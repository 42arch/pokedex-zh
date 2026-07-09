'use client'

import type { AbilityDetail, SimpleAbility } from '@/services/pokemon'
import { FunnelIcon, InfoIcon, MagnifyingGlassIcon, ShieldCheckIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { cn } from '@/lib/utils'
import { ResizableLayout } from './resizable-layout'

interface AbilitiesLayoutProps {
  abilityList: SimpleAbility[]
  children: React.ReactNode
}

export function AbilitiesLayout({ abilityList, children }: AbilitiesLayoutProps) {
  const router = useRouter()
  const locale = useLocale()
  const params = useParams()

  const activeName = params?.name ? (Array.isArray(params.name) ? decodeURIComponent(params.name[0]) : decodeURIComponent(params.name)) : ''
  const isActiveDetail = !!activeName

  // States
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedGen, setSelectedGen] = React.useState<number | 'all'>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  // Filter list
  const filteredAbilities = React.useMemo(() => {
    return abilityList.filter((ability) => {
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
    router.push(`/${locale}/abilities/${encodeURIComponent(name)}`)
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
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
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
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
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
              {filteredAbilities.map((ability, idx) => {
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
              })}

              {filteredAbilities.length === 0 && (
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

export function AbilityDetailView({ activeDetail, locale }: { activeDetail: AbilityDetail, locale: string }) {
  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link href={`/${locale}/abilities`} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <span>←</span>
          {' '}
          {translateText('返回特性列表', locale)}
        </Link>
      </div>

      {/* Content view */}
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">

        {/* Header profile block */}
        <div
          className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col gap-3 p-4 md:p-6"
          style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.15))' }}
        >
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/45 backdrop-blur-xl -z-10" />

          {/* Floating background Poke Ball */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 text-black/[0.03] dark:text-white/[0.02] pointer-events-none -z-10">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-red-500/10 dark:bg-red-500/25 text-red-500 shadow-sm border border-red-500/10">
              {translateText('宝可梦特性', locale)}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {translateText(activeDetail.name_zh, locale)}
            </h1>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {activeDetail.name_en}
              {' '}
              ·
              {activeDetail.name_ja}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/15 shadow-sm border border-white/20 dark:border-white/5 text-sm font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">
            {translateText(activeDetail.description, locale)}
          </div>
        </div>

        {/* Detailed effect text */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-zinc-400" />
            {translateText('对战效果详情', locale)}
          </h3>

          <div className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <div className="space-y-1">
              <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                {translateText('对战中效果', locale)}
              </h4>
              <p className="whitespace-pre-wrap">{translateText(activeDetail.effect, locale)}</p>
            </div>

            {activeDetail.detail_effect && activeDetail.detail_effect !== activeDetail.effect && (
              <div className="space-y-1 pt-3 border-t border-zinc-150/40 dark:border-zinc-850">
                <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  {translateText('详细细则/额外说明', locale)}
                </h4>
                <p className="whitespace-pre-wrap text-xs text-zinc-500 dark:text-zinc-400">{translateText(activeDetail.detail_effect, locale)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pokemons possess this ability */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-zinc-400" />
            {translateText('拥有该特性的宝可梦', locale)}
          </h3>

          <ScrollArea className="h-96 pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {activeDetail.pokemons.map((pk, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}/pokemon/${pk.id.padStart(4, '0')}`}
                  className="flex flex-col gap-2 p-3.5 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[9px] font-bold text-zinc-450 dark:text-zinc-500">
                      #
                      {pk.id}
                    </span>
                    <span className={cn(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded',
                      pk.is_hidden
                        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-500'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400',
                    )}
                    >
                      {translateText(pk.is_hidden ? '隐特性' : '普通', locale)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-zinc-900 dark:text-zinc-50 group-hover:text-red-500 transition-colors truncate">
                      {translateText(pk.name, locale)}
                    </p>
                    {pk.form && (
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate mt-0.5">
                        {translateText(pk.form, locale)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  )
}

export function AbilityEmptyView({ locale }: { locale: string }) {
  return (
    <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5 animate-in fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/50">
        ✨
      </div>
      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
        {translateText('请在左侧列表选择特性以查看详情', locale)}
      </p>
    </div>
  )
}
