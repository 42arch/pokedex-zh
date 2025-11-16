import type { PokemonSimple } from '@/types'
import { NextResponse } from 'next/server'
import { readFile } from '@/lib/file'

export async function GET() {
  try {
    const data = await readFile<PokemonSimple[]>('pokemon_list.json')
    return NextResponse.json(data)
  }
  catch {
    return NextResponse.error()
  }
}
