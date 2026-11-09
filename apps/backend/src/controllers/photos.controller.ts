import { Request, Response } from 'express';
import type { Photo } from '@prisma/client';
import { prisma } from '../config/prisma';
import { releaseMedia, storeUpload } from '../services/media.service';
import { sendError, toInt } from '../utils/http';

// Return both the new fields and the legacy ones (`_id`, `photo`, `title_uz`) used by the old client.
const toDto = (p: Photo) => ({
  _id: p.id,
  id: p.id,
  photo: p.photoUrl.startsWith('/') ? p.photoUrl.slice(1) : p.photoUrl,
  photoUrl: p.photoUrl,
  title_uz: p.titleUz || 'Yangiyer Flour Trading photo',
  titleUz: p.titleUz,
  titleRu: p.titleRu,
  titleEn: p.titleEn,
  titleAr: p.titleAr,
  category: p.category,
  width: p.width,
  height: p.height,
  date: p.date,
  createdAt: p.createdAt,
});

export const getPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    const photos = await prisma.photo.findMany({ where, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }] });
    const mapped = photos.map(toDto);
    res.status(200).json({ success: true, data: mapped, count: mapped.length });
  } catch (error: any) {
    sendError(res, error);
  }
};

export const addPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { width, height, date, titleUz, titleRu, titleEn, titleAr, category, photoUrl } = req.body;

    if (!req.file && !photoUrl) {
      res.status(400).json({ success: false, message: 'Photo file or photoUrl is required' });
      return;
    }

    const media = await storeUpload(req.file);
    const finalPhotoUrl = media?.url ?? photoUrl;

    const photo = await prisma.photo.create({
      data: {
        photoUrl: finalPhotoUrl,
        titleUz: titleUz || '',
        titleRu: titleRu || '',
        titleEn: titleEn || '',
        titleAr: titleAr || '',
        category: category || 'production',
        // Real dimensions from the uploaded file win over whatever the client typed.
        width: media?.width ?? toInt(width, 1080),
        height: media?.height ?? toInt(height, 720),
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Photo uploaded successfully',
      data: toDto(photo),
    });
  } catch (error: any) {
    sendError(res, error);
  }
};

export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Photo not found' });
      return;
    }

    const { titleUz, titleRu, titleEn, titleAr, category, date, photoUrl, width, height } = req.body;
    const media = await storeUpload(req.file);
    const nextUrl: string | undefined = media?.url ?? photoUrl;

    const updated = await prisma.photo.update({
      where: { id },
      data: {
        ...(titleUz !== undefined && { titleUz }),
        ...(titleRu !== undefined && { titleRu }),
        ...(titleEn !== undefined && { titleEn }),
        ...(titleAr !== undefined && { titleAr }),
        ...(category !== undefined && { category }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(nextUrl !== undefined && { photoUrl: nextUrl }),
        ...(media?.width
          ? { width: media.width, height: media.height ?? existing.height }
          : {
              ...(width !== undefined && { width: toInt(width, existing.width) }),
              ...(height !== undefined && { height: toInt(height, existing.height) }),
            }),
      },
    });

    if (nextUrl !== undefined && nextUrl !== existing.photoUrl) {
      await releaseMedia(existing.photoUrl);
    }

    res.status(200).json({ success: true, message: 'Photo updated successfully', data: toDto(updated) });
  } catch (error: any) {
    sendError(res, error);
  }
};

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await prisma.photo.delete({ where: { id } });
    await releaseMedia(deleted.photoUrl);
    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
  } catch (error: any) {
    sendError(res, error);
  }
};
