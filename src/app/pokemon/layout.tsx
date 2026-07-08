import * as React from 'react'
import { PokemonLayoutClient } from '@/app/pokemon/layout-client'
import { getCombinedPokedex, getRegionalPokedexMap } from '@/services/pokemon'

export default async function PokemonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [pokemonList, regionalMap] = await Promise.all([
    getCombinedPokedex(),
    getRegionalPokedexMap(),
  ])

  return (
    <PokemonLayoutClient pokemonList={pokemonList} regionalMap={regionalMap}>
      {children}
    </PokemonLayoutClient>
  )
}
