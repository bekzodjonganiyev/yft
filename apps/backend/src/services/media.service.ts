import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { imageSize } from 'image-size';
import type { Media } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ENV } from '../config/env';

/**
 * Central place where every file that ends up on the backend is stored.
 *
 * - The real file type is detected from the file's bytes (magic numbers), never from the
 *   client-supplied mimetype or extension, so a renamed .html/.svg cannot be served as an image.
 * - Files are content-addressed (SHA-256). Uploading the same image twice returns the existing
 *   record instead of writing a duplicate to disk.
 * - Image width/height are read on upload so the gallery can lay photos out without guessing.
 * - `releaseMedia()` deletes a file once nothing in the database points at it any more.
 */

export type MediaKind = 'image' | 'attachment';

export class MediaError extends Error {
  statusCode = 400;
}

const IMAGE_TYPES: Record<string, { ext: string; mime: string }> = {
  jpg: { ext: 'jpg', mime: 'image/jpeg' },
  png: { ext: 'png', mime: 'image/png' },
  webp: { ext: 'webp', mime: 'image/webp' },
  gif: { ext: 'gif', mime: 'image/gif' },
  avif: { ext: 'avif', mime: 'image/avif' }, // image-size reports the HEIF major brand

};

interface Detected {
  ext: string;
  mime: string;
  width?: number;
  height?: number;
}

const startsWith = (buf: Buffer, bytes: number[]) => bytes.every((b, i) => buf[i] === b);

const detectImage = (buffer: Buffer): Detected | null => {
  try {
    const size = imageSize(buffer);
    const type = size.type ? IMAGE_TYPES[size.type] : undefined;
    if (!type) return null;
    // EXIF orientations 5–8 are rotated 90°, so the displayed size is swapped.
    const rotated = size.orientation !== undefined && size.orientation >= 5;
    return {
      ...type,
      width: rotated ? size.height : size.width,
      height: rotated ? size.width : size.height,
    };
  } catch {
    return null;
  }
};

const detectDocument = (buffer: Buffer, originalName = ''): Detected | null => {
  const ext = path.extname(originalName).toLowerCase();
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) return { ext: 'pdf', mime: 'application/pdf' }; // %PDF-
  if (startsWith(buffer, [0xd0, 0xcf, 0x11, 0xe0]) && ext === '.doc') return { ext: 'doc', mime: 'application/msword' };
  if (startsWith(buffer, [0x50, 0x4b, 0x03, 0x04]) && ext === '.docx') {
    return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }
  return null;
};

export const detectFile = (buffer: Buffer, kind: MediaKind, originalName?: string): Detected => {
  const detected = detectImage(buffer) ?? (kind === 'attachment' ? detectDocument(buffer, originalName) : null);
  if (!detected) {
    throw new MediaError(
      kind === 'image'
        ? 'Unsupported image. Allowed formats: JPEG, PNG, WEBP, GIF, AVIF.'
        : 'Unsupported file. Allowed formats: JPEG, PNG, WEBP, GIF, AVIF, PDF, DOC, DOCX.'
    );
  }
  return detected;
};

export const publicUrlFor = (filename: string) => `/uploads/${filename}`;

export interface StoreOptions {
  kind?: MediaKind;
  originalName?: string;
  source?: string;
  alt?: string;
}

/** Validate, deduplicate and persist a file. Returns the Media record (new or existing). */
export const storeBuffer = async (buffer: Buffer, opts: StoreOptions = {}): Promise<Media> => {
  if (!buffer?.length) throw new MediaError('Empty file');

  const kind = opts.kind ?? 'image';
  const detected = detectFile(buffer, kind, opts.originalName);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  const existing = await prisma.media.findUnique({ where: { hash } });
  if (existing) {
    // Re-create the file if it was removed from disk by hand.
    const filePath = path.join(ENV.UPLOAD_DIR, existing.filename);
    await fs.access(filePath).catch(() => fs.writeFile(filePath, buffer));
    if (opts.source && !existing.source) {
      return prisma.media.update({ where: { id: existing.id }, data: { source: opts.source } });
    }
    return existing;
  }

  const prefix = detected.mime.startsWith('image/') ? 'img' : 'doc';
  const filename = `${prefix}-${hash.slice(0, 32)}.${detected.ext}`;
  await fs.mkdir(ENV.UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(ENV.UPLOAD_DIR, filename), buffer);

  return prisma.media.create({
    data: {
      filename,
      url: publicUrlFor(filename),
      hash,
      mimeType: detected.mime,
      size: buffer.length,
      width: detected.width ?? null,
      height: detected.height ?? null,
      originalName: opts.originalName?.slice(0, 255) ?? null,
      source: opts.source ?? null,
      alt: opts.alt ?? null,
    },
  });
};

/** Store a multer (memory storage) file. Returns undefined when no file was sent. */
export const storeUpload = async (
  file: Express.Multer.File | undefined,
  kind: MediaKind = 'image'
): Promise<Media | undefined> => {
  if (!file) return undefined;
  return storeBuffer(file.buffer, { kind, originalName: file.originalname, source: 'upload' });
};

const MAX_REMOTE_BYTES = 25 * 1024 * 1024;

/** Download a remote image and store it locally (used by the legacy-asset importer). */
export const storeRemote = async (url: string, opts: Omit<StoreOptions, 'source'> = {}): Promise<Media> => {
  const already = await prisma.media.findFirst({ where: { source: url } });
  if (already) return already;

  const res = await fetch(url, { signal: AbortSignal.timeout(20_000), redirect: 'follow' });
  if (!res.ok) throw new MediaError(`Download failed (${res.status}) for ${url}`);
  const declared = Number(res.headers.get('content-length') || 0);
  if (declared > MAX_REMOTE_BYTES) throw new MediaError(`Remote file too large: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_REMOTE_BYTES) throw new MediaError(`Remote file too large: ${url}`);

  return storeBuffer(buffer, {
    ...opts,
    originalName: opts.originalName ?? path.basename(new URL(url).pathname),
    source: url,
  });
};

/** Is this URL still used by any content row? */
export const isReferenced = async (url: string): Promise<boolean> => {
  const [products, photos, partners, inquiries, settings, banners, posts] = await Promise.all([
    prisma.product.count({ where: { imageUrl: url } }),
    prisma.photo.count({ where: { photoUrl: url } }),
    prisma.partner.count({ where: { logoUrl: url } }),
    prisma.inquiry.count({ where: { fileUrl: url } }),
    prisma.setting.count({ where: { value: url } }),
    prisma.banner.count({ where: { imageUrl: url } }),
    prisma.post.count({ where: { imageUrl: url } }),
  ]);
  return products + photos + partners + inquiries + settings + banners + posts > 0;
};

const removeMedia = async (media: Media) => {
  await prisma.media.delete({ where: { id: media.id } });
  await fs.unlink(path.join(ENV.UPLOAD_DIR, media.filename)).catch(() => undefined);
};

/**
 * Call after a row stops pointing at `url` (row deleted or image replaced).
 * Removes the file + Media row if nothing else references it. Safe to call with
 * remote URLs, empty values or untracked paths — those are ignored.
 */
export const releaseMedia = async (url: string | null | undefined): Promise<void> => {
  if (!url || !url.startsWith('/uploads/')) return;
  const media = await prisma.media.findUnique({ where: { url } });
  if (!media) return;
  if (await isReferenced(url)) return;
  await removeMedia(media);
};

/** Delete a media item explicitly (admin media library). Refuses while still in use unless forced. */
export const deleteMedia = async (id: string, force = false): Promise<void> => {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    const err = new MediaError('Media not found');
    err.statusCode = 404;
    throw err;
  }
  if (!force && (await isReferenced(media.url))) {
    const err = new MediaError('This file is still in use (product, photo, partner, banner, post, inquiry or setting)');
    err.statusCode = 409;
    throw err;
  }
  await removeMedia(media);
};
