import * as React from 'react'
import Link from 'next/link'
import { getPokemonDetail } from '@/services/pokemon'
import { getUserLocale } from '@/services/locale'
import { translateText } from '@/lib/chinese'
import { PokemonDetailView } from '@/components/pokemon-detail'

interface PageProps {
  params: Promise<{ id?: string[] }>
}

export default async function PokemonPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = await getUserLocale()

  // Get active Pokemon ID if any
  const activeId = resolvedParams.id?.[0]
  
  if (!activeId) {
    return (
      <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-450 border border-zinc-200/50 dark:border-zinc-800/50">
          🔍
        </div>
        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
          {translateText("请在左侧列表选择宝可梦以查看详情", locale)}
        </p>
      </div>
    )
  }

  const pokemonDetail = await getPokemonDetail(activeId)

  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link href="/pokemon" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">
          <span>←</span> {translateText("返回图鉴列表", locale)}
        </Link>
      </div>
      
      {pokemonDetail ? (
        <PokemonDetailView detail={pokemonDetail} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-zinc-300 dark:text-zinc-700 text-5xl">⚠️</span>
          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-4">
            {translateText("未找到该宝可梦的详细资料", locale)}
          </p>
        </div>
      )}
    </div>
  )
}
