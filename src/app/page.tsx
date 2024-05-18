'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu
} from '@/components/ui/dropdown-menu'
import { TbSearch, TbFilter, TbArrowsSort } from 'react-icons/tb'
import { useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { PokemonData } from '@/typings'
import { GET_POKEMONS } from '@/graphql/queries'
import { typeList } from '@/lib/constants'
import PokemonCard from './pokemon-card'
import { InView } from 'react-intersection-observer'
import Loading from '@/components/loading'

const LIMIT = 12
const allTypes = typeList.map((type) => type.name)

export default function HomePage() {
  const searchRef = useRef<HTMLInputElement>(null!)
  const [types, setTypes] = useState(allTypes)

  const { data, loading, fetchMore, refetch, error } = useQuery<{
    pokemons: PokemonData[]
  }>(GET_POKEMONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      langId: 12,
      limit: LIMIT,
      offset: 0,
      search: '',
      types: types
    }
  })

  const handleSearch = () => {
    refetch({
      search: searchRef.current.value
    })
  }

  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container grid gap-8 px-4 md:px-6'>
        <div className='flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-16'>
          <div className='grid gap-4'>
            <h1 className='text-5xl font-bold tracking-tight'>宝可梦图鉴</h1>
            <p className='px-1 text-xl text-gray-500 dark:text-gray-400'>
              探索和发现你喜欢的宝可梦！
            </p>
          </div>
          <div className='w-full flex-1 md:w-auto'>
            <div className='relative md:w-2/3'>
              <TbSearch className='absolute left-2.5 top-3.5 h-5 w-5 text-gray-500 dark:text-gray-400' />
              <Input
                ref={searchRef}
                className='h-12 w-full appearance-none bg-white pl-8 pr-20 shadow-none dark:bg-gray-950'
                placeholder='搜索名称...'
                type='search'
              />
              <Button
                className='absolute right-2.5 top-1.5'
                onClick={() => handleSearch()}
              >
                搜索
              </Button>
            </div>
          </div>
        </div>
        <div className='flex items-start gap-4 md:items-center md:gap-8'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex-1 md:flex-none' variant='outline'>
                <TbFilter className='mr-2 h-4 w-4' />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              <DropdownMenuLabel>属性</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {typeList.map((type, index) => (
                <DropdownMenuItem
                  key={index}
                  className='p-1 pb-1'
                  onClick={() => setTypes([type.name])}
                >
                  {/* <TypeIcon className='mr-2 h-4 w-4' /> */}
                  <span
                    className='min-w-16 rounded-full px-2 text-center text-white'
                    style={{
                      backgroundColor: type.color
                    }}
                  >
                    {type.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex-1 md:flex-none' variant='outline'>
                <TbArrowsSort className='mr-2 h-4 w-4' />
                排序
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <TbArrowsSort className='mr-2 h-4 w-4' />
                Type
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TbArrowsSort className='mr-2 h-4 w-4' />
                Generation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TbArrowsSort className='mr-2 h-4 w-4' />
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {data?.pokemons.map((item) => (
            <PokemonCard key={item.id} data={item} />
          ))}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <InView
            as='div'
            className='h-6'
            threshold={0}
            rootMargin='25px 0px'
            onChange={(inView) => {
              if (inView) {
                fetchMore({
                  variables: {
                    offset: data?.pokemons.length || 0
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    return {
                      pokemons: [...prev.pokemons, ...fetchMoreResult.pokemons]
                    }
                  }
                })
              }
            }}
          ></InView>
        )}
      </div>
    </section>
  )
}
