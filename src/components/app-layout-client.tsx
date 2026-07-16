'use client'

import { XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import * as React from 'react'
import { useDefaultLayout } from 'react-resizable-panels'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SidebarNav } from './sidebar-nav'

interface AppLayoutClientProps {
  children: React.ReactNode
  mobileHeader: React.ReactNode
}

function AppLayoutClientInner({ children, mobileHeader }: AppLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [showBanner, setShowBanner] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const locale = useLocale()

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'pokedex-sidebar',
  })

  React.useEffect(() => {
    const isClosed = localStorage.getItem('announcement-banner-closed')
    if (isClosed !== 'true') {
      setShowBanner(true)
    }
  }, [])

  const announcementText = locale === 'zh-Hant'
    ? '🎉 寶可夢中文圖鑑微信小程序「訓練家口袋圖鑑」現已上線！歡迎掃碼訪問或微信搜索訪問，功能更全，更新更及時！'
    : '🎉 宝可梦中文图鉴微信小程序“训练家口袋图鉴”现已上线！欢迎扫码访问或微信搜索访问，功能更全，更新更及时！'

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {showBanner && (
        <div className="w-full bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold py-2 px-4 relative flex items-center overflow-hidden shrink-0 z-40 select-none shadow-sm border-b border-emerald-750/30">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee-scroll {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 35s linear infinite;
              padding-left: 20px;
            }
            .animate-marquee-scroll:hover {
              animation-play-state: paused;
            }
          ` }}
          />

          <div
            onClick={() => setIsModalOpen(true)}
            className="flex-1 overflow-hidden flex items-center pr-10 cursor-pointer"
          >
            <span className="animate-marquee-scroll font-medium tracking-wide">
              {announcementText}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowBanner(false)
              localStorage.setItem('announcement-banner-closed', 'true')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-emerald-100 hover:text-white hover:bg-emerald-500/30 rounded-full transition-colors z-50 cursor-pointer"
            title="关闭通知"
          >
            <XIcon className="w-4 h-4" weight="bold" />
          </button>
        </div>
      )}

      {/* WeChat Mini Program Info Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xs sm:max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl overflow-hidden p-6 flex flex-col items-center text-center">
          <DialogHeader className="w-full flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              微信小程序版现已上线
            </div>
            <DialogTitle className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-2">
              训练家口袋图鉴
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold max-w-xs mt-1">
              宝可梦中文图鉴微信小程序版，功能更全，更新更及时！
            </DialogDescription>
          </DialogHeader>

          {/* QR Code Container with Glowing Gradient */}
          <div className="relative group my-5 shrink-0 select-none">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-md opacity-30 group-hover:opacity-45 transition duration-300 animate-pulse-slow" />
            <div className="relative bg-white p-3 rounded-3xl shadow-md border border-zinc-200/50 hover:scale-[1.02] transition-transform duration-300">
              <img
                src="/images/wechat-qrcode.png"
                alt="WeChat Mini Program QR Code"
                className="w-36 h-36 md:w-40 md:h-40 object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Prompt Instructions */}
          <div className="w-full space-y-3.5 text-sm font-semibold text-zinc-650 dark:text-zinc-350">
            <div className="p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-850/50 border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-1.5 text-left">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[9px] font-bold">1</span>
                <span>扫码方式</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                微信扫描上方小程序码，或保存二维码图片到相册后，在微信中“扫一扫”选择相册图片即可直接进入。
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-850/50 border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-1.5 text-left">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[9px] font-bold">2</span>
                <span>搜索方式</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                微信搜索输入
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold mx-1">
                  “训练家口袋图鉴”
                </span>
                ，直接点击搜索结果即可进入小程序！
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* On desktop, use ResizablePanelGroup */}
        <div className="hidden md:flex flex-1 h-full overflow-hidden">
          <ResizablePanelGroup
            orientation="horizontal"
            defaultLayout={defaultLayout}
            onLayoutChanged={onLayoutChanged}
          >
            <ResizablePanel
              defaultSize={defaultLayout ? undefined : 256}
              minSize={200}
              maxSize={320}
              collapsible={true}
              collapsedSize={70}
              onResize={(size) => {
                setIsCollapsed(size.inPixels <= 70)
              }}
            >
              <SidebarNav isCollapsed={isCollapsed} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
                <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {children}
                </main>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* On mobile, standard layout */}
        <div className="md:hidden flex flex-col flex-1 min-h-0 overflow-hidden">
          {mobileHeader}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export function AppLayoutClient({ children, mobileHeader }: AppLayoutClientProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Avoid layout shift/SSR mismatch by rendering a static default structure
    return (
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        {/* Desktop Sidebar fallback */}
        <aside className="hidden md:flex flex-col w-64 h-full border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
          <SidebarNav isCollapsed={false} />
        </aside>

        {/* Main Area fallback */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {mobileHeader}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return <AppLayoutClientInner children={children} mobileHeader={mobileHeader} />
}
