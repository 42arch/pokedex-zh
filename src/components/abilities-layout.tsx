'use client'

import type { SimpleAbility } from '@/services/pokemon'
import { FunnelIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAbilityList } from '@/hooks/use-pokemon-queries'
import { translateText } from '@/lib/chinese'
import { cn, getLocalizedPath } from '@/lib/utils'
import { ResizableLayout } from './resizable-layout'

interface AbilitiesLayoutProps {
  abilityList?: SimpleAbility[]
  children: React.ReactNode
}

export function AbilitiesLayout({ abilityList: initialAbilityList, children }: AbilitiesLayoutProps) {
  const router = useRouter()
  const locale = useLocale()
  const params = useParams()

  const { data: fetchedAbilityList, isLoading } = useAbilityList()
  const abilityList = fetchedAbilityList || initialAbilityList || []

  const activeName = params?.name ? (Array.isArray(params.name) ? decodeURIComponent(params.name[0]) : decodeURIComponent(params.name)) : ''
  const isActiveDetail = !!activeName

  // States
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedGen, setSelectedGen] = React.useState<number | 'all'>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  // Filter list
  const filteredAbilities = React.useMemo(() => {
    return abilityList.filter((ability: SimpleAbility) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q
        || ability.name_zh.toLowerCase().includes(q)
        || translateText(ability.name_zh, 'zh-Hant').toLowerCase().includes(q)
        || ability.name_ja.toLowerCase().includes(q)
        || ability.name_en.toLowerCase().includes(q)
        || ability.id.includes(q)

      const matchesGen = selectedGen === 'all' || ability.generation === selectedGen

      return matchesSearch && matchesGen
    })
  }, [abilityList, searchQuery, selectedGen])

  const handleSelect = (name: string) => {
    router.push(getLocalizedPath(`/abilities/${encodeURIComponent(name)}`, locale))
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedGen('all')
  }

  const hasActiveFilters = searchQuery !== '' || selectedGen !== 'all'

  return (
    <ResizableLayout
      id="abilities-list-split"
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
                  placeholder={translateText('搜索特性 (名称/英文/介绍)...', locale)}
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
                  (showFilters || selectedGen !== 'all') ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700' : '',
                )}
              >
                <FunnelIcon className="w-4 h-4" />
                {selectedGen !== 'all' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </Button>
            </div>

            {/* Collapsible filters */}
            {showFilters && (
              <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-250">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('引入世代', locale)}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setSelectedGen('all')}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                        selectedGen === 'all'
                          ? 'bg-red-500 text-red-foreground'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
                      )}
                    >
                      {translateText('全部', locale)}
                    </button>
                    {[3, 4, 5, 6, 7, 8, 9].map(gen => (
                      <button
                        key={gen}
                        onClick={() => setSelectedGen(gen)}
                        className={cn(
                          'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                          selectedGen === gen
                            ? 'bg-red-500 text-red-foreground'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
                        )}
                      >
                        G
                        {gen}
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
                {filteredAbilities.length}
                {' '}
                {translateText('个特性', locale)}
              </span>
            </div>
          </div>

          {/* Scroll list */}
          <ScrollArea className="flex-1 w-full">
            <div className="p-3 space-y-1.5 w-full">
              {isLoading && abilityList.length === 0
                ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <div
                        key={index}
                        className="w-full flex flex-col gap-2 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 animate-pulse bg-zinc-50/50 dark:bg-zinc-900/20"
                      >
                        <div className="flex justify-between items-center">
                          <div className="h-3 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
                          <div className="h-3 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="h-3 w-36 bg-zinc-100 dark:bg-zinc-900 rounded" />
                        <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded mt-1" />
                      </div>
                    ))
                  )
                : (
                    filteredAbilities.map((ability: SimpleAbility, idx: number) => {
                      const isSelected = activeName === ability.name_zh
                      const nameLabel = translateText(ability.name_zh, locale)

                      return (
                        <div
                          key={`${ability.id}-${ability.name_zh}-${idx}`}
                          onClick={() => handleSelect(ability.name_zh)}
                          className={cn(
                            'w-full flex flex-col gap-1 p-3 rounded-2xl cursor-pointer transition-all duration-200 border',
                            isSelected
                              ? 'border-zinc-900/10 dark:border-zinc-100/10 shadow-sm bg-zinc-50 dark:bg-zinc-900/40'
                              : 'border-zinc-100 dark:border-zinc-800/60 bg-transparent hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-700/60 text-zinc-700 dark:text-zinc-300',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                              No.
                              {ability.id}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                              G
                              {ability.generation}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                            {nameLabel}
                          </h4>
                          <p className="text-[11px] text-zinc-455 dark:text-zinc-500 truncate">
                            {ability.name_en}
                            {' '}
                            ·
                            {ability.name_ja}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-450 line-clamp-2 mt-1 border-t border-zinc-100/40 dark:border-zinc-900/40 pt-1 whitespace-normal break-all">
                            {translateText(ability.description, locale)}
                          </p>
                        </div>
                      )
                    })
                  )}

              {!isLoading && filteredAbilities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <span className="text-zinc-300 dark:text-zinc-700 text-4xl">🔍</span>
                  <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-3">
                    {translateText('未找到匹配的特性', locale)}
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
