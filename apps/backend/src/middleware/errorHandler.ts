import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 15MB)' : err.message;
    res.status(400).json({ success: false, message });
    return;
  }

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  if (statusCode >= 500) console.error('[Error Middleware]:', err);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
