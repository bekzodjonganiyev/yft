import { useSearch } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-6 animate-in fade-in-50 zoom-in-95 duration-300'>
        <div className='rounded-2xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/40 backdrop-blur-md'>
          <div className='mb-6 space-y-2 text-start'>
            <div className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400'>
              <ShieldCheck className='size-3.5' />
              <span>Administrator Xavfsiz Kirishi</span>
            </div>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>
              Boshqaruv paneliga kirish
            </h2>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Yangiyer Flour Trading tizimiga kirish uchun administrator
              elektron pochta va parolini kiriting.
            </p>
          </div>

          <UserAuthForm redirectTo={redirect} />
        </div>
      </div>
    </AuthLayout>
  )
}
