'use client'

import type { PokemonDetail } from '@/services/pokemon'
import { InfoIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import * as React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { translateText } from '@/lib/chinese'
import { GENERATION_COLORS, VERSION_COLORS } from '@/lib/constants'
import { cn, getLocalizedPath } from '@/lib/utils'

interface Ability {
  name: string
  is_hidden: boolean
  info?: string
}

interface AbilityCardProps {
  ability: Ability
  locale: string
  preloadedDesc?: string
}

function AbilityCard({
  ability,
  locale,
  preloadedDesc: _preloadedDesc,
}: AbilityCardProps) {
  const isUnknown = ability.name === '未知'
  const hasInfo = !!ability.info && !isUnknown
  const translatedAbility = translateText(ability.name, locale)

  return (
    <div className={cn(
      'bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm',
      hasInfo ? 'space-y-2' : '',
    )}
    >
      <div className={cn(
        'flex items-center justify-between',
        hasInfo ? 'border-b border-zinc-100 dark:border-zinc-900 pb-1.5' : '',
      )}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {translateText(ability.is_hidden ? '隐藏特性' : '一般特性', locale)}
          </span>
        </div>
        {isUnknown
          ? (
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                {translatedAbility}
              </span>
            )
          : (
              <Link
                prefetch={false}
                href={getLocalizedPath(`/abilities/${encodeURIComponent(ability.name)}`, locale)}
                className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm"
              >
                {translatedAbility}
                <InfoIcon className="w-3.5 h-3.5 opacity-60" />
              </Link>
            )}
      </div>

      {hasInfo && (
        <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium">
          {translateText(ability.info!, locale)}
        </p>
      )}
    </div>
  )
}

interface PokemonBasicInfoProps {
  detail: PokemonDetail
  activeForm: any
  abilityMap?: Record<string, string>
  locale: string
}

export function PokemonBasicInfo({
  detail,
  activeForm,
  abilityMap,
  locale,
}: PokemonBasicInfoProps) {
  return (
    <div className="space-y-4">
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
              {activeForm.egg_groups.map((group: string) => {
                const translatedGroup = translateText(group, locale)
                return (
                  <Link
                    prefetch={false}
                    key={group}
                    href={getLocalizedPath(`/pokemon?egg_group=${encodeURIComponent(group)}`, locale)}
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
      {activeForm.abilities.map((ability: Ability) => (
        <AbilityCard key={ability.name} ability={ability} locale={locale} preloadedDesc={abilityMap?.[ability.name]} />
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
    </div>
  )
}
