import { Request, Response } from 'express';
import type { InfoKind } from '@prisma/client';
import { prisma } from '../config/prisma';
import { pickLocalized } from '../utils/fields';
import { sendError, toInt } from '../utils/http';

const KINDS: InfoKind[] = ['MOTTO', 'FAQ'];
const parseKind = (v: unknown): InfoKind | undefined =>
  typeof v === 'string' && KINDS.includes(v.toUpperCase() as InfoKind) ? (v.toUpperCase() as InfoKind) : undefined;

/** GET /api/info-items?kind=MOTTO|FAQ */
export const getInfoItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const kind = parseKind(req.query.kind);
    const items = await prisma.infoItem.findMany({
      where: kind ? { kind } : {},
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    res.status(200).json({ success: true, data: items, count: items.length });
  } catch (error) {
    sendError(res, error);
  }
};

export const createInfoItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const kind = parseKind(req.body.kind);
    const titles = pickLocalized(req.body, 'title');
    if (!kind || !titles.titleUz) {
      res.status(400).json({ success: false, message: 'kind (MOTTO or FAQ) and titleUz are required' });
      return;
    }
    const item = await prisma.infoItem.create({
      data: { kind, titleUz: titles.titleUz, ...titles, ...pickLocalized(req.body, 'body'), order: toInt(req.body.order, 0) },
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateInfoItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.infoItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }
    const titles = pickLocalized(req.body, 'title');
    if (titles.titleUz === '') {
      res.status(400).json({ success: false, message: 'titleUz cannot be empty' });
      return;
    }
    const item = await prisma.infoItem.update({
      where: { id },
      data: {
        ...titles,
        ...pickLocalized(req.body, 'body'),
        ...(req.body.order !== undefined && { order: toInt(req.body.order, existing.order) }),
      },
    });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteInfoItem = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.infoItem.delete({ where: { id: String(req.params.id) } });
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    sendError(res, error);
  }
};
