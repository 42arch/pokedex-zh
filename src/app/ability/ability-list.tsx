'use client'

import type { AbilityFilterOptions } from '@/components/ability-filter'
import type {
  AbilityList,
  AbilitySimple,
} from '@/types'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import AbilityFilter from '@/components/ability-filter'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAbilityList } from '@/http/ability'
import { cn } from '@/lib/utils'

interface Props {
  initialData: AbilityList
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

function AllAbilityList({ className }: Props) {
  const [name, setName] = useState('')
  const [filterOptions, setFilterOptions] = useState<AbilityFilterOptions>({
    generation: null,
    order: 'asc',
  })

  const { data: fullList, error, isLoading } = useSWR('ability-list', getAbilityList)

  const filteredList = useMemo(() => {
    if (!fullList)
      return []

    let result = [...fullList]

    if (name) {
      const search = name.toLowerCase()
      result = result.filter(
        a =>
          a.name_zh.includes(search)
          || a.name_en.toLowerCase().includes(search)
          || a.name_ja.includes(search),
      )
    }

    if (filterOptions.generation) {
      result = result.filter(a => GEN_MAP[a.generation] === filterOptions.generation)
    }

    if (filterOptions.order === 'desc') {
      result.reverse()
    }

    return result
  }, [fullList, name, filterOptions])

  return (
    <div className={cn(className, 'border-r border-r-muted')}>
      <div className="border-b border-b-muted px-4 pb-2 pt-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
        <h1 className="font-bold">特性列表</h1>
      </div>
      <div className="relative h-[calc(100%-3rem-1px)] pl-4 pt-4">
        <div className="relative pr-4">
          <MagnifyingGlass className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索特性"
            className="pl-8"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
        <div className="relative flex h-[calc(100%-3rem-1px)] flex-col pb-2 pr-4">
          <AbilityFilter
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
                      {filteredList.map((ability, idx) => (
                        <AbilityItem key={idx} data={ability} />
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

export default AllAbilityList

function AbilityItem({ data }: { data: AbilitySimple }) {
  const { id, name_zh } = data
  return (
    <Link
      href={`/ability/${name_zh}`}
      prefetch={false}
      className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
    >
      <div className="ml-2 flex grow items-center justify-between">
        <span>{name_zh}</span>
        <span className="text-xs">
          #
          {id}
        </span>
      </div>
    </Link>
  )
}
