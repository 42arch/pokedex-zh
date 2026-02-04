import type { Order, PokemonList, Type } from '@/types'
import { NextResponse } from 'next/server'
import { cache } from '@/lib/cache'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get('page') || '0')
  const pageSize = Number.parseInt(searchParams.get('pageSize') || '50')
  const name = searchParams.get('name') || ''
  const type1 = searchParams.get('type1') || ''
  const type2 = searchParams.get('type2') || ''
  const filter = searchParams.get('filter') || ''
  const generation = searchParams.get('generation') || ''
  const order = (searchParams.get('order') || 'asc') as Order
  const pokedex = searchParams.get('pokedex') || 'national'

  try {
    // const fullData = await readFile<PokemonList>(`/pokedex/pokedex_${pokedex}.json`)
    const response = await fetch('https://s.starllow.com/pokedex/pokedex/national.json')
    const fullData = await response.json() as PokemonList

    const filteredData = fullData
      .filter(
        p =>
          p.name.includes(name)
          || p.name_en.toLowerCase().includes(name)
          || p.name_jp.includes(name),
      )
      .filter((p) => {
        if (generation) {
          return p.generation === generation
        }
        return true
      })
      .filter((p) => {
        if (filter) {
          return p.filter.includes(filter)
        }
        return true
      })
      .filter((p) => {
        if (type1 && type2) {
          return (
            p.types.includes(type1 as Type) && p.types.includes(type2 as Type)
          )
        }
        if (type1) {
          return p.types.includes(type1 as Type)
        }
        return true
      })

    const orderedData = order === 'desc' ? filteredData.reverse() : filteredData
    const total = orderedData.length

    const data = orderedData.splice(page * pageSize, pageSize)
    const res = NextResponse.json({
      total,
      page,
      pageSize,
      contents: data,
    })
    cache(res)
    return res
  }
  catch {
    return NextResponse.error()
  }
}
