'use client'

import type { CombinedPokemon } from '@/services/pokemon'
import { IdentificationCardIcon, ShieldCheckIcon, ShieldIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import * as React from 'react'
import { translateText } from '@/lib/chinese'
import { cn } from '@/lib/utils'
import { NatureChart } from './tools/nature-chart'
import { TeamPlanner } from './tools/team-planner'
import { TypeMatchupCalc } from './tools/type-matchup-calc'

interface ToolsLayoutProps {
  pokemonList: CombinedPokemon[]
}

type TabType = 'matchup' | 'nature' | 'team'

export function ToolsLayout({ pokemonList }: ToolsLayoutProps) {
  const locale = useLocale()
  const [activeTab, setActiveTab] = React.useState<TabType>('matchup')

  const tabs = [
    {
      id: 'matchup' as TabType,
      name: '属性相克计算器',
      icon: ShieldIcon,
      description: '分析单/双属性在防守端及攻击端的伤害倍数克制关系。',
    },
    {
      id: 'nature' as TabType,
      name: '性格修正查询',
      icon: IdentificationCardIcon,
      description: '快速查询宝可梦 25 种性格对五维能力属性的提升与降低修正。',
    },
    {
      id: 'team' as TabType,
      name: '队伍联防分析',
      icon: ShieldCheckIcon,
      description: '编辑 6 只宝可梦队伍，扫描全属性防守弱点与抗性覆盖盲点。',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50/20 dark:bg-zinc-950/10 min-h-[calc(100vh-4rem)] md:min-h-screen">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-200">

        {/* Header Title */}
        <div className="space-y-1.5 md:space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 bg-gradient-to-r from-zinc-900 to-zinc-650 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            {translateText('宝可梦工具箱', locale)}
          </h1>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {translateText('助力对战培育的实用分析小工具，支持性格修正、属性克制与队伍联防分析。', locale)}
          </p>
        </div>

        {/* Tab Buttons bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'p-4 rounded-3xl border text-left flex items-start gap-4 transition-all shadow-sm relative overflow-hidden group cursor-pointer',
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 shadow-md shadow-zinc-900/10'
                    : 'bg-white dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40',
                )}
              >
                <div
                  className={cn(
                    'p-2.5 rounded-2xl shrink-0 transition-all border shadow-sm',
                    isActive
                      ? 'bg-white/10 dark:bg-black/10 border-white/10 dark:border-black/5 text-zinc-50 dark:text-zinc-900'
                      : 'bg-zinc-50 dark:bg-zinc-900/80 border-zinc-200/40 dark:border-zinc-800/40 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <h4 className={cn('font-bold text-sm', isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-900 dark:text-zinc-100')}>
                    {translateText(tab.name, locale)}
                  </h4>
                  <p className={cn('text-[11px] leading-relaxed line-clamp-2 font-medium', isActive ? 'text-zinc-300 dark:text-zinc-550' : 'text-zinc-450 dark:text-zinc-500')}>
                    {translateText(tab.description, locale)}
                  </p>
                </div>

                {isActive && (
                  <span className="absolute right-4 top-4 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active Tab Panel */}
        <div className="bg-transparent rounded-3xl">
          {activeTab === 'matchup' && <TypeMatchupCalc />}
          {activeTab === 'nature' && <NatureChart />}
          {activeTab === 'team' && <TeamPlanner pokemonList={pokemonList} />}
        </div>

      </div>
    </div>
  )
}
