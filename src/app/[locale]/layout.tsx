import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { List } from '@phosphor-icons/react/dist/ssr'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import localFont from 'next/font/local'
import { AppLayoutClient } from '@/components/app-layout-client'
import { PokeballIcon, SidebarLinks } from '@/components/sidebar-nav'
import { ThemeProvider } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import '../globals.css'

const geistSans = localFont({
  src: '../../../public/fonts/Geist-Variable.woff2',
  variable: '--font-sans',
})

const geistMono = localFont({
  src: '../../../public/fonts/GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
})

const geistHeading = localFont({
  src: '../../../public/fonts/Geist-Variable.woff2',
  variable: '--font-heading',
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = 'https://pokedex.starllow.com'
  const isHant = locale === 'zh-Hant'
  return {
    title: isHant ? '寶可夢圖鑑 Pokedex | 寶可夢中文資料站' : '宝可梦图鉴 Pokedex | 宝可梦中文资料站',
    description: isHant
      ? '全面收錄寶可夢（神奇寶貝）全國圖鑑、地區圖鑑、屬性克製、性格修正，以及招式、特性、道具的詳細中英文資料，為您提供便捷的隊伍規劃與屬性克製查詢服務。'
      : '全面收录宝可梦（神奇宝贝）全国图鉴、地区图鉴、属性克制、性格修正，以及招式、特性、道具的详细中英文资料，为您提供便捷的队伍规划与属性克制查询服务。',
    alternates: {
      canonical: baseUrl,
      languages: {
        'zh-Hans': baseUrl,
        'zh-Hant': `${baseUrl}/zh-Hant`,
        'x-default': baseUrl,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: isHant ? '寶可夢圖鑑' : '宝可梦图鉴',
    },
    formatDetection: {
      telephone: false,
    },
  }
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'zh-Hant' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={cn('h-full', 'antialiased', geistSans.variable, geistMono.variable, geistHeading.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <body className="h-screen overflow-hidden flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppLayoutClient
              mobileHeader={(
                <header className="md:hidden h-16 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 z-20">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-red-500/10 dark:bg-red-500/20 text-red-500 shadow-sm">
                      <PokeballIcon className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-bold text-base tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
                      宝可梦图鉴
                    </span>
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
                        <List className="w-5 h-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col">
                      <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-red-500/10 dark:bg-red-500/20 text-red-500">
                          <PokeballIcon className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-base tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
                          宝可梦图鉴
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 justify-between">
                        <SidebarLinks />
                      </div>
                    </SheetContent>
                  </Sheet>
                </header>
              )}
            >
              {children}
            </AppLayoutClient>
          </ThemeProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId={gaId || ''} />
      </body>
    </html>
  )
}
