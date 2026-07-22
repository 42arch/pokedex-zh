import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { AbilitiesLayout } from '@/components/abilities-layout'

export default async function AbilitiesLayoutContainer({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <AbilitiesLayout>
      {children}
    </AbilitiesLayout>
  )
}
