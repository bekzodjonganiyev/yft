import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, isFeatured } = req.query;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { titleUz: { contains: search, mode: 'insensitive' } },
        { titleRu: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { descUz: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      titleUz,
      titleRu,
      titleEn,
      titleAr,
      descUz,
      descRu,
      descEn,
      descAr,
      category,
      packaging,
      gluten,
      ash,
      moisture,
      imageUrl,
      isFeatured,
      order,
    } = req.body;

    const file = req.file;
    const finalImageUrl = file ? `/uploads/${file.filename}` : (imageUrl || '');

    if (!titleUz || !titleRu || !titleEn) {
      res.status(400).json({ success: false, message: 'Product titles in Uz, Ru and En are required' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        titleUz,
        titleRu,
        titleEn,
        titleAr: titleAr || '',
        descUz: descUz || '',
        descRu: descRu || '',
        descEn: descEn || '',
        descAr: descAr || '',
        category: category || 'FLOUR_FIRST',
        packaging: packaging || '50 kg',
        gluten: gluten || '28%',
        ash: ash || '0.55%',
        moisture: moisture || '14%',
        imageUrl: finalImageUrl,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        order: order ? parseInt(order, 10) : 0,
      },
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const {
      titleUz,
      titleRu,
      titleEn,
      titleAr,
      descUz,
      descRu,
      descEn,
      descAr,
      category,
      packaging,
      gluten,
      ash,
      moisture,
      imageUrl,
      isFeatured,
      order,
    } = req.body;

    const file = req.file;
    const finalImageUrl = file ? `/uploads/${file.filename}` : imageUrl;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(titleUz !== undefined && { titleUz }),
        ...(titleRu !== undefined && { titleRu }),
        ...(titleEn !== undefined && { titleEn }),
        ...(titleAr !== undefined && { titleAr }),
        ...(descUz !== undefined && { descUz }),
        ...(descRu !== undefined && { descRu }),
        ...(descEn !== undefined && { descEn }),
        ...(descAr !== undefined && { descAr }),
        ...(category !== undefined && { category }),
        ...(packaging !== undefined && { packaging }),
        ...(gluten !== undefined && { gluten }),
        ...(ash !== undefined && { ash }),
        ...(moisture !== undefined && { moisture }),
        ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' || isFeatured === true }),
        ...(order !== undefined && { order: parseInt(order, 10) }),
      },
    });

    res.status(200).json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
