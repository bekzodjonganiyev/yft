# Yangiyer Flour Trading (YFT) - User Web Portal

Modern Next.js 14 web application for Yangiyer Flour Trading (LLP), designed with custom visual design tokens, full internationalization (Uzbek, Russian, English, Arabic RTL), interactive video hero, dynamic flour recommender calculator, responsive gallery lightbox, and direct wholesale inquiry submission.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system (`wheat`, `slateIron`, `milledCream`)
- **Typography**: Plus Jakarta Sans
- **Icons**: Lucide React
- **Internationalization**: Custom multi-language engine supporting `uz`, `ru`, `en`, and `ar` with automatic RTL layout

## Key Features & UI/UX Improvements
1. **Hero Section**:
   - Autoplay looping brand video background with custom gradient scrim.
   - Distinctive typography, real company heritage statement, and quick stats (33+ years, 300 tons/day capacity, 100% natural wheat).
2. **About Us Section**:
   - Interactive historical milestones timeline (1991 founding, 2005 expansion, 2018 Swiss milling tech upgrade, 2024 regional leader).
   - Video tour modal player.
3. **Flour Products Catalog**:
   - Tabbed filtering by category (Premium, First Grade, Second Grade, Wheat Bran).
   - Detailed technical cards showing gluten %, ash content, moisture %, packaging sizes (5kg to 50kg), and recommended uses.
   - Smooth order trigger that prefills the inquiry form.
4. **Interactive Flour Recommender Tool**:
   - Interactive wizard for commercial bakeries, confectionery factories, pasta producers, and retailers to select the exact right flour grade based on their recipe requirements.
5. **Photo Gallery**:
   - Categorized gallery (Milling lines, Laboratory, Logistics) with responsive masonry layout and interactive keyboard-controlled lightbox modal (zoom, navigation, escape).
6. **Partners Marquee**:
   - Infinite smooth auto-scrolling partner showcase.
7. **Contact & Quote Submission**:
   - Interactive form connected to Express/Prisma backend `POST /api/inquiries`.
   - Direct office cards and interactive Google Map to Yangiyer industrial district.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view in the browser.
3. Build for production:
   ```bash
   npm run build
   npm start
   ```
