// Data access for the public site. Everything is read from the backend (apps/backend);
// when it is unreachable the page still renders with the static fallbacks below.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export interface Product {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  titleAr: string;
  descUz: string;
  descRu: string;
  descEn: string;
  descAr: string;
  imageUrl: string;
  order: number;
}

export interface Photo {
  id: string;
  photoUrl: string;
  titleUz: string | null;
  titleRu: string | null;
  titleEn: string | null;
  titleAr: string | null;
  category: string;
  width: number;
  height: number;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
}

export type Settings = Record<string, string>;

export interface SiteData {
  products: Product[];
  photos: Photo[];
  partners: Partner[];
  settings: Settings;
}

/** Turn a backend path (`/uploads/x.jpg`) into an absolute URL. Absolute URLs pass through. */
export const assetUrl = (path: string | null | undefined, fallback = ''): string => {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/uploads/')) return `${API_URL}${path}`;
  return path; // e.g. /images/... from this app's public folder
};

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}/api${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const json = await res.json();
    return (json?.data ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export async function getSiteData(): Promise<SiteData> {
  const [products, photos, partners, settings] = await Promise.all([
    get<Product[]>('/products?isFeatured=true', []),
    get<Photo[]>('/photos', []),
    get<Partner[]>('/partners', []),
    get<Settings>('/settings', {}),
  ]);
  return { products, photos, partners, settings };
}

/** Values used when a setting is missing (backend down or not seeded yet). */
export const DEFAULTS = {
  phone: '+998 71 875 64 56',
  email: 'Yangiyerflour@gmail.com',
  aboutVideo: 'https://www.youtube.com/embed/G0zm9TybxpU',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2997.971617605521!2d69.2168139758326!3d41.287722171312694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE3JzE1LjgiTiA2OcKwMTMnMDkuOCJF!5e0!3m2!1sru!2s!4v1682497109753!5m2!1sru!2s',
  logo: '/images/logo.png',
  heroPoster: '/images/bg.jpg',
  aboutBg: '/images/bg1.jpg',
  partnersBg: '/images/bg2.jpg',
  contactImage: '/images/5138237.jpg',
};

export const SOCIAL_KEYS = ['facebook', 'telegram', 'instagram', 'youtube'] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const socialLinks = (settings: Settings) =>
  SOCIAL_KEYS.map((key) => ({ key, href: settings[`social.${key}`] })).filter(
    (s): s is { key: SocialKey; href: string } => !!s.href
  );
