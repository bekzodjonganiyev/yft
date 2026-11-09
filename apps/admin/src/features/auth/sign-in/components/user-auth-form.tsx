import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  HelpCircle,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Phone,
  ShieldAlert,
} from 'lucide-react'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'
import { api, errorMessage } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Emailni kiriting' : "Email noto'g'ri"),
  }),
  password: z.string().min(1, 'Parolni kiriting'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

/** Only allow same-app paths as redirect targets. */
const safeRedirect = (target?: string) =>
  target && target.startsWith('/') && !target.startsWith('//') ? target : '/'

const REMEMBER_KEY = 'yft_admin_saved_email'

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotDialog, setShowForgotDialog] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  // Load saved email on mount if previously remembered
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY)
      if (saved) {
        form.setValue('email', saved)
        setRememberMe(true)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [form])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError('')
    try {
      const res = await api.post<{ token: string; user: AuthUser }>(
        '/auth/login',
        data
      )

      if (rememberMe) {
        try {
          localStorage.setItem(REMEMBER_KEY, data.email)
        } catch {
          // Ignore localStorage errors
        }
      } else {
        try {
          localStorage.removeItem(REMEMBER_KEY)
        } catch {
          // Ignore localStorage errors
        }
      }

      auth.setSession(res.data.token, res.data.user)
      navigate({ to: safeRedirect(redirectTo), replace: true })
    } catch (err) {
      setError(errorMessage(err, "Kirib bo'lmadi"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-4', className)}
          {...props}
        >
          {/* Email input field */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <FormLabel className='flex items-center gap-1.5 text-xs font-semibold'>
                    <Mail className='size-3.5 text-muted-foreground' />
                    <span>Elektron pochta</span>
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    type='email'
                    autoComplete='username'
                    placeholder='admin@yft.uz'
                    className='h-10 text-sm focus-visible:ring-amber-500/30'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password input field */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <FormLabel className='flex items-center gap-1.5 text-xs font-semibold'>
                    <Lock className='size-3.5 text-muted-foreground' />
                    <span>Parol</span>
                  </FormLabel>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete='current-password'
                    placeholder='••••••••'
                    className='focus-within:ring-amber-500/30 [&>input]:h-10'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember me & Forgot Password */}
          <div className='flex items-center justify-between pt-0.5'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='remember'
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <label
                htmlFor='remember'
                className='cursor-pointer text-xs font-medium text-muted-foreground select-none hover:text-foreground'
              >
                Meni eslab qol
              </label>
            </div>

            <button
              type='button'
              onClick={() => setShowForgotDialog(true)}
              className='text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline'
            >
              Parolni unutdingizmi?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role='alert'
              className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs sm:text-sm text-destructive animate-in fade-in-50'
            >
              <AlertCircle className='size-4 shrink-0 mt-0.5' />
              <div className='leading-snug'>{error}</div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            className='mt-2 h-11 w-full gap-2 text-sm font-semibold shadow-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 dark:text-slate-950 transition-all cursor-pointer'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <>
                <LogIn className='size-4' />
                <span>Tizimga kirish</span>
              </>
            )}
          </Button>

          {/* Demo Helper Pill */}
          <div className='mt-2 flex items-center justify-between rounded-xl border border-dashed border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <HelpCircle className='size-3.5 text-amber-500' />
              <span>Test admin:</span>
            </span>
            <button
              type='button'
              onClick={() => {
                form.setValue('email', 'admin@yft.uz')
                form.setValue('password', 'Admin123!')
              }}
              className='font-semibold text-amber-600 dark:text-amber-400 hover:underline'
            >
              admin@yft.uz (to‘ldirish)
            </button>
          </div>
        </form>
      </Form>

      {/* Forgot Password Modal Dialog */}
      <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2'>
              <ShieldAlert className='size-6' />
            </div>
            <DialogTitle className='text-lg'>
              Administrator hisobini tiklash
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>
              Xavfsizlik talablariga muvofiq, boshqaruv paneli parollari faqat
              bosh tizim administratori orqali qayta tiklanishi mumkin.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3 rounded-xl border border-border/80 bg-muted/30 p-4 text-xs sm:text-sm text-foreground'>
            <div className='flex items-center gap-2'>
              <Phone className='size-4 text-amber-500' />
              <span className='font-medium'>Aloqa:</span>
              <a
                href='tel:+998909795055'
                className='font-semibold text-primary hover:underline'
              >
                +998 90 979 50 55
              </a>
            </div>
            <div className='flex items-center gap-2'>
              <Mail className='size-4 text-amber-500' />
              <span className='font-medium'>Email:</span>
              <a
                href='mailto:Yangiyerflour@gmail.com'
                className='font-semibold text-primary hover:underline'
              >
                Yangiyerflour@gmail.com
              </a>
            </div>
          </div>

          <div className='flex justify-end pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowForgotDialog(false)}
            >
              Tushunarli
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
