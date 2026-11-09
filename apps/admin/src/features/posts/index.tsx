import { useState } from 'react'
import { format } from 'date-fns'
import {
  BriefcaseBusiness,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { api, mediaUrl, toFormData } from '@/lib/api'
import { emptyLocalized, pickLocalized } from '@/lib/langs'
import type { Post, PostType } from '@/lib/types'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ImageInput } from '@/components/image-input'
import { LocalizedFields } from '@/components/localized-fields'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const COPY: Record<
  PostType,
  { title: string; one: string; description: string; icon: React.ElementType }
> = {
  NEWS: {
    title: 'Yangiliklar',
    one: 'yangilik',
    description: 'Saytdagi "Yangiliklar" bo‘limi va /news sahifasi.',
    icon: Newspaper,
  },
  VACANCY: {
    title: 'Vakansiyalar',
    one: 'vakansiya',
    description: 'Saytdagi "Vakansiyalar" bo‘limi va /vacancies sahifasi.',
    icon: BriefcaseBusiness,
  },
}

const KEY = ['posts']

export function PostsFeature({ type }: { type: PostType }) {
  const copy = COPY[type]
  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<Post[]>(KEY, '/posts', { type, all: true })
  const [editing, setEditing] = useState<Post | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)

  const remove = useApiMutation((id: string) => api.delete(`/posts/${id}`), {
    invalidate: [KEY, ['stats']],
    success: `${copy.one[0].toUpperCase()}${copy.one.slice(1)} o'chirildi`,
  })

  return (
    <PageShell
      title={copy.title}
      description={copy.description}
      icon={copy.icon}
      actions={
        <Button onClick={() => setEditing('new')}>
          <Plus /> Yangi {copy.one}
        </Button>
      }
    >
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={posts.length === 0}
        emptyText={`Hali ${copy.one} qo‘shilmagan.`}
        onRetry={() => refetch()}
      >
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-24'>Rasm</TableHead>
                <TableHead>Sarlavha</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Holati</TableHead>
                <TableHead className='text-end'>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className='flex h-12 w-20 items-center justify-center overflow-hidden rounded border bg-muted'>
                      {p.imageUrl ? (
                        <img
                          src={mediaUrl(p.imageUrl)}
                          alt=''
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <copy.icon className='h-5 w-5 text-muted-foreground' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='font-medium'>{p.titleUz}</div>
                    <div className='line-clamp-1 text-xs text-muted-foreground'>
                      {p.bodyUz}
                    </div>
                  </TableCell>
                  <TableCell className='text-sm whitespace-nowrap'>
                    {format(new Date(p.date), 'dd.MM.yyyy')}
                  </TableCell>
                  <TableCell>
                    {p.isPublished ? (
                      <Badge className='bg-emerald-600 text-white'>
                        E’lon qilingan
                      </Badge>
                    ) : (
                      <Badge variant='outline'>Qoralama</Badge>
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
        <PostDialog
          type={type}
          post={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`${copy.one[0].toUpperCase()}${copy.one.slice(1)}ni o'chirish`}
        desc={`"${deleting?.titleUz}" o'chiriladi.`}
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

function PostDialog({
  type,
  post,
  onClose,
}: {
  type: PostType
  post: Post | null
  onClose: () => void
}) {
  const copy = COPY[type]
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    post
      ? { ...pickLocalized(post, 'title'), ...pickLocalized(post, 'body') }
      : { ...emptyLocalized('title'), ...emptyLocalized('body') }
  )
  const [date, setDate] = useState(() =>
    format(post ? new Date(post.date) : new Date(), 'yyyy-MM-dd')
  )
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? true)
  const [image, setImage] = useState<File | null>(null)

  const save = useApiMutation(
    (fd: FormData) =>
      post ? api.put(`/posts/${post.id}`, fd) : api.post('/posts', fd),
    {
      invalidate: [KEY, ['stats']],
      success: post ? 'Saqlandi' : `Yangi ${copy.one} qo'shildi`,
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(
      toFormData({
        ...texts,
        type,
        date,
        isPublished,
        image: image ?? undefined,
      }),
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {post ? `${copy.title}: tahrirlash` : `Yangi ${copy.one}`}
          </DialogTitle>
          <DialogDescription>
            Matnda bo‘sh qator yangi xatboshini boshlaydi.
          </DialogDescription>
        </DialogHeader>
        <form id='post-form' onSubmit={onSubmit} className='grid gap-4'>
          <LocalizedFields
            fields={[
              { prefix: 'title', label: 'Sarlavha', required: true },
              { prefix: 'body', label: 'Matn', multiline: true, rows: 8 },
            ]}
            values={texts}
            onChange={(k, v) => setTexts((t) => ({ ...t, [k]: v }))}
          />
          <ImageInput
            label='Rasm'
            currentUrl={post?.imageUrl}
            file={image}
            onFileChange={setImage}
          />
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='grid gap-2'>
              <Label htmlFor='date'>Sana</Label>
              <Input
                id='date'
                type='date'
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <label className='flex items-center gap-3 self-end pb-2 text-sm'>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              Saytda e’lon qilish
            </label>
          </div>
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
          <Button type='submit' form='post-form' disabled={save.isPending}>
            {save.isPending && <Loader2 className='animate-spin' />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
