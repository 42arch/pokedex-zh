'use client'

import type { PokemonDetail } from '@/services/pokemon'
import { WarningCircleIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import * as React from 'react'
import { usePokemonDetail } from '@/hooks/use-pokemon-queries'
import { translateText } from '@/lib/chinese'
import { PokemonDetailClient } from './pokemon-detail-client'

interface PokemonDetailProps {
  detail: PokemonDetail
  abilityMap?: Record<string, string>
}

export function PokemonDetailView({ detail, abilityMap }: PokemonDetailProps) {
  const locale = useLocale()

  return (
    <PokemonDetailClient
      detail={detail}
      abilityMap={abilityMap}
      locale={locale}
    />
  )
}

export function PokemonDetailQueryView({ activeId }: { activeId: string }) {
  const locale = useLocale()
  const { data: detail, isLoading } = usePokemonDetail(activeId)

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 animate-pulse">
        <div className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 p-6 bg-zinc-100/80 dark:bg-zinc-900/50 h-48" />
        <div className="p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/60 dark:bg-zinc-900/50 h-64" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <WarningCircleIcon className="w-12 h-12 text-muted-foreground/45" weight="duotone" />
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-4">
          {translateText('未找到该宝可梦的详细资料', locale)}
        </p>
      </div>
    )
  }

  return (
    <PokemonDetailClient
      detail={detail}
      locale={locale}
    />
  )
}
