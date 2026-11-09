import { useState } from 'react'
import { format } from 'date-fns'
import { Eye, Inbox, Mail, Paperclip, Phone, Trash2 } from 'lucide-react'
import { api, mediaUrl } from '@/lib/api'
import { INQUIRY_STATUS as STATUS } from '@/lib/labels'
import type { Inquiry, InquiryStatus } from '@/lib/types'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const KEY = ['inquiries']
const fmt = (d: string) => format(new Date(d), 'dd.MM.yyyy HH:mm')
const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`

export function InquiriesFeature() {
  const [filter, setFilter] = useState<'ALL' | InquiryStatus>('ALL')
  const {
    data: inquiries = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<Inquiry[]>(KEY, '/inquiries', { status: filter })
  // Keep a snapshot so the dialog stays open even if a status change moves the row out of the current filter.
  const [viewing, setViewing] = useState<Inquiry | null>(null)
  const [deleting, setDeleting] = useState<Inquiry | null>(null)

  const updateStatus = useApiMutation(
    ({ id, status }: { id: string; status: InquiryStatus }) =>
      api.patch(`/inquiries/${id}/status`, { status }),
    { invalidate: [KEY, ['stats']], success: 'Holat yangilandi' }
  )
  const remove = useApiMutation(
    (id: string) => api.delete(`/inquiries/${id}`),
    {
      invalidate: [KEY, ['stats']],
      success: "Murojaat o'chirildi",
    }
  )

  return (
    <PageShell
      title='Murojaatlar'
      description='Saytdagi kontakt formasi orqali kelgan xabarlar.'
      icon={Inbox}
    >
      <div className='flex flex-wrap gap-2'>
        {(['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'] as const).map((s) => (
          <Button
            key={s}
            size='sm'
            variant={filter === s ? 'default' : 'outline'}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'Barchasi' : STATUS[s].label}
          </Button>
        ))}
      </div>

      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={inquiries.length === 0}
        emptyText='Murojaatlar yo‘q.'
        onRetry={() => refetch()}
      >
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana</TableHead>
                <TableHead>Mijoz</TableHead>
                <TableHead>Xabar</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className='text-end'>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((i) => (
                <TableRow
                  key={i.id}
                  className={i.status === 'NEW' ? 'font-medium' : undefined}
                >
                  <TableCell className='text-sm whitespace-nowrap text-muted-foreground'>
                    {fmt(i.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>{i.fullName}</div>
                    <a
                      href={tel(i.phone)}
                      className='text-xs text-muted-foreground hover:underline'
                    >
                      {i.phone}
                    </a>
                  </TableCell>
                  <TableCell className='max-w-md'>
                    <p className='line-clamp-2 text-sm'>{i.message}</p>
                    {i.fileUrl && (
                      <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
                        <Paperclip className='h-3 w-3' /> Fayl biriktirilgan
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS[i.status].className}>
                      {STATUS[i.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className='space-x-1 text-end'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setViewing(i)}
                      aria-label="Ko'rish"
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:bg-destructive/10'
                      onClick={() => setDeleting(i)}
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

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        {viewing && (
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>{viewing.fullName}</DialogTitle>
              <DialogDescription>{fmt(viewing.createdAt)}</DialogDescription>
            </DialogHeader>
            <div className='grid gap-3 text-sm'>
              <a
                href={tel(viewing.phone)}
                className='inline-flex items-center gap-2 hover:underline'
              >
                <Phone className='h-4 w-4' /> {viewing.phone}
              </a>
              {viewing.email && (
                <a
                  href={`mailto:${viewing.email}`}
                  className='inline-flex items-center gap-2 hover:underline'
                >
                  <Mail className='h-4 w-4' /> {viewing.email}
                </a>
              )}
              {viewing.subject && (
                <p className='font-medium'>{viewing.subject}</p>
              )}
              <p className='rounded-md bg-muted p-3 whitespace-pre-wrap'>
                {viewing.message}
              </p>
              {viewing.fileUrl && (
                <a
                  href={mediaUrl(viewing.fileUrl)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-primary hover:underline'
                >
                  <Paperclip className='h-4 w-4' /> Biriktirilgan faylni ochish
                </a>
              )}
            </div>
            <DialogFooter className='flex-wrap gap-2 sm:justify-start'>
              {(Object.keys(STATUS) as InquiryStatus[]).map((s) => (
                <Button
                  key={s}
                  size='sm'
                  variant={viewing.status === s ? 'default' : 'outline'}
                  disabled={viewing.status === s || updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate(
                      { id: viewing.id, status: s },
                      { onSuccess: () => setViewing({ ...viewing, status: s }) }
                    )
                  }
                >
                  {STATUS[s].label}
                </Button>
              ))}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Murojaatni o'chirish"
        desc={`${deleting?.fullName} murojaati va biriktirilgan fayli o'chiriladi.`}
        confirmText="O'chirish"
        cancelBtnText='Bekor qilish'
        destructive
        isLoading={remove.isPending}
        handleConfirm={() =>
          deleting &&
          remove.mutate(deleting.id, {
            onSuccess: () => {
              if (viewing?.id === deleting.id) setViewing(null)
              setDeleting(null)
            },
          })
        }
      />
    </PageShell>
  )
}
