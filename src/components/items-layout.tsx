'use client'

import type { ItemNode } from '@/services/pokemon'
import { FunnelIcon, InfoIcon, MagnifyingGlassIcon, TagIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { ASSET_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ResizableLayout } from './resizable-layout'

export interface FlattenedItem {
  name_zh: string
  name_ja: string
  name_en: string
  description: string | string[]
  icon: string | string[]
  categoryPath: string[]
}

interface ItemsLayoutProps {
  itemList: ItemNode[]
  activeName: string
}

// Helper to flatten the hierarchical tree structure of items
function flattenItems(nodes: ItemNode[], currentPath: string[] = []): FlattenedItem[] {
  let result: FlattenedItem[] = []
  for (const node of nodes) {
    if (node.type === 'category') {
      const nextPath = [...currentPath, node.name || '']
      if (node.children) {
        result = [...result, ...flattenItems(node.children, nextPath)]
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

// Fallback component for rendering item icon sprites
export function ItemSprite({
  name,
  icon,
  className,
  size = 32,
}: {
  name: string
  icon: string | string[]
  className?: string
  size?: number
}) {
  const iconName = Array.isArray(icon) ? icon[0] : icon
  const src = iconName ? `${ASSET_URL}/images/items/${encodeURIComponent(iconName)}` : ''
  const [error, setError] = React.useState(false)

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 font-bold',
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        🎒
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className={cn('object-contain transition-transform duration-200 group-hover:scale-110', className)}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  )
}

export function ItemsLayout({ itemList, activeName }: ItemsLayoutProps) {
  const router = useRouter()
  const locale = useLocale()

  // Flatten once
  const allItems = React.useMemo(() => flattenItems(itemList), [itemList])

  // Extract all unique category paths to filter by
  const categories = React.useMemo(() => {
    const catsSet = new Set<string>()
    allItems.forEach((item) => {
      item.categoryPath.forEach((cat) => {
        if (cat)
          catsSet.add(cat)
      })
    })
    return Array.from(catsSet)
  }, [allItems])

  // Filters State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | 'all'>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  // Filter items
  const filteredItems = React.useMemo(() => {
    return allItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch
        = !q
          || item.name_zh.toLowerCase().includes(q)
          || translateText(item.name_zh, 'zh-Hant').toLowerCase().includes(q)
          || item.name_ja.toLowerCase().includes(q)
          || item.name_en.toLowerCase().includes(q)
          || (Array.isArray(item.description)
            ? item.description.some(d => d.toLowerCase().includes(q))
            : item.description.toLowerCase().includes(q))

      const matchesCategory = selectedCategory === 'all' || item.categoryPath.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [allItems, searchQuery, selectedCategory])

  // Find active item detail
  const activeItem = React.useMemo(() => {
    return allItems.find(item => item.name_zh === activeName) || null
  }, [allItems, activeName])

  const handleSelect = (name: string) => {
    router.push(`/items?name=${encodeURIComponent(name)}`)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all'

  return (
    <ResizableLayout
      id="items-list-split"
      isActiveDetail={!!activeItem}
      leftPanelClassName="bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50"
      rightPanelClassName="bg-zinc-50/30 dark:bg-zinc-950/10"
      leftPanel={(
        <>
          {/* Search header */}
          <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <UiInput
                  type="text"
                  placeholder={translateText('搜索物品 (名称/英文/描述)...', locale)}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-2 rounded-xl text-sm border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 focus-visible:ring-1 focus-visible:ring-zinc-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'rounded-xl border-zinc-200/80 dark:border-zinc-800/80 relative hover:bg-zinc-50 dark:hover:bg-zinc-900/50',
                  (showFilters || selectedCategory !== 'all') && 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700',
                )}
              >
                <FunnelIcon className="w-4 h-4" />
                {selectedCategory !== 'all' && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
              </Button>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-250">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('物品分类', locale)}
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                        selectedCategory === 'all'
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
                      )}
                    >
                      {translateText('全部', locale)}
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                          selectedCategory === cat
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
                        )}
                      >
                        {translateText(cat, locale)}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="w-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl py-1 h-8 mt-1 font-semibold"
                  >
                    {translateText('清除所有筛选条件', locale)}
                  </Button>
                )}
              </div>
            )}

            {/* Counts */}
            <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 px-1 flex justify-between items-center">
              <span>
                {translateText('共找到', locale)}
                {' '}
                {filteredItems.length}
                {' '}
                {translateText('个物品', locale)}
              </span>
            </div>
          </div>

          {/* Scroll list */}
          <ScrollArea className="flex-1 w-full">
            <div className="p-3 space-y-1.5 w-full">
              {filteredItems.map((item) => {
                const isSelected = activeName === item.name_zh
                const nameLabel = translateText(item.name_zh, locale)
                const firstDesc = Array.isArray(item.description) ? item.description[0] : item.description
                const lastCategory = item.categoryPath[item.categoryPath.length - 1] || ''

                return (
                  <div
                    key={item.name_zh}
                    onClick={() => handleSelect(item.name_zh)}
                    className={cn(
                      'w-full flex items-start gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 border group',
                      isSelected
                        ? 'border-zinc-900/10 dark:border-zinc-100/10 shadow-sm bg-zinc-50 dark:bg-zinc-900/40'
                        : 'border-zinc-100 dark:border-zinc-800/60 bg-transparent hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-700/60 text-zinc-700 dark:text-zinc-300',
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      <ItemSprite name={item.name_zh} icon={item.icon} size={36} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {nameLabel}
                        </h4>
                        {lastCategory && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                            {translateText(lastCategory, locale)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                        {item.name_en}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1 border-t border-zinc-100/40 dark:border-zinc-900/40 pt-1">
                        {translateText(firstDesc || '', locale)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <span className="text-zinc-300 dark:text-zinc-700 text-4xl">🎒</span>
                  <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-3">
                    {translateText('未找到匹配的物品', locale)}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}
      rightPanel={(
        <>
          {activeItem
            ? (
                <div className="relative h-full flex flex-col">
                  {/* Mobile Back Button */}
                  <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
                    <Link
                      href="/items"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                    >
                      <span>←</span>
                      {' '}
                      {translateText('返回物品列表', locale)}
                    </Link>
                  </div>

                  {/* Content view */}
                  <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
                    {/* Header profile block */}
                    <div
                      className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col md:flex-row gap-4 p-4 md:p-6 items-center md:items-start"
                      style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.12))' }}
                    >
                      <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/45 backdrop-blur-xl -z-10" />

                      {/* Big Icon */}
                      <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-md border border-white dark:border-zinc-800/50">
                        <ItemSprite name={activeItem.name_zh} icon={activeItem.icon} size={64} />
                      </div>

                      {/* Info Text */}
                      <div className="flex-1 space-y-3.5 text-center md:text-left min-w-0 w-full">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                          <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 border border-red-500/10">
                            {translateText('道具物品', locale)}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                            <TagIcon className="w-3.5 h-3.5" />
                            {activeItem.categoryPath.map((pathName, index) => {
                              const isLast = index === activeItem.categoryPath.length - 1
                              return (
                                <span key={pathName} className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedCategory(pathName)
                                      setShowFilters(true)
                                    }}
                                    className="hover:underline hover:text-red-500 transition-colors"
                                  >
                                    {translateText(pathName, locale)}
                                  </button>
                                  {!isLast && <span className="opacity-50">&gt;</span>}
                                </span>
                              )
                            })}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {translateText(activeItem.name_zh, locale)}
                          </h1>
                          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            {activeItem.name_en}
                            {' '}
                            ·
                            {activeItem.name_ja}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Descriptions & Variants */}
                    <div className="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
                      <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                        <InfoIcon className="w-5 h-5 text-zinc-400" />
                        {translateText('物品效果描述', locale)}
                      </h3>

                      {Array.isArray(activeItem.icon) && activeItem.icon.length > 1
                        ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {activeItem.icon.map((ic, idx) => {
                                const variantDesc = Array.isArray(activeItem.description)
                                  ? activeItem.description[idx]
                                  : activeItem.description
                                return (
                                  <div
                                    key={idx}
                                    className="flex flex-col items-center gap-3.5 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-900 bg-zinc-50/40 dark:bg-zinc-900/20"
                                  >
                                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white dark:bg-zinc-900/60 shadow-sm">
                                      <ItemSprite name={activeItem.name_zh} icon={ic} size={40} />
                                    </div>
                                    <p className="text-xs font-semibold leading-relaxed text-center text-zinc-700 dark:text-zinc-300">
                                      {translateText(variantDesc || '', locale)}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        : (
                            <div className="p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/25 border border-zinc-100 dark:border-zinc-900/20 leading-relaxed font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                              {translateText(
                                (Array.isArray(activeItem.description)
                                  ? activeItem.description[0]
                                  : activeItem.description) || '',
                                locale,
                              )}
                            </div>
                          )}
                    </div>
                  </div>
                </div>
              )
            : (
                <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5 animate-in fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/50">
                    🎒
                  </div>
                  <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
                    {translateText('请在左侧列表选择物品以查看详情', locale)}
                  </p>
                </div>
              )}
        </>
      )}
    />
  )
}
