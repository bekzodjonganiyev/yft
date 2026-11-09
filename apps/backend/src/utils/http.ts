import { Response } from 'express';

/** Send an error response, respecting `statusCode` set on known errors (e.g. MediaError → 400). */
export const sendError = (res: Response, error: any) => {
  const status = typeof error?.statusCode === 'number' ? error.statusCode : error?.code === 'P2025' ? 404 : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message: status === 404 && error?.code === 'P2025' ? 'Not found' : error?.message || 'Server error' });
};

export const toInt = (value: unknown, fallback: number): number => {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : fallback;
};
