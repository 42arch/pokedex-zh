'use client'

import type { Locale } from '@/i18n/config'
import { CheckIcon, GearIcon, MonitorIcon, MoonIcon, SparkleIcon, SunIcon, TranslateIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { translateText } from '@/lib/chinese'
import { POKEDEX_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { setUserLocale } from '@/services/locale'

const REGION_KEY_MAP: Record<string, string> = {
  关都: 'kanto',
  城都: 'johto',
  丰缘: 'hoenn',
  神奥: 'sinnoh',
  合众: 'unova',
  卡洛斯: 'kalos',
  阿罗拉: 'alola',
  伽勒尔: 'galar',
  洗翠: 'hisui',
  帕底亚: 'paldea',
  密阿雷: 'miare',
}

export function SettingsDialog() {
  const locale = useLocale()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isPending, startTransition] = React.useTransition()
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeColor, setActiveColor] = React.useState('kanto')

  // Mounted check to prevent hydration mismatch for theme/color state
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
    const savedColor = localStorage.getItem('pokedex-theme-color') || 'kanto'
    setActiveColor(savedColor)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      return
    }

    startTransition(async () => {
      await setUserLocale(newLocale)
      const segments = pathname.split('/')
      // Remove any existing locale segment if present
      if (segments[1] === 'zh' || segments[1] === 'zh-Hant') {
        segments.splice(1, 1)
      }
      // Prepend the new locale if it's Hant, otherwise default is zh-Hans (represented as root / empty segment)
      if (newLocale !== 'zh') {
        segments.splice(1, 0, newLocale)
      }
      const search = typeof window !== 'undefined' ? window.location.search : ''
      const newPath = (segments.join('/') || '/') + search
      window.location.href = newPath
    })
  }

  const handleColorChange = (newColor: string) => {
    setActiveColor(newColor)
    localStorage.setItem('pokedex-theme-color', newColor)

    const html = document.documentElement
    // Remove all existing theme-* classes from html
    Array.from(html.classList).forEach((cls) => {
      if (cls.startsWith('theme-')) {
        html.classList.remove(cls)
      }
    })

    // Add new theme class
    html.classList.add(`theme-${newColor}`)
  }

  const languages: { code: Locale, name: string }[] = [
    { code: 'zh', name: '简体中文' },
    { code: 'zh-Hant', name: '繁體中文' },
  ]

  const themes = [
    { value: 'light', label: '浅色', icon: SunIcon },
    { value: 'dark', label: '深色', icon: MoonIcon },
    { value: 'system', label: '系统', icon: MonitorIcon },
  ]

  const themeColors = Object.entries(POKEDEX_COLORS).map(([name, color]) => ({
    value: REGION_KEY_MAP[name] || 'kanto',
    name,
    color,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 shadow-sm cursor-pointer select-none"
        >
          <GearIcon className="h-5 w-5 text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors animate-spin-slow" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-[calc(100%-2rem)] rounded-3xl p-6 border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <GearIcon className="w-5 h-5 text-red-550 animate-spin-slow" />
            {translateText('设置', locale)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language selection section */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
              <TranslateIcon className="w-3.5 h-3.5" />
              {translateText('语言设置', locale)}
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {languages.map((lang) => {
                const isSelected = locale === lang.code
                return (
                  <button
                    key={lang.code}
                    disabled={isPending}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      'flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer relative overflow-hidden',
                      isSelected
                        ? 'border-red-500/20 dark:border-red-500/30 bg-red-500/[0.04] dark:bg-red-500/[0.06] text-red-550'
                        : 'border-zinc-150/80 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300',
                      isPending && 'opacity-60 cursor-not-allowed',
                    )}
                  >
                    <span>{lang.name}</span>
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-red-550" weight="bold" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent Color selection section */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
              <SparkleIcon className="w-3.5 h-3.5" />
              {translateText('主题色彩', locale)}
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {themeColors.map((color) => {
                const isSelected = mounted && activeColor === color.value
                return (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    style={{ backgroundColor: color.color }}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center relative shadow-sm border-white dark:border-zinc-900',
                      isSelected ? 'ring-2 ring-offset-2 ring-zinc-950 dark:ring-zinc-50 dark:ring-offset-zinc-950 scale-105 opacity-100' : 'opacity-85 hover:opacity-100',
                    )}
                    title={translateText(color.name, locale)}
                  >
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 invert dark:invert-0 drop-shadow-sm" weight="bold" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Theme selection section */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
              {mounted && theme === 'dark' ? <MoonIcon className="w-3.5 h-3.5" /> : <SunIcon className="w-3.5 h-3.5" />}
              {translateText('主题外观', locale)}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((item) => {
                const isSelected = mounted && theme === item.value
                const IconComponent = item.icon
                return (
                  <button
                    key={item.value}
                    onClick={() => setTheme(item.value)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer',
                      isSelected
                        ? 'border-red-500/20 dark:border-red-500/30 bg-red-500/[0.04] dark:bg-red-500/[0.06] text-red-550'
                        : 'border-zinc-150/80 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-655 dark:text-zinc-400',
                    )}
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                    <span>{translateText(item.label, locale)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
