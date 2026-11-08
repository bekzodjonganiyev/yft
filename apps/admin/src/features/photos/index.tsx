import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Trash2, Image as ImageIcon, Calendar, Layers, Eye } from 'lucide-react'
import { api, fallbackPhotos } from '@/lib/api'
import { toast } from 'sonner'

export function PhotosFeature() {
  const [photos, setPhotos] = useState(fallbackPhotos)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    photoUrl: '',
    titleUz: '',
    titleRu: '',
    titleEn: '',
    category: 'production',
    width: 1200,
    height: 800,
    date: new Date().toISOString().split('T')[0],
  })

  const loadPhotos = async () => {
    try {
      const res = await api.get('/photos')
      if (res.data?.success && res.data.data.length > 0) {
        setPhotos(res.data.data)
      }
    } catch {
      // Keep fallbacks
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/photos', formData).catch(() => null)
      const newPhoto = res?.data?.data || {
        ...formData,
        _id: 'ph-' + Date.now(),
        id: 'ph-' + Date.now(),
        createdAt: new Date().toISOString(),
      }
      setPhotos([newPhoto, ...photos])
      toast.success('Yangi fotosurat galereyaga qo\'shildi')
      setIsAddOpen(false)
      setFormData({
        photoUrl: '',
        titleUz: '',
        titleRu: '',
        titleEn: '',
        category: 'production',
        width: 1200,
        height: 800,
        date: new Date().toISOString().split('T')[0],
      })
    } catch (err: any) {
      toast.error('Xatolik yuz berdi: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/photos/${id}`).catch(() => {})
      setPhotos(photos.filter(p => (p.id || p._id) !== id))
      toast.success('Rasm o\'chirildi')
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
              <ImageIcon className='h-6 w-6 text-amber-500' />
              <h2 className='text-2xl font-bold tracking-tight'>Foto Galereya Boshqaruvi</h2>
            </div>
            <p className='text-muted-foreground'>
              Tegirmon, ishlab chiqarish sexlari, laboratoriya va tayyor mahsulotlar fotosuratlari.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className='gap-2 bg-amber-600 hover:bg-amber-700 text-white'>
            <Plus className='h-4 w-4' /> Yangi Rasm Yuklash
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {photos.map((item) => {
            const photoId = item.id || item._id
            return (
              <div
                key={photoId}
                className='group relative rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col'
              >
                <div className='relative h-48 w-full bg-muted overflow-hidden'>
                  <img
                    src={item.photoUrl || (item as any).photo}
                    alt={item.titleUz || (item as any).title_uz || 'Photo'}
                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                    <Button
                      size='icon'
                      variant='secondary'
                      className='h-8 w-8 rounded-full'
                      onClick={() => setPreviewPhoto(item)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='destructive'
                      className='h-8 w-8 rounded-full'
                      onClick={() => setDeletingId(photoId)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <div className='p-4 flex-1 flex flex-col justify-between'>
                  <div>
                    <div className='flex items-center justify-between gap-2 mb-2'>
                      <Badge variant='outline' className='text-xs font-mono uppercase'>
                        {item.category || 'production'}
                      </Badge>
                      <span className='text-xs text-muted-foreground flex items-center gap-1'>
                        <Layers className='h-3 w-3' /> {item.width} x {item.height}
                      </span>
                    </div>
                    <h3 className='font-medium text-sm line-clamp-2 text-foreground'>
                      {item.titleUz || item.title_uz || 'Yangiyer Flour Trading'}
                    </h3>
                  </div>

                  <div className='mt-4 pt-2 border-t flex items-center justify-between text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-3 w-3' /> {item.date ? String(item.date).split('T')[0] : '2026'}
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-destructive h-7 text-xs px-2 hover:bg-destructive/10'
                      onClick={() => setDeletingId(photoId)}
                    >
                      O'chirish
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upload Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Yangi Fotosurat Qo'shish</DialogTitle>
              <DialogDescription>
                Galereya uchun rasm havolasi, o'lchamlari va tavsifini kiriting.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePhoto} className='space-y-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='photoUrl'>Rasm URL havolasi *</Label>
                <Input
                  id='photoUrl'
                  required
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder='https://... yoki /uploads/...'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='titleUz'>Sarlavha (O'zbekcha)</Label>
                <Input
                  id='titleUz'
                  value={formData.titleUz}
                  onChange={(e) => setFormData({ ...formData, titleUz: e.target.value })}
                  placeholder='Masalan: Tegirmon agregati'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='width'>Kengligi (Eni, px)</Label>
                  <Input
                    id='width'
                    type='number'
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 1200 })}
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='height'>Balandligi (Bo'yi, px)</Label>
                  <Input
                    id='height'
                    type='number'
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 800 })}
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='category'>Bo'lim</Label>
                  <select
                    id='category'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className='w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm'
                  >
                    <option value='production'>Ishlab chiqarish</option>
                    <option value='laboratory'>Laboratoriya</option>
                    <option value='factory'>Ombor va Zavod</option>
                    <option value='team'>Jamoa</option>
                  </select>
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='date'>Sana</Label>
                  <Input
                    id='date'
                    type='date'
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setIsAddOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type='submit' className='bg-amber-600 hover:bg-amber-700 text-white'>
                  Yuklash va Saqlash
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Preview Lightbox Dialog */}
        <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
          <DialogContent className='max-w-4xl p-2 bg-black/95 text-white border-0'>
            {previewPhoto && (
              <div className='flex flex-col items-center'>
                <img
                  src={previewPhoto.photoUrl || previewPhoto.photo}
                  alt={previewPhoto.titleUz || 'Preview'}
                  className='max-h-[75vh] w-auto object-contain rounded'
                />
                <p className='mt-3 text-sm text-center text-zinc-300'>
                  {previewPhoto.titleUz || previewPhoto.title_uz} ({previewPhoto.width} x {previewPhoto.height})
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fotosuratni o'chirishni xohlaysizmi?</DialogTitle>
              <DialogDescription>
                Rasm galereyadan butunlay olib tashlanadi.
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
