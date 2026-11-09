import { useState } from 'react'
import {
  CircleHelp,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { emptyLocalized, pickLocalized } from '@/lib/langs'
import type { InfoItem, InfoKind } from '@/lib/types'
import { useApiMutation, useApiQuery } from '@/hooks/use-api'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { LocalizedFields } from '@/components/localized-fields'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const KEY = ['info-items']

const COPY: Record<
  InfoKind,
  { tab: string; hint: string; title: string; body: string; empty: string }
> = {
  MOTTO: {
    tab: 'Motto kartochkalari',
    hint: 'Bosh sahifada banner ostidagi oq blokda birinchi 3 tasi ko‘rinadi.',
    title: 'Sarlavha',
    body: 'Qisqa matn',
    empty: 'Motto kartochkalari yo‘q.',
  },
  FAQ: {
    tab: 'Savol-javoblar (FAQ)',
    hint: 'Bosh sahifadagi "Tez-tez so‘raladigan savollar" bo‘limi.',
    title: 'Savol',
    body: 'Javob',
    empty: 'Savol-javoblar yo‘q — bo‘lim saytda yashiriladi.',
  },
}

export function InfoItemsFeature() {
  const [kind, setKind] = useState<InfoKind>('MOTTO')
  return (
    <PageShell
      title='Matn bloklari'
      description='Bosh sahifadagi motto kartochkalari va savol-javoblar.'
      icon={Sparkles}
    >
      <Tabs value={kind} onValueChange={(v) => setKind(v as InfoKind)}>
        <TabsList>
          <TabsTrigger value='MOTTO'>
            <Sparkles /> {COPY.MOTTO.tab}
          </TabsTrigger>
          <TabsTrigger value='FAQ'>
            <CircleHelp /> {COPY.FAQ.tab}
          </TabsTrigger>
        </TabsList>
        <TabsContent value='MOTTO'>
          <InfoList kind='MOTTO' />
        </TabsContent>
        <TabsContent value='FAQ'>
          <InfoList kind='FAQ' />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

function InfoList({ kind }: { kind: InfoKind }) {
  const copy = COPY[kind]
  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<InfoItem[]>(KEY, '/info-items', { kind })
  const [editing, setEditing] = useState<InfoItem | 'new' | null>(null)
  const [deleting, setDeleting] = useState<InfoItem | null>(null)

  const remove = useApiMutation(
    (id: string) => api.delete(`/info-items/${id}`),
    {
      invalidate: [KEY],
      success: "O'chirildi",
    }
  )

  return (
    <div className='mt-4 grid gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm text-muted-foreground'>{copy.hint}</p>
        <Button onClick={() => setEditing('new')}>
          <Plus /> Qo‘shish
        </Button>
      </div>
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        emptyText={copy.empty}
        onRetry={() => refetch()}
      >
        <ol className='grid gap-3'>
          {items.map((item) => (
            <li
              key={item.id}
              className='flex items-start justify-between gap-4 rounded-lg border bg-card p-4'
            >
              <div className='min-w-0'>
                <p className='font-semibold'>
                  <span className='me-2 text-muted-foreground'>
                    #{item.order}
                  </span>
                  {item.titleUz}
                </p>
                <p className='line-clamp-2 text-sm text-muted-foreground'>
                  {item.bodyUz}
                </p>
              </div>
              <div className='flex shrink-0'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setEditing(item)}
                  aria-label='Tahrirlash'
                >
                  <Pencil />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10'
                  onClick={() => setDeleting(item)}
                  aria-label="O'chirish"
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </QueryState>

      {editing && (
        <InfoDialog
          kind={kind}
          item={editing === 'new' ? null : editing}
          nextOrder={items.reduce((m, i) => Math.max(m, i.order), 0) + 1}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="O'chirish"
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
    </div>
  )
}

function InfoDialog({
  kind,
  item,
  nextOrder,
  onClose,
}: {
  kind: InfoKind
  item: InfoItem | null
  nextOrder: number
  onClose: () => void
}) {
  const copy = COPY[kind]
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    item
      ? { ...pickLocalized(item, 'title'), ...pickLocalized(item, 'body') }
      : { ...emptyLocalized('title'), ...emptyLocalized('body') }
  )
  const [order, setOrder] = useState(item?.order ?? nextOrder)

  const save = useApiMutation(
    (body: Record<string, unknown>) =>
      item
        ? api.put(`/info-items/${item.id}`, body)
        : api.post('/info-items', body),
    { invalidate: [KEY], success: 'Saqlandi' }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate({ ...texts, kind, order }, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{item ? 'Tahrirlash' : 'Qo‘shish'}</DialogTitle>
          <DialogDescription>{copy.hint}</DialogDescription>
        </DialogHeader>
        <form id='info-form' onSubmit={onSubmit} className='grid gap-4'>
          <LocalizedFields
            fields={[
              { prefix: 'title', label: copy.title, required: true },
              {
                prefix: 'body',
                label: copy.body,
                multiline: true,
                rows: kind === 'FAQ' ? 6 : 3,
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
          <Button type='submit' form='info-form' disabled={save.isPending}>
            {save.isPending && <Loader2 className='animate-spin' />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
