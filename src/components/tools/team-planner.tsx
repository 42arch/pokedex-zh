'use client'

import type { NationalPokemon } from '@/services/pokemon'
import { CheckCircleIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import * as React from 'react'
import { PokemonSprite } from '@/components/pokedex-list'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { cn } from '@/lib/utils'
import { TypeBadge } from '../type-badge'

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
] as const

type PokemonType = typeof POKEMON_TYPES[number]

// Row: Attacking Type, Column: Defending Type
const typeMatchups: Record<PokemonType, Record<PokemonType, number>> = {
  一般: {
    一般: 1,
    火: 1,
    水: 1,
    电: 1,
    草: 1,
    冰: 1,
    格斗: 1,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 1,
    虫: 1,
    岩石: 0.5,
    幽灵: 0,
    龙: 1,
    恶: 1,
    钢: 0.5,
    妖精: 1,
  },
  火: {
    一般: 1,
    火: 0.5,
    水: 0.5,
    电: 1,
    草: 2,
    冰: 2,
    格斗: 1,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 1,
    虫: 2,
    岩石: 0.5,
    幽灵: 1,
    龙: 0.5,
    恶: 1,
    钢: 2,
    妖精: 1,
  },
  水: {
    一般: 1,
    火: 2,
    水: 0.5,
    电: 1,
    草: 0.5,
    冰: 1,
    格斗: 1,
    毒: 1,
    地面: 2,
    飞行: 1,
    超能力: 1,
    虫: 1,
    岩石: 2,
    幽灵: 1,
    龙: 0.5,
    恶: 1,
    钢: 1,
    妖精: 1,
  },
  电: {
    一般: 1,
    火: 1,
    水: 2,
    电: 0.5,
    草: 0.5,
    冰: 1,
    格斗: 1,
    毒: 1,
    地面: 0,
    飞行: 2,
    超能力: 1,
    虫: 1,
    岩石: 1,
    幽灵: 1,
    龙: 0.5,
    恶: 1,
    钢: 1,
    妖精: 1,
  },
  草: {
    一般: 1,
    火: 0.5,
    水: 2,
    电: 1,
    草: 0.5,
    冰: 1,
    格斗: 1,
    毒: 0.5,
    地面: 2,
    飞行: 0.5,
    超能力: 1,
    虫: 0.5,
    岩石: 2,
    幽灵: 1,
    龙: 0.5,
    恶: 1,
    钢: 0.5,
    妖精: 1,
  },
  冰: {
    一般: 1,
    火: 0.5,
    水: 0.5,
    电: 1,
    草: 2,
    冰: 0.5,
    格斗: 1,
    毒: 1,
    地面: 2,
    飞行: 2,
    超能力: 1,
    虫: 1,
    岩石: 1,
    幽灵: 1,
    龙: 2,
    恶: 1,
    钢: 0.5,
    妖精: 1,
  },
  格斗: {
    一般: 2,
    火: 1,
    水: 1,
    电: 1,
    草: 1,
    冰: 2,
    格斗: 1,
    毒: 0.5,
    地面: 1,
    飞行: 0.5,
    超能力: 0.5,
    虫: 0.5,
    岩石: 2,
    幽灵: 0,
    龙: 1,
    恶: 2,
    钢: 2,
    妖精: 0.5,
  },
  毒: {
    一般: 1,
    火: 1,
    水: 1,
    电: 1,
    草: 2,
    冰: 1,
    格斗: 1,
    毒: 0.5,
    地面: 0.5,
    飞行: 1,
    超能力: 1,
    虫: 1,
    岩石: 0.5,
    幽灵: 0.5,
    龙: 1,
    恶: 1,
    钢: 0,
    妖精: 2,
  },
  地面: {
    一般: 1,
    火: 2,
    水: 1,
    电: 2,
    草: 0.5,
    冰: 1,
    格斗: 1,
    毒: 2,
    地面: 1,
    飞行: 0,
    超能力: 1,
    虫: 0.5,
    岩石: 2,
    幽灵: 1,
    龙: 1,
    恶: 1,
    钢: 2,
    妖精: 1,
  },
  飞行: {
    一般: 1,
    火: 1,
    水: 1,
    电: 0.5,
    草: 2,
    冰: 1,
    格斗: 2,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 1,
    虫: 2,
    岩石: 0.5,
    幽灵: 1,
    龙: 1,
    恶: 1,
    钢: 0.5,
    妖精: 1,
  },
  超能力: {
    一般: 1,
    火: 1,
    水: 1,
    电: 1,
    草: 1,
    冰: 1,
    格斗: 2,
    毒: 2,
    地面: 1,
    飞行: 1,
    超能力: 0.5,
    虫: 1,
    岩石: 1,
    幽灵: 1,
    龙: 1,
    恶: 0,
    钢: 0.5,
    妖精: 1,
  },
  虫: {
    一般: 1,
    火: 0.5,
    水: 1,
    电: 1,
    草: 2,
    冰: 1,
    格斗: 0.5,
    毒: 0.5,
    地面: 1,
    飞行: 0.5,
    超能力: 2,
    虫: 1,
    岩石: 1,
    幽灵: 0.5,
    龙: 1,
    恶: 2,
    钢: 0.5,
    妖精: 0.5,
  },
  岩石: {
    一般: 1,
    火: 2,
    水: 1,
    电: 1,
    草: 1,
    冰: 2,
    格斗: 0.5,
    毒: 1,
    地面: 0.5,
    飞行: 2,
    超能力: 1,
    虫: 2,
    岩石: 1,
    幽灵: 1,
    龙: 1,
    恶: 1,
    钢: 0.5,
    妖精: 1,
  },
  幽灵: {
    一般: 0,
    火: 1,
    水: 1,
    电: 1,
    草: 1,
    冰: 1,
    格斗: 1,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 2,
    虫: 1,
    岩石: 1,
    幽灵: 2,
    龙: 1,
    恶: 0.5,
    钢: 1,
    妖精: 1,
  },
  龙: {
    一般: 1,
    火: 1,
    水: 1,
    电: 1,
    草: 1,
    冰: 1,
    格斗: 1,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 1,
    虫: 1,
    岩石: 1,
    幽灵: 1,
    龙: 2,
    恶: 1,
    钢: 0.5,
    妖精: 0,
  },
  恶: {
    一般: 1,
    火: 1,
    水: 1,
    电: 1,
    草: 1,
    冰: 1,
    格斗: 0.5,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 2,
    虫: 1,
    岩石: 1,
    幽灵: 2,
    龙: 1,
    恶: 0.5,
    钢: 1,
    妖精: 0.5,
  },
  钢: {
    一般: 1,
    火: 0.5,
    水: 0.5,
    电: 0.5,
    草: 1,
    冰: 2,
    格斗: 1,
    毒: 1,
    地面: 1,
    飞行: 1,
    超能力: 1,
    虫: 1,
    岩石: 2,
    幽灵: 1,
    龙: 1,
    恶: 1,
    钢: 0.5,
    妖精: 2,
  },
  妖精: {
    一般: 1,
    火: 0.5,
    水: 1,
    电: 1,
    草: 1,
    冰: 1,
    格斗: 2,
    毒: 0.5,
    地面: 1,
    飞行: 1,
    超能力: 1,
    虫: 1,
    岩石: 1,
    幽灵: 1,
    龙: 2,
    恶: 2,
    钢: 0.5,
    妖精: 1,
  },
}

interface TeamPlannerProps {
  pokemonList: NationalPokemon[]
}

export function TeamPlanner({ pokemonList }: TeamPlannerProps) {
  const locale = useLocale()
  const [team, setTeam] = React.useState<(NationalPokemon | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [activeSlot, setActiveSlot] = React.useState<number | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter pokemon in search list
  const filteredPokemons = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q)
      return pokemonList.slice(0, 50) // default limit for list performance
    return pokemonList.filter((pk) => {
      return (
        pk.id.includes(q)
        || pk.name.toLowerCase().includes(q)
        || translateText(pk.name, 'zh-Hant').toLowerCase().includes(q)
      )
    })
  }, [pokemonList, searchQuery])

  const handleAddPokemon = (pk: NationalPokemon) => {
    if (activeSlot !== null) {
      const newTeam = [...team]
      newTeam[activeSlot] = pk
      setTeam(newTeam)
      setActiveSlot(null)
      setSearchQuery('')
    }
  }

  const handleRemovePokemon = (index: number) => {
    const newTeam = [...team]
    newTeam[index] = null
    setTeam(newTeam)
  }

  // Calculate effectiveness multipliers for a single pokemon
  const getPkMultiplier = (pk: NationalPokemon, attackType: PokemonType): number => {
    let mult = 1
    pk.types.forEach((defType) => {
      const t = defType.trim() as PokemonType
      if (typeMatchups[attackType] && typeMatchups[attackType][t] !== undefined) {
        mult *= typeMatchups[attackType][t]
      }
    })
    return mult
  }

  // Calculate Team Defensive Matrix
  const activeMembers = React.useMemo(() => team.filter((p): p is NationalPokemon => p !== null), [team])

  const defenseReport = React.useMemo(() => {
    if (activeMembers.length === 0)
      return null

    const typeSummaries: Record<PokemonType, {
      multipliers: number[]
      weakCount: number
      resistCount: number
      netScore: number
    }> = {} as any

    POKEMON_TYPES.forEach((atk) => {
      const multipliers = activeMembers.map(member => getPkMultiplier(member, atk))
      let weakCount = 0
      let resistCount = 0

      multipliers.forEach((m) => {
        if (m > 1)
          weakCount++
        if (m < 1)
          resistCount++
      })

      // Resistance adds points, weakness subtracts points
      const netScore = resistCount - weakCount

      typeSummaries[atk] = {
        multipliers,
        weakCount,
        resistCount,
        netScore,
      }
    })

    // Detect critical weaknesses (weak to a type, zero members resist it, or weakness count >= 3)
    const vulnerabilities: string[] = []
    POKEMON_TYPES.forEach((type) => {
      const sum = typeSummaries[type]
      if (sum.weakCount >= 3) {
        vulnerabilities.push(translateText(`严重弱于【${type}】属性 (有 ${sum.weakCount} 只宝可梦弱于该属性，这在联防中极为危险)。`, locale))
      }
      else if (sum.weakCount > 0 && sum.resistCount === 0) {
        vulnerabilities.push(translateText(`存在【${type}】属性盲点 (队伍中有 ${sum.weakCount} 只成员被克制，但没有任何成员能够抗性切换分担)。`, locale))
      }
    })

    return {
      typeSummaries,
      vulnerabilities,
    }
  }, [activeMembers, locale])

  return (
    <div className="space-y-6">
      {/* 6 Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {team.map((slot, index) => {
          return (
            <div
              key={index}
              className={cn(
                'rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 p-4 bg-white dark:bg-zinc-950 flex flex-col items-center justify-between min-h-[170px] shadow-sm relative transition-all group overflow-hidden',
              )}
            >
              {slot
                ? (
                    <>
                      {/* Delete button */}
                      <button
                        onClick={() => handleRemovePokemon(index)}
                        className="absolute top-2 right-2 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      {/* Pokémon Sprite & Info */}
                      <div className="flex-1 flex flex-col items-center justify-center gap-2 mt-2 w-full">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150/40 dark:border-zinc-850 flex items-center justify-center shadow-inner">
                          <PokemonSprite icon={slot.icon} size={48} />
                        </div>
                        <span className="font-mono text-[9px] font-bold text-zinc-400">
                          No.
                          {slot.id}
                        </span>
                        <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-50 text-center truncate max-w-full px-1">
                          {translateText(slot.name, locale)}
                        </h4>
                      </div>

                      {/* Types */}
                      <div className="flex gap-1 mt-2.5">
                        {slot.types.map(type => (
                          <TypeBadge key={type} type={type} className="px-2 py-0.5 rounded text-[9px]" />
                        ))}
                      </div>
                    </>
                  )
                : (
                    <button
                      onClick={() => setActiveSlot(index)}
                      className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 w-full rounded-2xl hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 transition-all"
                    >
                      <PlusIcon className="w-6 h-6" />
                      <span className="text-[10px] font-extrabold tracking-wide uppercase">
                        {translateText('添加成员', locale)}
                      </span>
                    </button>
                  )}
            </div>
          )
        })}
      </div>

      {/* Autocomplete Search Modal Drawer */}
      {activeSlot !== null && (
        <div className="fixed inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4.5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50/20 dark:bg-zinc-900/10">
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">
                {translateText(`选择第 ${activeSlot + 1} 个成员`, locale)}
              </h3>
              <button
                onClick={() => {
                  setActiveSlot(null)
                  setSearchQuery('')
                }}
                className="p-1.5 rounded-xl hover:bg-zinc-150 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Input search */}
            <div className="p-4 border-b border-zinc-150/40 dark:border-zinc-900 bg-white dark:bg-zinc-950 relative">
              <MagnifyingGlassIcon className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <UiInput
                type="text"
                placeholder={translateText('搜索名称/英文/属性...', locale)}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 rounded-xl text-sm border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 focus-visible:ring-1 focus-visible:ring-zinc-400"
                autoFocus
              />
            </div>

            {/* List */}
            <ScrollArea className="flex-1 max-h-[50vh] p-2">
              <div className="space-y-1">
                {filteredPokemons.map(pk => (
                  <div
                    key={`${pk.id}-${pk.name}`}
                    onClick={() => handleAddPokemon(pk)}
                    className="flex items-center justify-between p-2.5 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-150 dark:hover:border-zinc-850 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-center shadow-inner">
                        <PokemonSprite icon={pk.icon} size={32} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-50 group-hover:text-red-500 transition-colors">
                          {translateText(pk.name, locale)}
                        </h4>
                        <span className="font-mono text-[9px] text-zinc-450 dark:text-zinc-500">
                          #
                          {pk.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {pk.types.map(type => (
                        <TypeBadge key={type} type={type} className="px-2 py-0.5 rounded text-[9px]" />
                      ))}
                    </div>
                  </div>
                ))}

                {filteredPokemons.length === 0 && (
                  <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-xs">
                    {translateText('未找到匹配的宝可梦', locale)}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Analysis Section */}
      {activeMembers.length > 0 && defenseReport
        ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
              {/* Vulnerabilities Summary Report */}
              <div className="lg:col-span-4 bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  {translateText('联防弱点扫描报告', locale)}
                </h3>

                {defenseReport.vulnerabilities.length > 0
                  ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {defenseReport.vulnerabilities.map((v, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/10 text-xs text-amber-700 dark:text-amber-400 font-semibold leading-relaxed flex items-start gap-2.5 shadow-sm"
                          >
                            <WarningIcon className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed flex items-start gap-2.5 shadow-sm">
                        <CheckCircleIcon className="w-5 h-5 shrink-0" />
                        <span>{translateText('超凡联防！你的队伍目前没有任何属性弱点重合或抗性真空。防守均衡度完美！', locale)}</span>
                      </div>
                    )}

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-850 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-1.5">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    {translateText('💡 联防小贴士:', locale)}
                  </span>
                  <p>
                    {translateText('1. 属性抵抗或免疫越多，代表队伍抗性轮换空间越大。', locale)}
                  </p>
                  <p>
                    {translateText('2. 若有严重弱点属性，可通过加入拥有该属性【免疫特性】或【抗性双属性】的宝可梦进行补足。', locale)}
                  </p>
                </div>
              </div>

              {/* Matrix Detail Table */}
              <div className="lg:col-span-8 bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  {translateText('全属性联防抗性矩阵', locale)}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-150 dark:border-zinc-900">
                        <th className="p-2 text-left font-bold text-zinc-400 uppercase tracking-wide">
                          {translateText('攻击属性', locale)}
                        </th>
                        {team.map((slot, i) => (
                          <th
                            key={i}
                            className="p-2 text-center font-bold text-zinc-500 dark:text-zinc-400 w-16"
                          >
                            {slot
                              ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <PokemonSprite icon={slot.icon} size={24} />
                                    <span className="text-[9px] font-bold block max-w-[60px] truncate">
                                      {translateText(slot.name, locale)}
                                    </span>
                                  </div>
                                )
                              : (
                                  <span className="text-zinc-300 dark:text-zinc-750">-</span>
                                )}
                          </th>
                        ))}
                        <th className="p-2 text-center font-bold text-zinc-400 w-14">
                          {translateText('抗性', locale)}
                        </th>
                        <th className="p-2 text-center font-bold text-zinc-400 w-14">
                          {translateText('弱点', locale)}
                        </th>
                        <th className="p-2 text-center font-bold text-zinc-450 dark:text-zinc-400 w-14">
                          {translateText('净值', locale)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {POKEMON_TYPES.map((atk) => {
                        const sum = defenseReport.typeSummaries[atk]

                        return (
                          <tr
                            key={atk}
                            className="border-b border-zinc-100/50 dark:border-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                          >
                            <td className="p-2 text-left">
                              <TypeBadge type={atk} className="px-2.5 py-0.5 rounded-lg text-[9px]" />
                            </td>
                            {team.map((slot, i) => {
                              if (!slot) {
                                return <td key={i} className="p-2 text-center text-zinc-300 dark:text-zinc-800">-</td>
                              }
                              const m = sum.multipliers[i]
                              let multText = '1'
                              let cellClass = 'text-zinc-400'

                              if (m === 2) {
                                multText = '2x'
                                cellClass = 'bg-orange-500/10 text-orange-500 font-bold rounded-lg'
                              }
                              else if (m === 4) {
                                multText = '4x'
                                cellClass = 'bg-red-500/10 text-red-500 font-extrabold rounded-lg'
                              }
                              else if (m === 0.5) {
                                multText = '½x'
                                cellClass = 'bg-emerald-500/10 text-emerald-500 font-bold rounded-lg'
                              }
                              else if (m === 0.25) {
                                multText = '¼x'
                                cellClass = 'bg-green-500/10 text-green-500 font-extrabold rounded-lg'
                              }
                              else if (m === 0) {
                                multText = '0x'
                                cellClass = 'bg-blue-500/15 text-blue-500 font-extrabold rounded-lg'
                              }

                              return (
                                <td key={i} className={cn('p-2 text-center text-[10px] transition-colors', cellClass)}>
                                  {multText}
                                </td>
                              )
                            })}
                            <td className="p-2 text-center text-emerald-500 font-extrabold">
                              {sum.resistCount > 0 ? `+${sum.resistCount}` : '0'}
                            </td>
                            <td className="p-2 text-center text-red-500 font-extrabold">
                              {sum.weakCount > 0 ? `-${sum.weakCount}` : '0'}
                            </td>
                            <td className="p-2 text-center">
                              <span
                                className={cn(
                                  'text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm',
                                  sum.netScore > 0
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : sum.netScore < 0
                                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold'
                                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400',
                                )}
                              >
                                {sum.netScore > 0 ? `+${sum.netScore}` : sum.netScore}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        : (
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 text-center shadow-sm">
              <span className="text-4xl">📋</span>
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-3">
                {translateText('请在上方槽位添加至少一只宝可梦开始分析队伍联防属性。', locale)}
              </p>
            </div>
          )}
    </div>
  )
}
