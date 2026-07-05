'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { HeartIcon, SwordIcon, ShieldIcon, LightningIcon, SparkleIcon, InfoIcon } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PokemonDetail } from '@/services/pokemon'
import { translateText } from '@/lib/chinese'
import { getTypeColor, getTypeGradient, getStatColor, getStatName } from '@/lib/pokemon-helpers'
import { TypeBadge, CategoryBadge } from './type-badge'
import { cn } from '@/lib/utils'

interface PokemonDetailProps {
  detail: PokemonDetail
}

export function PokemonDetailView({ detail }: PokemonDetailProps) {
  const router = useRouter()
  const locale = useLocale()

  // State
  const [activeFormIndex, setActiveFormIndex] = React.useState(0)

  // Computed Values
  const activeForm = detail.forms[activeFormIndex] || detail.forms[0]
  
  // Find stats for active form
  const activeStatsObj = React.useMemo(() => {
    // try to find by form name
    let statEntry = detail.stats.find(s => s.form === activeForm.name)
    if (!statEntry) {
      // fallback to first
      statEntry = detail.stats[0]
    }
    return statEntry ? statEntry.data : { hp: '0', attack: '0', defense: '0', sp_attack: '0', sp_defense: '0', speed: '0' }
  }, [detail, activeForm])

  // Stat calculations
  const statsList = [
    { key: 'hp', name: 'HP', icon: HeartIcon, val: parseInt(activeStatsObj.hp, 10) || 0 },
    { key: 'attack', name: '攻击', icon: SwordIcon, val: parseInt(activeStatsObj.attack, 10) || 0 },
    { key: 'defense', name: '防御', icon: ShieldIcon, val: parseInt(activeStatsObj.defense, 10) || 0 },
    { key: 'sp_attack', name: '特攻', icon: LightningIcon, val: parseInt(activeStatsObj.sp_attack, 10) || 0 },
    { key: 'sp_defense', name: '特防', icon: SparkleIcon, val: parseInt(activeStatsObj.sp_defense, 10) || 0 },
    { key: 'speed', name: '速度', icon: LightningIcon, val: parseInt(activeStatsObj.speed, 10) || 0 }, // Wait, LightningIcon or Timer or Arrow
  ]

  const statsTotal = statsList.reduce((sum, s) => sum + s.val, 0)

  // Find type effectiveness for active form
  const typeEffectiveness = React.useMemo(() => {
    let effEntry = detail.type_effectiveness.find(e => e.form === activeForm.name)
    if (!effEntry) {
      effEntry = detail.type_effectiveness[0]
    }
    return effEntry ? effEntry.data : []
  }, [detail, activeForm])

  // Group type effectiveness by damage multiplier
  const effectivenessGroups = React.useMemo(() => {
    const groups: Record<string, string[]> = {
      '4': [],
      '2': [],
      '1': [],
      '0.5': [],
      '0.25': [],
      '0': []
    }
    typeEffectiveness.forEach(item => {
      if (groups[item.damage] !== undefined) {
        groups[item.damage].push(item.type)
      }
    })
    return groups
  }, [typeEffectiveness])

  // Translate types
  const translatedTypes = activeForm.types.map(t => translateText(t, locale))

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* 1. Profile Header Card */}
      <div 
        className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 transition-all duration-300"
        style={{ background: getTypeGradient(activeForm.types) }}
      >
        {/* Glassmorphic overlay blur */}
        <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl -z-10" />

        {/* Floating background Poke Ball */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 text-black/[0.03] dark:text-white/[0.02] pointer-events-none -z-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>

        {/* Pokemon Image Section */}
        <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-72">
          <div className="relative flex items-center justify-center w-52 h-52 md:w-60 md:h-60 rounded-full bg-white/20 dark:bg-black/10 shadow-inner group hover:scale-[1.02] transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/data/images/official/${activeForm.image}`}
              alt={detail.name_zh}
              className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-xl select-none group-hover:rotate-2 transition-transform duration-300"
              onError={(e) => {
                // fallback to default image if error
                e.currentTarget.src = `/data/images/official/${activeForm.image}`
              }}
            />
          </div>
        </div>

        {/* Name and Basic details */}
        <div className="flex-1 text-center md:text-left space-y-3.5 w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="font-mono text-sm md:text-base font-bold bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full text-zinc-700 dark:text-zinc-300 shadow-sm">
              #{detail.pokedex_id}
            </span>
            <div className="flex gap-1.5">
              {activeForm.types.map((type) => (
                <TypeBadge key={type} type={type} className="px-3.5 py-1 rounded-full border border-white/10 text-xs" />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
              {translateText(detail.name_zh, locale)}
            </h1>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {detail.name_en} · {detail.name_ja}
            </p>
          </div>

          <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300 bg-white/40 dark:bg-black/10 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-inner">
            {translateText(detail.description, locale)}
          </p>

          {/* Form switch buttons (if multiple forms exist) */}
          {detail.forms.length > 1 && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {translateText('不同形态', locale)}
              </label>
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                {detail.forms.map((form, idx) => (
                  <button
                    key={form.name}
                    onClick={() => setActiveFormIndex(idx)}
                    className={cn(
                      'px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer',
                      activeFormIndex === idx
                        ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 border-transparent shadow-md'
                        : 'bg-white/70 dark:bg-zinc-900/70 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                    )}
                  >
                    {translateText(form.name, locale)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Detail Tabs (Stats, Profile, Matchups, Moves, Pokedex) */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full grid grid-cols-5 rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 h-11 shrink-0 overflow-x-auto">
          <TabsTrigger value="stats" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('能力值', locale)}</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('属性资料', locale)}</TabsTrigger>
          <TabsTrigger value="effectiveness" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('相克表', locale)}</TabsTrigger>
          <TabsTrigger value="evolution" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('进化链', locale)}</TabsTrigger>
          <TabsTrigger value="moves" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('招式表', locale)}</TabsTrigger>
        </TabsList>

        {/* Ability Stats Tab */}
        <TabsContent value="stats" className="mt-4 focus-visible:outline-none">
          <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div className="space-y-4">
              <h3 className="font-bold text-base tracking-tight border-b border-zinc-100 dark:border-zinc-900 pb-2">
                {translateText('基础种族值', locale)}
              </h3>
              <div className="space-y-3.5">
                {statsList.map((stat) => {
                  const percent = Math.min(100, (stat.val / 255) * 100)
                  const barColorClass = getStatColor(stat.key)
                  const statName = getStatName(stat.key, locale)

                  return (
                    <div key={stat.key} className="flex items-center gap-3 text-sm">
                      <span className="w-14 font-semibold text-zinc-500 dark:text-zinc-400">
                        {statName}
                      </span>
                      <span className="w-8 font-mono font-bold text-right text-zinc-900 dark:text-zinc-100">
                        {stat.val}
                      </span>
                      <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden shadow-inner border border-zinc-200/20 dark:border-zinc-800/20">
                        <div 
                          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColorClass)}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                
                <div className="flex items-center gap-3 pt-3.5 border-t border-zinc-100 dark:border-zinc-900 text-sm">
                  <span className="w-14 font-bold text-zinc-800 dark:text-zinc-200">
                    {translateText('总和', locale)}
                  </span>
                  <span className="w-8 font-mono font-black text-right text-zinc-950 dark:text-zinc-50 text-base">
                    {statsTotal}
                  </span>
                  <div className="flex-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 text-right pr-2">
                    {translateText('满分为 1530 (理论上限)', locale)}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Intro Description */}
            <div className="space-y-4">
              <h3 className="font-bold text-base tracking-tight border-b border-zinc-100 dark:border-zinc-900 pb-2">
                {translateText('生态与习性', locale)}
              </h3>
              <ScrollArea className="h-64 pr-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-medium pr-1">
                  {translateText(detail.profile, locale)}
                </p>
                {detail.prototype && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                      {translateText('设计原型与出处', locale)}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed whitespace-pre-line font-medium">
                      {translateText(detail.prototype, locale)}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        {/* Profile info Tab */}
        <TabsContent value="profile" className="mt-4 focus-visible:outline-none">
          <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            
            {/* Left Parameters */}
            <div className="space-y-4">
              <h3 className="font-bold text-base tracking-tight border-b border-zinc-100 dark:border-zinc-900 pb-2">
                {translateText('基础属性', locale)}
              </h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
                <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('分类', locale)}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{translateText(activeForm.category, locale)}</p>
                </div>
                <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('体色', locale)}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{translateText(activeForm.color, locale)}</p>
                </div>
                <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('身高', locale)}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{activeForm.height}</p>
                </div>
                <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('体重', locale)}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{activeForm.weight}</p>
                </div>
                <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('捕获率', locale)}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{translateText(activeForm.catch_rate, locale)}</p>
                </div>
                <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('基础经验值', locale)}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{activeForm.base_exp}</p>
                </div>
              </div>
            </div>

            {/* Right Parameters (Abilities, breeding) */}
            <div className="space-y-4">
              <h3 className="font-bold text-base tracking-tight border-b border-zinc-100 dark:border-zinc-900 pb-2">
                {translateText('特性与培育', locale)}
              </h3>
              
              <div className="space-y-3.5 text-sm">
                
                {/* Abilities */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('特性', locale)}</span>
                  <div className="flex flex-col gap-2">
                    {activeForm.abilities.map((ability) => {
                      const translatedAbility = translateText(ability.name, locale)
                      return (
                        <div key={ability.name} className="flex items-center justify-between">
                          <Link 
                            href={`/abilities?name=${encodeURIComponent(ability.name)}`}
                            className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"
                          >
                            {translatedAbility}
                            <InfoIcon className="w-3.5 h-3.5 opacity-60" />
                          </Link>
                          {ability.is_hidden && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                              {translateText('隐藏特性', locale)}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Breeding Parameters */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('蛋群', locale)}</span>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">
                      {activeForm.egg_groups.map(g => translateText(g, locale)).join(', ')}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('孵化周期', locale)}</span>
                    <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      {translateText(activeForm.egg_cycles, locale)}
                    </p>
                  </div>
                </div>

                {/* Gender Ratio */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('性别比例', locale)}</span>
                  {typeof activeForm.gender_ratio === 'object' ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-sky-500">{translateText('雄性', locale)} {activeForm.gender_ratio.male}%</span>
                        <span className="text-pink-500">{translateText('雌性', locale)} {activeForm.gender_ratio.female}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden flex shadow-inner border border-zinc-200/20 dark:border-zinc-800/20">
                        <div className="bg-sky-400 h-full" style={{ width: `${activeForm.gender_ratio.male}%` }} />
                        <div className="bg-pink-400 h-full" style={{ width: `${activeForm.gender_ratio.female}%` }} />
                      </div>
                    </div>
                  ) : (
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{translateText(activeForm.gender_ratio || '无性别', locale)}</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </TabsContent>

        {/* Type Effectiveness Tab */}
        <TabsContent value="effectiveness" className="mt-4 focus-visible:outline-none">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base tracking-tight">
                {translateText('属性受性效果', locale)}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                {translateText('显示该宝可梦防守时，遭受不同属性攻击的伤害倍数', locale)}
              </p>
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
                if (!list || list.length === 0) return null

                return (
                  <div 
                    key={group.multiplier} 
                    className={cn(
                      'p-4 rounded-2xl border flex flex-col md:flex-row md:items-center gap-3.5 transition-all duration-200 shadow-sm', 
                      group.color
                    )}
                  >
                    <span className="font-black text-xs md:text-sm tracking-tight w-40 shrink-0">
                      {translateText(group.label, locale)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {list.map((type) => (
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
                  {effectivenessGroups['1']?.map((type) => (
                    <TypeBadge key={type} type={type} className="px-3 py-1 rounded-full" />
                  )) || <span className="text-zinc-400 text-xs font-bold">-</span>}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Evolution Chain Tab */}
        <TabsContent value="evolution" className="mt-4 focus-visible:outline-none">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-6">
            <h3 className="font-bold text-base tracking-tight">
              {translateText('进化链分支', locale)}
            </h3>

            {detail.evolution_chains.map((chain, chainIdx) => (
              <div key={chainIdx} className="flex flex-col md:flex-row items-center justify-center gap-4 py-4 relative">
                {chain.map((stage, stageIdx) => {
                  const translatedStageName = translateText(stage.name, locale)
                  const isCurrent = stage.name === detail.name_zh

                  return (
                    <React.Fragment key={stage.name}>
                      {/* Evolution condition arrow */}
                      {stageIdx > 0 && (
                        <div className="flex flex-col items-center justify-center shrink-0 w-24 text-center my-2 md:my-0 select-none">
                          <span className="text-zinc-400 dark:text-zinc-600 text-lg">➔</span>
                          {stage.text && (
                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200/30 dark:border-zinc-800/30 mt-1 max-w-[120px] truncate">
                              {translateText(stage.text, locale)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Pokemon node card */}
                      {/* Clicking on it will search the list or trigger route change */}
                      <div
                        onClick={async () => {
                          // we need the national index of this pokemon. We can try to look it up or query a redirect.
                          // since we don't have the id directly, let's load all pokemon to search or just route.
                          // Fortunately, the image name contains the ID! e.g., "001Bulbasaur_Dream.png" -> id is "0001" or matched.
                          // Let's parse ID from image, or find it.
                          const matchedId = stage.image.match(/^(\d+)/)?.[1]
                          if (matchedId) {
                            router.push(`/pokemon/${matchedId.padStart(4, '0')}`)
                          }
                        }}
                        className={cn(
                          'flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer w-40 hover:shadow-md hover:scale-[1.02]',
                          isCurrent
                            ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                            : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700'
                        )}
                      >
                        <div className="relative w-20 h-20 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl p-1 shadow-inner border border-zinc-100/30 dark:border-zinc-800/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/data/images/dream/${stage.image}`}
                            alt={stage.name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              // If dream world image fails, show placeholder or sprite
                              e.currentTarget.src = '/file.svg'
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-32">
                            {translatedStageName}
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">
                            {translateText(stage.stage, locale)}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Moves Tab */}
        <TabsContent value="moves" className="mt-4 focus-visible:outline-none">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base tracking-tight">
                {translateText('学习招式表', locale)}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                {translateText('显示当前形态在不同等级下可以习得的招式目录', locale)}
              </p>
            </div>

            <Tabs defaultValue="level" className="w-full">
              <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-9">
                <TabsTrigger value="level" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('等级提升', locale)}</TabsTrigger>
                <TabsTrigger value="machine" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('招式学习器', locale)}</TabsTrigger>
                <TabsTrigger value="egg" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('蛋招式', locale)}</TabsTrigger>
              </TabsList>

              {/* 1. Level-up moves */}
              <TabsContent value="level" className="mt-3 focus-visible:outline-none">
                <ScrollArea className="h-96 pr-2">
                  <div className="overflow-x-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          <th className="py-2.5 px-3 w-16">{translateText('等级', locale)}</th>
                          <th className="py-2.5 px-3">{translateText('招式名称', locale)}</th>
                          <th className="py-2.5 px-3 w-20">{translateText('属性', locale)}</th>
                          <th className="py-2.5 px-3 w-20">{translateText('分类', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">PP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Get learnable moves for active form */}
                        {(detail.learnable_moves.find(m => m.form === activeForm.name) || detail.learnable_moves[0])?.data.map((move, idx) => {
                          const typeColor = getTypeColor(move.type)
                          const translatedMoveName = translateText(move.name, locale)
                          const translatedTypeName = translateText(move.type, locale)
                          const translatedCategoryName = translateText(move.category, locale)

                          return (
                            <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium">
                              <td className="py-3 px-3 font-mono font-bold text-zinc-500 dark:text-zinc-400">{move.level}</td>
                              <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-50">
                                <Link 
                                  href={`/moves?name=${encodeURIComponent(move.name)}`}
                                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                  {translatedMoveName}
                                </Link>
                              </td>
                              <td className="py-3 px-3">
                                <TypeBadge type={move.type} className="px-2 py-0.5 rounded text-[9px] block text-center justify-center" />
                              </td>
                              <td className="py-3 px-3">
                                <CategoryBadge category={move.category} className="px-2 py-0.5 rounded text-[9px] block text-center justify-center" />
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.power}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.accuracy}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.pp}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 2. Machine moves */}
              <TabsContent value="machine" className="mt-3 focus-visible:outline-none">
                <ScrollArea className="h-96 pr-2">
                  <div className="overflow-x-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          <th className="py-2.5 px-3 w-28">{translateText('学习器', locale)}</th>
                          <th className="py-2.5 px-3">{translateText('招式名称', locale)}</th>
                          <th className="py-2.5 px-3 w-20">{translateText('属性', locale)}</th>
                          <th className="py-2.5 px-3 w-20">{translateText('分类', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">PP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.machine_moves.find(m => m.form === activeForm.name) || detail.machine_moves[0])?.data.map((move, idx) => {
                          const typeColor = getTypeColor(move.type)
                          const translatedMoveName = translateText(move.name, locale)
                          const translatedTypeName = translateText(move.type, locale)
                          const translatedCategoryName = translateText(move.category, locale)
                          const translatedMachine = translateText(move.machine, locale)

                          return (
                            <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium">
                              <td className="py-3 px-3 font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{translatedMachine}</td>
                              <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-50">
                                <Link 
                                  href={`/moves?name=${encodeURIComponent(move.name)}`}
                                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                  {translatedMoveName}
                                </Link>
                              </td>
                              <td className="py-3 px-3">
                                <TypeBadge type={move.type} className="px-2 py-0.5 rounded text-[9px] block text-center justify-center" />
                              </td>
                              <td className="py-3 px-3">
                                <CategoryBadge category={move.category} className="px-2 py-0.5 rounded text-[9px] block text-center justify-center" />
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.power}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.accuracy}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.pp}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 3. Egg moves */}
              <TabsContent value="egg" className="mt-3 focus-visible:outline-none">
                <ScrollArea className="h-96 pr-2">
                  <div className="overflow-x-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          <th className="py-2.5 px-3">{translateText('招式名称', locale)}</th>
                          <th className="py-2.5 px-3 w-20">{translateText('属性', locale)}</th>
                          <th className="py-2.5 px-3 w-20">{translateText('分类', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                          <th className="py-2.5 px-3 w-16 text-center">PP</th>
                          <th className="py-2.5 px-3 w-40">{translateText('遗传亲代 (部分)', locale)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.egg_moves.find(m => m.form === activeForm.name) || detail.egg_moves[0])?.data.map((move, idx) => {
                          const typeColor = getTypeColor(move.type)
                          const translatedMoveName = translateText(move.name, locale)
                          const translatedTypeName = translateText(move.type, locale)
                          const translatedCategoryName = translateText(move.category, locale)
                          const translatedParents = move.parents.map(p => translateText(p.name, locale)).slice(0, 4).join(', ')

                          return (
                            <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium font-medium">
                              <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-50">
                                <Link 
                                  href={`/moves?name=${encodeURIComponent(move.name)}`}
                                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                  {translatedMoveName}
                                </Link>
                              </td>
                              <td className="py-3 px-3">
                                <TypeBadge type={move.type} className="px-2 py-0.5 rounded text-[9px] block text-center justify-center" />
                              </td>
                              <td className="py-3 px-3">
                                <CategoryBadge category={move.category} className="px-2 py-0.5 rounded text-[9px] block text-center justify-center" />
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.power}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.accuracy}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.pp}</td>
                              <td className="py-3 px-3 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold truncate max-w-[160px]">{translatedParents}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

      {/* 3. Game Pokedex Entries */}
      {detail.pokedex_entries.length > 0 && (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight">
            {translateText('历代图鉴说明', locale)}
          </h3>
          <ScrollArea className="h-64 pr-2">
            <div className="space-y-4 pr-1">
              {detail.pokedex_entries.map((entry, idx) => (
                <div key={idx} className="space-y-1.5 pb-3 border-b border-zinc-100 dark:border-zinc-900 last:border-b-0">
                  <span className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText(entry.name, locale)}
                  </span>
                  <div className="grid gap-2">
                    {entry.versions.map((ver, vidx) => (
                      <div key={vidx} className="text-xs bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-100/50 dark:border-zinc-900 flex flex-col gap-1">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {translateText(ver.name, locale)}
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                          {translateText(ver.text, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

    </div>
  )
}
