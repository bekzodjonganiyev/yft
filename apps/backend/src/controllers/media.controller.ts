import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { deleteMedia, isReferenced, storeUpload } from '../services/media.service';
import { sendError } from '../utils/http';

/** GET /api/media — media library (admin). */
export const listMedia = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    const withUsage = await Promise.all(items.map(async (m) => ({ ...m, inUse: await isReferenced(m.url) })));
    res.status(200).json({ success: true, data: withUsage, count: withUsage.length });
  } catch (error) {
    sendError(res, error);
  }
};

/** POST /api/media (field `file`) — upload an image, returns its URL. Also mounted at /api/upload. */
export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const media = await storeUpload(req.file);
    if (!media) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    res.status(201).json({ success: true, url: media.url, filename: media.filename, data: media });
  } catch (error) {
    sendError(res, error);
  }
};

/** DELETE /api/media/:id[?force=true] */
export const removeMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteMedia(String(req.params.id), req.query.force === 'true');
    res.status(200).json({ success: true, message: 'Media deleted' });
  } catch (error) {
    sendError(res, error);
  }
};
