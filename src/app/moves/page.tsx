import * as React from 'react'
import { getMoveList, getMoveDetail } from '@/services/pokemon'
import { MovesLayout } from '@/components/moves-layout'

interface PageProps {
  searchParams: Promise<{ name?: string }>
}

export default async function MovesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const moveList = await getMoveList()

  const activeName = resolvedSearchParams.name || ''
  const activeDetail = activeName ? await getMoveDetail(activeName) : null

  return (
    <MovesLayout 
      moveList={moveList} 
      activeDetail={activeDetail} 
      activeName={activeName} 
    />
  )
}
