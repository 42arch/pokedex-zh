'use client'

import type { MoveFilterOptions } from '@/components/move-filter'
import type {
  MoveList,
  MoveSimple,
  PaginatedResponse,
  PokemonList,
} from '@/types'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import CategoryBadge from '@/components/category-badge'
import MoveFilter from '@/components/move-filter'
import TypeBadge from '@/components/type-badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import useOnView from '@/hooks/useOnView'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 50
const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Props {
  initialData: MoveList
  className?: string
}

function AllMoveList({ initialData, className }: Props) {
  const ref = useRef<HTMLDivElement>(null!)
  const isVisible = useOnView(ref)
  const [fetched, setFetched] = useState(false)
  const [moveList, setMoveList] = useState<MoveList>(initialData)
  const [name, setName] = useState('')
  const [filterOptions, setFilterOptions] = useState<MoveFilterOptions>({
    type: null,
    category: null,
    generation: null,
    order: 'asc',
  })

  const getKey = (
    page: number,
    previousPageData: PaginatedResponse<MoveList> | null,
  ): string | null => {
    if (previousPageData && !previousPageData.contents.length)
      return null
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: PAGE_SIZE.toString(),
      name,
      order: filterOptions.order,
    })

    if (filterOptions.generation)
      params.append('generation', filterOptions.generation)
    if (filterOptions.type)
      params.append('type', filterOptions.type)
    if (filterOptions.category)
      params.append('category', filterOptions.category)

    return `/api/move?${params.toString()}`
  }
  const { data, error, size, setSize } = useSWRInfinite<
    PaginatedResponse<PokemonList>
  >(getKey, fetcher)

  const isLoadingInitialData = !data && !error
  const isLoadingMore
    = isLoadingInitialData
      || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0].contents?.length === 0
  const isReachingEnd
    = isEmpty || (data && data[data.length - 1]?.contents.length < PAGE_SIZE)

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
    if (data) {
      setFetched(true)
      const newList: MoveList = []
      data.forEach(page =>
        page.contents.forEach((p: MoveSimple) => {
          newList.push(p)
        }),
      )
      if (fetched) {
        setMoveList(newList)
      }
      else {
        if (size > 1) {
          setMoveList(newList)
        }
      }
    }
  }, [
    data,
    fetched,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isVisible,
    setSize,
    size,
  ])

  return (
    <div className={cn(className, 'border-r border-r-muted')}>
      <div className="border-b border-b-muted px-4 pb-2 pt-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
        <h1 className="font-bold">招式列表</h1>
      </div>
      <div className="relative h-[calc(100%-3rem-1px)] pl-4 pt-4">
        <div className="relative pr-4">
          <MagnifyingGlass className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索招式"
            className="pl-8"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
        <div className="relative flex h-[calc(100%-3rem-1px)] flex-col pb-2 pr-4">
          <MoveFilter
            options={filterOptions}
            onOptionsChange={(v) => {
              setFilterOptions(v)
            }}
          />
          <ScrollArea className="flex-grow">
            <div className="flex flex-col gap-2">
              {moveList.map((move, idx) => (
                <MoveItem key={idx} data={move} />
              ))}
            </div>
            <div ref={ref} className="mt-2 p-3 text-center text-sm">
              {isLoadingMore
                ? '加载中...'
                : isReachingEnd
                  ? `共${data[0].total}个`
                  : '加载更多'}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AllMoveList

function MoveItem({ data }: { data: MoveSimple }) {
  const { index, name } = data
  return (
    <Link
      href={`/move/${name}`}
      className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
    >
      <div className="ml-2 flex grow flex-col items-center">
        <div className="flex h-[26px] w-full items-center justify-between">
          <div className="flex h-full flex-col justify-evenly">
            <span>{name}</span>
          </div>

          <div className="flex items-center gap-2">
            <TypeBadge type={data.type} size="small" />
            <CategoryBadge type={data.category} size="small" />
            <span className="ml-2 text-xs">
              #
              {index}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
