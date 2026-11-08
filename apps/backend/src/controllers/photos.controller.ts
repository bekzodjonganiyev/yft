import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    const photos = await prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Compatibility mapper: return both `photoUrl` and `photo` for backwards compatibility with legacy UI
    const mapped = photos.map((p) => ({
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
    }));

    res.status(200).json({ success: true, data: mapped, count: mapped.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { width, height, date, titleUz, titleRu, titleEn, titleAr, category, photoUrl } = req.body;

    const finalPhotoUrl = file ? `/uploads/${file.filename}` : photoUrl;

    if (!finalPhotoUrl) {
      res.status(400).json({ success: false, message: 'Photo file or photoUrl is required' });
      return;
    }

    const photo = await prisma.photo.create({
      data: {
        photoUrl: finalPhotoUrl,
        titleUz: titleUz || '',
        titleRu: titleRu || '',
        titleEn: titleEn || '',
        titleAr: titleAr || '',
        category: category || 'production',
        width: width ? parseInt(width, 10) : 1080,
        height: height ? parseInt(height, 10) : 720,
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Photo uploaded successfully',
      data: photo,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.photo.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
