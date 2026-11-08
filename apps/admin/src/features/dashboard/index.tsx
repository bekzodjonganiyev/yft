import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { Wheat, Inbox, Image, Handshake } from 'lucide-react'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} className='me-auto' />
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>YFT Boshqaruv Paneli</h1>
            <p className='text-muted-foreground text-sm'>
              Yangiyer Flour Trading ishlab chiqarish, mahsulotlar va buyurtmalar statistikasi.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button className='bg-amber-600 hover:bg-amber-700 text-white'>Hisobotni Yuklash (PDF)</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Ko'rsatkichlar (Overview)</TabsTrigger>
              <TabsTrigger value='analytics'>Analitika (Tegirmon quvvati)</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Un Mahsulotlari
                  </CardTitle>
                  <Wheat className='h-4 w-4 text-amber-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>4 tur</div>
                  <p className='text-xs text-muted-foreground'>
                    Oliy nav, 1-nav, 2-nav, kepak
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Mijozlar Murojaatlari
                  </CardTitle>
                  <Inbox className='h-4 w-4 text-blue-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>2 ta yangi</div>
                  <p className='text-xs text-muted-foreground'>
                    Ulgurji xarid va eksport so'rovlari
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Foto Galereya</CardTitle>
                  <Image className='h-4 w-4 text-emerald-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>12 fotosurat</div>
                  <p className='text-xs text-muted-foreground'>
                    Tegirmon, laboratoriya, ombor
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Hamkor Korxonalar
                  </CardTitle>
                  <Handshake className='h-4 w-4 text-purple-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>5 ta kompaniya</div>
                  <p className='text-xs text-muted-foreground'>
                    Yirik non sexlari va distribyutorlar
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Oylik Yetkazib Berish Hajmi (Tonna)</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>So'nggi Murojaatlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Umumiy',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Mahsulotlar',
    href: '/products',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Galereya',
    href: '/photos',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Murojaatlar',
    href: '/inquiries',
    isActive: false,
    disabled: false,
  },
]
