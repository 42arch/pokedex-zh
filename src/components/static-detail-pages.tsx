'use client'

import type { FlattenedItem } from '@/components/items-layout'
import type { ItemNode } from '@/services/pokemon'
import { MagnifyingGlassIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { AbilityDetailClient } from '@/components/ability-detail-view'
import { ItemDetailView, ItemEmptyView } from '@/components/item-detail-view'
import { MoveDetailClient } from '@/components/move-detail-view'
import { PokemonDetailClient } from '@/components/pokemon-detail-client'
import { useItemList, usePokemonDetail } from '@/hooks/use-pokemon-queries'
import { useStaticDetailName } from '@/hooks/use-static-detail-name'
import { translateText } from '@/lib/chinese'

function PokemonEmptyView({ locale }: { locale: string }) {
  return (
    <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-450 border border-zinc-200/50 dark:border-zinc-800/50">
        <MagnifyingGlassIcon className="w-7 h-7" weight="duotone" />
      </div>
      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
        {translateText('请在左侧列表选择宝可梦以查看详情', locale)}
      </p>
    </div>
  )
}

function flattenItemsDetail(nodes: ItemNode[], currentPath: string[] = []): FlattenedItem[] {
  let result: FlattenedItem[] = []
  for (const node of nodes) {
    if (node.type === 'category') {
      const nextPath = [...currentPath, node.name || '']
      if (node.children) {
        result = [...result, ...flattenItemsDetail(node.children, nextPath)]
      }
    }
    else if (node.type === 'item' && node.name_zh) {
      result.push({
        name_zh: node.name_zh,
        name_ja: node.name_ja || '',
        name_en: node.name_en || '',
        description: node.description || '',
        icon: node.icon || '',
        categoryPath: currentPath,
      })
    }
  }
  return result
}

export function StaticPokemonDetailPage() {
  const locale = useLocale()
  const activeName = useStaticDetailName('pokemon')
  const { data: pokemonDetail, isLoading } = usePokemonDetail(activeName)

  if (!activeName) {
    return <PokemonEmptyView locale={locale} />
  }

  if (isLoading) {
    return <div className="p-8 text-sm font-bold text-zinc-400">{translateText('加载中...', locale)}</div>
  }

  if (!pokemonDetail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <WarningCircleIcon className="w-12 h-12 text-muted-foreground/45" weight="duotone" />
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-4">
          {translateText('未找到该宝可梦的详细资料', locale)}
        </p>
      </div>
    )
  }

  return <PokemonDetailClient detail={pokemonDetail} locale={locale} />
}

export function StaticAbilityDetailPage() {
  const locale = useLocale()
  const activeName = useStaticDetailName('abilities')
  return <AbilityDetailClient activeName={activeName} locale={locale} />
}

export function StaticMoveDetailPage() {
  const locale = useLocale()
  const activeName = useStaticDetailName('moves')
  return <MoveDetailClient activeName={activeName} locale={locale} />
}

export function StaticItemDetailPage() {
  const locale = useLocale()
  const activeName = useStaticDetailName('items')
  const { data: itemList, isLoading } = useItemList()
  const allItems = itemList ? flattenItemsDetail(itemList) : []
  const activeItem = allItems.find(item => item.name_zh === activeName || translateText(item.name_zh, locale) === activeName) || null

  if (!activeName || (!activeItem && !isLoading)) {
    return <ItemEmptyView locale={locale} />
  }

  if (isLoading) {
    return <div className="p-8 text-sm font-bold text-zinc-400">{translateText('加载中...', locale)}</div>
  }

  return activeItem ? <ItemDetailView activeItem={activeItem} locale={locale} /> : <ItemEmptyView locale={locale} />
}
