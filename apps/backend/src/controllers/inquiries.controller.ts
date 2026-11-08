import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, data: inquiries, count: inquiries.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { fullName, phone, email, subject, message } = req.body;

    if (!fullName || !phone || !message) {
      res.status(400).json({ success: false, message: 'Full name, phone and message are required' });
      return;
    }

    const fileUrl = file ? `/uploads/${file.filename}` : undefined;

    const inquiry = await prisma.inquiry.create({
      data: {
        fullName,
        phone,
        email: email || null,
        subject: subject || 'General Inquiry',
        message,
        fileUrl,
        status: 'NEW',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Our team will contact you shortly.',
      data: inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!['NEW', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, message: 'Inquiry status updated', data: inquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.inquiry.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
