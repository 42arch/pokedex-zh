'use client'

import { useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import useOnView from '@/hooks/useOnView'
import { cn } from '@/lib/utils'
import {
  PaginatedResponse,
  PokemonList,
  PokemonSimple,
} from '@/types'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Link from 'next/link'
import TypeBadge from '@/components/type-badge'

import PokedexSelect from '@/components/pokedex-select'
import PokemonFilter, { FilterOptions } from '@/components/pokemon-filter'
import { PAGE_SIZE } from '@/lib/constants'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Props {
  initialData: PokemonList
  className?: string
}


function AllPokemonList({ initialData, className }: Props) {
  const ref = useRef<HTMLDivElement>(null!)
  const isVisible = useOnView(ref)
  const [fetched, setFetched] = useState(false)
  const [pokemonList, setPokemonList] = useState<PokemonList>(initialData)
  const [name, setName] = useState('')
  const [pokedex, setPokedex] = useState('national')
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type1: null,
    type2: null,
    generation: null,
    filter: null,
    order: 'asc'
  })

  const getKey = (
    page: number,
    previousPageData: PaginatedResponse<PokemonList> | null
  ): string | null => {
    if (previousPageData && !previousPageData.contents.length) return null

    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: PAGE_SIZE.toString(),
      name: name,
      pokedex: pokedex,
      order: filterOptions.order
    })
    if (filterOptions.type1) params.append('type1', filterOptions.type1)
    if (filterOptions.type2) params.append('type2', filterOptions.type2)
    if (filterOptions.filter) params.append('filter', filterOptions.filter)
    if (filterOptions.generation)
      params.append('generation', filterOptions.generation)

    return `/api/pokemon?${params.toString()}`
  }
  const { data, error, size, setSize } = useSWRInfinite<
    PaginatedResponse<PokemonList>
  >(getKey, fetcher)

  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0].contents?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.contents.length < PAGE_SIZE)

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
    if (data) {
      setFetched(true)
      const newList: PokemonList = []
      data.forEach((page) =>
        page.contents.map((p: PokemonSimple) => {
          newList.push(p)
        })
      )
      if (fetched) {
        setPokemonList(newList)
      } else {
        if (size > 1) {
          setPokemonList(newList)
        }
      }
    }
  }, [data, fetched, isLoadingMore, isReachingEnd, isVisible, setSize, size])

  return (
    <div className={cn(className, 'border-r border-r-muted')}>
      <div className='border-b border-b-muted px-4 pb-2 pt-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300'>
        <PokedexSelect value={pokedex} onChange={(v) => setPokedex(v)} />
      </div>
      <div className='relative h-[calc(100%-3rem-1px)] pl-4 pt-4'>
        <div className='relative pr-4'>
          <MagnifyingGlass className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='搜索宝可梦'
            className='pl-8'
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
        <div className='relative flex h-[calc(100%-3rem-1px)] flex-col pb-2 pr-4'>
          <PokemonFilter
            options={filterOptions}
            onOptionsChange={(v) => {
              setFilterOptions(v)
            }}
          />
          <ScrollArea className='flex-grow'>
            <div className='flex flex-col gap-2'>
              {pokemonList.map((pokemon, idx) => (
                <PokemonItem key={idx} data={pokemon} />
              ))}
            </div>
            <div ref={ref} className='mt-2 p-3 text-center text-sm'>
              {isLoadingMore
                ? '加载中...'
                : isReachingEnd
                  ? `共 ${data[0].total} 种`
                  : '加载更多'}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AllPokemonList

function PokemonItem({ data }: { data: PokemonSimple }) {
  const { index, name, types, meta } = data
  const linkName = name.split('-')[0]
  return (
    <Link
      href={`/pokemon/${linkName}`}
      prefetch={false}
      className='flex flex-row items-center gap-4 rounded-lg border px-4 py-3 text-left text-sm transition-all hover:bg-accent'
    >
      <div className='flex items-center'>
        <span
          className='pokemon-normal'
          style={{
            backgroundPosition: meta.icon_position
          }}
        ></span>
      </div>
      <div className='ml-2 flex flex-grow flex-col items-center'>
        <div className='flex h-[56px] w-full items-center justify-between'>
          <div className='flex h-full flex-col justify-evenly'>
            <span>{name}</span>

            <div className='flex gap-2'>
              {types.map((type) => (
                <TypeBadge key={type} type={type} size='small' />
              ))}
            </div>
          </div>
          <span className='text-xs'>#{index}</span>
        </div>
      </div>
    </Link>
  )
}



