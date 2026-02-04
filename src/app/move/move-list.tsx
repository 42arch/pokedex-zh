'use client'

import type { MoveFilterOptions } from '@/components/move-filter'
import type {
  MoveList,
  MoveSimple,
} from '@/types'
import { getMoveList } from '@/http/move'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import CategoryBadge from '@/components/category-badge'
import MoveFilter from '@/components/move-filter'
import TypeBadge from '@/components/type-badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Props {
  initialData: MoveList
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

function AllMoveList({ className }: Props) {
  const [name, setName] = useState('')
  const [filterOptions, setFilterOptions] = useState<MoveFilterOptions>({
    type: null,
    category: null,
    generation: null,
    order: 'asc',
  })

  const { data: fullList, error, isLoading } = useSWR('move-list', getMoveList)

  const filteredList = useMemo(() => {
    if (!fullList)
      return []

    let result = [...fullList]

    if (name) {
      const search = name.toLowerCase()
      result = result.filter(
        m =>
          m.name_zh.includes(search)
          || m.name_en.toLowerCase().includes(search)
          || m.name_jp.includes(search),
      )
    }

    if (filterOptions.generation) {
      result = result.filter(m => GEN_MAP[m.generation] === filterOptions.generation)
    }

    if (filterOptions.type) {
      result = result.filter(m => m.type === filterOptions.type)
    }

    if (filterOptions.category) {
      result = result.filter(m => m.category === filterOptions.category)
    }

    if (filterOptions.order === 'desc') {
      result.reverse()
    }

    return result
  }, [fullList, name, filterOptions])

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
                      {filteredList.map((move, idx) => (
                        <MoveItem key={idx} data={move} />
                      ))}
                      <div className="mt-2 p-3 text-center text-sm text-muted-foreground">
                        共
                        {' '}
                        {filteredList.length}
                        {' '}
                        个
                      </div>
                    </div>
                  )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AllMoveList

function MoveItem({ data }: { data: MoveSimple }) {
  const { id, name_zh } = data
  return (
    <Link
      href={`/move/${name_zh}`}
      className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
    >
      <div className="ml-2 flex grow flex-col items-center">
        <div className="flex h-[26px] w-full items-center justify-between">
          <div className="flex h-full flex-col justify-evenly">
            <span>{name_zh}</span>
          </div>

          <div className="flex items-center gap-2">
            <TypeBadge type={data.type} size="small" />
            <CategoryBadge type={data.category} size="small" />
            <span className="ml-2 text-xs">
              #
              {id}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
