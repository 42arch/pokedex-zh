import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { List } from '@phosphor-icons/react/dist/ssr'
import { NextIntlClientProvider } from 'next-intl'
import localFont from 'next/font/local'
import Link from 'next/link'
import { AppLayoutClient } from '@/components/app-layout-client'
import { QueryProvider } from '@/components/query-provider'
import { SettingsDialog } from '@/components/settings-dialog'
import { PokeballIcon, SidebarLinks } from '@/components/sidebar-nav'
import { ThemeProvider } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { BASE_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import messages from '../../messages/zh.json'
import './globals.css'

const geistSans = localFont({
  src: '../../public/fonts/Geist-Variable.woff2',
  variable: '--font-sans',
})

const geistMono = localFont({
  src: '../../public/fonts/GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
})

const geistHeading = localFont({
  src: '../../public/fonts/Geist-Variable.woff2',
  variable: '--font-heading',
})

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = BASE_URL
  return {
    title: '宝可梦中文图鉴 Pokedex | 宝可梦中文资料站',
    description: '快速查询，随时了解你的宝可梦伙伴！ 全面收录宝可梦（神奇宝贝）全国图鉴、地区图鉴、属性克制、性格修正，以及招式、特性、道具的详细中英文资料，为您提供便捷的队伍规划与属性克制查询服务。',
    alternates: {
      canonical: baseUrl,
      languages: {
        'zh': baseUrl,
        'x-default': baseUrl,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: '宝可梦中文图鉴',
    },
    formatDetection: {
      telephone: false,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  return (
    <html
      lang="zh"
      className={cn('h-full', 'dark', 'antialiased', geistSans.variable, geistMono.variable, geistHeading.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <body
        className="h-screen overflow-hidden flex flex-col md:flex-row bg-background text-foreground transition-colors duration-200"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var color = localStorage.getItem('pokedex-theme-color') || 'kanto';
                  document.documentElement.classList.add('theme-' + color);
                } catch (e) {}
              })();
            `,
          }}
        />
        <NextIntlClientProvider locale="zh" messages={messages}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AppLayoutClient
                mobileHeader={(
                  <header className="md:hidden h-16 border-b border-sidebar-border bg-sidebar/95 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 z-20">
                    <Link
                      prefetch={false}
                      href="/"
                      className="flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-red-500/12 text-red-500 shadow-sm">
                        <PokeballIcon className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-bold text-base tracking-tight text-sidebar-foreground">
                        宝可梦图鉴
                      </span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <SettingsDialog />
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-sidebar-accent">
                            <List className="w-5 h-5" />
                            <span className="sr-only">Toggle Menu</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0 bg-sidebar/95 text-sidebar-foreground backdrop-blur-md border-r border-sidebar-border flex flex-col">
                          <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
                            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-red-500/12 text-red-500">
                              <PokeballIcon className="w-4.5 h-4.5" />
                            </div>
                            <span className="font-bold text-base tracking-tight text-sidebar-foreground">
                              宝可梦图鉴
                            </span>
                          </div>
                          <div className="flex flex-col flex-1 justify-between">
                            <SidebarLinks />
                            <div className="p-4 border-t border-sidebar-border">
                              <SettingsDialog />
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </header>
                )}
              >
                {children}
              </AppLayoutClient>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId={gaId || ''} />
      </body>
    </html>
  )
}
