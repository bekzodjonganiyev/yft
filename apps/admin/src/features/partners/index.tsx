import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Trash2, Handshake, ExternalLink, Globe } from 'lucide-react'
import { api, fallbackPartners } from '@/lib/api'
import { toast } from 'sonner'

export function PartnersFeature() {
  const [partners, setPartners] = useState(fallbackPartners)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    order: 1,
  })

  const loadPartners = async () => {
    try {
      const res = await api.get('/partners')
      if (res.data?.success && res.data.data.length > 0) {
        setPartners(res.data.data)
      }
    } catch {
      // Use fallback
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/partners', formData).catch(() => null)
      const newPartner = res?.data?.data || {
        ...formData,
        id: 'part-' + Date.now(),
      }
      setPartners([...partners, newPartner])
      toast.success('Yangi hamkor qo\'shildi')
      setIsAddOpen(false)
      setFormData({ name: '', logoUrl: '', websiteUrl: '', order: partners.length + 1 })
    } catch (err: any) {
      toast.error('Xatolik: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/partners/${id}`).catch(() => {})
      setPartners(partners.filter(p => p.id !== id))
      toast.success('Hamkor o\'chirildi')
      setDeletingId(null)
    } catch (err: any) {
      toast.error('O\'chirishda xatolik: ' + err.message)
    }
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2'>
              <Handshake className='h-6 w-6 text-amber-500' />
              <h2 className='text-2xl font-bold tracking-tight'>Hamkor Korxonalar</h2>
            </div>
            <p className='text-muted-foreground'>
              Yangiyer Flour Trading bilan hamkorlik qilayotgan ulgurji mijozlar va xalqaro tashkilotlar.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className='gap-2 bg-amber-600 hover:bg-amber-700 text-white'>
            <Plus className='h-4 w-4' /> Yangi Hamkor Qo'shish
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {partners.map((partner) => (
            <div
              key={partner.id}
              className='rounded-xl border bg-card p-6 flex flex-col items-center text-center justify-between shadow-sm hover:shadow-md transition-shadow relative group'
            >
              <div className='h-24 w-full flex items-center justify-center p-2 mb-4 bg-muted/30 rounded-lg border'>
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className='max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all'
                />
              </div>

              <div className='w-full'>
                <h3 className='font-semibold text-base text-foreground mb-1'>{partner.name}</h3>
                {partner.websiteUrl && partner.websiteUrl !== '#' && (
                  <a
                    href={partner.websiteUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-xs text-primary hover:underline inline-flex items-center gap-1 justify-center'
                  >
                    <Globe className='h-3 w-3' /> Veb-saytga o'tish <ExternalLink className='h-3 w-3' />
                  </a>
                )}
              </div>

              <div className='mt-4 pt-3 border-t w-full flex justify-end'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-destructive hover:bg-destructive/10 h-7 text-xs'
                  onClick={() => setDeletingId(partner.id)}
                >
                  <Trash2 className='h-3.5 w-3.5 me-1' /> O'chirish
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Partner Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Yangi Hamkor Qo'shish</DialogTitle>
              <DialogDescription>
                Hamkor korxona nomi, logotipi va veb-sayti havolasini kiriting.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePartner} className='space-y-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='name'>Hamkor Nomi *</Label>
                <Input
                  id='name'
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="O'zdonmahsulot AK"
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='logoUrl'>Logotip URL havolasi *</Label>
                <Input
                  id='logoUrl'
                  required
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder='https://...'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='websiteUrl'>Veb-sayt havolasi (ixtiyoriy)</Label>
                <Input
                  id='websiteUrl'
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder='https://...'
                />
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setIsAddOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type='submit' className='bg-amber-600 hover:bg-amber-700 text-white'>
                  Saqlash
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hamkorni o'chirishni xohlaysizmi?</DialogTitle>
              <DialogDescription>
                Bu korxona hamkorlar ro'yxatidan o'chiriladi.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setDeletingId(null)}>
                Bekor qilish
              </Button>
              <Button variant='destructive' onClick={() => deletingId && handleDelete(deletingId)}>
                O'chirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}
