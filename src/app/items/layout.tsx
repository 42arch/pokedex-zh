import * as React from 'react'
import { ItemsLayout } from '@/components/items-layout'

export default async function ItemsLayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ItemsLayout>
      {children}
    </ItemsLayout>
  )
}
