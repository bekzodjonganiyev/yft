// Data access for the public site. Everything is read from the backend (apps/backend);
// when it is unreachable the pages still render (empty sections are hidden).

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

type Localized<K extends string> = Record<`${K}${'Uz' | 'Ru' | 'En' | 'Fa'}`, string>;

export type Product = Localized<'title'> & Localized<'desc'> & { id: string; imageUrl: string; order: number };
export type Photo = Partial<Localized<'title'>> & { id: string; photoUrl: string; width: number; height: number };
export type Partner = { id: string; name: string; logoUrl: string; websiteUrl: string | null };
export type Banner = Localized<'title'> & { id: string; imageUrl: string };
export type InfoItem = Localized<'title'> & Localized<'body'> & { id: string; kind: 'MOTTO' | 'FAQ' };
export type PostType = 'NEWS' | 'VACANCY';
export type Post = Localized<'title'> &
  Localized<'body'> & { id: string; type: PostType; imageUrl: string; date: string };
export type Settings = Record<string, string>;

/** Turn a backend path (`/uploads/x.jpg`) into an absolute URL. Absolute URLs pass through. */
export const assetUrl = (path: string | null | undefined, fallback = ''): string => {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/uploads/')) return `${API_URL}${path}`;
  return path; // e.g. /images/... from this app's public folder
};

export async function api<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}/api${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const json = await res.json();
    return (json?.data ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export const getSettings = () => api<Settings>('/settings', {});
export const getPosts = (type: PostType, limit?: number) =>
  api<Post[]>(`/posts?type=${type}${limit ? `&limit=${limit}` : ''}`, []);
export const getPost = (id: string) => api<Post | null>(`/posts/${encodeURIComponent(id)}`, null);
export const getPhotos = () => api<Photo[]>('/photos', []);

export async function getHomeData() {
  const [banners, mottos, faqs, photos, news, products, vacancies, partners, settings] = await Promise.all([
    api<Banner[]>('/banners', []),
    api<InfoItem[]>('/info-items?kind=MOTTO', []),
    api<InfoItem[]>('/info-items?kind=FAQ', []),
    getPhotos(),
    getPosts('NEWS', 4),
    api<Product[]>('/products?isFeatured=true', []),
    getPosts('VACANCY', 3),
    api<Partner[]>('/partners', []),
    getSettings(),
  ]);
  return { banners, mottos, faqs, photos, news, products, vacancies, partners, settings };
}

/** Values used when a setting is missing (backend down or not seeded yet). */
export const DEFAULTS = {
  phone: '+998 90 979 50 55',
  email: 'Yangiyerflour@gmail.com',
  website: 'https://yangiyerflourtrading.uz',
  aboutVideo: 'https://www.youtube.com/embed/G0zm9TybxpU',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1181.1895909939317!2d69.21878063797728!3d41.2875452257138!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8be0fdfbfecd%3A0x6c5afd84eb8438a6!2sLLC%20%22YANGIYER%20FLOUR%20TRADING%22!5e0!3m2!1suz!2s!4v1684500868007!5m2!1suz!2s',
  logo: '/images/logo.png',
  aboutBg: '/images/bugdoy.jpg',
};

export const SOCIAL_KEYS = ['telegram', 'instagram', 'facebook', 'youtube', 'twitter'] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const socialLinks = (settings: Settings) =>
  SOCIAL_KEYS.map((key) => ({ key, href: settings[`social.${key}`] })).filter(
    (s): s is { key: SocialKey; href: string } => !!s.href
  );

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
