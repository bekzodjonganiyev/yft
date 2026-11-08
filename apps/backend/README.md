# Yangiyer Flour Trading (YFT) - Backend API

Production-ready backend API service for Yangiyer Flour Trading platform built with Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma ORM v6
- **Authentication**: JWT & Bcrypt password hashing
- **File Uploads**: Multer (Static file hosting at `/uploads`)
- **Validation**: Strict TypeScript & type-safe request parsing

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token and user info)
- `POST /api/auth/register` - Register new admin/manager user
- `GET /api/auth/me` - Get authenticated user profile (Bearer token required)

### Products (Wheat Flour & Grains)
- `GET /api/products` - List products with optional `?category=` and `?search=` filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (supports multipart image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Gallery / Photos
- `GET /api/photos` - List all gallery photos
- `POST /api/photos` - Upload gallery photo with width/height/category
- `DELETE /api/photos/:id` - Delete photo
- Legacy compatibility: `GET /photo/all`, `POST /photo/add`, `DELETE /photo/:id`

### Partners
- `GET /api/partners` - List partner companies and logos
- `POST /api/partners` - Add partner (with logo upload)
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### Inquiries / Contact Messages
- `POST /api/inquiries` - Public submission form with file upload
- `GET /api/inquiries` - Admin list of inquiries (filter by status `NEW`, `IN_PROGRESS`, `RESOLVED`)
- `PATCH /api/inquiries/:id/status` - Update inquiry status
- `DELETE /api/inquiries/:id` - Remove inquiry

### Dashboard Analytics
- `GET /api/stats` - Total products, photos, partners, inquiries, latest activity

## Getting Started

1. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
2. Configure `DATABASE_URL` in `.env`.
3. Push schema to PostgreSQL database:
   ```bash
   npx prisma db push
   ```
4. Seed initial data (default admin `admin@yft.uz` / `Admin123!`, sample products, photos, partners):
   ```bash
   npm run prisma:seed
   ```
5. Run development server:
   ```bash
   npm run dev
   ```
6. Build for production:
   ```bash
   npm run build
   npm start
   ```
