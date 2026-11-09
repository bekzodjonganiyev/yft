import { useState } from 'react'
import { GalleryHorizontal, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { api, mediaUrl, toFormData } from '@/lib/api'
import { emptyLocalized, pickLocalized } from '@/lib/langs'
import type { Banner } from '@/lib/types'
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
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ImageInput } from '@/components/image-input'
import { LocalizedFields } from '@/components/localized-fields'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const KEY = ['banners']

export function BannersFeature() {
  const {
    data: banners = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<Banner[]>(KEY, '/banners', { all: true })
  const [editing, setEditing] = useState<Banner | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Banner | null>(null)

  const remove = useApiMutation((id: string) => api.delete(`/banners/${id}`), {
    invalidate: [KEY],
    success: "Banner o'chirildi",
  })

  return (
    <PageShell
      title='Bannerlar'
      description='Bosh sahifadagi katta slayder. Rasm qorong‘ilashtirilib, ustida kompaniya nomi va banner matni chiqadi.'
      icon={GalleryHorizontal}
      actions={
        <Button onClick={() => setEditing('new')}>
          <Plus /> Yangi banner
        </Button>
      }
    >
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={banners.length === 0}
        emptyText='Hali banner yo‘q.'
        onRetry={() => refetch()}
      >
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {banners.map((b) => (
            <figure
              key={b.id}
              className='overflow-hidden rounded-lg border bg-card'
            >
              <div className='relative aspect-[16/7] bg-black'>
                <img
                  src={mediaUrl(b.imageUrl)}
                  alt=''
                  className='h-full w-full object-cover opacity-60'
                />
                <p className='absolute inset-x-3 bottom-3 line-clamp-2 text-sm font-medium text-white'>
                  {b.titleUz}
                </p>
              </div>
              <figcaption className='flex items-center justify-between gap-2 p-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <Badge variant='outline'>#{b.order}</Badge>
                  {b.isActive ? (
                    <Badge className='bg-emerald-600 text-white'>Saytda</Badge>
                  ) : (
                    <Badge variant='outline'>Yashirin</Badge>
                  )}
                </div>
                <div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setEditing(b)}
                    aria-label='Tahrirlash'
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive hover:bg-destructive/10'
                    onClick={() => setDeleting(b)}
                    aria-label="O'chirish"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </QueryState>

      {editing && (
        <BannerDialog
          banner={editing === 'new' ? null : editing}
          nextOrder={banners.reduce((m, b) => Math.max(m, b.order), 0) + 1}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Bannerni o'chirish"
        desc="Banner va uning rasmi o'chiriladi."
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

function BannerDialog({
  banner,
  nextOrder,
  onClose,
}: {
  banner: Banner | null
  nextOrder: number
  onClose: () => void
}) {
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    banner ? pickLocalized(banner, 'title') : emptyLocalized('title')
  )
  const [order, setOrder] = useState(banner?.order ?? nextOrder)
  const [isActive, setIsActive] = useState(banner?.isActive ?? true)
  const [image, setImage] = useState<File | null>(null)

  const save = useApiMutation(
    (fd: FormData) =>
      banner ? api.put(`/banners/${banner.id}`, fd) : api.post('/banners', fd),
    {
      invalidate: [KEY],
      success: banner ? 'Banner yangilandi' : "Banner qo'shildi",
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(
      toFormData({ ...texts, order, isActive, image: image ?? undefined }),
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {banner ? 'Bannerni tahrirlash' : 'Yangi banner'}
          </DialogTitle>
          <DialogDescription>
            Keng (landshaft) rasm tanlang, kamida 1920 px.
          </DialogDescription>
        </DialogHeader>
        <form id='banner-form' onSubmit={onSubmit} className='grid gap-4'>
          <ImageInput
            label='Rasm'
            required={!banner}
            currentUrl={banner?.imageUrl}
            file={image}
            onFileChange={setImage}
          />
          <LocalizedFields
            fields={[
              {
                prefix: 'title',
                label: 'Matn',
                hint: 'Ixtiyoriy — kompaniya nomi ostida chiqadi.',
              },
            ]}
            values={texts}
            onChange={(k, v) => setTexts((t) => ({ ...t, [k]: v }))}
          />
          <div className='grid gap-2'>
            <Label htmlFor='order'>Tartib raqami</Label>
            <Input
              id='order'
              type='number'
              min={0}
              value={order}
              onChange={(e) =>
                setOrder(Math.max(0, Math.trunc(Number(e.target.value) || 0)))
              }
            />
          </div>
          <label className='flex items-center gap-3 text-sm'>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
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
          <Button type='submit' form='banner-form' disabled={save.isPending}>
            {save.isPending && <Loader2 className='animate-spin' />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
