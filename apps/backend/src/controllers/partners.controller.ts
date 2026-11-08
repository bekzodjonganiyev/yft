import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getPartners = async (_req: Request, res: Response): Promise<void> => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.status(200).json({ success: true, data: partners, count: partners.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { name, logoUrl, websiteUrl, order } = req.body;
    const finalLogoUrl = file ? `/uploads/${file.filename}` : logoUrl;

    if (!name || !finalLogoUrl) {
      res.status(400).json({ success: false, message: 'Partner name and logo are required' });
      return;
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl: finalLogoUrl,
        websiteUrl: websiteUrl || '',
        order: order ? parseInt(order, 10) : 0,
      },
    });

    res.status(201).json({ success: true, message: 'Partner created successfully', data: partner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const file = req.file;
    const { name, logoUrl, websiteUrl, order } = req.body;
    const finalLogoUrl = file ? `/uploads/${file.filename}` : logoUrl;

    const updated = await prisma.partner.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(finalLogoUrl !== undefined && { logoUrl: finalLogoUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(order !== undefined && { order: parseInt(order, 10) }),
      },
    });

    res.status(200).json({ success: true, message: 'Partner updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.partner.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Partner deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
