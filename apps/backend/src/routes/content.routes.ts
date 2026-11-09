import { Router } from 'express';
import { createBanner, deleteBanner, getBanners, updateBanner } from '../controllers/banners.controller';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/posts.controller';
import { createInfoItem, deleteInfoItem, getInfoItems, updateInfoItem } from '../controllers/info-items.controller';
import { authenticate } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

export const bannerRoutes = Router()
  .get('/', getBanners)
  .post('/', authenticate, imageUpload.single('image'), createBanner)
  .put('/:id', authenticate, imageUpload.single('image'), updateBanner)
  .delete('/:id', authenticate, deleteBanner);

export const postRoutes = Router()
  .get('/', getPosts)
  .get('/:id', getPost)
  .post('/', authenticate, imageUpload.single('image'), createPost)
  .put('/:id', authenticate, imageUpload.single('image'), updatePost)
  .delete('/:id', authenticate, deletePost);

export const infoItemRoutes = Router()
  .get('/', getInfoItems)
  .post('/', authenticate, createInfoItem)
  .put('/:id', authenticate, updateInfoItem)
  .delete('/:id', authenticate, deleteInfoItem);
