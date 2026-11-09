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
- `POST /api/auth/register` - Create a new admin/manager user (**admin token required**)
- `GET /api/auth/me` - Get authenticated user profile (Bearer token required)

### Products (Wheat Flour & Grains)
- `GET /api/products` - List products with optional `?category=` and `?search=` filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (supports multipart image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Gallery / Photos
- `GET /api/photos` - List all gallery photos
- `POST /api/photos` - Upload gallery photo (field `photo`); width/height are read from the file
- `PUT /api/photos/:id` - Update photo titles/category or replace the image
- `DELETE /api/photos/:id` - Delete photo
- Legacy compatibility: `GET /photo/all`, `POST /photo/add` (auth), `DELETE /photo/:id` (auth)

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

### Site content (version_2_1_0 design)
- `GET /api/banners[?all=true]` · `POST` / `PUT /api/banners/:id` (field `image`) · `DELETE` — hero slider
- `GET /api/posts?type=NEWS|VACANCY[&limit=4][&all=true]` · `GET /api/posts/:id` · `POST` / `PUT` (field `image`) · `DELETE` — news & vacancies (drafts hidden unless `all=true`)
- `GET /api/info-items?kind=MOTTO|FAQ` · `POST` / `PUT` (JSON) · `DELETE` — motto cards and FAQ
- All text fields come in four languages: `…Uz`, `…Ru`, `…En`, `…Fa` (Persian). Product/photo `…Fa` fields are
  stored in the former `…Ar` columns (`@map`), so no data migration is needed.

### Media (file storage)
- `GET /api/media` - Media library with `inUse` flag (auth)
- `POST /api/media` - Upload an image, field `file` (auth). Same as `POST /api/upload`
- `DELETE /api/media/:id[?force=true]` - Delete a file; refused with 409 while still referenced (auth)

### Site settings
- `GET /api/settings` - Public `{ key: value }` map (phone, email, address, `asset.*` images, `social.*` links…)
- `PUT /api/settings/:key` - JSON `{ value }` or multipart image in field `file` (auth)
- `DELETE /api/settings/:key` (auth)

## How files are stored

All uploads (banners, post images, product images, gallery photos, partner logos, site assets, inquiry attachments) go through
`src/services/media.service.ts`:

1. Multer keeps the upload in memory (max 15 MB) — nothing touches disk before validation.
2. The real type is detected from the file bytes (JPEG, PNG, WEBP, GIF, AVIF; PDF/DOC/DOCX for inquiry
   attachments). A renamed `.html`/`.svg` is rejected.
3. The SHA-256 hash names the file (`uploads/img-<hash>.jpg`) and is unique in the `media` table, so the
   same image uploaded twice is stored once.
4. Image width/height are saved (the gallery uses them for its layout).
5. When a banner/post/product/photo/partner/setting/inquiry is deleted or its image replaced, `releaseMedia()` removes
   the old file if nothing else references it.

Files are served from `/uploads/*` with long-lived immutable caching and `X-Content-Type-Options: nosniff`.

### Importing the images of the previous site (branch `version_2_1_0`)

```bash
git worktree add ../yft-version_2_1_0 version_2_1_0   # once
pnpm --filter @yft/backend assets:import -- --source ../../../yft-version_2_1_0
```

Copies the logo and the wheat photos into storage and creates the hero banners, gallery photos and
`asset.*` settings. The rest of that site's content (banners, news, vacancies, products, partners, gallery)
was served by `coral-app-bsinx.ondigitalocean.app`, which no longer exists — it has to be re-entered in the
admin panel. The placeholder partner logos in that branch (Nike / "logoipsum") are not imported.
Flags: `--skip-remote`, `--localize-db` (copy any other http(s) image URL in the DB), `--clear-dead` (with `--localize-db`: blank partner logos whose source is gone, so the site shows the name until a new logo is uploaded), `--force`.
The script is idempotent.

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
4. Seed initial data (default admin `admin@yft.uz` / `Admin123!`, sample products, partners and settings):
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
