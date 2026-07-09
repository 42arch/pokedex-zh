'use client'

import type { PokemonDetail } from '@/services/pokemon'
import { HeartIcon, InfoIcon, LightningIcon, ShieldIcon, SparkleIcon, SwordIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { translateText } from '@/lib/chinese'
import { ASSET_URL, GENERATION_COLORS, VERSION_COLORS } from '@/lib/constants'
import { getStatColor, getStatName, getTypeGradient } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'
import { CategoryBadge, TypeBadge } from './type-badge'

function AbilityCard({ ability, locale }: { ability: { name: string, is_hidden: boolean }, locale: string }) {
  const [desc, setDesc] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true
    setLoading(true)
    const fetchDesc = async () => {
      try {
        const url = `${ASSET_URL}/abilities/${encodeURIComponent(ability.name)}.json`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (active) {
            const rawDesc = data.introduction || data.desc || data.description || data.effect || ''
            setDesc(rawDesc)
          }
        }
      }
      catch (err) {
        console.error(err)
      }
      finally {
        if (active)
          setLoading(false)
      }
    }
    fetchDesc()
    return () => {
      active = false
    }
  }, [ability.name])

  const translatedAbility = translateText(ability.name, locale)

  return (
    <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-2">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {translateText(ability.is_hidden ? '隐藏特性' : '一般特性', locale)}
          </span>
        </div>
        <Link
          href={`/${locale}/abilities/${encodeURIComponent(ability.name)}`}
          className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm"
        >
          {translatedAbility}
          <InfoIcon className="w-3.5 h-3.5 opacity-60" />
        </Link>
      </div>

      {loading
        ? (
            <div className="h-4 w-2/3 bg-zinc-100/50 dark:bg-zinc-900/40 rounded animate-pulse" />
          )
        : desc
          ? (
              <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium">
                {translateText(desc, locale)}
              </p>
            )
          : (
              <p className="text-xs text-zinc-400 italic">
                {translateText('暂无描述', locale)}
              </p>
            )}
    </div>
  )
}

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

interface PokemonDetailProps {
  detail: PokemonDetail
}

export function PokemonDetailView({ detail }: PokemonDetailProps) {
  const router = useRouter()
  const locale = useLocale()

  // State
  const [activeFormIndex, setActiveFormIndex] = React.useState(0)
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

  // Computed Values
  const activeForm = detail.forms[activeFormIndex] || detail.forms[0]

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
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-300">

      {/* 1. Profile Header Card */}
      <div
        className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 transition-all duration-300"
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
        <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-44">
          <div className="relative flex items-center justify-center w-36 h-36 md:w-40 md:h-40 rounded-full bg-white/20 dark:bg-black/10 shadow-inner group hover:scale-[1.02] transition-transform duration-300">
            <img
              src={`${ASSET_URL}/images/official/${activeForm.image}`}
              alt={detail.name_zh}
              className="w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl select-none group-hover:rotate-2 transition-transform duration-300"
              onError={(e) => {
                // fallback to default image if error
                e.currentTarget.src = `${ASSET_URL}/images/official/${activeForm.image}`
              }}
            />
          </div>
        </div>

        {/* Name and Basic details */}
        <div className="flex-1 text-center md:text-left space-y-3.5 w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="font-mono text-sm md:text-base font-bold bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full text-zinc-700 dark:text-zinc-300 shadow-sm">
              #
              {detail.pokedex_id}
            </span>
            <div className="flex gap-1.5 items-center flex-wrap">
              {activeForm.types.map(type => (
                <TypeBadge key={type} type={type} className="rounded-full border border-white/10 text-xs" />
              ))}
            </div>
          </div>
          <div className="h-6">
            {activeForm.category && (
              <span className="px-3.5 py-1 rounded-full bg-white/30 dark:bg-zinc-900/30 border border-white/20 dark:border-zinc-800/40 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-md">
                {translateText(activeForm.category, locale)}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
              {translateText(detail.name_zh, locale)}
            </h1>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {detail.name_en}
              {' '}
              ·
              {detail.name_ja}
            </p>
          </div>

          {/* <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300 bg-white/40 dark:bg-black/10 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-inner">
            {translateText(detail.description, locale)}
          </p> */}

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
                        : 'bg-white/70 dark:bg-zinc-900/70 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100',
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

      {/* 2. Detail Tabs (Basic Info, Matchups, Evolution, Moves) */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full grid grid-cols-4 rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 h-11 shrink-0 overflow-x-auto">
          <TabsTrigger value="stats" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('基础信息', locale)}</TabsTrigger>
          <TabsTrigger value="effectiveness" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('属性信息', locale)}</TabsTrigger>
          <TabsTrigger value="evolution" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('进化链', locale)}</TabsTrigger>
          <TabsTrigger value="moves" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">{translateText('招式表', locale)}</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="stats" className="mt-3 focus-visible:outline-none space-y-4">

          {/* 1. 基础属性与培育 */}
          <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
            <h3 className="font-bold text-base tracking-tight border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
              {translateText('基础属性与培育', locale)}
            </h3>

            <div className="flex flex-col gap-6 text-sm">
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('身高', locale)}</span>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{activeForm.height}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('体重', locale)}</span>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{activeForm.weight}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('图鉴颜色', locale)}</span>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{translateText(activeForm.color, locale)}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('捕获率', locale)}</span>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{translateText(activeForm.catch_rate, locale)}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('孵化周期', locale)}</span>
                    <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{translateText(activeForm.egg_cycles, locale)}</p>
                  </div>
                  {/* <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('经验值', locale)}</span>
                    <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{activeForm.base_exp}</p>
                  </div> */}
                  <div className="space-y-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('百级上限经验值', locale)}</span>
                    <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{activeForm.experience_100}</p>
                  </div>
                </div>
              </div>

              {/* Egg Groups Inline block */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{translateText('蛋群', locale)}</span>
                <div className="flex gap-2">
                  {activeForm.egg_groups.map((group) => {
                    const translatedGroup = translateText(group, locale)
                    return (
                      <Link
                        key={group}
                        href={`/${locale}/pokemon?egg_group=${encodeURIComponent(group)}`}
                        className="font-bold text-xs text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-white/80 dark:bg-zinc-950/80 px-2 py-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
                      >
                        {translatedGroup}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm space-y-1">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{translateText('性别比例', locale)}</span>
                {typeof activeForm.gender_ratio === 'object'
                  ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-sky-500">
                            {translateText('雄性', locale)}
                            {' '}
                            {activeForm.gender_ratio.male}
                            %
                          </span>
                          <span className="text-pink-500">
                            {translateText('雌性', locale)}
                            {' '}
                            {activeForm.gender_ratio.female}
                            %
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden flex shadow-inner border border-zinc-200/20 dark:border-zinc-800/20">
                          <div className="bg-sky-400 h-full" style={{ width: `${activeForm.gender_ratio.male}%` }} />
                          <div className="bg-pink-400 h-full" style={{ width: `${activeForm.gender_ratio.female}%` }} />
                        </div>
                      </div>
                    )
                  : (
                      <p className="font-bold text-xs text-zinc-850 dark:text-zinc-200">{translateText(activeForm.gender_ratio || '无性别', locale)}</p>
                    )}
              </div>
            </div>
          </div>

          {/* 2. 特性 (每个特性一个卡片) */}
          {activeForm.abilities.map(ability => (
            <AbilityCard key={ability.name} ability={ability} locale={locale} />
          ))}

          {/* 4. 简介 */}
          <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-3">
            <h3 className="font-bold text-base tracking-tight border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
              {translateText('简介', locale)}
            </h3>
            <div className="flex flex-col gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                  {translateText('生态与习性', locale)}
                </h4>
                <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed whitespace-pre-line font-medium">
                  {translateText(detail.profile, locale)}
                </p>
              </div>

              {detail.prototype && (
                <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                  <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {translateText('设计原型与出处', locale)}
                  </h4>
                  <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed whitespace-pre-line font-medium">
                    {translateText(detail.prototype, locale)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 历代图鉴说明 */}
          {detail.pokedex_entries.length > 0 && (
            <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-3">
              <h3 className="font-bold text-base tracking-tight">
                {translateText('历代图鉴说明', locale)}
              </h3>

              <Accordion type="multiple" defaultValue={['item-0']} className="w-full overflow-hidden">
                {detail.pokedex_entries.map((entry, idx) => {
                  const genColor = GENERATION_COLORS[entry.name as keyof typeof GENERATION_COLORS] || '#ef4444'

                  return (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-zinc-150 dark:border-zinc-850 last:border-b-0">
                      <AccordionTrigger className="hover:no-underline py-3 px-4 flex items-center justify-between text-zinc-800 dark:text-zinc-200 font-bold hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: genColor }} />
                          <span className="text-sm">
                            {translateText(entry.name, locale)}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-3 bg-zinc-50/20 dark:bg-zinc-900/5">
                        {entry.versions.map((ver, vidx) => {
                          const translatedVerName = translateText(ver.name, locale)
                          const verColor = VERSION_COLORS[ver.name as keyof typeof VERSION_COLORS] || VERSION_COLORS[translatedVerName as keyof typeof VERSION_COLORS] || '#6b7280'

                          // Calculate text contrast
                          let isDarkText = false
                          if (verColor.startsWith('#') && verColor.length >= 7) {
                            const hex = verColor.replace('#', '')
                            const r = Number.parseInt(hex.substring(0, 2), 16)
                            const g = Number.parseInt(hex.substring(2, 4), 16)
                            const b = Number.parseInt(hex.substring(4, 6), 16)
                            const brightness = (r * 299 + g * 587 + b * 114) / 1000
                            if (brightness >= 186)
                              isDarkText = true
                          }

                          return (
                            <div key={vidx} className="flex flex-col gap-1.5 items-start border-b border-zinc-100 dark:border-zinc-900 last:border-b-0 pb-3 last:pb-0">
                              <span
                                className={cn(
                                  'px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm shrink-0 whitespace-nowrap',
                                  isDarkText ? 'text-zinc-950' : 'text-white',
                                )}
                                style={{ backgroundColor: verColor }}
                              >
                                {translatedVerName}
                              </span>
                              <p className="text-xs text-zinc-650 dark:text-zinc-350 font-medium leading-relaxed">
                                {translateText(ver.text, locale)}
                              </p>
                            </div>
                          )
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          )}
        </TabsContent>

        {/* Type Effectiveness Tab */}
        <TabsContent value="effectiveness" className="mt-3 focus-visible:outline-none space-y-4">

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
                          ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/30 dark:border-zinc-800/30'
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
                {activeForm.base_points.map((bp, idx) => {
                  const displayName = getBasePointStatName(bp.stat)
                  let statColorClass = 'bg-zinc-500/10 text-zinc-500 border-zinc-500/25'
                  const lowerStat = bp.stat.toLowerCase().replace(/[\s._-]+/g, '')
                  if (lowerStat === 'hp')
                    statColorClass = 'bg-rose-500/10 text-rose-500 border-rose-500/25 dark:bg-rose-500/5 dark:border-rose-500/15'
                  else if (lowerStat === 'attack')
                    statColorClass = 'bg-orange-500/10 text-orange-500 border-orange-500/25 dark:bg-orange-500/5 dark:border-orange-500/15'
                  else if (lowerStat === 'defense')
                    statColorClass = 'bg-amber-500/10 text-amber-500 border-amber-500/25 dark:bg-amber-500/5 dark:border-amber-500/15'
                  else if (lowerStat === 'specialattack' || lowerStat === 'spattack' || lowerStat === 'special_attack')
                    statColorClass = 'bg-sky-500/10 text-sky-500 border-sky-500/25 dark:bg-sky-500/5 dark:border-sky-500/15'
                  else if (lowerStat === 'specialdefense' || lowerStat === 'spdefense' || lowerStat === 'special_defense')
                    statColorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25 dark:bg-emerald-500/5 dark:border-emerald-500/15'
                  else if (lowerStat === 'speed')
                    statColorClass = 'bg-indigo-500/10 text-indigo-500 border-indigo-500/25 dark:bg-indigo-500/5 dark:border-indigo-500/15'

                  return (
                    <div
                      key={idx}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1 rounded-xl border font-bold text-xs shadow-sm',
                        statColorClass,
                      )}
                    >
                      <span>{translateText(displayName, locale)}</span>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded font-black">
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
                          ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/30 dark:border-zinc-800/30'
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
        </TabsContent>

        {/* Evolution Chain Tab */}
        <TabsContent value="evolution" className="mt-3 focus-visible:outline-none space-y-4">
          <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
            <h3 className="font-bold text-base tracking-tight">
              {translateText('进化链分支', locale)}
            </h3>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-max flex flex-col gap-4">
                {detail.evolution_chains.map((chain, chainIdx) => (
                  <div key={chainIdx} className="flex flex-row items-center justify-start md:justify-center gap-4 py-4 relative">
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
                              const matchedId = stage.image.match(/^(\d+)/)?.[1]
                              if (matchedId) {
                                router.push(`/${locale}/pokemon/${matchedId.padStart(4, '0')}`)
                              }
                            }}
                            className={cn(
                              'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm select-none hover:scale-[1.03]',
                              isCurrent
                                ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                                : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700',
                            )}
                          >
                            <div className="relative w-20 h-20 flex items-center justify-center rounded-xl p-1 border border-zinc-100/30 dark:border-zinc-800/30">
                              <img
                                src={`${ASSET_URL}/images/dream/${stage.image}`}
                                alt={stage.name}
                                className="w-16 h-16 object-contain"
                                onError={(e) => {
                                  if (e.currentTarget.src.includes('/dream/')) {
                                    e.currentTarget.src = `${ASSET_URL}/images/official/${stage.image}`
                                  }
                                  else {
                                    e.currentTarget.src = '/file.svg'
                                  }
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
            </div>

            {/* 超级进化 (Mega Evolution) */}
            {detail.mega_evolution && detail.mega_evolution.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                  {translateText('超级进化', locale)}
                </h4>
                <div className="flex flex-wrap gap-4">
                  {detail.mega_evolution.map((mega, idx) => {
                    const matchedIdx = detail.forms.findIndex((f) => {
                      const norm = (s: string) => s.toLowerCase().replace(/[\s._·★-]+/g, '').replace('极', '级').replace('ｘ', 'x').replace('ｙ', 'y')
                      const fn = norm(f.name)
                      const target = norm(mega.form_name)
                      const targetAlt = norm(`${mega.name}${mega.form_name}`)
                      return fn === target || fn === targetAlt || fn.includes(target) || target.includes(fn)
                    })

                    const isCurrent = matchedIdx !== -1 && activeFormIndex === matchedIdx

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (matchedIdx !== -1)
                            setActiveFormIndex(matchedIdx)
                        }}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm select-none hover:scale-[1.03]',
                          isCurrent
                            ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                            : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700',
                        )}
                      >
                        <div className="relative w-20 h-20 flex items-center justify-center rounded-xl p-1 border border-zinc-100/30 dark:border-zinc-800/30">
                          <img
                            src={`${ASSET_URL}/images/dream/${mega.image}`}
                            alt={mega.form_name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              if (e.currentTarget.src.includes('/dream/')) {
                                e.currentTarget.src = `${ASSET_URL}/images/official/${mega.image}`
                              }
                              else {
                                e.currentTarget.src = '/file.svg'
                              }
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-32">
                            {translateText(mega.form_name, locale)}
                          </p>
                          <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase mt-0.5">
                            {translateText('超级进化', locale)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 超级巨化 (Gigantamax) */}
            {detail.gigantamax_evolution && detail.gigantamax_evolution.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                  {translateText('超级巨化', locale)}
                </h4>
                <div className="flex flex-wrap gap-4">
                  {detail.gigantamax_evolution.map((gmax, idx) => {
                    const matchedIdx = detail.forms.findIndex((f) => {
                      const norm = (s: string) => s.toLowerCase().replace(/[\s._·★-]+/g, '').replace('极', '级')
                      const fn = norm(f.name)
                      const target = norm(gmax.form_name)
                      const targetAlt = norm(`${gmax.name}${gmax.form_name}`)
                      return fn === target || fn === targetAlt || fn.includes(target) || target.includes(fn)
                    })

                    const isCurrent = matchedIdx !== -1 && activeFormIndex === matchedIdx

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (matchedIdx !== -1)
                            setActiveFormIndex(matchedIdx)
                        }}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm select-none hover:scale-[1.03]',
                          isCurrent
                            ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                            : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700',
                        )}
                      >
                        <div className="relative w-20 h-20 flex items-center justify-center rounded-xl p-1 border border-zinc-100/30 dark:border-zinc-800/30">
                          <img
                            src={`${ASSET_URL}/images/dream/${gmax.image}`}
                            alt={gmax.form_name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              if (e.currentTarget.src.includes('/dream/')) {
                                e.currentTarget.src = `${ASSET_URL}/images/official/${gmax.image}`
                              }
                              else {
                                e.currentTarget.src = '/file.svg'
                              }
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-32">
                            {translateText(gmax.form_name, locale)}
                          </p>
                          <p className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase mt-0.5">
                            {translateText('超级巨化', locale)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* HOME 形象卡片 */}
          {detail.home_images && detail.home_images.length > 0 && (
            <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
              <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
                <h3 className="font-bold text-base tracking-tight">
                  {translateText('HOME 形象', locale)}
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                  {translateText('该宝可梦在 Pokémon HOME 中的高清 3D 模型渲染图（普通色与闪光对比）', locale)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.home_images.map((img, idx) => {
                  const displayName = img.name.includes('-')
                    ? img.name.substring(img.name.indexOf('-') + 1)
                    : translateText('普通形态', locale)

                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 shadow-sm flex flex-col gap-3">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-900/40 pb-1 w-full">
                        {translateText(displayName, locale)}
                      </span>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Normal Artwork */}
                        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-zinc-950/60 border border-zinc-200/20 dark:border-zinc-800/20 relative group">
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200/30 dark:border-zinc-800/30">
                            {translateText('普通', locale)}
                          </span>
                          <div className="w-20 h-20 flex items-center justify-center relative">
                            <img
                              src={`${ASSET_URL}/images/home/${img.image}`}
                              alt={`${img.name} normal`}
                              className="w-18 h-18 object-contain select-none transition-transform duration-300 group-hover:scale-[1.05]"
                              onError={(e) => { e.currentTarget.src = '/file.svg' }}
                            />
                          </div>
                        </div>

                        {/* Shiny Artwork */}
                        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-amber-500/[0.03] dark:bg-amber-500/[0.01] border border-amber-500/10 dark:border-amber-500/5 relative group">
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/10">
                            {translateText('闪光', locale)}
                            {' '}
                            ✨
                          </span>
                          <div className="w-20 h-20 flex items-center justify-center relative">
                            <img
                              src={`${ASSET_URL}/images/home/${img.shiny}`}
                              alt={`${img.name} shiny`}
                              className="w-18 h-18 object-contain select-none transition-transform duration-300 group-hover:scale-[1.05]"
                              onError={(e) => { e.currentTarget.src = '/file.svg' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Moves Tab */}
        <TabsContent value="moves" className="mt-3 focus-visible:outline-none space-y-4">
          {detail.forms.length > 1 && (
            <div className="flex flex-wrap gap-1 p-1 bg-zinc-150/40 dark:bg-zinc-900/40 rounded-xl w-fit">
              {detail.forms.map((form, idx) => (
                <button
                  key={form.name}
                  onClick={() => setActiveFormIndex(idx)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none',
                    activeFormIndex === idx
                      ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/30 dark:border-zinc-800/30'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                  )}
                >
                  {translateText(form.name, locale)}
                </button>
              ))}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
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
                <div className="overflow-x-auto pr-1">
                  <table className="w-full min-w-[600px] text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        <th className="py-2.5 px-3 w-16">{translateText('等级', locale)}</th>
                        <th className="py-2.5 px-3 min-w-[130px]">{translateText('招式名称', locale)}</th>
                        <th className="py-2.5 px-3 w-28 text-center">{translateText('属性', locale)}</th>
                        <th className="py-2.5 px-3 w-28 text-center">{translateText('分类', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">PP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Get learnable moves for active form */}
                      {(detail.learnable_moves.find(m => m.form === activeForm.name) || detail.learnable_moves[0])?.data.map((move, idx) => {
                        const translatedMoveName = translateText(move.name, locale)

                        return (
                          <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium">
                            <td className="py-3 px-3 font-mono font-bold text-zinc-500 dark:text-zinc-400">{move.level}</td>
                            <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                              <Link
                                href={`/${locale}/moves/${encodeURIComponent(move.name)}`}
                                className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                {translatedMoveName}
                              </Link>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <TypeBadge type={move.type} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <CategoryBadge category={move.category} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
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
              </TabsContent>

              {/* 2. Machine moves */}
              <TabsContent value="machine" className="mt-3 focus-visible:outline-none">
                <div className="overflow-x-auto pr-1">
                  <table className="w-full min-w-[600px] text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        <th className="py-2.5 px-3 w-28">{translateText('学习器', locale)}</th>
                        <th className="py-2.5 px-3 min-w-[130px]">{translateText('招式名称', locale)}</th>
                        <th className="py-2.5 px-3 w-28 text-center">{translateText('属性', locale)}</th>
                        <th className="py-2.5 px-3 w-28 text-center">{translateText('分类', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">PP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail.machine_moves.find(m => m.form === activeForm.name) || detail.machine_moves[0])?.data.map((move, idx) => {
                        const translatedMoveName = translateText(move.name, locale)
                        const translatedMachine = translateText(move.machine, locale)

                        return (
                          <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium font-medium">
                            <td className="py-3 px-3 font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{translatedMachine}</td>
                            <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-55 animate-pulse-none whitespace-nowrap">
                              <Link
                                href={`/${locale}/moves/${encodeURIComponent(move.name)}`}
                                className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                {translatedMoveName}
                              </Link>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <TypeBadge type={move.type} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <CategoryBadge category={move.category} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
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
              </TabsContent>

              {/* 3. Egg moves */}
              <TabsContent value="egg" className="mt-3 focus-visible:outline-none">
                <div className="overflow-x-auto pr-1">
                  <table className="w-full min-w-[650px] text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        <th className="py-2.5 px-3 min-w-[130px]">{translateText('招式名称', locale)}</th>
                        <th className="py-2.5 px-3 w-28 text-center">{translateText('属性', locale)}</th>
                        <th className="py-2.5 px-3 w-28 text-center">{translateText('分类', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                        <th className="py-2.5 px-3 w-16 text-center">PP</th>
                        <th className="py-2.5 px-3 w-40">{translateText('遗传亲代 (部分)', locale)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail.egg_moves.find(m => m.form === activeForm.name) || detail.egg_moves[0])?.data.map((move, idx) => {
                        const translatedMoveName = translateText(move.name, locale)
                        const translatedParents = move.parents.map(p => translateText(p.name, locale)).slice(0, 4).join(', ')

                        return (
                          <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium font-medium">
                            <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-55 animate-pulse-none whitespace-nowrap">
                              <Link
                                href={`/${locale}/moves/${encodeURIComponent(move.name)}`}
                                className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                {translatedMoveName}
                              </Link>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <TypeBadge type={move.type} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <CategoryBadge category={move.category} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
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
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}
