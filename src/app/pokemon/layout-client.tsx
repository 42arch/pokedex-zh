'use client'

import type { NationalPokemon, RegionalPokedexMap } from '@/services/pokemon'
import * as React from 'react'
import { PokedexList } from '@/components/pokedex-list'
import { ResizableLayout } from '@/components/resizable-layout'
import { useStaticDetailName } from '@/hooks/use-static-detail-name'

export function PokemonLayoutClient({
  pokemonList,
  regionalMap,
  children,
}: {
  pokemonList: NationalPokemon[]
  regionalMap: RegionalPokedexMap
  children: React.ReactNode
}) {
  const activeName = useStaticDetailName('pokemon')
  const isActiveDetail = !!activeName

  return (
    <ResizableLayout
      id="pokedex-list-split"
      isActiveDetail={isActiveDetail}
      leftPanel={<PokedexList pokemonList={pokemonList} regionalMap={regionalMap} />}
      rightPanel={children}
      leftPanelClassName="bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50"
      rightPanelClassName="bg-zinc-50/30 dark:bg-zinc-950/10"
    />
  )
}
