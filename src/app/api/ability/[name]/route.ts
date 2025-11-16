import type { AbilityDetail, PokemonList } from '@/types'
import { NextResponse } from 'next/server'
import { findFile, readFile } from '@/lib/file'

export async function GET(request: Request, context: any) {
  const { params } = context
  const name = params.name

  try {
    const file = await findFile(name, 'ability')
    if (file) {
      const data = await readFile<AbilityDetail>(`ability/${file}`)
      const pokemonList = await readFile<PokemonList>('pokemon_full_list.json')
      data.pokemon.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.meta = detail ? detail.meta : null
      })
      return NextResponse.json(data)
    }
    return NextResponse.json(null)
  }
  catch {
    return NextResponse.error()
  }
}
