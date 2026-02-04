'use client'

import type { FilterOptions } from '@/components/pokemon-filter'
import type {
  PokemonList,
  PokemonSimple,
  Type,
} from '@/types'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import PokedexSelect from '@/components/pokedex-select'
import PokemonFilter from '@/components/pokemon-filter'
import TypeBadge from '@/components/type-badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getPokedex } from '@/http/pokemon'

import { cn } from '@/lib/utils'

interface Props {
  initialData: PokemonList
  className?: string
}

const GEN_MAP: Record<number, string> = {
  1: '第一世代',
  2: '第二世代',
  3: '第三世代',
  4: '第四世代',
  5: '第五世代',
  6: '第六世代',
  7: '第七世代',
  8: '第八世代',
  9: '第九世代',
}

function AllPokemonList({ className }: Props) {
  const [name, setName] = useState('')
  const [pokedex, setPokedex] = useState('national')
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type1: null,
    type2: null,
    generation: null,
    filter: null,
    order: 'asc',
  })

  const { data: fullList, error, isLoading } = useSWR('pokedex-full', getPokedex)

  const filteredList = useMemo(() => {
    if (!fullList)
      return []

    let result = [...fullList]

    // 搜索过滤
    if (name) {
      const search = name.toLowerCase()
      result = result.filter(
        p =>
          p.name.includes(search)
          || p.name_en?.toLowerCase().includes(search)
          || p.name_jp?.includes(search),
      )
    }

    // 世代过滤
    if (filterOptions.generation) {
      result = result.filter((p) => {
        const genStr = GEN_MAP[p.gen] || p.generation
        return genStr === filterOptions.generation
      })
    }

    // 分类过滤 (初、鼠、石等)
    if (filterOptions.filter) {
      result = result.filter(p => p.filter.includes(filterOptions.filter!))
    }

    // 属性过滤
    if (filterOptions.type1 && filterOptions.type2) {
      result = result.filter(
        p =>
          p.types.includes(filterOptions.type1 as Type)
          && p.types.includes(filterOptions.type2 as Type),
      )
    }
    else if (filterOptions.type1) {
      result = result.filter(p => p.types.includes(filterOptions.type1 as Type))
    }

    // 排序
    if (filterOptions.order === 'desc') {
      result.reverse()
    }

    return result
  }, [fullList, name, filterOptions])

  return (
    <div className={cn(className, 'border-r border-r-muted')}>
      <div className="border-b border-b-muted px-4 pb-2 pt-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
        <PokedexSelect value={pokedex} onChange={v => setPokedex(v)} />
      </div>
      <div className="relative h-[calc(100%-3rem-1px)] pl-4 pt-4">
        <div className="relative pr-4">
          <MagnifyingGlass className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索宝可梦"
            className="pl-8"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
        <div className="relative flex h-[calc(100%-3rem-1px)] flex-col pb-2 pr-4">
          <PokemonFilter
            options={filterOptions}
            onOptionsChange={(v) => {
              setFilterOptions(v)
            }}
          />
          <ScrollArea className="grow">
            {isLoading
              ? (
                  <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                    加载中...
                  </div>
                )
              : error
                ? (
                    <div className="flex h-40 items-center justify-center text-sm text-red-500">
                      加载失败，请重试
                    </div>
                  )
                : (
                    <div className="flex flex-col gap-2">
                      {filteredList.map((pokemon, idx) => (
                        <PokemonItem key={idx} data={pokemon} />
                      ))}
                      <div className="mt-2 p-3 text-center text-sm text-muted-foreground">
                        共
                        {' '}
                        {filteredList.length}
                        {' '}
                        种
                      </div>
                    </div>
                  )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AllPokemonList

function PokemonItem({ data }: { data: PokemonSimple }) {
  const { id, name, types, icon } = data
  const linkName = name.split('-')[0]
  return (
    <Link
      href={`/pokemon/${linkName}`}
      prefetch={false}
      className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
    >
      <div className="flex items-center">
        <span
          className="pokemon-icon"
          style={{
            backgroundPosition: icon,
          }}
        >
        </span>
      </div>
      <div className="ml-2 flex grow flex-col items-center">
        <div className="flex h-[56px] w-full items-center justify-between">
          <div className="flex h-full flex-col justify-evenly">
            <span>{name}</span>

            <div className="flex gap-2">
              {types.map(type => (
                <TypeBadge key={type} type={type as Type} size="small" />
              ))}
            </div>
          </div>
          <span className="text-xs">
            #
            {id}
          </span>
        </div>
      </div>
    </Link>
  )
}
