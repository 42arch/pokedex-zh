'use client'

import { ShieldIcon, SwordIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import * as React from 'react'
import { translateText } from '@/lib/chinese'
import { getTypeColor } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'
import { TypeBadge, TypeIcon } from '../type-badge'

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

export function TypeMatchupCalc() {
  const locale = useLocale()
  const [mode, setMode] = React.useState<'defending' | 'attacking'>('defending')

  // Defending Mode States
  const [defTypes, setDefTypes] = React.useState<PokemonType[]>([])

  // Attacking Mode States
  const [atkType, setAtkType] = React.useState<PokemonType | null>(null)

  const handleDefTypeClick = (type: PokemonType) => {
    if (defTypes.includes(type)) {
      setDefTypes(defTypes.filter(t => t !== type))
    }
    else {
      if (defTypes.length < 2) {
        setDefTypes([...defTypes, type])
      }
      else {
        // Replace the second type
        setDefTypes([defTypes[0], type])
      }
    }
  }

  // Calculate Defensive Matchup Results
  const defResults = React.useMemo(() => {
    if (defTypes.length === 0)
      return null

    const results: Record<number, PokemonType[]> = {
      4: [],
      2: [],
      1: [],
      0.5: [],
      0.25: [],
      0: [],
    }

    POKEMON_TYPES.forEach((atk) => {
      let multiplier = 1
      defTypes.forEach((def) => {
        multiplier *= typeMatchups[atk][def]
      })
      results[multiplier]?.push(atk)
    })

    return results
  }, [defTypes])

  // Calculate Attacking Matchup Results
  const atkResults = React.useMemo(() => {
    if (!atkType)
      return null

    const results: Record<number, PokemonType[]> = {
      2: [],
      1: [],
      0.5: [],
      0: [],
    }

    POKEMON_TYPES.forEach((def) => {
      const multiplier = typeMatchups[atkType][def]
      results[multiplier]?.push(def)
    })

    return results
  }, [atkType])

  return (
    <div className="space-y-6">
      {/* Mode Switches */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 max-w-md">
        <button
          onClick={() => setMode('defending')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
            mode === 'defending'
              ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300',
          )}
        >
          {translateText('防守端属性克制分析', locale)}
        </button>
        <button
          onClick={() => setMode('attacking')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
            mode === 'attacking'
              ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300',
          )}
        >
          {translateText('攻击端属性克制分析', locale)}
        </button>
      </div>

      {mode === 'defending'
        ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Types Selection Panel */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4 shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {translateText('选择防守方属性 (最多两个)', locale)}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {translateText('点击属性选择或取消，查看当前属性组合受到的伤害倍数。', locale)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {POKEMON_TYPES.map((type) => {
                    const isSelected = defTypes.includes(type)
                    const typeColor = getTypeColor(type)

                    return (
                      <button
                        key={type}
                        onClick={() => handleDefTypeClick(type)}
                        className={cn(
                          'py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all shadow-sm flex items-center justify-center gap-1.5',
                          isSelected
                            ? 'text-white border-transparent shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/80',
                        )}
                        style={isSelected ? { backgroundColor: typeColor } : undefined}
                      >
                        <TypeIcon type={type} className="scale-[0.8]" />
                        <span>{translateText(type, locale)}</span>
                      </button>
                    )
                  })}
                </div>

                {defTypes.length > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                        {translateText('已选择:', locale)}
                      </span>
                      <div className="flex gap-1.5">
                        {defTypes.map(type => (
                          <TypeBadge key={type} type={type} className="px-2 py-0.5 rounded-lg text-[9px]" />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setDefTypes([])}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      {translateText('重置', locale)}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-6 shadow-sm min-h-[300px] flex flex-col justify-center">
                {defResults
                  ? (
                      <div className="space-y-4.5">
                        <h4 className="font-extrabold text-sm border-b border-zinc-150 dark:border-zinc-900 pb-2">
                          {translateText('受到的克制倍数', locale)}
                        </h4>

                        {([
                          { multiplier: 4, label: '4x 双倍克制 (极高伤害)', class: 'bg-red-500/10 dark:bg-red-500/25 border-red-500/10 text-red-500' },
                          { multiplier: 2, label: '2x 属性克制 (高伤害)', class: 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/10 text-orange-500' },
                          { multiplier: 1, label: '1x 常规伤害', class: 'bg-zinc-100/50 dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400' },
                          { multiplier: 0.5, label: '0.5x 属性抵抗 (低伤害)', class: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/10 text-emerald-500' },
                          { multiplier: 0.25, label: '0.25x 双倍抵抗 (极低伤害)', class: 'bg-green-500/10 dark:bg-green-500/25 border-green-500/10 text-green-500' },
                          { multiplier: 0, label: '0x 属性免疫 (无伤害)', class: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/10 text-blue-500' },
                        ] as const).map(({ multiplier, label, class: containerClass }) => {
                          const list = defResults[multiplier] || []
                          if (list.length === 0)
                            return null

                          return (
                            <div
                              key={multiplier}
                              className={cn('p-3.5 rounded-2xl border flex flex-col gap-2 shadow-sm', containerClass)}
                            >
                              <span className="text-[11px] font-bold tracking-wide uppercase">
                                {translateText(label, locale)}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {list.map(t => (
                                  <TypeBadge key={t} type={t} className="px-2 py-0.5 rounded-lg text-[9px]" />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  : (
                      <div className="text-center py-8">
                        <ShieldIcon className="mx-auto w-10 h-10 text-muted-foreground/45" weight="duotone" />
                        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-2.5">
                          {translateText('请在左侧选择防守宝可梦的属性来查看属性相克分析。', locale)}
                        </p>
                      </div>
                    )}
              </div>
            </div>
          )
        : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Attacking Selection Panel */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4 shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {translateText('选择攻击方属性', locale)}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {translateText('点击属性选择攻击属性，查看对不同防守属性的克制系数。', locale)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {POKEMON_TYPES.map((type) => {
                    const isSelected = atkType === type
                    const typeColor = getTypeColor(type)

                    return (
                      <button
                        key={type}
                        onClick={() => setAtkType(type)}
                        className={cn(
                          'py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all shadow-sm flex items-center justify-center gap-1.5',
                          isSelected
                            ? 'text-white border-transparent shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/80',
                        )}
                        style={isSelected ? { backgroundColor: typeColor } : undefined}
                      >
                        <TypeIcon type={type} className="scale-[0.8]" />
                        <span>{translateText(type, locale)}</span>
                      </button>
                    )
                  })}
                </div>

                {atkType && (
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                        {translateText('已选择:', locale)}
                      </span>
                      <TypeBadge type={atkType} className="px-2 py-0.5 rounded-lg text-[9px]" />
                    </div>

                    <button
                      onClick={() => setAtkType(null)}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      {translateText('重置', locale)}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-6 shadow-sm min-h-[300px] flex flex-col justify-center">
                {atkResults
                  ? (
                      <div className="space-y-4.5">
                        <h4 className="font-extrabold text-sm border-b border-zinc-150 dark:border-zinc-900 pb-2">
                          {translateText('对不同防守属性的克制效果', locale)}
                        </h4>

                        {([
                          { multiplier: 2, label: '2.0x 效果绝佳 (双倍伤害)', class: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/10 text-emerald-500' },
                          { multiplier: 1, label: '1.0x 效果一般 (常规伤害)', class: 'bg-zinc-100/50 dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400' },
                          { multiplier: 0.5, label: '0.5x 效果不佳 (减半伤害)', class: 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/10 text-orange-500' },
                          { multiplier: 0, label: '0.0x 毫无效果 (没有伤害)', class: 'bg-red-500/10 dark:bg-red-500/20 border-red-500/10 text-red-500' },
                        ] as const).map(({ multiplier, label, class: containerClass }) => {
                          const list = atkResults[multiplier] || []
                          if (list.length === 0)
                            return null

                          return (
                            <div
                              key={multiplier}
                              className={cn('p-3.5 rounded-2xl border flex flex-col gap-2 shadow-sm', containerClass)}
                            >
                              <span className="text-[11px] font-bold tracking-wide uppercase">
                                {translateText(label, locale)}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {list.map(t => (
                                  <TypeBadge key={t} type={t} className="px-2 py-0.5 rounded-lg text-[9px]" />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  : (
                      <div className="text-center py-8">
                        <SwordIcon className="mx-auto w-10 h-10 text-muted-foreground/45" weight="duotone" />
                        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-2.5">
                          {translateText('请在左侧选择攻击招式的属性来查看属性打击效果分析。', locale)}
                        </p>
                      </div>
                    )}
              </div>
            </div>
          )}
    </div>
  )
}
