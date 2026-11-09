# Yangiyer Flour Trading (YFT) — Monorepo

Ushbu monorepo loyihada barcha 3 ta qism (User, Admin, Backend) **pnpm monorepo** arxitekturasida bitta papkaga birlashtirilgan:

- `apps/user`: Next.js 14 (App Router) + Tailwind CSS + 4 tilli i18n (uz, ru, en, fa). Dizayn `version_2_1_0` branchidagi saytdan ko'chirilgan, barcha kontent backenddan olinadi.
- `apps/admin`: [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) andozasi asosida Vite + React 19 + Tailwind CSS + TanStack Router + Radix UI boshqaruv paneli.
- `apps/backend`: Express.js + TypeScript + PostgreSQL + Prisma ORM v6 + JWT + Multer fayl yuklash tizimi.

---

## 🚀 Ishga tushirish (Quick Start)

### 1. Bog'liqliklarni o'rnatish (pnpm)
```bash
pnpm install
```

### 2. Ma'lumotlar bazasi (PostgreSQL + Prisma)
`apps/backend/.env` faylida PostgreSQL ulanishingizni tekshiring:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yft_db?schema=public"
JWT_SECRET="yft-super-secret-jwt-key-2026"
PORT=5000
```

Prisma klientini generatsiya qilish va boshlang'ich ma'lumotlarni to'ldirish (seed):
```bash
pnpm run prisma:generate
pnpm --filter @yft/backend prisma:push   # yangi `media` jadvali uchun
pnpm run prisma:seed
pnpm --filter @yft/backend assets:import -- --source ../../../yft-version_2_1_0
```

> **Default Admin Hisobi:**
> - Email: `admin@yft.uz`
> - Parol: `Admin123!`

---

## 🛠️ Dasturlash (Dev rejimida ishga tushirish)

Barcha servislarni bir vaqtning o'zida ishga tushirish:
```bash
pnpm run dev
```

Yoki alohida qismlar:
```bash
pnpm run dev:user    # http://localhost:3000 (Next.js User qismi)
pnpm run dev:admin   # http://localhost:5173 (Shadcn Admin paneli)
pnpm run dev:back    # http://localhost:5000 (Express.js API serveri)
```

---

## 📦 Production Build

Barcha ilovalarni bir vaqtda build qilish:
```bash
pnpm run build
```

Alohida build qilish:
```bash
pnpm run build:user
pnpm run build:admin
pnpm run build:back
```

---

## 📁 Monorepo Papkalar Tuzilishi

```
yft-front/
├── apps/
│   ├── admin/      # Shadcn Admin (Vite + React 19 + TanStack Router)
│   ├── backend/    # Express.js + Prisma ORM + PostgreSQL REST API
│   └── user/       # Next.js 14 App Router (Foydalanuvchilar qismi)
├── package.json    # Monorepo root skriptlari
├── pnpm-workspace.yaml
└── README.md
```

---

## 🌐 Xususiyatlar va Imkoniyatlar

### User (Next.js 14)
- **Dizayn**: `version_2_1_0` branchidagi saytdan ko'chirilgan — shaffof navbar, banner slayderi va ustidagi 3 ta "motto" kartochka, "Biz haqimizda" + video, fotogalereya, yangiliklar, mahsulotlar slayderi, vakansiyalar, FAQ, hamkorlar, kontakt formasi + xarita, to'q-firuza footer. Ranglar: `primary #EEAD0F`, `secondary #063F58`; shrift IBM Plex Sans.
- **Sahifalar**: `/`, `/photos`, `/news`, `/news/[id]`, `/vacancies`, `/vacancies/[id]`.
- **Kontent backenddan** (60 soniyada yangilanadi): bannerlar, motto/FAQ, yangiliklar, vakansiyalar, mahsulotlar, fotolar, hamkorlar va `settings`. Bo'sh bo'limlar yashiriladi.
- **4 til**: `uz`, `ru`, `en`, `fa` (fors tili, RTL).
- `NEXT_PUBLIC_API_URL` (`apps/user/.env.example`) — backend manzili.

### Admin (Shadcn-Admin)
- Haqiqiy login (`/api/auth/login`), himoyalangan route'lar, 401 da avtomatik chiqish.
- Bannerlar, matn bloklari (motto, FAQ), yangiliklar va vakansiyalar (qoralama / e'lon qilingan).
- Bosh sahifa: `/api/stats` dan sonlar, so'nggi murojaatlar va mahsulotlar.
- Mahsulotlar, foto galereya va hamkorlar: to'liq CRUD, rasm yuklash (preview bilan), 4 tilli maydonlar (uz, ru, en, fa).
- Sayt sozlamalari: telefon, email, manzil, ijtimoiy tarmoqlar, video/xarita havolalari va bo'lim rasmlari (`asset.*`).
- Murojaatlar: holat (`NEW`, `IN_PROGRESS`, `RESOLVED`), biriktirilgan faylni ochish, o'chirish.

### Backend (Express + Prisma)
- Xavfsiz JWT autentifikatsiya va bcrypt parol shifrlash.
- Prisma v6 ORM bilan to'liq tiplashgan PostgreSQL modellari.
- Fayl saqlash: `media` jadvali, magic-byte tekshiruvi, SHA-256 bo'yicha dedup, o'lchamlarni avtomatik aniqlash, ishlatilmay qolgan fayllarni o'chirish (batafsil: `apps/backend/README.md`).
- Eski sayt (`version_2_1_0`) rasmlarini import qilish: `pnpm --filter @yft/backend assets:import -- --source <version_2_1_0 checkout>`.
