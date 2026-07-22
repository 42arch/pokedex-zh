'use client'

import type { PokemonDetail } from '@/services/pokemon'
import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { translateText } from '@/lib/chinese'

import { PokemonBasicInfo } from './pokemon-detail/pokemon-basic-info'
import { PokemonEvolution } from './pokemon-detail/pokemon-evolution'
import { PokemonHeader } from './pokemon-detail/pokemon-header'
import { PokemonMoves } from './pokemon-detail/pokemon-moves'
import { PokemonStats } from './pokemon-detail/pokemon-stats'

interface PokemonDetailClientProps {
  detail: PokemonDetail
  abilityMap?: Record<string, string>
  locale: string
}

export function PokemonDetailClient({ detail, abilityMap, locale }: PokemonDetailClientProps) {
  const [activeFormIndex, setActiveFormIndex] = React.useState(0)
  const activeForm = detail.forms[activeFormIndex] || detail.forms[0]

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      <PokemonHeader
        detail={detail}
        activeFormIndex={activeFormIndex}
        setActiveFormIndex={setActiveFormIndex}
        locale={locale}
      />

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full grid grid-cols-4 rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 h-11 shrink-0 overflow-x-auto">
          <TabsTrigger value="stats" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">
            {translateText('基础信息', locale)}
          </TabsTrigger>
          <TabsTrigger value="effectiveness" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">
            {translateText('属性信息', locale)}
          </TabsTrigger>
          <TabsTrigger value="evolution" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">
            {translateText('进化链', locale)}
          </TabsTrigger>
          <TabsTrigger value="moves" className="rounded-xl text-xs font-bold cursor-pointer py-1.5">
            {translateText('招式表', locale)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-3 focus-visible:outline-none space-y-4">
          <PokemonBasicInfo
            detail={detail}
            activeForm={activeForm}
            abilityMap={abilityMap}
            locale={locale}
          />
        </TabsContent>

        <TabsContent value="effectiveness" className="mt-3 focus-visible:outline-none space-y-4">
          <PokemonStats
            detail={detail}
            activeForm={activeForm}
            locale={locale}
          />
        </TabsContent>

        <TabsContent value="evolution" className="mt-3 focus-visible:outline-none space-y-4">
          <PokemonEvolution
            detail={detail}
            activeFormIndex={activeFormIndex}
            setActiveFormIndex={setActiveFormIndex}
            locale={locale}
          />
        </TabsContent>

        <TabsContent value="moves" className="mt-3 focus-visible:outline-none space-y-4">
          <PokemonMoves
            detail={detail}
            activeForm={activeForm}
            activeFormIndex={activeFormIndex}
            setActiveFormIndex={setActiveFormIndex}
            locale={locale}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
