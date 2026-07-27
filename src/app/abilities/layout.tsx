import * as React from 'react'
import { AbilitiesLayout } from '@/components/abilities-layout'

export default async function AbilitiesLayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AbilitiesLayout>
      {children}
    </AbilitiesLayout>
  )
}
