import { type SVGProps } from 'react'
import { Wheat } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <Wheat
      aria-hidden='true'
      className={cn('size-6 text-amber-500', className)}
      {...props}
    />
  )
}
