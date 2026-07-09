'use client'

import {
  BagIcon,
  LightningIcon,
  SparkleIcon,
  SwordIcon,
  WrenchIcon,
} from '@phosphor-icons/react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './language-switcher'
import { ModeToggle } from './mode-toggle'

// Stylized Pokéball SVG Icon
export function PokeballIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-6 h-6', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h7.5" />
      <path d="M14.5 12H22" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2a10 10 0 0 1 7.54 3.42" className="opacity-40" />
    </svg>
  )
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string, weight?: 'fill' | 'regular' | 'duotone' }>
}

export function SidebarLinks({ onItemClick, isCollapsed }: { onItemClick?: () => void, isCollapsed?: boolean }) {
  const pathname = usePathname()
  const t = useTranslations('Navbar')
  const locale = useLocale()

  const navItems: NavItem[] = [
    { name: t('pokemon'), href: `/${locale}/pokemon`, icon: SwordIcon },
    { name: t('moves'), href: `/${locale}/moves`, icon: LightningIcon },
    { name: t('abilities'), href: `/${locale}/abilities`, icon: SparkleIcon },
    { name: t('items'), href: `/${locale}/items`, icon: BagIcon },
    { name: t('tools'), href: `/${locale}/tools`, icon: WrenchIcon },
  ]

  return (
    <TooltipProvider>
      <nav className={cn('space-y-1.5 px-3 py-4 flex-1', isCollapsed && 'px-1.5')}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          const linkContent = (
            <Link
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center rounded-2xl text-sm font-semibold transition-all duration-200 group relative',
                isCollapsed ? 'justify-center w-11 h-11 p-0 mx-auto' : 'gap-3.5 px-4 py-3',
                isActive
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-md shadow-zinc-900/10 dark:shadow-zinc-100/5'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100',
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-zinc-50 dark:text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
                )}
                weight={isActive ? 'fill' : 'regular'}
              />
              {!isCollapsed && <span>{item.name}</span>}
              {!isCollapsed && isActive && (
                <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
              )}
            </Link>
          )

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 border-none shadow-md">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            )
          }

          return <React.Fragment key={item.href}>{linkContent}</React.Fragment>
        })}
      </nav>
    </TooltipProvider>
  )
}

export function SidebarNav({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <aside className={cn(
      'flex flex-col h-full w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md z-30 transition-all duration-300',
    )}
    >
      {/* Brand Header */}
      <div className={cn(
        'h-16 flex items-center border-b border-zinc-200/50 dark:border-zinc-800/50',
        isCollapsed ? 'justify-center px-0' : 'gap-3 px-6',
      )}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-500 shadow-sm animate-pulse-slow">
          <PokeballIcon className="w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            宝可梦图鉴
          </span>
        )}
      </div>

      {/* Navigation Menu */}
      <SidebarLinks isCollapsed={isCollapsed} />

      {/* Footer Controls */}
      <div className={cn(
        'p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3',
        isCollapsed ? 'items-center px-2' : 'flex-row items-center justify-between',
      )}
      >
        <div className={cn('flex items-center gap-1.5', isCollapsed && 'flex-col gap-2')}>
          <LanguageSwitcher />
          <ModeToggle />
        </div>
        {!isCollapsed && (
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-medium">
            v1.0.0
          </span>
        )}
      </div>
    </aside>
  )
}
