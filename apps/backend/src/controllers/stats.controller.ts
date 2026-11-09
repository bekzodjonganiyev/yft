import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendError } from '../utils/http';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [productsCount, photosCount, partnersCount, inquiriesCount, newInquiriesCount, usersCount, newsCount, vacanciesCount, bannersCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.photo.count(),
        prisma.partner.count(),
        prisma.inquiry.count(),
        prisma.inquiry.count({ where: { status: 'NEW' } }),
        prisma.user.count(),
        prisma.post.count({ where: { type: 'NEWS' } }),
        prisma.post.count({ where: { type: 'VACANCY' } }),
        prisma.banner.count(),
      ]);

    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: {
        productsCount,
        photosCount,
        partnersCount,
        inquiriesCount,
        newInquiriesCount,
        usersCount,
        newsCount,
        vacanciesCount,
        bannersCount,
        recentInquiries,
        recentProducts,
      },
    });
  } catch (error: any) {
    sendError(res, error);
  }
};
