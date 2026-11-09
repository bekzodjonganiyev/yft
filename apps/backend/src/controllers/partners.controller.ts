import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { releaseMedia, storeUpload } from '../services/media.service';
import { sendError, toInt } from '../utils/http';

export const getPartners = async (_req: Request, res: Response): Promise<void> => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.status(200).json({ success: true, data: partners, count: partners.length });
  } catch (error: any) {
    sendError(res, error);
  }
};

export const createPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, logoUrl, websiteUrl, order } = req.body;
    if (!name || (!req.file && !logoUrl)) {
      res.status(400).json({ success: false, message: 'Partner name and logo are required' });
      return;
    }
    const media = await storeUpload(req.file);
    const finalLogoUrl = media?.url ?? logoUrl;

    if (!name || !finalLogoUrl) {
      res.status(400).json({ success: false, message: 'Partner name and logo are required' });
      return;
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl: finalLogoUrl,
        websiteUrl: websiteUrl || '',
        order: toInt(order, 0),
      },
    });

    res.status(201).json({ success: true, message: 'Partner created successfully', data: partner });
  } catch (error: any) {
    sendError(res, error);
  }
};

export const updatePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { name, logoUrl, websiteUrl, order } = req.body;
    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Partner not found' });
      return;
    }
    const media = await storeUpload(req.file);
    const finalLogoUrl: string | undefined = media?.url ?? logoUrl;

    const updated = await prisma.partner.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(finalLogoUrl !== undefined && { logoUrl: finalLogoUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(order !== undefined && { order: toInt(order, existing.order) }),
      },
    });

    if (finalLogoUrl !== undefined && finalLogoUrl !== existing.logoUrl) {
      await releaseMedia(existing.logoUrl);
    }

    res.status(200).json({ success: true, message: 'Partner updated successfully', data: updated });
  } catch (error: any) {
    sendError(res, error);
  }
};

export const deletePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await prisma.partner.delete({ where: { id } });
    await releaseMedia(deleted.logoUrl);
    res.status(200).json({ success: true, message: 'Partner deleted successfully' });
  } catch (error: any) {
    sendError(res, error);
  }
};
