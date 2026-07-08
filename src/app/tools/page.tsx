import * as React from 'react'
import { ToolsLayout } from '@/components/tools-layout'
import { getCombinedPokedex } from '@/services/pokemon'

export default async function ToolsPage() {
  const pokemonList = await getCombinedPokedex()

  return (
    <ToolsLayout
      pokemonList={pokemonList}
    />
  )
}
