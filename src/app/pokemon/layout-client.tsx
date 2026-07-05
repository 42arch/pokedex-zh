'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { CombinedPokemon, RegionalPokedexMap } from '@/services/pokemon'
import { PokedexList } from '@/components/pokedex-list'
import { cn } from '@/lib/utils'

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
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)] md:h-screen">
      {/* Left Panel: Pokedex List */}
      <div className={cn(
        "w-full md:w-[350px] lg:w-[380px] shrink-0 h-full overflow-hidden",
        isActiveDetail && "hidden md:block"
      )}>
        <PokedexList pokemonList={pokemonList} regionalMap={regionalMap} />
      </div>

      {/* Right Panel: Pokemon Detail Content */}
      <div className={cn(
        "flex-1 h-full overflow-y-auto bg-zinc-50/30 dark:bg-zinc-950/10",
        !isActiveDetail && "hidden md:block"
      )}>
        {children}
      </div>
    </div>
  )
}
