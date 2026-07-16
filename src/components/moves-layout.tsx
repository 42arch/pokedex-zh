'use client'

import type { SimpleMove } from '@/services/pokemon'
import { FunnelIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { getTypeColor } from '@/lib/pokemon-helpers'
import { cn, getLocalizedPath } from '@/lib/utils'
import { ResizableLayout } from './resizable-layout'
import { CategoryBadge, TypeBadge } from './type-badge'

// All Types for filter
const POKEMON_TYPES = [
  '一般',
  '火',
  '水',
  '电',
  '草',
  '冰',
  '格斗',
  '毒',
  '地面',
  '飞行',
  '超能力',
  '虫',
  '岩石',
  '幽灵',
  '龙',
  '恶',
  '钢',
  '妖精',
]

interface MovesLayoutProps {
  moveList: SimpleMove[]
  children: React.ReactNode
}

export function MovesLayout({ moveList, children }: MovesLayoutProps) {
  const router = useRouter()
  const locale = useLocale()
  const params = useParams()

  const activeName = params?.name ? (Array.isArray(params.name) ? decodeURIComponent(params.name[0]) : decodeURIComponent(params.name)) : ''
  const isActiveDetail = !!activeName

  // Filters
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<string | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<string | 'all'>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  // Filter moves
  const filteredMoves = React.useMemo(() => {
    return moveList.filter((move) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q
        || move.name_zh.toLowerCase().includes(q)
        || translateText(move.name_zh, 'zh-Hant').toLowerCase().includes(q)
        || move.name_jp.toLowerCase().includes(q)
        || move.name_en.toLowerCase().includes(q)
        || move.id.includes(q)

      const matchesType = selectedType === 'all' || move.type === selectedType
      const matchesCategory = selectedCategory === 'all' || move.category === selectedCategory

      return matchesSearch && matchesType && matchesCategory
    })
  }, [moveList, searchQuery, selectedType, selectedCategory])

  const handleSelect = (name: string) => {
    router.push(getLocalizedPath(`/moves/${encodeURIComponent(name)}`, locale))
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedCategory('all')
  }

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'all' || selectedCategory !== 'all'

  return (
    <ResizableLayout
      id="moves-list-split"
      isActiveDetail={isActiveDetail}
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
                  placeholder={translateText('搜索招式 (名称/属性/英文/介绍)...', locale)}
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
                  (showFilters || selectedType !== 'all' || selectedCategory !== 'all') ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700' : '',
                )}
              >
                <FunnelIcon className="w-4 h-4" />
                {(selectedType !== 'all' || selectedCategory !== 'all') && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </Button>
            </div>

            {/* Collapsible filters */}
            {showFilters && (
              <div className="flex flex-col gap-3.5 p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-250">
                {/* Type filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('招式属性', locale)}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                        selectedType === 'all'
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200/60',
                      )}
                    >
                      {translateText('全部', locale)}
                    </button>
                    {POKEMON_TYPES.map((type) => {
                      const isSelected = selectedType === type
                      const typeColor = getTypeColor(type)
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(isSelected ? 'all' : type)}
                          className={cn(
                            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border border-transparent',
                            isSelected
                              ? 'text-white shadow-sm'
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200/60',
                          )}
                          style={isSelected ? { backgroundColor: typeColor } : undefined}
                        >
                          {translateText(type, locale)}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Category filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('招式分类', locale)}
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                        selectedCategory === 'all'
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
                      )}
                    >
                      {translateText('全部', locale)}
                    </button>
                    {['物理', '特殊', '变化'].map((cat) => {
                      const isSelected = selectedCategory === cat
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                          className="px-3.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                          style={{
                            backgroundColor: isSelected
                              ? (cat === '物理' ? '#e62829' : cat === '特殊' ? '#2980ef' : '#9fa19f')
                              : undefined,
                            color: isSelected ? '#fff' : undefined,
                            border: !isSelected ? '1px solid var(--border)' : '1px solid transparent',
                          }}
                        >
                          <CategoryBadge category={cat} variant="icon" />
                          <span>{translateText(cat, locale)}</span>
                        </button>
                      )
                    })}
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
                {filteredMoves.length}
                {' '}
                {translateText('个招式', locale)}
              </span>
            </div>
          </div>

          {/* Moves scroll list */}
          <ScrollArea className="flex-1 w-full">
            <div className="p-3 space-y-1.5 w-full">
              {filteredMoves.map((move, idx) => {
                const isSelected = activeName === move.name_zh
                const nameLabel = translateText(move.name_zh, locale)

                return (
                  <div
                    key={`${move.id}-${move.name_zh}-${idx}`}
                    onClick={() => handleSelect(move.name_zh)}
                    className={cn(
                      'w-full flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 border',
                      isSelected
                        ? 'border-zinc-900/10 dark:border-zinc-100/10 shadow-sm bg-zinc-50 dark:bg-zinc-900/40'
                        : 'border-zinc-100 dark:border-zinc-800/60 bg-transparent hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-700/60 text-zinc-700 dark:text-zinc-300',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                        No.
                        {move.id}
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {nameLabel}
                        </h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <CategoryBadge category={move.category} variant="icon" />
                          <TypeBadge type={move.type} variant="icon" />
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                        {move.name_en}
                        {' '}
                        ·
                        {move.name_jp}
                      </p>
                    </div>
                  </div>
                )
              })}

              {filteredMoves.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <span className="text-zinc-300 dark:text-zinc-700 text-4xl">🔍</span>
                  <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-3">
                    {translateText('未找到匹配的招式', locale)}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}
      rightPanel={children}
    />
  )
}
