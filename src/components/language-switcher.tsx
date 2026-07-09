'use client'

import type { Locale } from '@/i18n/config'
import { CheckIcon, TranslateIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { setUserLocale } from '@/services/locale'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false)
      return
    }

    startTransition(async () => {
      await setUserLocale(newLocale)
      const segments = pathname.split('/')
      if (segments[1] === 'zh' || segments[1] === 'zh-Hant') {
        segments[1] = newLocale
      }
      else {
        segments.splice(1, 0, newLocale)
      }
      const newPath = segments.join('/') || '/'
      router.push(newPath)
      setIsOpen(false)
    })
  }

  const languages: { code: Locale, name: string }[] = [
    { code: 'zh', name: '简体中文' },
    { code: 'zh-Hant', name: '繁體中文' },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full relative border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
      >
        <TranslateIcon className={cn('h-[1.2rem] w-[1.2rem] transition-transform duration-300', isOpen && 'rotate-12', isPending && 'animate-pulse')} />
        <span className="sr-only">Switch Language</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-3 duration-200 z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 cursor-pointer',
                locale === lang.code
                  ? 'bg-zinc-900/5 dark:bg-zinc-100/5 text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-zinc-100/5 hover:text-zinc-900 dark:hover:text-zinc-50',
              )}
            >
              <span>{lang.name}</span>
              {locale === lang.code && (
                <CheckIcon className="h-4 w-4 text-zinc-900 dark:text-zinc-50" weight="bold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
