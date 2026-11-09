import { Logo } from '@/assets/logo'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col items-center justify-center space-y-2 py-8 sm:p-8'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <Logo />
          <h1 className='text-xl font-medium'>Yangiyer Flour Trading</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
