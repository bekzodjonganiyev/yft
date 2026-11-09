import {
  LayoutDashboard,
  Package,
  Image,
  Inbox,
  Handshake,
  Settings,
  Wheat,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    { name: 'Yangiyer Flour Trading', logo: Wheat, plan: 'Boshqaruv paneli' },
  ],
  navGroups: [
    {
      title: 'Umumiy',
      items: [{ title: 'Bosh sahifa', url: '/', icon: LayoutDashboard }],
    },
    {
      title: 'Sayt kontenti',
      items: [
        { title: 'Mahsulotlar', url: '/products', icon: Package },
        { title: 'Foto galereya', url: '/photos', icon: Image },
        { title: 'Hamkorlar', url: '/partners', icon: Handshake },
        { title: 'Sayt sozlamalari', url: '/settings', icon: Settings },
      ],
    },
    {
      title: 'Mijozlar',
      items: [{ title: 'Murojaatlar', url: '/inquiries', icon: Inbox }],
    },
  ],
}
