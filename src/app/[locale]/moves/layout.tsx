import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { MovesLayout } from '@/components/moves-layout'
import { getMoveList } from '@/services/pokemon'

export default async function MovesLayoutContainer({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const moveList = await getMoveList()

  return (
    <MovesLayout moveList={moveList}>
      {children}
    </MovesLayout>
  )
}
