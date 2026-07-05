'use client'

import { cn } from '@/lib/utils'
import {
  BagIcon,
  LightningIcon,
  SparkleIcon,
  SwordIcon,
  WrenchIcon,
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
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
  icon: React.ComponentType<{ className?: string; weight?: 'fill' | 'regular' | 'duotone' }>
}

export function SidebarLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const t = useTranslations('Navbar')

  const navItems: NavItem[] = [
    { name: t('pokemon'), href: '/pokemon', icon: SwordIcon },
    { name: t('moves'), href: '/moves', icon: LightningIcon },
    { name: t('abilities'), href: '/abilities', icon: SparkleIcon },
    { name: t('items'), href: '/items', icon: BagIcon },
    { name: t('tools'), href: '/tools', icon: WrenchIcon },
  ]

  return (
    <nav className="space-y-1.5 px-3 py-4 flex-1">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group relative',
              isActive
                ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-md shadow-zinc-900/10 dark:shadow-zinc-100/5'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100'
            )}
          >
            <Icon
              className={cn(
                'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                isActive ? 'text-zinc-50 dark:text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
              )}
              weight={isActive ? 'fill' : 'regular'}
            />
            <span>{item.name}</span>
            {isActive && (
              <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export function SidebarNav() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md z-30 transition-all">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-500 shadow-sm animate-pulse-slow">
          <PokeballIcon className="w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
          宝可梦图鉴
        </span>
      </div>

      {/* Navigation Menu */}
      <SidebarLinks />

      {/* Footer Controls */}
      <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ModeToggle />
        </div>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-medium">
          v1.0.0
        </span>
      </div>
    </aside>
  )
}
