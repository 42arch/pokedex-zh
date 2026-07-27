'use client'

import {
  BagIcon,
  HouseIcon,
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
import { cn, getLocalizedPath } from '@/lib/utils'
import { SettingsDialog } from './settings-dialog'

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

  const getHref = (path: string) => getLocalizedPath(path, locale)

  const navItems: NavItem[] = [
    { name: t('home'), href: getHref('/'), icon: HouseIcon },
    { name: t('pokemon'), href: getHref('/pokemon'), icon: SwordIcon },
    { name: t('moves'), href: getHref('/moves'), icon: LightningIcon },
    { name: t('abilities'), href: getHref('/abilities'), icon: SparkleIcon },
    { name: t('items'), href: getHref('/items'), icon: BagIcon },
    { name: t('tools'), href: getHref('/tools'), icon: WrenchIcon },
  ]

  return (
    <TooltipProvider>
      <nav className={cn('space-y-1.5 px-3 py-4 flex-1', isCollapsed && 'px-1.5')}>
        {navItems.map((item) => {
          const normalizePath = (p: string) => p.replace(/\/$/, '') || '/'
          const currentPath = normalizePath(pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/')
          const itemPath = normalizePath(item.href.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/')
          const isActive = item.href === getHref('/')
            ? currentPath === itemPath
            : currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
          const Icon = item.icon

          const linkContent = (
            <Link
              prefetch={false}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden border border-transparent',
                isCollapsed ? 'justify-center w-11 h-11 p-0 mx-auto' : 'gap-3.5 px-4 py-3',
                isActive
                  ? 'bg-sidebar-accent/80 text-sidebar-accent-foreground border-sidebar-border shadow-sm'
                  : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/55 hover:text-sidebar-accent-foreground hover:border-sidebar-border/70',
              )}
            >
              {isActive && (
                <span
                  className={cn(
                    'absolute bg-red-500',
                    isCollapsed
                      ? 'bottom-1.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full'
                      : 'left-0 top-2 bottom-2 w-1 rounded-r-full',
                  )}
                />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-red-500' : 'text-sidebar-foreground/45 group-hover:text-sidebar-accent-foreground',
                )}
                weight={isActive ? 'fill' : 'regular'}
              />
              {!isCollapsed && <span>{item.name}</span>}
              {!isCollapsed && isActive && (
                <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-red-500" />
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
  const locale = useLocale()
  return (
    <aside className={cn(
      'flex flex-col h-full w-full bg-sidebar/90 text-sidebar-foreground backdrop-blur-md z-30 transition-all duration-300',
    )}
    >
      {/* Brand Header */}
      <Link
        prefetch={false}
        href={getLocalizedPath('/', locale)}
        className={cn(
          'h-16 flex items-center border-b border-sidebar-border hover:bg-sidebar-accent/70 transition-all duration-200',
          isCollapsed ? 'justify-center w-full' : 'gap-3 px-6 w-full',
        )}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/15 text-red-500 shadow-sm">
          <PokeballIcon className="w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
            宝可梦图鉴
          </span>
        )}
      </Link>

      {/* Navigation Menu */}
      <SidebarLinks isCollapsed={isCollapsed} />

      {/* Footer Controls */}
      <div className={cn(
        'p-4 border-t border-sidebar-border flex flex-col gap-3',
        isCollapsed ? 'items-center px-2' : 'flex-row items-center justify-between',
      )}
      >
        <SettingsDialog />
        {!isCollapsed && (
          <span className="text-[10px] text-sidebar-foreground/45 font-mono font-medium">
            v1.0.0
          </span>
        )}
      </div>
    </aside>
  )
}
