import * as React from 'react'
import { getCombinedPokedex } from '@/services/pokemon'
import { ToolsLayout } from '@/components/tools-layout'

export default async function ToolsPage() {
  const pokemonList = await getCombinedPokedex()

  return (
    <ToolsLayout 
      pokemonList={pokemonList} 
    />
  )
}
