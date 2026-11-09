import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { releaseMedia, storeUpload } from '../services/media.service';
import { pickLocalized, toBool } from '../utils/fields';
import { sendError, toInt } from '../utils/http';

/** GET /api/banners — public: active banners; `?all=true` (admin) includes inactive */
export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await prisma.banner.findMany({
      where: req.query.all === 'true' ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.status(200).json({ success: true, data: banners, count: banners.length });
  } catch (error) {
    sendError(res, error);
  }
};

export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Banner image is required' });
      return;
    }
    const media = await storeUpload(req.file);
    const banner = await prisma.banner.create({
      data: {
        ...pickLocalized(req.body, 'title'),
        imageUrl: media!.url,
        order: toInt(req.body.order, 0),
        isActive: toBool(req.body.isActive) ?? true,
      },
    });
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    const media = await storeUpload(req.file);
    const isActive = toBool(req.body.isActive);
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...pickLocalized(req.body, 'title'),
        ...(media && { imageUrl: media.url }),
        ...(req.body.order !== undefined && { order: toInt(req.body.order, existing.order) }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    if (media && media.url !== existing.imageUrl) await releaseMedia(existing.imageUrl);
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await prisma.banner.delete({ where: { id: String(req.params.id) } });
    await releaseMedia(deleted.imageUrl);
    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    sendError(res, error);
  }
};
