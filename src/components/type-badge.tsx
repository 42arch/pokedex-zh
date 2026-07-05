'use client'

import * as React from 'react'
import { useLocale } from 'next-intl'
import { translateText } from '@/lib/chinese'
import { getTypeColor } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'

export function TypeIcon({ type, className }: { type: string; className?: string }) {
  const t = type.trim()
  return (
    <span
      className={cn('type shrink-0', `type-${t}`, className)}
    />
  )
}

export function TypeBadge({ type, showText = true, className }: { type: string; showText?: boolean; className?: string }) {
  const locale = useLocale()
  const t = type.trim()
  const color = getTypeColor(t)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold text-white shadow-sm border border-black/5',
        className
      )}
      style={{ backgroundColor: color }}
    >
      <TypeIcon type={t} className="scale-[0.8] -mx-0.5" />
      {showText && <span>{translateText(t, locale)}</span>}
    </span>
  )
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const c = category.trim()
  return (
    <span
      className={cn('type shrink-0', `type-${c}`, className)}
    />
  )
}

export function CategoryBadge({ category, showText = true, className }: { category: string; showText?: boolean; className?: string }) {
  const locale = useLocale()
  const c = category.trim()
  
  let bgColor = 'bg-zinc-500'
  if (c === '物理') bgColor = 'bg-orange-600'
  else if (c === '特殊') bgColor = 'bg-blue-600'
  else if (c === '变化') bgColor = 'bg-zinc-500'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold text-white shadow-sm border border-black/5',
        bgColor,
        className
      )}
    >
      <CategoryIcon category={c} className="scale-[0.8] -mx-0.5" />
      {showText && <span>{translateText(c, locale)}</span>}
    </span>
  )
}
