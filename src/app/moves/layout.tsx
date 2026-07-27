import * as React from 'react'
import { MovesLayout } from '@/components/moves-layout'

export default async function MovesLayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MovesLayout>
      {children}
    </MovesLayout>
  )
}
