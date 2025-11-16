import type { MoveDetail, PokemonList } from '@/types'
import { NextResponse } from 'next/server'
import { findFile, readFile } from '@/lib/file'

export async function GET(request: Request, context: any) {
  const { params } = context
  const name = params.name

  try {
    const file = await findFile(name, 'move')
    if (file) {
      const data = await readFile<MoveDetail>(`move/${file}`)
      const pokemonList = await readFile<PokemonList>('pokemon_full_list.json')

      data.pokemon.egg.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.level.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.machine.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.tutor.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
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
