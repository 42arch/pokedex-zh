import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import type { AbilityList, PaginatedResponse } from '@/types'
import { fetchData } from '@/lib/fetch'
import AllAbilityList from './ability-list'

export const metadata: Metadata = {
  title: '宝可梦中文图鉴 | 特性列表',
  description: '宝可梦中文图鉴，特性列表。',
  keywords: ['宝可梦', '宝可梦图鉴', '特性列表'],
}

export default async function Page({ children }: PropsWithChildren) {
  const data = await fetchData<PaginatedResponse<AbilityList>>(
    'ability?page=0&pageSize=30',
  )

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <AllAbilityList
        initialData={data.contents}
        className="w-full border-l border-l-muted md:border-l-0 lg:w-1/3 "
      />
      {children}
    </div>
  )
}
