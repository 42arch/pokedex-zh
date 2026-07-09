import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { ItemsLayout } from '@/components/items-layout'
import { getItemList } from '@/services/pokemon'

export default async function ItemsLayoutContainer({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const itemList = await getItemList()

  return (
    <ItemsLayout itemList={itemList}>
      {children}
    </ItemsLayout>
  )
}
