import { Request, Response } from 'express';
import type { PostType } from '@prisma/client';
import { prisma } from '../config/prisma';
import { releaseMedia, storeUpload } from '../services/media.service';
import { pickLocalized, toBool } from '../utils/fields';
import { sendError, toInt } from '../utils/http';

const TYPES: PostType[] = ['NEWS', 'VACANCY'];
const parseType = (v: unknown): PostType | undefined =>
  typeof v === 'string' && TYPES.includes(v.toUpperCase() as PostType) ? (v.toUpperCase() as PostType) : undefined;

const parseDate = (v: unknown): Date | undefined => {
  if (typeof v !== 'string' || !v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

/** GET /api/posts?type=NEWS|VACANCY&limit=4 — public: published only; `?all=true` (admin) includes drafts */
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = parseType(req.query.type);
    const limit = Math.min(Math.max(toInt(req.query.limit, 100), 1), 200);
    const posts = await prisma.post.findMany({
      where: { ...(type && { type }), ...(req.query.all === 'true' ? {} : { isPublished: true }) },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    res.status(200).json({ success: true, data: posts, count: posts.length });
  } catch (error) {
    sendError(res, error);
  }
};

/** GET /api/posts/:id — public (published only) */
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await prisma.post.findUnique({ where: { id: String(req.params.id) } });
    if (!post || (!post.isPublished && req.query.all !== 'true')) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    sendError(res, error);
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = parseType(req.body.type);
    const titles = pickLocalized(req.body, 'title');
    if (!type || !titles.titleUz) {
      res.status(400).json({ success: false, message: 'type (NEWS or VACANCY) and titleUz are required' });
      return;
    }
    const media = await storeUpload(req.file);
    const post = await prisma.post.create({
      data: {
        type,
        titleUz: titles.titleUz,
        ...titles,
        ...pickLocalized(req.body, 'body'),
        imageUrl: media?.url ?? '',
        date: parseDate(req.body.date) ?? new Date(),
        isPublished: toBool(req.body.isPublished) ?? true,
      },
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    sendError(res, error);
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }
    const titles = pickLocalized(req.body, 'title');
    if (titles.titleUz === '') {
      res.status(400).json({ success: false, message: 'titleUz cannot be empty' });
      return;
    }
    const media = await storeUpload(req.file);
    const removeImage = toBool(req.body.removeImage) === true;
    const isPublished = toBool(req.body.isPublished);
    const type = parseType(req.body.type);
    const date = parseDate(req.body.date);
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...titles,
        ...pickLocalized(req.body, 'body'),
        ...(type && { type }),
        ...(date && { date }),
        ...(isPublished !== undefined && { isPublished }),
        ...(media ? { imageUrl: media.url } : removeImage ? { imageUrl: '' } : {}),
      },
    });
    if (post.imageUrl !== existing.imageUrl) await releaseMedia(existing.imageUrl);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    sendError(res, error);
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await prisma.post.delete({ where: { id: String(req.params.id) } });
    await releaseMedia(deleted.imageUrl);
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    sendError(res, error);
  }
};
