import { ExternalLink, Globe, Layers, ShieldCheck, Sparkles, Wheat } from 'lucide-react'
import { ThemeSwitch } from '@/components/theme-switch'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen w-full lg:grid lg:grid-cols-12 bg-background'>
      {/* Left Column: Brand Showcase (Visible on large screens) */}
      <aside className='relative hidden lg:col-span-5 xl:col-span-6 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 text-white border-e border-white/10'>
        {/* Ambient atmospheric glows */}
        <div className='pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-600/15 blur-3xl' />
        <div className='pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl' />

        {/* Subtle geometric dot grid pattern */}
        <div
          className='pointer-events-none absolute inset-0 opacity-20'
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top: Brand Header */}
        <div className='relative z-10'>
          <div className='flex items-center gap-3.5'>
            <div className='flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/25 ring-1 ring-white/20'>
              <Wheat className='size-6 text-slate-950' />
            </div>
            <div>
              <h1 className='text-xl font-bold tracking-tight text-white'>
                Yangiyer Flour Trading
              </h1>
              <p className='text-xs font-semibold uppercase tracking-wider text-amber-400'>
                Boshqaruv Tizimi
              </p>
            </div>
          </div>

          <div className='mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300 backdrop-blur-md'>
            <Sparkles className='size-3.5 text-amber-400' />
            <span>1991-yildan buyon xalqaro sifat va ishonch</span>
          </div>
        </div>

        {/* Center: Value Proposition & Feature Cards */}
        <div className='relative z-10 my-10 space-y-8'>
          <div className='space-y-3 max-w-lg'>
            <h2 className='text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-tight'>
              Oliy sifatli un va don mahsulotlari boshqaruvi
            </h2>
            <p className='text-sm text-slate-300 leading-relaxed'>
              Korxona ishlab chiqarish jarayonlari, mahsulotlar katalogi,
              yangiliklar, vakansiyalar va xalqaro hamkorlik loyihalarini yagona
              xavfsiz boshqaruv panelidan nazorat qiling.
            </p>
          </div>

          <div className='grid gap-3.5 max-w-lg'>
            {/* Feature 1 */}
            <div className='flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.08]'>
              <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'>
                <Wheat className='size-4.5' />
              </div>
              <div className='space-y-0.5'>
                <h3 className='text-sm font-semibold text-white'>
                  SO‘FRA, MASHRAB, AL HAYOT brendlari
                </h3>
                <p className='text-xs text-slate-400'>
                  Qozog‘iston sara bug‘doyidan tayyorlangan oliy va 1-navli un
                  mahsulotlari bazasi.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className='flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.08]'>
              <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30'>
                <Globe className='size-4.5' />
              </div>
              <div className='space-y-0.5'>
                <h3 className='text-sm font-semibold text-white'>
                  BMT Jahon Oziq-Ovqat Dasturi (WFP)
                </h3>
                <p className='text-xs text-slate-400'>
                  BMTning rasmiy ta’minotchisi va xalqaro gumanitar hamkorlik
                  eksportchisi.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className='flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.08]'>
              <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'>
                <Layers className='size-4.5' />
              </div>
              <div className='space-y-0.5'>
                <h3 className='text-sm font-semibold text-white'>
                  Markazlashtirilgan Monitoring
                </h3>
                <p className='text-xs text-slate-400'>
                  Mijozlar murojaatlari, fotogalereya, kontent va tizim
                  sozlamalari tezkor tahriri.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: System Status & Motto */}
        <div className='relative z-10 space-y-3 pt-4 border-t border-white/10'>
          <div className='flex items-center gap-2 text-xs text-slate-300'>
            <span className='relative flex size-2.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
              <span className='relative inline-flex size-2.5 rounded-full bg-emerald-500'></span>
            </span>
            <span>Tizim holati: Barcha xizmatlar barqaror ishlamoqda</span>
          </div>
          <p className='text-xs italic text-slate-400'>
            «Sifatli un — to‘kin dasturxon va sog‘lom kelajak asosi.»
          </p>
        </div>
      </aside>

      {/* Right Column: Authentication Form Area */}
      <main className='relative lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-screen'>
        {/* Top Navigation Bar */}
        <header className='flex items-center justify-between pb-6'>
          {/* Mobile Brand Logo */}
          <div className='flex items-center gap-2.5 lg:invisible'>
            <div className='flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md'>
              <Wheat className='size-5' />
            </div>
            <div>
              <span className='font-bold text-sm tracking-tight'>
                Yangiyer Flour Trading
              </span>
              <span className='block text-[10px] uppercase font-semibold text-amber-500'>
                Boshqaruv Paneli
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className='ms-auto flex items-center gap-2.5'>
            <a
              href='https://yft.smartlist.uz'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground'
              title='Foydalanuvchilar portalini yangi oynada ochish'
            >
              <span>Foydalanuvchilar portali</span>
              <ExternalLink className='size-3.5' />
            </a>
            <ThemeSwitch />
          </div>
        </header>

        {/* Center: The Form Container */}
        <div className='my-auto flex w-full flex-col items-center justify-center py-6'>
          {children}
        </div>

        {/* Bottom Security Footer */}
        <footer className='pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground text-center sm:text-start'>
          <div className='inline-flex items-center gap-1.5'>
            <ShieldCheck className='size-4 text-emerald-500' />
            <span>256-bit SSL shifrlangan xavfsiz ulanish</span>
          </div>
          <div>© 2026 Yangiyer Flour Trading. Barcha huquqlar himoyalangan.</div>
        </footer>
      </main>
    </div>
  )
}
