# YFT Admin

Boshqaruv paneli: Vite + React 19 + TanStack Router/Query + shadcn/ui
([satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) asosida, MIT — `LICENSE`).

```bash
cp .env.example .env        # VITE_API_URL=http://localhost:5000
pnpm --filter @yft/admin dev
```

- Kirish: `POST /api/auth/login`; token `localStorage` (`yft_admin_session`) da, muddati o'tsa yoki backend 401 qaytarsa `/sign-in` ga qaytaradi.
- Sahifalar: Bosh sahifa (`/api/stats`), Mahsulotlar, Foto galereya, Hamkorlar, Sayt sozlamalari (`/api/settings`), Murojaatlar.
- Rasmlar multipart orqali yuklanadi (`image` / `photo` / `logo` / `file`), backend ularni `media` jadvaliga saqlaydi.
