'use client'

import { useParams, usePathname } from 'next/navigation'

type DetailSection = 'pokemon' | 'moves' | 'abilities' | 'items'

export function useStaticDetailName(section: DetailSection) {
  const params = useParams()
  const pathname = usePathname()

  const paramName = params?.name
  if (paramName) {
    return Array.isArray(paramName)
      ? decodeURIComponent(paramName[0] || '')
      : decodeURIComponent(paramName)
  }

  const segments = pathname.split('/').filter(Boolean)
  const sectionIndex = segments.indexOf(section)
  const detailName = sectionIndex >= 0 ? segments[sectionIndex + 1] : ''

  return detailName ? decodeURIComponent(detailName) : ''
}
