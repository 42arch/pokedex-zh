import type { PokemonDetail } from '@/services/pokemon'
import { HeartIcon, LightningIcon, ShieldIcon, SparkleIcon, SwordIcon } from '@phosphor-icons/react'
import * as React from 'react'
import { translateText } from '@/lib/chinese'
import { STATS_COLORS } from '@/lib/constants'
import { getStatName } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'
import { TypeBadge } from '../type-badge'

function getBasePointStatName(statKey: string) {
  const key = statKey.toLowerCase().replace(/[\s._-]+/g, '')
  if (key === 'hp')
    return 'HP'
  if (key === 'attack')
    return '攻击'
  if (key === 'defense')
    return '防御'
  if (key === 'specialattack' || key === 'spattack' || key === 'special_attack')
    return '特攻'
  if (key === 'specialdefense' || key === 'spdefense' || key === 'special_defense')
    return '特防'
  if (key === 'speed')
    return '速度'
  return statKey
}

interface PokemonStatsProps {
  detail: PokemonDetail
  activeForm: any
  locale: string
}

export function PokemonStats({
  detail,
  activeForm,
  locale,
}: PokemonStatsProps) {
  const [activeStatsForm, setActiveStatsForm] = React.useState(() => {
    const normal = detail.stats.find(s => s.form === '一般' || s.form === '普通' || s.form === '')
    return normal ? normal.form : (detail.stats[0]?.form || '一般')
  })
  const [activeEffForm, setActiveEffForm] = React.useState(() => {
    const normal = detail.type_effectiveness.find(e => e.form === '一般' || e.form === '普通' || e.form === '')
    return normal ? normal.form : (detail.type_effectiveness[0]?.form || '')
  })

  // Synchronize local switcher forms when detail changes
  React.useEffect(() => {
    if (detail) {
      const normalStat = detail.stats.find(s => s.form === '一般' || s.form === '普通' || s.form === '')
      setActiveStatsForm(normalStat ? normalStat.form : (detail.stats[0]?.form || '一般'))

      const normalEff = detail.type_effectiveness.find(e => e.form === '一般' || e.form === '普通' || e.form === '')
      setActiveEffForm(normalEff ? normalEff.form : (detail.type_effectiveness[0]?.form || ''))
    }
  }, [detail])

  // Find stats for active form
  const activeStatsObj = React.useMemo(() => {
    const entry = detail.stats.find(s => s.form === activeStatsForm) || detail.stats[0]
    return entry ? entry.data : { hp: '0', attack: '0', defense: '0', sp_attack: '0', sp_defense: '0', speed: '0' }
  }, [detail.stats, activeStatsForm])

  // Stat calculations
  const statsList = [
    { key: 'hp', name: 'HP', icon: HeartIcon, val: parseInt(activeStatsObj.hp, 10) || 0 },
    { key: 'attack', name: '攻击', icon: SwordIcon, val: parseInt(activeStatsObj.attack, 10) || 0 },
    { key: 'defense', name: '防御', icon: ShieldIcon, val: parseInt(activeStatsObj.defense, 10) || 0 },
    { key: 'sp_attack', name: '特攻', icon: LightningIcon, val: parseInt(activeStatsObj.sp_attack, 10) || 0 },
    { key: 'sp_defense', name: '特防', icon: SparkleIcon, val: parseInt(activeStatsObj.sp_defense, 10) || 0 },
    { key: 'speed', name: '速度', icon: LightningIcon, val: parseInt(activeStatsObj.speed, 10) || 0 },
  ]

  const statsTotal = statsList.reduce((sum, s) => sum + s.val, 0)

  // Find type effectiveness for active form
  const typeEffectiveness = React.useMemo(() => {
    const entry = detail.type_effectiveness.find(e => e.form === activeEffForm) || detail.type_effectiveness[0]
    return entry ? entry.data : []
  }, [detail.type_effectiveness, activeEffForm])

  // Group type effectiveness by damage multiplier
  const effectivenessGroups = React.useMemo(() => {
    const groups: Record<string, string[]> = {
      4: [],
      2: [],
      1: [],
      0.5: [],
      0.25: [],
      0: [],
    }
    typeEffectiveness.forEach((item) => {
      if (groups[item.damage] !== undefined) {
        groups[item.damage].push(item.type)
      }
    })
    return groups
  }, [typeEffectiveness])

  return (
    <div className="space-y-4">
      {/* 3. 基础种族值 */}
      <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-2">
          <h3 className="font-bold text-base tracking-tight">
            {translateText('基础种族值', locale)}
          </h3>
          {detail.stats.length > 1 && (
            <div className="flex flex-wrap gap-1 p-1 bg-zinc-150/40 dark:bg-zinc-900/40 rounded-xl w-fit">
              {detail.stats.map(s => (
                <button
                  key={s.form}
                  onClick={() => setActiveStatsForm(s.form)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none',
                    activeStatsForm === s.form
                      ? 'bg-red-500 text-red-foreground shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                  )}
                >
                  {translateText(s.form || '一般', locale)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3.5 max-w-2xl">
          {statsList.map((stat) => {
            const percent = Math.min(100, (stat.val / 255) * 100)
            const statColor = STATS_COLORS[stat.key as keyof typeof STATS_COLORS] || '#888888'
            const statName = getStatName(stat.key, locale)

            return (
              <div key={stat.key} className="flex items-center gap-3 text-sm">
                <span className="w-14 font-semibold text-zinc-550 dark:text-zinc-400">
                  {statName}
                </span>
                <span className="w-8 font-mono font-bold text-right text-zinc-900 dark:text-zinc-100">
                  {stat.val}
                </span>
                <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden shadow-inner border border-zinc-200/20 dark:border-zinc-800/20">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%`, backgroundColor: statColor }}
                  />
                </div>
              </div>
            )
          })}

          <div className="flex items-center gap-3 pt-3.5 border-t border-zinc-100 dark:border-zinc-900 text-sm">
            <span className="w-14 font-bold text-zinc-800 dark:text-zinc-200">
              {translateText('总和', locale)}
            </span>
            <span className="w-8 font-mono font-black text-right text-zinc-955 dark:text-zinc-50 text-base">
              {statsTotal}
            </span>
            <div className="flex-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 text-right pr-2">
              {translateText('满分为 1530 (理论上限)', locale)}
            </div>
          </div>
        </div>
      </div>

      {/* 取得基础点数 */}
      {activeForm.base_points && activeForm.base_points.length > 0 && (
        <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-3">
          <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
            <h3 className="font-bold text-base tracking-tight">
              {translateText('取得基础点数', locale)}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {translateText('击败该宝可梦后，同行宝可梦可获得的基础点数（努力值）', locale)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {activeForm.base_points.map((bp: any, idx: number) => {
              const displayName = getBasePointStatName(bp.stat)
              const lowerStat = bp.stat.toLowerCase().replace(/[\s._-]+/g, '')

              let normalizedKey: keyof typeof STATS_COLORS = 'hp'
              if (lowerStat === 'hp')
                normalizedKey = 'hp'
              else if (lowerStat === 'attack')
                normalizedKey = 'attack'
              else if (lowerStat === 'defense')
                normalizedKey = 'defense'
              else if (lowerStat === 'specialattack' || lowerStat === 'spattack' || lowerStat === 'special_attack' || lowerStat === 'sp_attack')
                normalizedKey = 'sp_attack'
              else if (lowerStat === 'specialdefense' || lowerStat === 'spdefense' || lowerStat === 'special_defense' || lowerStat === 'sp_defense')
                normalizedKey = 'sp_defense'
              else if (lowerStat === 'speed')
                normalizedKey = 'speed'

              const statColor = STATS_COLORS[normalizedKey] || '#888888'

              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 rounded-xl border font-bold text-xs shadow-sm"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${statColor} 8%, transparent)`,
                    borderColor: `color-mix(in srgb, ${statColor} 20%, transparent)`,
                    color: statColor,
                  }}
                >
                  <span>{translateText(displayName, locale)}</span>
                  <span
                    className="font-mono text-[11px] px-1.5 py-0.5 rounded font-black"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${statColor} 12%, transparent)`,
                    }}
                  >
                    +
                    {bp.value}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Divider */}
          <div className="border-t border-zinc-100 dark:border-zinc-900/60 my-2" />

          {/* 显示基础经验值和对战经验值 */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {translateText('基础经验值', locale)}
              </span>
              <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                {activeForm.base_exp || '-'}
              </p>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {translateText('对战经验值', locale)}
              </span>
              <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                {activeForm.battle_exp || '-'}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 属性相性 */}
      <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-base tracking-tight">
              {translateText('属性相性', locale)}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {translateText('显示该宝可梦防守时，遭受不同属性攻击的伤害倍数', locale)}
            </p>
          </div>
          {detail.type_effectiveness.length > 1 && (
            <div className="flex flex-wrap gap-1 p-1 bg-zinc-150/40 dark:bg-zinc-900/40 rounded-xl w-fit">
              {detail.type_effectiveness.map(e => (
                <button
                  key={e.form}
                  onClick={() => setActiveEffForm(e.form)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none',
                    activeEffForm === e.form
                      ? 'bg-red-500 text-red-foreground shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                  )}
                >
                  {translateText(e.form || '一般', locale)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {[
            { label: '4 倍伤害 (极度致命)', multiplier: '4', color: 'bg-red-500/10 border-red-500/25 text-red-500 dark:text-red-400' },
            { label: '2 倍伤害 (弱点克制)', multiplier: '2', color: 'bg-orange-500/10 border-orange-500/25 text-orange-500 dark:text-orange-400' },
            { label: '0.5 倍伤害 (微弱抵抗)', multiplier: '0.5', color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500 dark:text-emerald-400' },
            { label: '0.25 倍伤害 (极强抵抗)', multiplier: '0.25', color: 'bg-teal-500/10 border-teal-500/25 text-teal-500 dark:text-teal-400' },
            { label: '0 倍伤害 (免受伤害/免疫)', multiplier: '0', color: 'bg-zinc-500/10 border-zinc-500/25 text-zinc-500 dark:text-zinc-400' },
          ].map((group) => {
            const list = effectivenessGroups[group.multiplier]
            if (!list || list.length === 0)
              return null

            return (
              <div
                key={group.multiplier}
                className={cn(
                  'p-4 rounded-2xl border flex flex-col md:flex-row md:items-center gap-3.5 transition-all duration-200 shadow-sm',
                  group.color,
                )}
              >
                <span className="font-black text-xs md:text-sm tracking-tight w-40 shrink-0">
                  {translateText(group.label, locale)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {list.map(type => (
                    <TypeBadge key={type} type={type} className="px-3 py-1 rounded-full" />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Normal damage types */}
          <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col md:flex-row md:items-center gap-3.5">
            <span className="font-bold text-xs md:text-sm tracking-tight w-40 shrink-0 text-zinc-500 dark:text-zinc-400">
              {translateText('1 倍伤害 (一般效果)', locale)}
            </span>
            <div className="flex flex-wrap gap-2">
              {effectivenessGroups['1']?.map(type => (
                <TypeBadge key={type} type={type} className="px-3 py-1 rounded-full" />
              )) || <span className="text-zinc-400 text-xs font-bold">-</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
