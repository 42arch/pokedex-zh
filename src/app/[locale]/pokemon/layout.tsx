import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { PokemonLayoutClient } from '@/app/[locale]/pokemon/layout-client'
import { getCombinedPokedex, getRegionalPokedexMap } from '@/services/pokemon'

export default async function PokemonLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

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
