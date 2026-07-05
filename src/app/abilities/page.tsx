import * as React from 'react'
import { getAbilityList, getAbilityDetail } from '@/services/pokemon'
import { AbilitiesLayout } from '@/components/abilities-layout'

interface PageProps {
  searchParams: Promise<{ name?: string }>
}

export default async function AbilitiesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const abilityList = await getAbilityList()

  const activeName = resolvedSearchParams.name || ''
  const activeDetail = activeName ? await getAbilityDetail(activeName) : null

  return (
    <AbilitiesLayout 
      abilityList={abilityList} 
      activeDetail={activeDetail} 
      activeName={activeName} 
    />
  )
}
