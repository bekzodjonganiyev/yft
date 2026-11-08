import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yft_admin_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.token = token;
  }
  return config;
});

// Fallback initial products in case backend isn't started yet
export const fallbackProducts = [
  {
    id: 'prod-1',
    titleUz: 'Oliy Navli Bug\'doy Uni (Premium)',
    titleRu: 'Мука Пшеничная Высший Сорт (Премиум)',
    titleEn: 'Premium Grade Wheat Flour',
    category: 'FLOUR_PREMIUM',
    packaging: '50 kg, 25 kg, 10 kg, 5 kg',
    gluten: '28 - 30%',
    ash: '0.55%',
    moisture: '14.0%',
    imageUrl: 'https://new-tkti-back.herokuapp.com/uploads/photo-1682483616007.png',
    isFeatured: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    titleUz: '1-Navli Bug\'doy Uni (Birinchi Nav)',
    titleRu: 'Мука Пшеничная Первый Сорт',
    titleEn: 'First Grade Wheat Flour',
    category: 'FLOUR_FIRST',
    packaging: '50 kg, 25 kg',
    gluten: '30 - 32%',
    ash: '0.75%',
    moisture: '14.5%',
    imageUrl: 'https://new-tkti-back.herokuapp.com/uploads/photo-1682483561838.png',
    isFeatured: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    titleUz: '2-Navli Bug\'doy Uni (Ikkinchi Nav)',
    titleRu: 'Мука Пшеничная Второй Сорт',
    titleEn: 'Second Grade Wheat Flour',
    category: 'FLOUR_SECOND',
    packaging: '50 kg',
    gluten: '25 - 27%',
    ash: '1.25%',
    moisture: '14.5%',
    imageUrl: 'https://new-tkti-back.herokuapp.com/uploads/photo-1682483597485.png',
    isFeatured: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    titleUz: 'Bug\'doy Kepagi (Ozuqabop)',
    titleRu: 'Отруби Пшеничные Кормовые',
    titleEn: 'Wheat Bran',
    category: 'BRAN',
    packaging: '25 kg, 20 kg',
    gluten: '-',
    ash: '5.0%',
    moisture: '13.5%',
    imageUrl: 'https://new-tkti-back.herokuapp.com/uploads/photo-1682483580131.png',
    isFeatured: false,
    order: 4,
    createdAt: new Date().toISOString(),
  },
];

export const fallbackPhotos = [
  {
    _id: 'ph-1',
    id: 'ph-1',
    photoUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop',
    title_uz: 'Yangiyer zamonaviy tegirmon kompleksi',
    titleUz: 'Yangiyer zamonaviy tegirmon kompleksi',
    titleRu: 'Современный мельничный комплекс Янгиер',
    titleEn: 'Yangiyer modern milling complex',
    category: 'production',
    width: 1200,
    height: 800,
    date: '2026-04-15',
  },
  {
    _id: 'ph-2',
    id: 'ph-2',
    photoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    title_uz: 'Bug\'doy donlarini saralash va tozalash sexi',
    titleUz: 'Bug\'doy donlarini saralash va tozalash sexi',
    titleRu: 'Цех очистки и калибровки зерна',
    titleEn: 'Grain cleaning and sorting workshop',
    category: 'production',
    width: 1200,
    height: 800,
    date: '2026-04-18',
  },
  {
    _id: 'ph-3',
    id: 'ph-3',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    title_uz: 'Tayyor un mahsulotlari logistika ombori',
    titleUz: 'Tayyor un mahsulotlari logistika ombori',
    titleRu: 'Склад готовой продукции и логистики',
    titleEn: 'Finished product storage and logistics hub',
    category: 'factory',
    width: 1200,
    height: 800,
    date: '2026-04-20',
  },
  {
    _id: 'ph-4',
    id: 'ph-4',
    photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    title_uz: 'Sifat nazorati va zamonaviy laboratoriya',
    titleUz: 'Sifat nazorati va zamonaviy laboratoriya',
    titleRu: 'Контроль качества и лаборатория',
    titleEn: 'Quality control laboratory',
    category: 'laboratory',
    width: 1200,
    height: 800,
    date: '2026-04-22',
  },
];

export const fallbackInquiries = [
  {
    id: 'inq-1',
    fullName: 'Anvar Rahimov',
    phone: '+998 90 123 45 67',
    email: 'anvar.bakery@gmail.com',
    subject: 'Oliy navli un uchun ulgurji buyurtma (20 tonna)',
    message: 'Toshkent shahridagi non sexlarimiz uchun har oy 20 tonna oliy navli un yetkazib berish shartlari va narxlari bo‘yicha tijorat taklifi so‘raymiz.',
    status: 'NEW',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inq-2',
    fullName: 'Dilshod Karimov',
    phone: '+998 97 765 43 21',
    email: 'karimov_trading@mail.ru',
    subject: 'Eksport shartlari (Qozog‘iston/Tojikiston)',
    message: 'Tojikiston bozoriga 1-navli un eksporti bo‘yicha hamkorlik qilish istagidamiz. Fitosanitar sertifikatlar va yetkazib berish muddati haqida ma’lumot bera olasizmi?',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const fallbackPartners = [
  { id: 'part-1', name: 'O\'zdonmahsulot AK', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953905268.jpg', websiteUrl: 'https://ozdon.uz', order: 1 },
  { id: 'part-2', name: 'Agro Industrial Holding', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953888366.jpg', websiteUrl: '#', order: 2 },
  { id: 'part-3', name: 'Central Asia Grain Export', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953777534.jpg', websiteUrl: '#', order: 3 },
  { id: 'part-4', name: 'Bukhara Bakery Group', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953754646.jpg', websiteUrl: '#', order: 4 },
];
