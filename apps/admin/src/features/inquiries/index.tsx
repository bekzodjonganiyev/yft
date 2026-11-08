import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
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
import { Inbox, Phone, Mail, Clock, Eye, Trash2 } from 'lucide-react'
import { api, fallbackInquiries } from '@/lib/api'
import { toast } from 'sonner'

export function InquiriesFeature() {
  const [inquiries, setInquiries] = useState(fallbackInquiries)
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL')
  const [viewingInquiry, setViewingInquiry] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadInquiries = async () => {
    try {
      const res = await api.get('/inquiries')
      if (res.data?.success && res.data.data.length > 0) {
        setInquiries(res.data.data)
      }
    } catch {
      // Use fallback
    }
  }

  useEffect(() => {
    loadInquiries()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status }).catch(() => {})
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i))
      if (viewingInquiry && viewingInquiry.id === id) {
        setViewingInquiry({ ...viewingInquiry, status })
      }
      toast.success('Murojaat holati o\'zgartirildi: ' + status)
    } catch (err: any) {
      toast.error('Xatolik: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/inquiries/${id}`).catch(() => {})
      setInquiries(inquiries.filter(i => i.id !== id))
      toast.success('Murojaat o\'chirildi')
      setDeletingId(null)
      if (viewingInquiry?.id === id) setViewingInquiry(null)
    } catch (err: any) {
      toast.error('O\'chirishda xatolik: ' + err.message)
    }
  }

  const filtered = inquiries.filter(i => {
    if (activeFilter === 'ALL') return true
    return i.status === activeFilter
  })

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
              <Inbox className='h-6 w-6 text-amber-500' />
              <h2 className='text-2xl font-bold tracking-tight'>Murojaatlar va Buyurtmalar</h2>
            </div>
            <p className='text-muted-foreground'>
              Mijozlar tomonidan veb-sayt orqali yuborilgan xabarlar, narx so'rovlari va hamkorlik takliflari.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant={activeFilter === 'ALL' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveFilter('ALL')}
            >
              Barchasi ({inquiries.length})
            </Button>
            <Button
              variant={activeFilter === 'NEW' ? 'default' : 'outline'}
              size='sm'
              className={activeFilter === 'NEW' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              onClick={() => setActiveFilter('NEW')}
            >
              Yangi ({inquiries.filter(i => i.status === 'NEW').length})
            </Button>
            <Button
              variant={activeFilter === 'IN_PROGRESS' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveFilter('IN_PROGRESS')}
            >
              Jarayonda ({inquiries.filter(i => i.status === 'IN_PROGRESS').length})
            </Button>
            <Button
              variant={activeFilter === 'RESOLVED' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveFilter('RESOLVED')}
            >
              Bajarildi ({inquiries.filter(i => i.status === 'RESOLVED').length})
            </Button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mijoz (F.I.SH)</TableHead>
                <TableHead>Aloqa</TableHead>
                <TableHead>Mavzu / Xabar matni</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Holati</TableHead>
                <TableHead className='text-right'>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                    Tanlangan bo'limda murojaatlar mavjud emas.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className={item.status === 'NEW' ? 'bg-amber-500/5' : ''}>
                    <TableCell className='font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        {item.status === 'NEW' && (
                          <span className='h-2 w-2 rounded-full bg-amber-500 animate-pulse' />
                        )}
                        {item.fullName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm flex items-center gap-1.5'>
                        <Phone className='h-3.5 w-3.5 text-muted-foreground' /> {item.phone}
                      </div>
                      {item.email && (
                        <div className='text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5'>
                          <Mail className='h-3 w-3' /> {item.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='max-w-md'>
                      <div className='font-medium text-sm truncate'>{item.subject || 'Buyurtma so\'rovi'}</div>
                      <div className='text-xs text-muted-foreground truncate'>{item.message}</div>
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground whitespace-nowrap'>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' /> {new Date(item.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.status === 'NEW' ? (
                        <Badge className='bg-amber-500 text-white hover:bg-amber-600'>Yangi</Badge>
                      ) : item.status === 'IN_PROGRESS' ? (
                        <Badge className='bg-blue-600 text-white hover:bg-blue-700'>Jarayonda</Badge>
                      ) : (
                        <Badge className='bg-emerald-600 text-white hover:bg-emerald-700'>Bajarildi</Badge>
                      )}
                    </TableCell>
                    <TableCell className='text-right space-x-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setViewingInquiry(item)}
                      >
                        <Eye className='h-4 w-4' />
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

        {/* View Inquiry Modal */}
        <Dialog open={!!viewingInquiry} onOpenChange={() => setViewingInquiry(null)}>
          <DialogContent className='max-w-xl'>
            {viewingInquiry && (
              <>
                <DialogHeader>
                  <div className='flex items-center justify-between'>
                    <DialogTitle>{viewingInquiry.fullName}</DialogTitle>
                    {viewingInquiry.status === 'NEW' ? (
                      <Badge className='bg-amber-500 text-white'>Yangi</Badge>
                    ) : viewingInquiry.status === 'IN_PROGRESS' ? (
                      <Badge className='bg-blue-600 text-white'>Jarayonda</Badge>
                    ) : (
                      <Badge className='bg-emerald-600 text-white'>Bajarildi</Badge>
                    )}
                  </div>
                  <DialogDescription>
                    Yuborilgan sana: {new Date(viewingInquiry.createdAt).toLocaleString('uz-UZ')}
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-2 text-sm'>
                  <div className='grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg'>
                    <div>
                      <span className='text-xs text-muted-foreground block'>Telefon raqami:</span>
                      <a href={`tel:${viewingInquiry.phone}`} className='font-semibold text-primary hover:underline'>
                        {viewingInquiry.phone}
                      </a>
                    </div>
                    <div>
                      <span className='text-xs text-muted-foreground block'>Elektron pochta:</span>
                      <span className='font-medium'>{viewingInquiry.email || 'Ko\'rsatilmagan'}</span>
                    </div>
                  </div>

                  <div>
                    <span className='text-xs font-semibold uppercase text-muted-foreground'>Mavzu:</span>
                    <p className='font-medium mt-1'>{viewingInquiry.subject || 'Umumiy murojaat'}</p>
                  </div>

                  <div>
                    <span className='text-xs font-semibold uppercase text-muted-foreground'>Xabar:</span>
                    <div className='mt-1 p-3 border rounded-lg bg-card text-foreground whitespace-pre-wrap leading-relaxed'>
                      {viewingInquiry.message}
                    </div>
                  </div>
                </div>

                <DialogFooter className='flex-col sm:flex-row gap-2'>
                  <div className='flex gap-2 me-auto'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleUpdateStatus(viewingInquiry.id, 'IN_PROGRESS')}
                    >
                      Jarayonga olish
                    </Button>
                    <Button
                      size='sm'
                      className='bg-emerald-600 hover:bg-emerald-700 text-white'
                      onClick={() => handleUpdateStatus(viewingInquiry.id, 'RESOLVED')}
                    >
                      Bajarildi deb belgilash
                    </Button>
                  </div>
                  <Button variant='secondary' onClick={() => setViewingInquiry(null)}>
                    Yopish
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Murojaatni o'chirishni xohlaysizmi?</DialogTitle>
              <DialogDescription>
                Murojaat arxivdan ham butunlay olib tashlanadi.
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
