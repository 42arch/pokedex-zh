'use client'

import type { Locale } from '@/i18n/config'
import { CheckIcon, TranslateIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const locale = useLocale()

  const languages: { code: Locale, name: string }[] = [
    { code: 'zh', name: '简体中文' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full relative border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm cursor-pointer select-none"
        >
          <TranslateIcon className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isCollapsed ? 'center' : 'start'}
        side="top"
        className="w-36 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/5 z-50"
        sideOffset={8}
      >
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-150 focus:bg-zinc-900/5 dark:focus:bg-zinc-100/5 focus:text-zinc-900 dark:focus:text-zinc-50',
              locale === lang.code
                ? 'bg-zinc-900/5 dark:bg-zinc-100/5 text-zinc-900 dark:text-zinc-50 font-bold'
                : 'text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50',
            )}
          >
            <span>{lang.name}</span>
            {locale === lang.code && (
              <CheckIcon className="h-4 w-4 text-zinc-900 dark:text-zinc-50" weight="bold" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
