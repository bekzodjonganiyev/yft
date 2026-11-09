import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { releaseMedia, storeUpload } from '../services/media.service';
import { sendError } from '../utils/http';

/**
 * Site settings are simple key/value pairs (phone, email, address…).
 * Keys starting with `asset.` hold image URLs used by the public site
 * (e.g. `asset.about_bg`, `asset.partners_bg`, `asset.contact_image`, `asset.logo`).
 */
const KEY_RE = /^[a-z0-9_.-]{1,64}$/i;

/** GET /api/settings — public map of all settings: { key: value } */
export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.status(200).json({ success: true, data: map });
  } catch (error) {
    sendError(res, error);
  }
};

/** PUT /api/settings/:key — JSON `{ value }` or multipart with an image in field `file` (for asset.* keys). */
export const upsertSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = String(req.params.key);
    if (!KEY_RE.test(key)) {
      res.status(400).json({ success: false, message: 'Invalid setting key' });
      return;
    }

    const media = await storeUpload(req.file);
    const value: unknown = media?.url ?? req.body?.value;
    if (typeof value !== 'string') {
      res.status(400).json({ success: false, message: 'value (string) or file is required' });
      return;
    }

    const previous = await prisma.setting.findUnique({ where: { key } });
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value, ...(req.body?.description !== undefined && { description: req.body.description }) },
      create: { key, value, description: req.body?.description ?? null },
    });
    if (previous && previous.value !== value) await releaseMedia(previous.value);

    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    sendError(res, error);
  }
};

/** DELETE /api/settings/:key */
export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await prisma.setting.delete({ where: { key: String(req.params.key) } });
    await releaseMedia(deleted.value);
    res.status(200).json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    sendError(res, error);
  }
};
