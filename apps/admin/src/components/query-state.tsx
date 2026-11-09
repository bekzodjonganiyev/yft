import { RefreshCw } from 'lucide-react'
import { errorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface QueryStateProps {
  isLoading: boolean
  error: unknown
  isEmpty: boolean
  emptyText: string
  onRetry: () => void
  children: React.ReactNode
}

/** Loading / error / empty states shared by all list pages. */
export function QueryState({
  isLoading,
  error,
  isEmpty,
  emptyText,
  onRetry,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-14 w-full' />
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center'>
        <p className='text-sm text-destructive'>
          {errorMessage(error, "Ma'lumotlarni yuklab bo'lmadi")}
        </p>
        <Button variant='outline' size='sm' onClick={onRetry}>
          <RefreshCw /> Qayta urinish
        </Button>
      </div>
    )
  }
  if (isEmpty) {
    return (
      <div className='rounded-md border bg-card p-10 text-center text-muted-foreground'>
        {emptyText}
      </div>
    )
  }
  return <>{children}</>
}
