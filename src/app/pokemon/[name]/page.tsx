'use client'

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { getPokedex, getPokemon } from '@/http/pokemon'
import type { PokemonDetail, PokemonList } from '@/types'
import useSWR from 'swr'
import MobilePage from './mobile-page'
import PokemonDetailComponent from './pokemon-detail'
import TopBar from './top-bar'

interface Props {
  params: Promise<{ name: string }>
}

export default function Page({ params }: Props) {
  const { name } = use(params)
  const [detailData, setDetailData] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const { data: pokedex } = useSWR('pokedex-full', getPokedex)

  useEffect(() => {
    async function fetchDetail() {
      if (!pokedex) return

      // Find pokemon by name (Chinese, English, or Japanese)
      // The params.name is likely the link name which is usually Chinese name or part of it?
      // In pokemon-list.tsx: linkName = name.split('-')[0]. 
      // Actually national.json name is "妙蛙种子", list link is "/pokemon/妙蛙种子".
      // So name is "妙蛙种子".
      
      const decodedName = decodeURIComponent(name)
      const pokemon = pokedex.find(
        p => p.name === decodedName || p.name_en === decodedName || p.name_jp === decodedName
      )

      if (pokemon) {
        try {
          const data = await getPokemon(pokemon.id, pokemon.name)
          setDetailData(data)
        } catch (e) {
          console.error(e)
        }
      }
      setLoading(false)
    }

    if (pokedex) {
      fetchDetail()
    }
  }, [pokedex, name])

  if (loading && !detailData) {
    return <div className="flex h-full w-full items-center justify-center">加载中...</div>
  }

  if (!detailData) {
    return <div className="flex h-full w-full items-center justify-center">未找到宝可梦</div>
  }

  return (
    <>
      <div className="relative hidden w-full lg:block lg:w-2/3">
        <TopBar name={detailData.name_zh} index={detailData.pokedex_id} />
        <PokemonDetailComponent data={detailData} />
      </div>
      <MobilePage data={detailData} />
    </>
  )
}
