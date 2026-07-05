import * as React from 'react'
import { getCombinedPokedex, getRegionalPokedexMap } from '@/services/pokemon'
import { PokemonLayoutClient } from '@/app/pokemon/layout-client'

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
