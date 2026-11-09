import type { InquiryStatus } from '@/lib/types'

export const PRODUCT_CATEGORIES: Record<string, string> = {
  FLOUR_PREMIUM: 'Oliy nav un',
  FLOUR_FIRST: '1-nav un',
  FLOUR_SECOND: '2-nav un',
  BRAN: 'Kepak',
  GRAIN: "Bug'doy (don)",
}

export const PHOTO_CATEGORIES: Record<string, string> = {
  production: 'Ishlab chiqarish',
  factory: 'Zavod va ombor',
  laboratory: 'Laboratoriya',
  field: "Bug'doy dalasi",
  team: 'Jamoa',
}

export const INQUIRY_STATUS: Record<
  InquiryStatus,
  { label: string; className: string }
> = {
  NEW: { label: 'Yangi', className: 'bg-amber-500 text-white' },
  IN_PROGRESS: { label: 'Jarayonda', className: 'bg-sky-600 text-white' },
  RESOLVED: { label: 'Yakunlangan', className: 'bg-emerald-600 text-white' },
}

export const initials = (name?: string) =>
  (name || 'A')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
