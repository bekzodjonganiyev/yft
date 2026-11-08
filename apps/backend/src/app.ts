import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import photoRoutes from './routes/photos.routes';
import partnerRoutes from './routes/partners.routes';
import inquiryRoutes from './routes/inquiries.routes';
import statsRoutes from './routes/stats.routes';

// Controllers for backward compatibility
import { getPhotos, addPhoto, deletePhoto } from './controllers/photos.controller';
import { login } from './controllers/auth.controller';
import { upload } from './middleware/upload';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static directory for uploaded files
  app.use('/uploads', express.static(ENV.UPLOAD_DIR));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // REST API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/photos', photoRoutes);
  app.use('/api/partners', partnerRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/stats', statsRoutes);

  // Upload single file endpoint
  app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, url: fileUrl, filename: req.file.filename });
  });

  // Legacy API compatibility routes for old client bindings
  app.get('/photo/all', getPhotos);
  app.post('/photo/add', upload.single('photo'), addPhoto);
  app.delete('/photo/:id', deletePhoto);
  app.post('/auth/login', login);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
