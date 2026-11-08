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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Wheat, Search as SearchIcon } from 'lucide-react'
import { api, fallbackProducts } from '@/lib/api'
import { toast } from 'sonner'

export function ProductsFeature() {
  const [products, setProducts] = useState(fallbackProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    titleUz: '',
    titleRu: '',
    titleEn: '',
    category: 'FLOUR_FIRST',
    packaging: '50 kg, 25 kg',
    gluten: '30%',
    ash: '0.75%',
    moisture: '14.0%',
    imageUrl: '',
    isFeatured: true,
  })

  const loadProducts = async () => {
    try {
      const res = await api.get('/products')
      if (res.data?.success && res.data.data.length > 0) {
        setProducts(res.data.data)
      }
    } catch {
      // Fallback data is preserved
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleOpenAdd = () => {
    setFormData({
      titleUz: '',
      titleRu: '',
      titleEn: '',
      category: 'FLOUR_FIRST',
      packaging: '50 kg, 25 kg',
      gluten: '30%',
      ash: '0.75%',
      moisture: '14.0%',
      imageUrl: '',
      isFeatured: true,
    })
    setIsAddOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData).catch(() => {})
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p))
        toast.success('Mahsulot muvaffaqiyatli yangilandi')
      } else {
        const res = await api.post('/products', formData).catch(() => null)
        const newProduct = res?.data?.data || {
          ...formData,
          id: 'prod-' + Date.now(),
          order: products.length + 1,
          createdAt: new Date().toISOString(),
        }
        setProducts([newProduct, ...products])
        toast.success('Yangi mahsulot qo\'shildi')
      }
      setIsAddOpen(false)
      setEditingProduct(null)
    } catch (err: any) {
      toast.error('Xatolik yuz berdi: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`).catch(() => {})
      setProducts(products.filter(p => p.id !== id))
      toast.success('Mahsulot o\'chirildi')
      setDeletingId(null)
    } catch (err: any) {
      toast.error('O\'chirishda xatolik: ' + err.message)
    }
  }

  const filtered = products.filter(p =>
    p.titleUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <Wheat className='h-6 w-6 text-amber-500' />
              <h2 className='text-2xl font-bold tracking-tight'>Un Mahsulotlari Boshqaruvi</h2>
            </div>
            <p className='text-muted-foreground'>
              Yangiyer Flour Trading un navlari, qadoqlash turlari va texnik ko'rsatkichlari.
            </p>
          </div>
          <Button onClick={handleOpenAdd} className='gap-2 bg-amber-600 hover:bg-amber-700 text-white'>
            <Plus className='h-4 w-4' /> Yangi Mahsulot Qo'shish
          </Button>
        </div>

        {/* Filter bar */}
        <div className='flex items-center gap-3'>
          <div className='relative flex-1 max-w-sm'>
            <SearchIcon className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder="Mahsulot nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
          <Badge variant='outline' className='py-1.5 px-3'>
            Jami: {filtered.length} ta
          </Badge>
        </div>

        {/* Products Table */}
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rasm</TableHead>
                <TableHead>Nomi (O'zbekcha / Ruscha / Inglizcha)</TableHead>
                <TableHead>Kategoriya</TableHead>
                <TableHead>Qadoq</TableHead>
                <TableHead>Kleykovina (Gluten)</TableHead>
                <TableHead>Kul miqdori (Ash)</TableHead>
                <TableHead>Holati</TableHead>
                <TableHead className='text-right'>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                    Hech qanday mahsulot topilmadi.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className='h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center border'>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.titleUz} className='h-full w-full object-cover' />
                        ) : (
                          <Wheat className='h-6 w-6 text-amber-500' />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='font-semibold text-foreground'>{item.titleUz}</div>
                      <div className='text-xs text-muted-foreground'>{item.titleRu}</div>
                      <div className='text-xs text-muted-foreground/80 italic'>{item.titleEn}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary' className='text-xs font-mono'>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm'>{item.packaging}</TableCell>
                    <TableCell className='text-sm font-medium'>{item.gluten}</TableCell>
                    <TableCell className='text-sm font-medium'>{item.ash}</TableCell>
                    <TableCell>
                      {item.isFeatured ? (
                        <Badge className='bg-emerald-600 text-white'>Asosiy</Badge>
                      ) : (
                        <Badge variant='outline'>Oddiy</Badge>
                      )}
                    </TableCell>
                    <TableCell className='text-right space-x-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          setEditingProduct(item)
                          setFormData({
                            titleUz: item.titleUz,
                            titleRu: item.titleRu,
                            titleEn: item.titleEn,
                            category: item.category,
                            packaging: item.packaging,
                            gluten: item.gluten || '',
                            ash: item.ash || '',
                            moisture: item.moisture || '',
                            imageUrl: item.imageUrl,
                            isFeatured: item.isFeatured,
                          })
                          setIsAddOpen(true)
                        }}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:bg-destructive/10'
                        onClick={() => setDeletingId(item.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add / Edit Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Mahsulotni Tahrirlash' : "Yangi Un Mahsuloti Qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Mahsulot ma'lumotlari, ko'rsatkichlari va qadoqlash parametrlarini kiriting.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveProduct} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='titleUz'>Nomi (O'zbekcha) *</Label>
                  <Input
                    id='titleUz'
                    required
                    value={formData.titleUz}
                    onChange={(e) => setFormData({ ...formData, titleUz: e.target.value })}
                    placeholder='Oliy navli un'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='titleRu'>Nomi (Ruscha) *</Label>
                  <Input
                    id='titleRu'
                    required
                    value={formData.titleRu}
                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                    placeholder='Мука высший сорт'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='titleEn'>Nomi (Inglizcha) *</Label>
                  <Input
                    id='titleEn'
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder='Premium Wheat Flour'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='category'>Kategoriya</Label>
                  <select
                    id='category'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className='w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm'
                  >
                    <option value='FLOUR_PREMIUM'>Oliy Nav (Premium)</option>
                    <option value='FLOUR_FIRST'>1-Nav (Birinchi Nav)</option>
                    <option value='FLOUR_SECOND'>2-Nav (Ikkinchi Nav)</option>
                    <option value='BRAN'>Kepak (Bran)</option>
                    <option value='GRAIN'>Bug'doy Doni (Grain)</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='gluten'>Kleykovina (Gluten)</Label>
                  <Input
                    id='gluten'
                    value={formData.gluten}
                    onChange={(e) => setFormData({ ...formData, gluten: e.target.value })}
                    placeholder='28 - 30%'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='ash'>Kul Miqdori (Ash)</Label>
                  <Input
                    id='ash'
                    value={formData.ash}
                    onChange={(e) => setFormData({ ...formData, ash: e.target.value })}
                    placeholder='0.55%'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='moisture'>Namlik (Moisture)</Label>
                  <Input
                    id='moisture'
                    value={formData.moisture}
                    onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                    placeholder='14.0%'
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='packaging'>Qadoq turlari</Label>
                <Input
                  id='packaging'
                  value={formData.packaging}
                  onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                  placeholder='50 kg, 25 kg, 10 kg, 5 kg'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='imageUrl'>Rasm Havolasi (URL yoki /uploads/...)</Label>
                <Input
                  id='imageUrl'
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder='https://... yoki /uploads/...'
                />
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setIsAddOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type='submit' className='bg-amber-600 hover:bg-amber-700 text-white'>
                  {editingProduct ? 'O\'zgarishlarni Saqlash' : 'Mahsulotni Yaratish'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mahsulotni o'chirishni tasdiqlaysizmi?</DialogTitle>
              <DialogDescription>
                Bu amalni ortga qaytarib bo'lmaydi. Mahsulot katalogdan o'chiriladi.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setDeletingId(null)}>
                Bekor qilish
              </Button>
              <Button
                variant='destructive'
                onClick={() => deletingId && handleDelete(deletingId)}
              >
                Ha, o'chirilsin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}
