'use client'

import type { CombinedPokemon, RegionalPokedexMap } from '@/services/pokemon'
import { FunnelIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { FILTER_LIST, POKEDEX_COLORS, POKEDEX_LIST, TYPE_COLORS } from '@/lib/constants'
import { getTypeColor } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'
import { TypeBadge } from './type-badge'

// Sprite Icon Component using sprites.webp
export function PokemonSprite({ icon, className, size = 40 }: { icon: string, className?: string, size?: number }) {
  return (
    <div
      className={cn('pokemon-icon shrink-0 select-none bg-no-repeat', className)}
      style={{
        fontSize: `${size}px`,
        backgroundPosition: icon,
        imageRendering: 'pixelated',
      }}
    />
  )
}

// All Pokemon Types for filter
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

interface PokedexListProps {
  pokemonList: CombinedPokemon[]
  regionalMap: RegionalPokedexMap
}

export function PokedexList({ pokemonList, regionalMap }: PokedexListProps) {
  const router = useRouter()
  const params = useParams()
  const locale = useLocale()

  const currentId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : ''

  // Search and Filter States
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedGen, setSelectedGen] = React.useState<number | 'all'>('all')
  // Up to 2 types can be selected simultaneously
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])
  // Region: two levels — selectedRegion is region name, selectedSubDex is sub-dex key
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null)
  const [selectedSubDex, setSelectedSubDex] = React.useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = React.useState<string | 'all'>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  // Toggle type: deselect if already on, add as 2nd if 1 selected, replace 2nd if 2 already selected
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type))
        return prev.filter(t => t !== type)
      if (prev.length === 0)
        return [type]
      if (prev.length === 1)
        return [prev[0], type]
      // 2 already selected — replace the second one
      return [prev[0], type]
    })
  }

  // When region is deselected, also clear sub-dex
  const handleSelectRegion = (regionKey: string) => {
    if (selectedRegion === regionKey) {
      setSelectedRegion(null)
      setSelectedSubDex(null)
    }
    else {
      setSelectedRegion(regionKey)
      setSelectedSubDex(null)
    }
  }

  const handleSelectSubDex = (subKey: string) => {
    setSelectedSubDex(prev => prev === subKey ? null : subKey)
  }

  // Filter Logic
  const filteredList = React.useMemo(() => {
    return pokemonList.filter((pokemon) => {
      // 1. Search Query Match
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q
        || pokemon.id.includes(q)
        || pokemon.name.toLowerCase().includes(q)
        || translateText(pokemon.name, 'zh-Hant').toLowerCase().includes(q)
        || pokemon.name_jp.toLowerCase().includes(q)
        || pokemon.name_en.toLowerCase().includes(q)

      // 2. Generation Match
      const matchesGen = selectedGen === 'all' || pokemon.gen === selectedGen

      // 3. Type Match — all selected types must be present
      const matchesType = selectedTypes.length === 0 || selectedTypes.every(t => pokemon.types.includes(t))

      // 4. Regional Pokedex Match — sub-dex takes priority over region
      let matchesRegion = true
      if (selectedSubDex) {
        matchesRegion = (regionalMap.bySub[pokemon.id] || []).includes(selectedSubDex)
      }
      else if (selectedRegion) {
        matchesRegion = (regionalMap.byRegion[pokemon.id] || []).includes(selectedRegion)
      }

      // 5. Category Filter Match
      const matchesFilter = selectedFilter === 'all' || pokemon.filter.includes(selectedFilter)

      return matchesSearch && matchesGen && matchesType && matchesRegion && matchesFilter
    })
  }, [pokemonList, searchQuery, selectedGen, selectedTypes, selectedRegion, selectedSubDex, selectedFilter, regionalMap])

  const handleSelect = (id: string) => {
    router.push(`/${locale}/pokemon/${id}`)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedGen('all')
    setSelectedTypes([])
    setSelectedRegion(null)
    setSelectedSubDex(null)
    setSelectedFilter('all')
  }

  const hasActiveFilters = searchQuery !== '' || selectedGen !== 'all' || selectedTypes.length > 0 || selectedRegion !== null || selectedFilter !== 'all'
  const hasNonSearchFilters = selectedGen !== 'all' || selectedTypes.length > 0 || selectedRegion !== null || selectedFilter !== 'all'

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50">
      {/* Search Header */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <UiInput
              type="text"
              placeholder={translateText('搜索宝可梦 (名称/编号/英文)...', locale)}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl text-sm border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-700"
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
              (showFilters || hasNonSearchFilters) && 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700',
            )}
          >
            <FunnelIcon className="w-4 h-4" />
            {hasNonSearchFilters && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Button>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-250">

            {/* Regional Pokedex Filter — two-level */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {translateText('地区图鉴', locale)}
              </label>
              {/* Level 1: Region buttons */}
              <div className="flex flex-wrap gap-1">
                {POKEDEX_LIST.map(({ name, items }) => {
                  const regionKey = name.replace('地区', '')
                  const color = (POKEDEX_COLORS as Record<string, string>)[regionKey]
                  const isActive = selectedRegion === regionKey
                  return (
                    <button
                      key={regionKey}
                      onClick={() => handleSelectRegion(regionKey)}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border',
                        isActive
                          ? 'text-zinc-900 shadow-sm border-transparent'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 border-transparent',
                      )}
                      style={isActive && color ? { backgroundColor: color } : undefined}
                    >
                      {regionKey}
                      {items.length > 1 && (
                        <span className={cn('ml-1 text-[9px]', isActive ? 'opacity-60' : 'opacity-40')}>▾</span>
                      )}
                    </button>
                  )
                })}
              </div>
              {/* Level 2: Sub-dex buttons — shown when a region is selected and has multiple dexes */}
              {selectedRegion && (() => {
                const region = POKEDEX_LIST.find(r => r.name.replace('地区', '') === selectedRegion)
                if (!region || region.items.length <= 1)
                  return null
                const regionKey = selectedRegion
                const color = (POKEDEX_COLORS as Record<string, string>)[regionKey]
                return (
                  <div className="flex flex-wrap gap-1 pl-1 pt-0.5 border-l-2" style={{ borderColor: color ? `${color}80` : '#e4e4e7' }}>
                    {region.items.map(({ name: subName, url }) => {
                      // derive sub-key from url filename without extension
                      const subKey = url.replace('.json', '')
                      const isSubActive = selectedSubDex === subKey
                      return (
                        <button
                          key={subKey}
                          onClick={() => handleSelectSubDex(subKey)}
                          className={cn(
                            'px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all border',
                            isSubActive
                              ? 'text-zinc-900 shadow-sm border-transparent'
                              : 'bg-white dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-800/60',
                          )}
                          style={isSubActive && color ? { backgroundColor: color } : undefined}
                        >
                          {subName}
                        </button>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* Generation Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {translateText('世代', locale)}
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedGen('all')}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                    selectedGen === 'all'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                  )}
                >
                  {translateText('全部', locale)}
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(gen => (
                  <button
                    key={gen}
                    onClick={() => setSelectedGen(gen)}
                    className={cn(
                      'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                      selectedGen === gen
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                    )}
                  >
                    G
                    {gen}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter — up to 2 types, colors from TYPE_COLORS */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2">
                {translateText('属性', locale)}
                {selectedTypes.length > 0 && (
                  <span className="normal-case font-normal text-zinc-400 dark:text-zinc-500">
                    (
                    {selectedTypes.length === 2 ? translateText('双属性', locale) : translateText('单属性', locale)}
                    )
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedTypes([])}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                    selectedTypes.length === 0
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                  )}
                >
                  {translateText('全部', locale)}
                </button>
                {POKEMON_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type)
                  const translatedType = translateText(type, locale)
                  const typeColor = (TYPE_COLORS as Record<string, string>)[type]

                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border border-transparent',
                        isSelected
                          ? 'text-white shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                      )}
                      style={isSelected ? { backgroundColor: typeColor } : undefined}
                    >
                      {translatedType}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Category Filter — full label always shown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {translateText('分类', locale)}
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                    selectedFilter === 'all'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                  )}
                >
                  {translateText('全部', locale)}
                </button>
                {FILTER_LIST.map(({ value, label, color }) => {
                  const isSelected = selectedFilter === value
                  return (
                    <button
                      key={value}
                      onClick={() => setSelectedFilter(isSelected ? 'all' : value)}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border border-transparent',
                        isSelected
                          ? 'text-white shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60',
                      )}
                      style={isSelected ? { backgroundColor: color } : undefined}
                    >
                      {translateText(label, locale)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="w-full text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl py-1 h-8 mt-1 font-semibold"
              >
                {translateText('清除所有筛选条件', locale)}
              </Button>
            )}
          </div>
        )}

        {/* Count Summary */}
        <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 px-1 flex justify-between items-center">
          <span>
            {translateText('共找到', locale)}
            {' '}
            {filteredList.length}
            {' '}
            {translateText('只宝可梦', locale)}
          </span>
          {hasActiveFilters && (
            <span className="text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md text-[10px]">
              {translateText('过滤中', locale)}
            </span>
          )}
        </div>
      </div>

      {/* Pokémon Cards List */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-3 space-y-1.5 w-full">
          {filteredList.map((pokemon, idx) => {
            const isSelected = currentId === pokemon.id
            const translatedName = translateText(pokemon.name, locale)
            const primaryType = pokemon.types[0] || '一般'
            const activeColor = getTypeColor(primaryType)

            return (
              <div
                key={`${pokemon.id}-${pokemon.name}-${idx}`}
                onClick={() => handleSelect(pokemon.id)}
                className={cn(
                  'w-full flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 group relative overflow-hidden border',
                  isSelected
                    ? 'border-none shadow-sm'
                    : 'border-zinc-100 dark:border-zinc-800/60 bg-transparent hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-700/60 text-zinc-700 dark:text-zinc-300',
                )}
                style={
                  isSelected
                    ? {
                        background: `linear-gradient(135deg, ${activeColor}15, ${activeColor}25)`,
                      }
                    : undefined
                }
              >
                {/* Active Left Accent Strip */}
                {isSelected && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-md"
                    style={{ backgroundColor: activeColor }}
                  />
                )}

                {/* Sprite Icon */}
                <div className="relative flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/80 rounded-xl p-1.5 border border-zinc-100 dark:border-zinc-800/40 shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <PokemonSprite icon={pokemon.icon} size={36} />
                </div>

                {/* Pokémon Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                      #
                      {pokemon.id}
                    </span>
                  </div>
                  <h4 className={cn(
                    'font-bold text-sm truncate tracking-tight transition-colors',
                    isSelected ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-900 dark:text-zinc-100',
                  )}
                  >
                    {translatedName}
                  </h4>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium truncate mt-0.5">
                    {pokemon.name_en}
                  </p>
                </div>

                {/* Types Badges */}
                <div className="flex flex-row gap-1 items-center shrink-0">
                  {pokemon.types.map(type => (
                    <TypeBadge key={type} type={type} variant="icon" />
                  ))}
                </div>
              </div>
            )
          })}

          {filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <span className="text-zinc-300 dark:text-zinc-700 text-4xl">🔍</span>
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-3">
                {translateText('未找到匹配的宝可梦', locale)}
              </p>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-zinc-900 dark:text-zinc-100 underline mt-2 hover:opacity-80"
              >
                {translateText('重置筛选', locale)}
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
