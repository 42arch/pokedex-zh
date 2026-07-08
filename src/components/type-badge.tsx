'use client'

import { useLocale } from 'next-intl'
import * as React from 'react'
import { translateText } from '@/lib/chinese'
import { getTypeColor } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'

export function TypeIcon({ type, className }: { type: string, className?: string }) {
  const t = type.trim()
  return (
    <span
      className={cn('type shrink-0', `type-${t}`, className)}
    />
  )
}

export function TypeBadge({
  type,
  showText = true,
  variant = 'default',
  className,
}: {
  type: string
  showText?: boolean
  variant?: 'default' | 'icon'
  className?: string
}) {
  const locale = useLocale()
  const t = type.trim()
  const color = getTypeColor(t)
  const isIconOnly = variant === 'icon' || !showText

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shadow-sm border border-black/5 shrink-0',
        isIconOnly
          ? 'p-0.5 w-6 h-6 rounded-md'
          : 'px-2.5 py-0.5 rounded-lg text-xs font-bold text-white gap-1.5',
        className,
      )}
      style={{ backgroundColor: color }}
      title={isIconOnly ? translateText(t, locale) : undefined}
    >
      <TypeIcon type={t} className={cn('scale-[0.8] -mx-0.5', isIconOnly && 'scale-90 mx-0')} />
      {!isIconOnly && <span>{translateText(t, locale)}</span>}
    </span>
  )
}

export function CategoryIcon({ category, className }: { category: string, className?: string }) {
  const c = category.trim()
  return (
    <span
      className={cn('type shrink-0', `type-${c}`, className)}
    />
  )
}

export function CategoryBadge({
  category,
  showText = true,
  variant = 'default',
  className,
}: {
  category: string
  showText?: boolean
  variant?: 'default' | 'icon'
  className?: string
}) {
  const locale = useLocale()
  const c = category.trim()
  const isIconOnly = variant === 'icon' || !showText

  let bgColor = 'bg-zinc-500'
  if (c === '物理')
    bgColor = 'bg-orange-600'
  else if (c === '特殊')
    bgColor = 'bg-blue-600'
  else if (c === '变化')
    bgColor = 'bg-zinc-500'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shadow-sm border border-black/5 shrink-0',
        isIconOnly
          ? 'p-0.5 w-6 h-6 rounded-md'
          : 'px-2.5 py-0.5 rounded-lg text-xs font-bold text-white gap-1.5',
        bgColor,
        className,
      )}
      title={isIconOnly ? translateText(c, locale) : undefined}
    >
      <CategoryIcon category={c} className={cn('scale-[0.8] -mx-0.5', isIconOnly && 'scale-90 mx-0')} />
      {!isIconOnly && <span>{translateText(c, locale)}</span>}
    </span>
  )
}
