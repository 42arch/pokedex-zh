import * as React from 'react'
import { getItemList } from '@/services/pokemon'
import { ItemsLayout } from '@/components/items-layout'

interface PageProps {
  searchParams: Promise<{ name?: string }>
}

export default async function ItemsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const itemList = await getItemList()

  const activeName = resolvedSearchParams.name || ''

  return (
    <ItemsLayout 
      itemList={itemList} 
      activeName={activeName} 
    />
  )
}
