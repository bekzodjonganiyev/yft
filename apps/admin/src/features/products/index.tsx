import { useMemo, useState } from 'react'
import {
  Loader2,
  Pencil,
  Plus,
  Search as SearchIcon,
  Trash2,
  Wheat,
} from 'lucide-react'
import { api, mediaUrl, toFormData } from '@/lib/api'
import { PRODUCT_CATEGORIES } from '@/lib/labels'
import type { Product } from '@/lib/types'
import { useApiMutation, useApiQuery } from '@/hooks/use-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ImageInput } from '@/components/image-input'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const LANGS = [
  { code: 'Uz', label: "O'zbekcha", required: true },
  { code: 'Ru', label: 'Русский', required: true },
  { code: 'En', label: 'English', required: true },
  { code: 'Ar', label: 'العربية', required: false },
] as const

type FormValues = {
  titleUz: string
  titleRu: string
  titleEn: string
  titleAr: string
  descUz: string
  descRu: string
  descEn: string
  descAr: string
  category: string
  packaging: string
  gluten: string
  ash: string
  moisture: string
  order: number
  isFeatured: boolean
}

const emptyForm = (order: number): FormValues => ({
  titleUz: '',
  titleRu: '',
  titleEn: '',
  titleAr: '',
  descUz: '',
  descRu: '',
  descEn: '',
  descAr: '',
  category: 'FLOUR_FIRST',
  packaging: '50 kg',
  gluten: '',
  ash: '',
  moisture: '',
  order,
  isFeatured: true,
})

const fromProduct = (p: Product): FormValues => ({
  titleUz: p.titleUz,
  titleRu: p.titleRu,
  titleEn: p.titleEn,
  titleAr: p.titleAr,
  descUz: p.descUz,
  descRu: p.descRu,
  descEn: p.descEn,
  descAr: p.descAr,
  category: p.category,
  packaging: p.packaging,
  gluten: p.gluten ?? '',
  ash: p.ash ?? '',
  moisture: p.moisture ?? '',
  order: p.order,
  isFeatured: p.isFeatured,
})

const KEY = ['products']

export function ProductsFeature() {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<Product[]>(KEY, '/products')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const remove = useApiMutation((id: string) => api.delete(`/products/${id}`), {
    invalidate: [KEY],
    success: "Mahsulot o'chirildi",
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      [p.titleUz, p.titleRu, p.titleEn, p.category].some((v) =>
        v?.toLowerCase().includes(q)
      )
    )
  }, [products, search])

  return (
    <PageShell
      title='Mahsulotlar'
      description='Saytdagi "brendlar" karuselida ko‘rinadigan un mahsulotlari.'
      icon={Wheat}
      actions={
        <Button onClick={() => setEditing('new')}>
          <Plus /> Yangi mahsulot
        </Button>
      }
    >
      <div className='flex items-center gap-3'>
        <div className='relative max-w-sm flex-1'>
          <SearchIcon className='absolute start-3 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Nomi bo‘yicha qidirish…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='ps-9'
          />
        </div>
        <Badge variant='outline' className='px-3 py-1.5'>
          Jami: {filtered.length}
        </Badge>
      </div>

      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={filtered.length === 0}
        emptyText={
          search ? 'Hech narsa topilmadi.' : 'Hali mahsulot qo‘shilmagan.'
        }
        onRetry={() => refetch()}
      >
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-20'>Rasm</TableHead>
                <TableHead>Nomi</TableHead>
                <TableHead>Kategoriya</TableHead>
                <TableHead>Qadoq</TableHead>
                <TableHead>Kleykovina / Kul / Namlik</TableHead>
                <TableHead>Tartib</TableHead>
                <TableHead>Holati</TableHead>
                <TableHead className='text-end'>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded border bg-muted'>
                      {p.imageUrl ? (
                        <img
                          src={mediaUrl(p.imageUrl)}
                          alt=''
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <Wheat className='h-5 w-5 text-amber-500' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='font-semibold'>{p.titleUz}</div>
                    <div className='text-xs text-muted-foreground'>
                      {p.titleRu}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {p.titleEn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>
                      {PRODUCT_CATEGORIES[p.category] ?? p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-sm'>{p.packaging}</TableCell>
                  <TableCell className='font-mono text-xs'>
                    {[p.gluten, p.ash, p.moisture]
                      .map((v) => v || '—')
                      .join(' / ')}
                  </TableCell>
                  <TableCell>{p.order}</TableCell>
                  <TableCell>
                    {p.isFeatured ? (
                      <Badge className='bg-emerald-600 text-white'>
                        Saytda
                      </Badge>
                    ) : (
                      <Badge variant='outline'>Yashirin</Badge>
                    )}
                  </TableCell>
                  <TableCell className='space-x-1 text-end'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setEditing(p)}
                      aria-label='Tahrirlash'
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:bg-destructive/10'
                      onClick={() => setDeleting(p)}
                      aria-label="O'chirish"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </QueryState>

      {editing && (
        <ProductDialog
          product={editing === 'new' ? null : editing}
          nextOrder={products.reduce((m, p) => Math.max(m, p.order), 0) + 1}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Mahsulotni o'chirish"
        desc={`"${deleting?.titleUz}" o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        cancelBtnText='Bekor qilish'
        destructive
        isLoading={remove.isPending}
        handleConfirm={() =>
          deleting &&
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
      />
    </PageShell>
  )
}

function ProductDialog({
  product,
  nextOrder,
  onClose,
}: {
  product: Product | null
  nextOrder: number
  onClose: () => void
}) {
  const [values, setValues] = useState<FormValues>(() =>
    product ? fromProduct(product) : emptyForm(nextOrder)
  )
  const [image, setImage] = useState<File | null>(null)
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const save = useApiMutation(
    (fd: FormData) =>
      product
        ? api.put(`/products/${product.id}`, fd)
        : api.post('/products', fd),
    {
      invalidate: [KEY],
      success: product ? 'Mahsulot yangilandi' : "Mahsulot qo'shildi",
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(toFormData({ ...values, image: image ?? undefined }), {
      onSuccess: onClose,
    })
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
          </DialogTitle>
          <DialogDescription>
            Nom va tavsifni har bir til uchun kiriting.
          </DialogDescription>
        </DialogHeader>

        <form id='product-form' onSubmit={onSubmit} className='grid gap-4'>
          <Tabs defaultValue='Uz'>
            <TabsList>
              {LANGS.map((l) => (
                <TabsTrigger key={l.code} value={l.code}>
                  {l.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGS.map((l) => (
              <TabsContent
                key={l.code}
                value={l.code}
                forceMount
                className='grid gap-3 data-[state=inactive]:hidden'
              >
                <div className='grid gap-2'>
                  <Label htmlFor={`title${l.code}`}>
                    Nomi ({l.label})
                    {l.required && <span className='text-destructive'> *</span>}
                  </Label>
                  <Input
                    id={`title${l.code}`}
                    dir={l.code === 'Ar' ? 'rtl' : undefined}
                    required={l.required}
                    maxLength={200}
                    value={values[`title${l.code}`]}
                    onChange={(e) => set(`title${l.code}`, e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor={`desc${l.code}`}>Tavsif ({l.label})</Label>
                  <Textarea
                    id={`desc${l.code}`}
                    dir={l.code === 'Ar' ? 'rtl' : undefined}
                    rows={3}
                    maxLength={2000}
                    value={values[`desc${l.code}`]}
                    onChange={(e) => set(`desc${l.code}`, e.target.value)}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='grid gap-2'>
              <Label>Kategoriya</Label>
              <Select
                value={values.category}
                onValueChange={(v) => set('category', v)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='packaging'>Qadoq</Label>
              <Input
                id='packaging'
                placeholder='50 kg, 25 kg'
                value={values.packaging}
                onChange={(e) => set('packaging', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='gluten'>Kleykovina</Label>
              <Input
                id='gluten'
                placeholder='28 - 30%'
                value={values.gluten}
                onChange={(e) => set('gluten', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='ash'>Kul miqdori</Label>
              <Input
                id='ash'
                placeholder='0.55%'
                value={values.ash}
                onChange={(e) => set('ash', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='moisture'>Namlik</Label>
              <Input
                id='moisture'
                placeholder='14%'
                value={values.moisture}
                onChange={(e) => set('moisture', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='order'>Tartib raqami</Label>
              <Input
                id='order'
                type='number'
                min={0}
                step={1}
                value={values.order}
                onChange={(e) =>
                  set(
                    'order',
                    Math.max(0, Math.trunc(Number(e.target.value) || 0))
                  )
                }
              />
            </div>
          </div>

          <ImageInput
            label='Rasm'
            currentUrl={product?.imageUrl}
            file={image}
            onFileChange={setImage}
          />

          <label className='flex items-center gap-3 text-sm'>
            <Switch
              checked={values.isFeatured}
              onCheckedChange={(c) => set('isFeatured', c)}
            />
            Saytda ko‘rsatish
          </label>
        </form>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={save.isPending}
          >
            Bekor qilish
          </Button>
          <Button type='submit' form='product-form' disabled={save.isPending}>
            {save.isPending && <Loader2 className='animate-spin' />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
