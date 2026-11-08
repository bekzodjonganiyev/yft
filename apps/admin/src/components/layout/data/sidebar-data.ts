import {
  LayoutDashboard,
  Package,
  Image,
  Inbox,
  Handshake,
  Users,
  Settings,
  ShieldCheck,
  Wheat,
  Factory,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'YFT Administrator',
    email: 'admin@yft.uz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
  },
  teams: [
    {
      name: 'Yangiyer Flour Trading',
      logo: Wheat,
      plan: 'Un va Don Ishlab Chiqarish',
    },
    {
      name: 'YFT Sirdaryo Tegirmon',
      logo: Factory,
      plan: 'Ishlab chiqarish kompleksi',
    },
  ],
  navGroups: [
    {
      title: 'Umumiy',
      items: [
        {
          title: 'Bosh sahifa (Dashboard)',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Ishlab Chiqarish va Mahsulotlar',
      items: [
        {
          title: 'Mahsulotlar (Un turlari)',
          url: '/products',
          icon: Package,
        },
        {
          title: 'Foto Galereya',
          url: '/photos',
          icon: Image,
        },
        {
          title: 'Hamkorlar',
          url: '/partners',
          icon: Handshake,
        },
      ],
    },
    {
      title: 'Mijozlar va Murojaatlar',
      items: [
        {
          title: 'Murojaatlar (Inquiries)',
          url: '/inquiries',
          icon: Inbox,
        },
      ],
    },
    {
      title: 'Tizim va Xavfsizlik',
      items: [
        {
          title: 'Foydalanuvchilar',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Tizim Sozlamalari',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Autentifikatsiya',
          icon: ShieldCheck,
          items: [
            {
              title: 'Kirish (Sign In)',
              url: '/sign-in',
            },
            {
              title: 'Parolni tiklash',
              url: '/forgot-password',
            },
          ],
        },
      ],
    },
  ],
}
