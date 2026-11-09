import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import { imageUpload } from './middleware/upload';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import photoRoutes from './routes/photos.routes';
import partnerRoutes from './routes/partners.routes';
import inquiryRoutes from './routes/inquiries.routes';
import statsRoutes from './routes/stats.routes';
import mediaRoutes from './routes/media.routes';
import settingsRoutes from './routes/settings.routes';

import { getPhotos, addPhoto, deletePhoto } from './controllers/photos.controller';
import { login } from './controllers/auth.controller';
import { uploadMedia } from './controllers/media.controller';

export const createApp = (): Application => {
  const app = express();

  const allowedOrigins = new Set([ENV.CLIENT_USER_URL, ENV.CLIENT_ADMIN_URL, ...ENV.CORS_ORIGINS]);
  app.use(
    cors({
      // Requests without Origin (server-side fetches, curl) are allowed; browsers only from known apps.
      origin: (origin, cb) => cb(null, !origin || allowedOrigins.has(origin) || ENV.NODE_ENV !== 'production'),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Uploaded files. File names are content hashes, so they can be cached forever.
  app.use(
    '/uploads',
    express.static(ENV.UPLOAD_DIR, {
      immutable: true,
      maxAge: '365d',
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
    })
  );

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/photos', photoRoutes);
  app.use('/api/partners', partnerRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/settings', settingsRoutes);

  // Generic image upload (kept for existing clients) — same as POST /api/media
  app.post('/api/upload', authenticate, imageUpload.single('file'), uploadMedia);

  // Legacy API compatibility routes for old client bindings
  app.get('/photo/all', getPhotos);
  app.post('/photo/add', authenticate, imageUpload.single('photo'), addPhoto);
  app.delete('/photo/:id', authenticate, deletePhoto);
  app.post('/auth/login', login);

  app.use(errorHandler);

  return app;
};
