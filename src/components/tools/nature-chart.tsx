'use client'

import { ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import * as React from 'react'
import { Input as UiInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { cn } from '@/lib/utils'

interface Nature {
  name_zh: string
  name_en: string
  name_ja: string
  up: string | null
  down: string | null
  description: string
}

const STAT_LABELS: Record<string, string> = {
  attack: '攻击',
  defense: '防御',
  sp_attack: '特攻',
  sp_defense: '特防',
  speed: '速度',
}

const STAT_KEYS = ['attack', 'defense', 'sp_attack', 'sp_defense', 'speed'] as const

const NATURES: Nature[] = [
  { name_zh: '固执', name_en: 'Adamant', name_ja: 'いじっぱり', up: 'attack', down: 'sp_attack', description: '适合物理输出手，牺牲无用的特攻提升物攻。' },
  { name_zh: '爽朗', name_en: 'Jolly', name_ja: 'ようき', up: 'speed', down: 'sp_attack', description: '适合速攻物理输出手，优先拉满速度。' },
  { name_zh: '内敛', name_en: 'Modest', name_ja: 'ひかえめ', up: 'sp_attack', down: 'attack', description: '适合特攻输出手，牺牲物攻提升特攻。' },
  { name_zh: '胆小', name_en: 'Timid', name_ja: 'おくびょう', up: 'speed', down: 'attack', description: '适合速攻特攻输出手，优先拉满速度。' },
  { name_zh: '顽皮', name_en: 'Naughty', name_ja: 'やんちゃ', up: 'attack', down: 'sp_defense', description: '双刀手或特定战术可用，牺牲特防加物攻。' },
  { name_zh: '怕寂寞', name_en: 'Lonely', name_ja: 'さみしがり', up: 'attack', down: 'defense', description: '较少使用，牺牲物防提升物攻。' },
  { name_zh: '勇敢', name_en: 'Brave', name_ja: 'ゆうかん', up: 'attack', down: 'speed', description: '适合空间队物理输出手，降低速度以在空间下先手。' },
  { name_zh: '大胆', name_en: 'Bold', name_ja: 'ずぶとい', up: 'defense', down: 'attack', description: '适合物防盾牌，减少混乱及欺诈伤害。' },
  { name_zh: '淘气', name_en: 'Impish', name_ja: 'わんぱく', up: 'defense', down: 'sp_attack', description: '适合纯物理坦克，牺牲特攻增加物防。' },
  { name_zh: '乐天', name_en: 'Lax', name_ja: 'のうてんき', up: 'defense', down: 'sp_defense', description: '较少使用，牺牲特防提升物防。' },
  { name_zh: '悠闲', name_en: 'Relaxed', name_ja: 'のんき', up: 'defense', down: 'speed', description: '适合空间队物防坦克或双防手。' },
  { name_zh: '慢吞吞', name_en: 'Mild', name_ja: 'おっとり', up: 'sp_attack', down: 'defense', description: '较少使用，牺牲物防增加特攻。' },
  { name_zh: '马虎', name_en: 'Rash', name_ja: 'うっかりや', up: 'sp_attack', down: 'sp_defense', description: '双刀手可用，牺牲特防增加特攻。' },
  { name_zh: '冷静', name_en: 'Quiet', name_ja: 'れいせい', up: 'sp_attack', down: 'speed', description: '适合空间队特攻输出手，降低速度。' },
  { name_zh: '温和', name_en: 'Calm', name_ja: 'おだやか', up: 'sp_defense', down: 'attack', description: '适合特防特化盾牌，减少物攻以防混乱和欺诈伤害。' },
  { name_zh: '慎重', name_en: 'Careful', name_ja: 'しんちょう', up: 'sp_defense', down: 'sp_attack', description: '适合特防坦克，牺牲无用的特攻增加特防。' },
  { name_zh: '温顺', name_en: 'Gentle', name_ja: 'おとなしい', up: 'sp_defense', down: 'defense', description: '较少使用，牺牲物防提升特防。' },
  { name_zh: '自大', name_en: 'Sassy', name_ja: 'なまいき', up: 'sp_defense', down: 'speed', description: '适合空间队特防盾牌，降低速度。' },
  { name_zh: '急躁', name_en: 'Hasty', name_ja: 'せっかち', up: 'speed', down: 'defense', description: '双刀速攻手可用，犧牲物防以提速。' },
  { name_zh: '天真', name_en: 'Naive', name_ja: 'むじゃき', up: 'speed', down: 'sp_defense', description: '双刀速攻手常用，牺牲特防提升速度。' },
  { name_zh: '认真', name_en: 'Serious', name_ja: 'まじめ', up: null, down: null, description: '平衡性格，无任何属性修正。' },
  { name_zh: '坦率', name_en: 'Docile', name_ja: 'すなお', up: null, down: null, description: '平衡性格，无任何属性修正。' },
  { name_zh: '羞涩', name_en: 'Bashful', name_ja: 'てれや', up: null, down: null, description: '平衡性格，无任何属性修正。' },
  { name_zh: '勤奋', name_en: 'Hardy', name_ja: 'がんばりや', up: null, down: null, description: '平衡性格，无任何属性修正。' },
  { name_zh: '实干', name_en: 'Quirky', name_ja: 'きまぐれ', up: null, down: null, description: '平衡性格，无任何属性修正。' },
]

export function NatureChart() {
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [hoveredNature, setHoveredNature] = React.useState<Nature | null>(null)

  // Filter list of natures
  const filteredNatures = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q)
      return NATURES
    return NATURES.filter((nature) => {
      const upLabel = nature.up ? translateText(STAT_LABELS[nature.up] || '', locale) : ''
      const downLabel = nature.down ? translateText(STAT_LABELS[nature.down] || '', locale) : ''
      return (
        nature.name_zh.toLowerCase().includes(q)
        || nature.name_en.toLowerCase().includes(q)
        || nature.name_ja.toLowerCase().includes(q)
        || upLabel.includes(q)
        || downLabel.includes(q)
      )
    })
  }, [searchQuery, locale])

  // Get nature in matrix cell
  const getMatrixNature = (upStat: string, downStat: string): Nature | undefined => {
    return NATURES.find(n => n.up === upStat && n.down === downStat)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <UiInput
          type="text"
          placeholder={translateText('搜索性格名称/影响属性 (e.g. 攻击, 固执)...', locale)}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 py-2 rounded-xl text-sm border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 focus-visible:ring-1 focus-visible:ring-zinc-400 shadow-sm"
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

      {/* Grid Layout containing Matrix & Search results */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* Matrix Visualization */}
        <div className="xl:col-span-7 bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {translateText('性格修正矩阵', locale)}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {translateText('横轴为降低属性 (0.9x)，纵轴为提升属性 (1.1x)。鼠标悬停单元格查看性格详情。', locale)}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-2 border-b border-r border-zinc-200 dark:border-zinc-800 font-bold bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-400">
                    {translateText('提\\降', locale)}
                  </th>
                  {STAT_KEYS.map(key => (
                    <th
                      key={key}
                      className="p-2 border-b border-zinc-200 dark:border-zinc-800 font-bold text-red-500/90 dark:text-red-400/90 bg-red-500/5 dark:bg-red-500/10 text-center"
                    >
                      -
                      {translateText(STAT_LABELS[key], locale)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STAT_KEYS.map(upKey => (
                  <tr key={upKey}>
                    <td className="p-2 border-r border-zinc-200 dark:border-zinc-800 font-bold text-emerald-500/90 dark:text-emerald-400/90 bg-emerald-500/5 dark:bg-emerald-500/10 text-center">
                      +
                      {translateText(STAT_LABELS[upKey], locale)}
                    </td>
                    {STAT_KEYS.map((downKey) => {
                      const nature = getMatrixNature(upKey, downKey)
                      const isNeutral = upKey === downKey
                      const cellName = isNeutral
                        ? (upKey === 'attack' ? '认真' : upKey === 'defense' ? '坦率' : upKey === 'sp_attack' ? '羞涩' : upKey === 'sp_defense' ? '勤奋' : '实干')
                        : nature?.name_zh || ''

                      const actualNature = isNeutral
                        ? NATURES.find(n => n.name_zh === cellName)
                        : nature

                      const isSelected = hoveredNature?.name_zh === cellName

                      return (
                        <td
                          key={downKey}
                          onMouseEnter={() => actualNature && setHoveredNature(actualNature)}
                          onMouseLeave={() => setHoveredNature(null)}
                          className={cn(
                            'p-2.5 border border-zinc-200 dark:border-zinc-800 text-center cursor-pointer transition-all font-bold rounded-md',
                            isNeutral
                              ? 'bg-zinc-50/40 dark:bg-zinc-900/10 text-zinc-400 dark:text-zinc-500'
                              : 'bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900',
                            isSelected && 'ring-2 ring-zinc-900 dark:ring-zinc-100 z-10 scale-[1.03] bg-zinc-50 dark:bg-zinc-900 shadow-sm',
                          )}
                        >
                          {translateText(cellName, locale)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hover detail card inside selector */}
          <div className="h-24 flex items-center justify-center p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-900/50">
            {hoveredNature
              ? (
                  <div className="w-full text-center space-y-1 animate-in fade-in duration-150">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">
                      {translateText(hoveredNature.name_zh, locale)}
                      {' '}
                      (
                      {hoveredNature.name_en}
                      {' '}
                      ·
                      {hoveredNature.name_ja}
                      )
                    </h4>
                    <div className="flex justify-center items-center gap-3 text-xs font-bold">
                      {hoveredNature.up
                        ? (
                            <>
                              <span className="flex items-center gap-0.5 text-emerald-500">
                                <ArrowUpIcon className="w-3.5 h-3.5" />
                                {translateText(STAT_LABELS[hoveredNature.up] || '', locale)}
                                {' '}
                                (+10%)
                              </span>
                              <span className="flex items-center gap-0.5 text-red-500">
                                <ArrowDownIcon className="w-3.5 h-3.5" />
                                {translateText(STAT_LABELS[hoveredNature.down || ''] || '', locale)}
                                {' '}
                                (-10%)
                              </span>
                            </>
                          )
                        : (
                            <span className="text-zinc-400 dark:text-zinc-500">
                              {translateText('平衡修正 (无属性增减)', locale)}
                            </span>
                          )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
                      {translateText(hoveredNature.description, locale)}
                    </p>
                  </div>
                )
              : (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
                    {translateText('将鼠标悬停在矩阵格子上查看详细属性影响', locale)}
                  </span>
                )}
          </div>
        </div>

        {/* Detailed Search List */}
        <div className="xl:col-span-5 bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-3.5 max-h-[580px] overflow-hidden flex flex-col">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
            <span>{translateText('全部性格列表', locale)}</span>
            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              {filteredNatures.length}
              {' '}
              / 25
            </span>
          </h3>

          <ScrollArea className="flex-1 pr-1.5">
            <div className="space-y-2">
              {filteredNatures.map(nature => (
                <div
                  key={nature.name_zh}
                  className="p-3.5 rounded-2xl border border-zinc-150/40 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 flex flex-col gap-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                        {translateText(nature.name_zh, locale)}
                      </h4>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                        {nature.name_en}
                        {' '}
                        ·
                        {nature.name_ja}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      {nature.up
                        ? (
                            <>
                              <span className="flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/25 text-emerald-500 border border-emerald-500/10">
                                +
                                {translateText(STAT_LABELS[nature.up] || '', locale)}
                              </span>
                              <span className="flex items-center px-1.5 py-0.5 rounded bg-red-500/10 dark:bg-red-500/25 text-red-500 border border-red-500/10">
                                -
                                {translateText(STAT_LABELS[nature.down || ''] || '', locale)}
                              </span>
                            </>
                          )
                        : (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                              {translateText('平衡', locale)}
                            </span>
                          )}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-650 dark:text-zinc-400 font-semibold leading-relaxed">
                    {translateText(nature.description, locale)}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  )
}
