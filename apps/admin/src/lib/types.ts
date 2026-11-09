// Shapes returned by apps/backend (see prisma/schema.prisma)

export interface Product {
  id: string
  titleUz: string
  titleRu: string
  titleEn: string
  titleFa: string
  descUz: string
  descRu: string
  descEn: string
  descFa: string
  category: string
  packaging: string
  gluten: string | null
  ash: string | null
  moisture: string | null
  imageUrl: string
  isFeatured: boolean
  order: number
  createdAt: string
}

export interface Photo {
  id: string
  photoUrl: string
  titleUz: string | null
  titleRu: string | null
  titleEn: string | null
  titleFa: string | null
  category: string
  width: number
  height: number
  date: string
  createdAt: string
}

export interface Partner {
  id: string
  name: string
  logoUrl: string
  websiteUrl: string | null
  order: number
}

export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED'

export interface Inquiry {
  id: string
  fullName: string
  phone: string
  email: string | null
  subject: string | null
  message: string
  fileUrl: string | null
  status: InquiryStatus
  createdAt: string
}

export interface Stats {
  productsCount: number
  photosCount: number
  partnersCount: number
  inquiriesCount: number
  newInquiriesCount: number
  usersCount: number
  newsCount: number
  vacanciesCount: number
  bannersCount: number
  recentInquiries: Inquiry[]
  recentProducts: Product[]
}

export type Settings = Record<string, string>

export interface Banner {
  id: string
  imageUrl: string
  titleUz: string
  titleRu: string
  titleEn: string
  titleFa: string
  order: number
  isActive: boolean
}

export type PostType = 'NEWS' | 'VACANCY'

export interface Post {
  id: string
  type: PostType
  imageUrl: string
  titleUz: string
  titleRu: string
  titleEn: string
  titleFa: string
  bodyUz: string
  bodyRu: string
  bodyEn: string
  bodyFa: string
  date: string
  isPublished: boolean
}

export type InfoKind = 'MOTTO' | 'FAQ'

export interface InfoItem {
  id: string
  kind: InfoKind
  titleUz: string
  titleRu: string
  titleEn: string
  titleFa: string
  bodyUz: string
  bodyRu: string
  bodyEn: string
  bodyFa: string
  order: number
}
