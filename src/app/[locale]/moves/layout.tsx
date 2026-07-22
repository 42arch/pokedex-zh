import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { MovesLayout } from '@/components/moves-layout'

export default async function MovesLayoutContainer({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <MovesLayout>
      {children}
    </MovesLayout>
  )
}
