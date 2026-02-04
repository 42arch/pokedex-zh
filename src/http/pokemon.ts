import type { PokemonDetail, PokemonList } from '@/types'

export async function getPokedex() {
  const response = await fetch('https://s.starllow.com/pokedex/pokedex/national.json')
  const data = await response.json() as PokemonList
  return data
}

export async function getPokemon(id: string, name: string) {
  const response = await fetch(`https://s.starllow.com/pokedex/pokemon/${id}-${name}.json`)
  const data = await response.json() as PokemonDetail
  return data
}
