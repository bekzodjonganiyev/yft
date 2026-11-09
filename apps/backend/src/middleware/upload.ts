import multer from 'multer';

/**
 * Files are kept in memory and handed to `media.service` which validates the real file type,
 * deduplicates by hash and writes to UPLOAD_DIR. Nothing is written to disk before validation.
 */
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const DOCUMENT_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const makeUpload = (allowed: string[], label: string) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    fileFilter: (_req, file, cb) => {
      // Cheap early rejection; the authoritative check is the magic-byte detection in media.service.
      if (allowed.includes(file.mimetype)) return cb(null, true);
      const err = new Error(`Unsupported file type. Allowed: ${label}.`) as Error & { statusCode: number };
      err.statusCode = 400;
      cb(err);
    },
  });

/** Images only (products, gallery photos, partner logos, site assets). */
export const imageUpload = makeUpload(IMAGE_MIME, 'JPEG, PNG, WEBP, GIF, AVIF');

/** Images or documents (inquiry attachments). */
export const attachmentUpload = makeUpload([...IMAGE_MIME, ...DOCUMENT_MIME], 'images, PDF, DOC, DOCX');

/** @deprecated kept for older imports — same as imageUpload */
export const upload = imageUpload;
