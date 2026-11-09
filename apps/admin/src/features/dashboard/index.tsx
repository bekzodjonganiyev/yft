import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import {
  BriefcaseBusiness,
  Handshake,
  Image,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Wheat,
} from 'lucide-react'
import { mediaUrl } from '@/lib/api'
import { INQUIRY_STATUS as STATUS } from '@/lib/labels'
import type { Stats } from '@/lib/types'
import { useApiQuery } from '@/hooks/use-api'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

export function Dashboard() {
  const { data, isLoading, error, refetch } = useApiQuery<Stats>(
    ['stats'],
    '/stats'
  )

  const tiles = data
    ? [
        {
          label: 'Mahsulotlar',
          value: data.productsCount,
          icon: Wheat,
          to: '/products' as const,
        },
        {
          label: 'Galereya fotolari',
          value: data.photosCount,
          icon: Image,
          to: '/photos' as const,
        },
        {
          label: 'Hamkorlar',
          value: data.partnersCount,
          icon: Handshake,
          to: '/partners' as const,
        },
        {
          label: 'Yangiliklar',
          value: data.newsCount,
          icon: Newspaper,
          to: '/news' as const,
        },
        {
          label: 'Vakansiyalar',
          value: data.vacanciesCount,
          icon: BriefcaseBusiness,
          to: '/vacancies' as const,
        },
        {
          label: 'Murojaatlar',
          value: data.inquiriesCount,
          icon: Inbox,
          to: '/inquiries' as const,
          note: data.newInquiriesCount
            ? `${data.newInquiriesCount} ta yangi`
            : undefined,
        },
      ]
    : []

  return (
    <PageShell
      title='Bosh sahifa'
      description='Sayt kontenti va murojaatlar bo‘yicha qisqacha holat.'
      icon={LayoutDashboard}
    >
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={false}
        emptyText=''
        onRetry={() => refetch()}
      >
        {data && (
          <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {tiles.map((t) => (
                <Link
                  key={t.label}
                  to={t.to}
                  className='rounded-xl transition-shadow hover:shadow-md'
                >
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        {t.label}
                      </CardTitle>
                      <t.icon className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-3xl font-bold tabular-nums'>
                        {t.value}
                      </div>
                      {t.note && (
                        <p className='text-xs font-medium text-amber-600'>
                          {t.note}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className='grid gap-4 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>So‘nggi murojaatlar</CardTitle>
                  <CardDescription>Oxirgi 5 ta xabar</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {data.recentInquiries.length === 0 && (
                    <p className='text-sm text-muted-foreground'>
                      Hozircha murojaat yo‘q.
                    </p>
                  )}
                  {data.recentInquiries.map((i) => (
                    <div
                      key={i.id}
                      className='flex items-start justify-between gap-3'
                    >
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium'>
                          {i.fullName}
                        </p>
                        <p className='truncate text-xs text-muted-foreground'>
                          {i.message}
                        </p>
                      </div>
                      <div className='flex shrink-0 flex-col items-end gap-1'>
                        <Badge className={STATUS[i.status].className}>
                          {STATUS[i.status].label}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {format(new Date(i.createdAt), 'dd.MM HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>So‘nggi mahsulotlar</CardTitle>
                  <CardDescription>
                    Oxirgi qo‘shilgan yoki yangilangan
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {data.recentProducts.length === 0 && (
                    <p className='text-sm text-muted-foreground'>
                      Mahsulot yo‘q.
                    </p>
                  )}
                  {data.recentProducts.map((p) => (
                    <div key={p.id} className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted'>
                        {p.imageUrl ? (
                          <img
                            src={mediaUrl(p.imageUrl)}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <Wheat className='h-4 w-4 text-amber-500' />
                        )}
                      </div>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium'>
                          {p.titleUz}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {p.packaging}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </QueryState>
    </PageShell>
  )
}
