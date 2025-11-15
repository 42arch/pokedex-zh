import { PropsWithChildren } from 'react'
import PokemonList from './pokemon-list'
import { fetchData } from '@/lib/fetch'
import type { PaginatedResponse, PokemonList as PokemonListType } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '宝可梦中文图鉴 | 全国图鉴列表',
  description: '宝可梦中文图鉴，全国图鉴列表。',
  keywords: ['宝可梦', '宝可梦图鉴', '全国图鉴列表']
}

export default async function Page({ children }: PropsWithChildren) {
  const data = await fetchData<PaginatedResponse<PokemonListType>>(
    'pokemon?pokedex=national&page=0&pageSize=30'
  )

  return (
    <div className='relative flex h-full w-full overflow-hidden'>
      <PokemonList
        initialData={data.contents}
        className='w-full border-l border-l-muted  md:border-l-0 lg:w-1/3 '
      />
      {children}
    </div>
  )
}
