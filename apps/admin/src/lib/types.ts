// Shapes returned by apps/backend (see prisma/schema.prisma)

export interface Product {
  id: string
  titleUz: string
  titleRu: string
  titleEn: string
  titleAr: string
  descUz: string
  descRu: string
  descEn: string
  descAr: string
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
  titleAr: string | null
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
  recentInquiries: Inquiry[]
  recentProducts: Product[]
}

export type Settings = Record<string, string>
