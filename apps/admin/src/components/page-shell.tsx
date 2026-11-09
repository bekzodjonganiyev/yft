import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

interface PageShellProps {
  title: string
  description?: string
  icon?: React.ElementType
  actions?: React.ReactNode
  children: React.ReactNode
}

/** Common page frame: top bar + title row + content. */
export function PageShell({
  title,
  description,
  icon: Icon,
  actions,
  children,
}: PageShellProps) {
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
              {Icon && <Icon className='h-6 w-6 text-amber-500' />}
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            </div>
            {description && (
              <p className='text-muted-foreground'>{description}</p>
            )}
          </div>
          {actions}
        </div>
        {children}
      </Main>
    </>
  )
}
