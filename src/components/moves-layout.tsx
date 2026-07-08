'use client'

import type { MoveDetail, SimpleMove } from '@/services/pokemon'
import { FunnelIcon, InfoIcon, MagnifyingGlassIcon, ShieldCheckIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { translateText } from '@/lib/chinese'
import { getGenerationName, getTypeColor } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'
import { ResizableLayout } from './resizable-layout'
import { CategoryBadge, TypeBadge, TypeIcon } from './type-badge'

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
  activeDetail: MoveDetail | null
  activeName: string
}

export function MovesLayout({ moveList, activeDetail, activeName }: MovesLayoutProps) {
  const router = useRouter()
  const locale = useLocale()

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
    router.push(`/moves?name=${encodeURIComponent(name)}`)
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
      isActiveDetail={!!activeDetail}
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
                  placeholder={translateText('搜索招式 (名称/属性/英文)...', locale)}
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
                  (showFilters || selectedType !== 'all' || selectedCategory !== 'all') && 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700',
                )}
              >
                <FunnelIcon className="w-4 h-4" />
                {(selectedType !== 'all' || selectedCategory !== 'all') && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </Button>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-250">
                {/* Category Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('分类', locale)}
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { key: 'all', label: '全部' },
                      { key: '物理', label: '物理' },
                      { key: '特殊', label: '特殊' },
                      { key: '变化', label: '变化' },
                    ].map(cat => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={cn(
                          'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                          selectedCategory === cat.key
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
                        )}
                      >
                        {translateText(cat.label, locale)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('属性', locale)}
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                        selectedType === 'all'
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60',
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
                          onClick={() => setSelectedType(type)}
                          className={cn(
                            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border border-transparent flex items-center gap-1.5',
                            isSelected
                              ? 'text-white shadow-sm'
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                          )}
                          style={isSelected ? { backgroundColor: typeColor } : undefined}
                        >
                          <TypeIcon type={type} className="scale-[0.8] -mx-0.5" />
                          <span>{translateText(type, locale)}</span>
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
      rightPanel={(
        <>
          {activeDetail
            ? (
                <div className="relative h-full flex flex-col">
                  {/* Mobile Back Button */}
                  <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
                    <Link href="/moves" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      <span>←</span>
                      {' '}
                      {translateText('返回招式列表', locale)}
                    </Link>
                  </div>

                  {/* Move Detail View */}
                  <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">

                    {/* Header profile block */}
                    <div
                      className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col gap-3.5 p-4 md:p-6"
                      style={{ background: `linear-gradient(135deg, ${getTypeColor(activeDetail.type)}15, ${getTypeColor(activeDetail.type)}25)` }}
                    >
                      <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl -z-10" />

                      {/* Floating background Poke Ball */}
                      <div className="absolute -right-16 -bottom-16 w-64 h-64 text-black/[0.03] dark:text-white/[0.02] pointer-events-none -z-10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <TypeBadge type={activeDetail.type} className="px-3.5 py-1 rounded-full text-xs" />
                        <CategoryBadge category={activeDetail.category} className="px-3.5 py-1 rounded-full text-xs" />
                        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                          {getGenerationName(parseInt(activeDetail.generation, 10) || 1, locale)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
                          {translateText(activeDetail.name_zh, locale)}
                        </h1>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          {activeDetail.name_en}
                          {' '}
                          ·
                          {activeDetail.name_ja}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/15 shadow-sm border border-white/20 dark:border-white/5 text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {translateText(activeDetail.description, locale)}
                      </div>

                      {/* Base Parameters grid */}
                      <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                        <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                          <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">{translateText('威力', locale)}</span>
                          <p className="font-black text-zinc-900 dark:text-zinc-50 mt-1 font-mono">{activeDetail.power}</p>
                        </div>
                        <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                          <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">{translateText('命中率', locale)}</span>
                          <p className="font-black text-zinc-900 dark:text-zinc-50 mt-1 font-mono">
                            {activeDetail.accuracy}
                            %
                          </p>
                        </div>
                        <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                          <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">PP</span>
                          <p className="font-black text-zinc-900 dark:text-zinc-50 mt-1 font-mono">{activeDetail.pp}</p>
                        </div>
                      </div>
                    </div>

                    {/* Effect text */}
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-3">
                      <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                        <InfoIcon className="w-5 h-5 text-zinc-400" />
                        {translateText('效果说明', locale)}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {translateText(activeDetail.effect, locale)}
                      </p>
                    </div>

                    {/* Flags Grid (Contact, Priority, Snatch, Magic Coat etc.) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: '接触目标', val: activeDetail.makes_contact === '是' ? '接触' : '非接触', active: activeDetail.makes_contact === '是' },
                        { label: '先制优先度', val: activeDetail.priority, active: parseInt(activeDetail.priority, 10) !== 0 },
                        { label: '受守住影响', val: activeDetail.affected_by_protect === '是' ? '受影响' : '不受影响', active: activeDetail.affected_by_protect === '是' },
                        { label: '受魔法反射影响', val: activeDetail.affected_by_magic_coat === '是' ? '可反射' : '不可反射', active: activeDetail.affected_by_magic_coat === '开' || activeDetail.affected_by_magic_coat === '是' },
                      ].map((flag, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'p-3 rounded-2xl border text-center shadow-sm flex flex-col items-center justify-center gap-1 transition-all',
                            flag.active
                              ? 'bg-zinc-900/5 dark:bg-zinc-100/5 border-zinc-900/10 dark:border-zinc-100/10 text-zinc-900 dark:text-zinc-50'
                              : 'bg-transparent border-zinc-100 dark:border-zinc-900 text-zinc-400 dark:text-zinc-500',
                          )}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider">{translateText(flag.label, locale)}</span>
                          <p className="font-black text-sm mt-0.5">{translateText(flag.val, locale)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Learnable Pokemons List */}
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
                      <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-zinc-400" />
                        {translateText('可学会该招式的宝可梦', locale)}
                      </h3>

                      <Tabs defaultValue="level-learn">
                        <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-9">
                          <TabsTrigger value="level-learn" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('等级提升', locale)}</TabsTrigger>
                          <TabsTrigger value="machine-learn" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('招式学习器', locale)}</TabsTrigger>
                          <TabsTrigger value="egg-learn" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('遗传招式', locale)}</TabsTrigger>
                        </TabsList>

                        {/* Level Learn list */}
                        <TabsContent value="level-learn" className="mt-3">
                          <ScrollArea className="h-64 pr-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                              {activeDetail.pokemons.flatMap(p =>
                                p.level_learn.map(l => ({
                                  form: p.form,
                                  level: l.level,
                                  id: l.id,
                                  name: l.name,
                                })),
                              ).map((pk, idx) => (
                                <Link
                                  key={idx}
                                  href={`/pokemon/${pk.id.padStart(4, '0')}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm"
                                >
                                  {/* We need the Poke sprite. Since we don't have the icon in details directly, we can show a placeholder or let's use the ID to render it dynamically if possible, or show a placeholder. Wait! Pokemon detail list doesn't have the sprite coordinates. BUT we can show a simple index number! */}
                                  <span className="font-mono text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md">
                                    {pk.level}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                                      {translateText(pk.name, locale)}
                                    </p>
                                    {pk.form && pk.form !== '一般' && (
                                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate">
                                        {translateText(pk.form, locale)}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        {/* Machine Learn list */}
                        <TabsContent value="machine-learn" className="mt-3">
                          <ScrollArea className="h-64 pr-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                              {activeDetail.pokemons.flatMap(p =>
                                p.machine_learn.map(m => ({
                                  form: p.form,
                                  machine: m.machine,
                                  id: m.id,
                                  name: m.name,
                                })),
                              ).map((pk, idx) => (
                                <Link
                                  key={idx}
                                  href={`/pokemon/${pk.id.padStart(4, '0')}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm"
                                >
                                  <span className="font-mono text-[9px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md">
                                    {translateText(pk.machine, locale)}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                                      {translateText(pk.name, locale)}
                                    </p>
                                    {pk.form && pk.form !== '一般' && (
                                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate">
                                        {translateText(pk.form, locale)}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        {/* Egg Learn list */}
                        <TabsContent value="egg-learn" className="mt-3">
                          <ScrollArea className="h-64 pr-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                              {activeDetail.pokemons.flatMap(p =>
                                p.egg_learn.map(e => ({
                                  form: p.form,
                                  id: e.id,
                                  name: e.name,
                                })),
                              ).map((pk, idx) => (
                                <Link
                                  key={idx}
                                  href={`/pokemon/${pk.id.padStart(4, '0')}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm"
                                >
                                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">
                                    {translateText('遗传', locale)}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                                      {translateText(pk.name, locale)}
                                    </p>
                                    {pk.form && pk.form !== '一般' && (
                                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate">
                                        {translateText(pk.form, locale)}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </div>

                  </div>
                </div>
              )
            : (
                <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5 animate-in fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/50">
                    ⚡
                  </div>
                  <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
                    {translateText('请在左侧列表选择招式以查看详情', locale)}
                  </p>
                </div>
              )}
        </>
      )}
    />
  )
}
