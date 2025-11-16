import type { AbilityDetail, PokemonDetail } from '@/types'
import { NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { findFile, readFile } from '@/lib/file'

export async function GET(request: Request, context: any) {
  const { params } = context
  const name = params.name

  try {
    const file = await findFile(name, 'pokemon')
    if (file) {
      const data = await readFile<PokemonDetail>(`pokemon/${file}`)
      await Promise.all(
        data.forms.map(async (form) => {
          await Promise.all(
            form.ability.map(async (a) => {
              const aFile = await findFile(a.name, 'ability')
              const detail = await readFile<AbilityDetail>(`ability/${aFile}`)
              a.text = detail.text
            }),
          )
        }),
      )
      const res = NextResponse.json(data)
      cache(res)
      return res
    }
    return NextResponse.json(null)
  }
  catch {
    return NextResponse.error()
  }
}
