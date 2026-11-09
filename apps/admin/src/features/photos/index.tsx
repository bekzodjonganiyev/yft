import { useState } from 'react'
import { Camera, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { api, mediaUrl, toFormData } from '@/lib/api'
import { PHOTO_CATEGORIES } from '@/lib/labels'
import type { Photo } from '@/lib/types'
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
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ImageInput } from '@/components/image-input'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const KEY = ['photos']

export function PhotosFeature() {
  const [category, setCategory] = useState('ALL')
  const {
    data: photos = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<Photo[]>(KEY, '/photos', { category })
  const [editing, setEditing] = useState<Photo | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Photo | null>(null)

  const remove = useApiMutation((id: string) => api.delete(`/photos/${id}`), {
    invalidate: [KEY],
    success: "Foto o'chirildi",
  })

  return (
    <PageShell
      title='Foto galereya'
      description='Saytdagi "Galereya" bo‘limi. Rasm o‘lchamlari fayldan avtomatik olinadi.'
      icon={Camera}
      actions={
        <Button onClick={() => setEditing('new')}>
          <Plus /> Foto yuklash
        </Button>
      }
    >
      <div className='flex flex-wrap gap-2'>
        {[['ALL', 'Barchasi'], ...Object.entries(PHOTO_CATEGORIES)].map(
          ([value, label]) => (
            <Button
              key={value}
              size='sm'
              variant={category === value ? 'default' : 'outline'}
              onClick={() => setCategory(value)}
            >
              {label}
            </Button>
          )
        )}
      </div>

      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={photos.length === 0}
        emptyText='Bu bo‘limda foto yo‘q.'
        onRetry={() => refetch()}
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {photos.map((p) => (
            <figure
              key={p.id}
              className='group overflow-hidden rounded-lg border bg-card'
            >
              <div className='relative aspect-[4/3] bg-muted'>
                <img
                  src={mediaUrl(p.photoUrl)}
                  alt={p.titleUz ?? ''}
                  loading='lazy'
                  className='h-full w-full object-cover'
                />
                <div className='absolute end-2 top-2 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
                  <Button
                    size='icon'
                    variant='secondary'
                    onClick={() => setEditing(p)}
                    aria-label='Tahrirlash'
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => setDeleting(p)}
                    aria-label="O'chirish"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <figcaption className='space-y-1 p-3'>
                <p className='line-clamp-2 text-sm font-medium'>
                  {p.titleUz || (
                    <span className='text-muted-foreground'>Nomsiz</span>
                  )}
                </p>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <Badge variant='secondary'>
                    {PHOTO_CATEGORIES[p.category] ?? p.category}
                  </Badge>
                  <span>
                    {p.width}×{p.height}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </QueryState>

      {editing && (
        <PhotoDialog
          photo={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Fotoni o'chirish"
        desc="Foto saytdan va serverdan o'chiriladi. Bu amalni qaytarib bo'lmaydi."
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

function PhotoDialog({
  photo,
  onClose,
}: {
  photo: Photo | null
  onClose: () => void
}) {
  const [titles, setTitles] = useState({
    titleUz: photo?.titleUz ?? '',
    titleRu: photo?.titleRu ?? '',
    titleEn: photo?.titleEn ?? '',
    titleAr: photo?.titleAr ?? '',
  })
  const [category, setCategory] = useState(photo?.category ?? 'production')
  const [file, setFile] = useState<File | null>(null)

  const save = useApiMutation(
    (fd: FormData) =>
      photo ? api.put(`/photos/${photo.id}`, fd) : api.post('/photos', fd),
    { invalidate: [KEY], success: photo ? 'Foto yangilandi' : 'Foto yuklandi' }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(toFormData({ ...titles, category, photo: file ?? undefined }), {
      onSuccess: onClose,
    })
  }

  const fields = [
    ['titleUz', "Sarlavha (o'zbekcha)"],
    ['titleRu', 'Sarlavha (ruscha)'],
    ['titleEn', 'Sarlavha (inglizcha)'],
    ['titleAr', 'Sarlavha (arabcha)'],
  ] as const

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {photo ? 'Fotoni tahrirlash' : 'Yangi foto'}
          </DialogTitle>
          <DialogDescription>
            Sarlavhalar galereya va lightbox'da ko‘rinadi.
          </DialogDescription>
        </DialogHeader>
        <form id='photo-form' onSubmit={onSubmit} className='grid gap-4'>
          <ImageInput
            label='Rasm'
            required={!photo}
            currentUrl={photo?.photoUrl}
            file={file}
            onFileChange={setFile}
          />
          <div className='grid gap-2'>
            <Label>Bo‘lim</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PHOTO_CATEGORIES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {fields.map(([key, label]) => (
            <div key={key} className='grid gap-2'>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                dir={key === 'titleAr' ? 'rtl' : undefined}
                maxLength={200}
                value={titles[key]}
                onChange={(e) =>
                  setTitles((t) => ({ ...t, [key]: e.target.value }))
                }
              />
            </div>
          ))}
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
          <Button type='submit' form='photo-form' disabled={save.isPending}>
            {save.isPending && <Loader2 className='animate-spin' />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
