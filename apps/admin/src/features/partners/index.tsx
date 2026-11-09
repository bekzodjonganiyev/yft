import { useState } from 'react'
import { z } from 'zod'
import {
  ExternalLink,
  Handshake,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { api, mediaUrl, toFormData } from '@/lib/api'
import type { Partner } from '@/lib/types'
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
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const KEY = ['partners']
const urlSchema = z.union([z.literal(''), z.url({ protocol: /^https?$/ })])

export function PartnersFeature() {
  const {
    data: partners = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<Partner[]>(KEY, '/partners')
  const [editing, setEditing] = useState<Partner | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Partner | null>(null)

  const remove = useApiMutation((id: string) => api.delete(`/partners/${id}`), {
    invalidate: [KEY],
    success: "Hamkor o'chirildi",
  })

  return (
    <PageShell
      title='Hamkorlar'
      description='Saytdagi "Hamkorlar" karuselidagi logotiplar.'
      icon={Handshake}
      actions={
        <Button onClick={() => setEditing('new')}>
          <Plus /> Yangi hamkor
        </Button>
      }
    >
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={partners.length === 0}
        emptyText='Hali hamkor qo‘shilmagan.'
        onRetry={() => refetch()}
      >
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-28'>Logotip</TableHead>
                <TableHead>Nomi</TableHead>
                <TableHead>Sayt</TableHead>
                <TableHead>Tartib</TableHead>
                <TableHead className='text-end'>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className='flex h-12 w-24 items-center justify-center overflow-hidden rounded border bg-white p-1'>
                      {p.logoUrl ? (
                        <img
                          src={mediaUrl(p.logoUrl)}
                          alt=''
                          className='max-h-full max-w-full object-contain'
                          onError={(e) =>
                            (e.currentTarget.style.visibility = 'hidden')
                          }
                        />
                      ) : (
                        <span className='text-[10px] text-muted-foreground'>
                          Logo yo‘q
                        </span>
                      )}
                    </div>
                    {/^https?:/.test(p.logoUrl) && (
                      <p className='mt-1 text-[10px] text-amber-600'>
                        Tashqi havola — qayta yuklang
                      </p>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{p.name}</TableCell>
                  <TableCell>
                    {p.websiteUrl && p.websiteUrl !== '#' ? (
                      <a
                        href={p.websiteUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 text-sm text-primary hover:underline'
                      >
                        {p.websiteUrl.replace(/^https?:\/\//, '')}
                        <ExternalLink className='h-3 w-3' />
                      </a>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </TableCell>
                  <TableCell>{p.order}</TableCell>
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
        <PartnerDialog
          partner={editing === 'new' ? null : editing}
          nextOrder={partners.reduce((m, p) => Math.max(m, p.order), 0) + 1}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hamkorni o'chirish"
        desc={`"${deleting?.name}" o'chiriladi.`}
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

function PartnerDialog({
  partner,
  nextOrder,
  onClose,
}: {
  partner: Partner | null
  nextOrder: number
  onClose: () => void
}) {
  const [name, setName] = useState(partner?.name ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(
    partner?.websiteUrl === '#' ? '' : (partner?.websiteUrl ?? '')
  )
  const [order, setOrder] = useState(partner?.order ?? nextOrder)
  const [logo, setLogo] = useState<File | null>(null)
  const [urlError, setUrlError] = useState('')

  const save = useApiMutation(
    (fd: FormData) =>
      partner
        ? api.put(`/partners/${partner.id}`, fd)
        : api.post('/partners', fd),
    {
      invalidate: [KEY],
      success: partner ? 'Hamkor yangilandi' : "Hamkor qo'shildi",
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = websiteUrl.trim()
    if (!urlSchema.safeParse(url).success) {
      setUrlError('Havola https:// bilan boshlanishi kerak')
      return
    }
    save.mutate(
      toFormData({
        name: name.trim(),
        websiteUrl: url,
        order,
        logo: logo ?? undefined,
      }),
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {partner ? 'Hamkorni tahrirlash' : 'Yangi hamkor'}
          </DialogTitle>
          <DialogDescription>
            Logotip oq fonda ko‘rsatiladi — shaffof PNG yoki oq fonli rasm
            yaxshi.
          </DialogDescription>
        </DialogHeader>
        <form id='partner-form' onSubmit={onSubmit} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>
              Nomi <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='name'
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <ImageInput
            label='Logotip'
            required={!partner}
            currentUrl={partner?.logoUrl}
            file={logo}
            onFileChange={setLogo}
          />
          <div className='grid gap-2'>
            <Label htmlFor='website'>Sayt havolasi</Label>
            <Input
              id='website'
              type='url'
              placeholder='https://'
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value)
                setUrlError('')
              }}
              aria-invalid={!!urlError}
            />
            {urlError && <p className='text-xs text-destructive'>{urlError}</p>}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='order'>Tartib raqami</Label>
            <Input
              id='order'
              type='number'
              min={0}
              step={1}
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
          <Button type='submit' form='partner-form' disabled={save.isPending}>
            {save.isPending && <Loader2 className='animate-spin' />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
