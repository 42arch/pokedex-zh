import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import localFont from 'next/font/local'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { cn } from '@/lib/utils'
import './globals.css'

export const fontSans = localFont({
  src: [
    {
      path: '../../public/fonts/NotoSansSC-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Medium.ttf',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../../public/fonts/NotoSansSC-SemiBold.ttf',
      weight: '600',
      style: 'semibold',
    },
    {
      path: '../../public/fonts/NotoSansSC-Bold.ttf',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '宝可梦图鉴',
  description: '宝可梦中文图鉴，快速查询，随时了解你的宝可梦伙伴！',
  keywords: ['宝可梦', '宝可梦图鉴', '中文图鉴', '神奇宝贝图鉴', '宠物小精灵'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  return (
    <html lang="zh_CN">
      <body
        className={cn(
          fontSans.variable,
          'mx-auto bg-white font-sans text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400',
        )}
      >
        <div className="sticky top-0 z-10 border-b border-b-muted">
          <Header />
        </div>
        <div className="flex h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] ">
          <Sidebar className="hidden border-r border-r-muted lg:flex lg:w-64" />
          <div className="h-full w-full px-4 lg:w-[calc(100vw-16rem)] lg:pl-0">
            {children}
          </div>
        </div>
        <GoogleAnalytics gaId={gaId || ''} />
      </body>
    </html>
  )
}
