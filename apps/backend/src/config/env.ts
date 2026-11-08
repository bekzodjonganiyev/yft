import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'yft_secret_key_default_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_USER_URL: process.env.CLIENT_USER_URL || 'http://localhost:3000',
  CLIENT_ADMIN_URL: process.env.CLIENT_ADMIN_URL || 'http://localhost:5173',
  UPLOAD_DIR: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
};
