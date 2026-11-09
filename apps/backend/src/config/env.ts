import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

const list = (value: string | undefined, fallback: string[]) =>
  value ? value.split(',').map((v) => v.trim()).filter(Boolean) : fallback;

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'yft_dev_only_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_USER_URL: process.env.CLIENT_USER_URL || 'http://localhost:3000',
  CLIENT_ADMIN_URL: process.env.CLIENT_ADMIN_URL || 'http://localhost:5173',
  /** Extra comma-separated CORS origins (e.g. production domains). */
  CORS_ORIGINS: list(process.env.CORS_ORIGINS, []),
  UPLOAD_DIR: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
};
