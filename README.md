# Yangiyer Flour Trading (YFT) — Monorepo

Ushbu monorepo loyihada barcha 3 ta qism (User, Admin, Backend) **pnpm monorepo** arxitekturasida bitta papkaga birlashtirilgan:

- `apps/user`: Next.js 14 (App Router) + Tailwind CSS + 4 tilli i18n + Interaktiv kalkulyator va video hero.
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
pnpm run prisma:seed
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
- **Frontend-design ko'rsatmalari asosida zamonaviy dizayn**: bug'doy, un, tegirmon sanoatiga mos ranglar palitrasi (`wheat`, `milledCream`, `slateIron`).
- **4 tilli interfeys**: O'zbek (`uz`), Rus (`ru`), Ingliz (`en`), Arab (`ar` — avtomatik RTL yo'nalishi bilan).
- **Interaktiv Flour Recommender**: Mahsulot va faoliyat turiga ko'ra (non, qandolat, lavash, somsa) to'g'ri un navini hisoblab beruvchi kalkulyator.
- **Texnik spetsifikatsiyalar**: Har bir un navi uchun kleykovina, kul miqdori, namlik va qadoq ma'lumotlari.
- **Lightbox Foto Galereya**: Korxona, elevator, tegirmon va laboratoriya fotolari.
- **To'g'ridan-to'g'ri Murojaat Formasi**: Backend API (`/api/inquiries`) ga to'g'ridan-to'g'ri bog'langan.

### Admin (Shadcn-Admin)
- Dashboard analitika grafiklari: Ishlab chiqarish ko'rsatkichlari, oylik yuklash hajmlari, yangi arizalar.
- Un mahsulotlari boshqaruvi: Navlar bo'yicha saralash, texnik parametrlar, narx va rasm tahrirlash (CRUD).
- Foto galereya boshqaruvi: Kategoriyalar bo'yicha yangi fotolar yuklash va tahrirlash.
- Arizalar va Murojaatlar Inboxi: Holatlar (`NEW`, `IN_PROGRESS`, `RESOLVED`), mijoz ma'lumotlari va telefon raqamlari.
- Hamkorlar boshqaruvi: Logotip, nom va sayt havolalari.

### Backend (Express + Prisma)
- Xavfsiz JWT autentifikatsiya va bcrypt parol shifrlash.
- Prisma v6 ORM bilan to'liq tiplashgan PostgreSQL modellari.
- Multer bilan xavfsiz fayl yuklash tizimi.
