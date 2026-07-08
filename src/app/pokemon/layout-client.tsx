'use client'

import type { CombinedPokemon, RegionalPokedexMap } from '@/services/pokemon'
import { useParams } from 'next/navigation'
import * as React from 'react'
import { PokedexList } from '@/components/pokedex-list'
import { ResizableLayout } from '@/components/resizable-layout'

export function PokemonLayoutClient({
  pokemonList,
  regionalMap,
  children,
}: {
  pokemonList: CombinedPokemon[]
  regionalMap: RegionalPokedexMap
  children: React.ReactNode
}) {
  const params = useParams()

  // Resolve id param whether it is catch-all array or string
  const activeId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : ''
  const isActiveDetail = !!activeId

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
