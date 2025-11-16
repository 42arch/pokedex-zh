import type { PokemonList } from '@/types'
import { NextResponse } from 'next/server'
import { readFile } from '@/lib/file'

export async function GET() {
  const allData = await readFile<PokemonList>('pokemon_list.json')
  const total = allData.length
  return NextResponse.json(total)
}
