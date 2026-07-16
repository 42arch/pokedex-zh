import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { AbilityDetailView, AbilityEmptyView } from '@/components/ability-detail-view'
import { translateText } from '@/lib/chinese'
import { getAbilityDetail } from '@/services/pokemon'

interface PageProps {
  params: Promise<{ locale: string, name?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, name } = await params
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = 'https://pokedex.starllow.com'
  const path = activeName ? `/abilities/${encodeURIComponent(activeName)}` : '/abilities'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh-Hans': `${baseUrl}${path}`,
      'zh-Hant': `${baseUrl}/zh-Hant${path}`,
      'x-default': `${baseUrl}${path}`,
    },
  }

  if (!activeName) {
    return {
      title: '宝可梦特性列表 | 宝可梦图鉴 Pokedex',
      description: '查询宝可梦的特性列表，了解各种普通特性和隐藏特性（梦特）的效果及拥有该特性的宝可梦。',
      alternates,
    }
  }

  const detail = await getAbilityDetail(activeName)
  if (!detail) {
    return {
      title: '未找到特性 | 宝可梦图鉴 Pokedex',
      alternates,
    }
  }

  const nameZh = translateText(detail.name_zh, locale)
  const description = detail.description || `查看宝可梦特性“${nameZh}”的详细资料，包含特性效果、对战内外的效果细节以及拥有该特性的宝可梦列表。`

  return {
    title: `${nameZh} (特性) | 宝可梦图鉴 Pokedex`,
    description: description.slice(0, 150),
    alternates,
  }
}

export async function generateStaticParams() {
  return []
}

export default async function AbilitiesPage({ params }: PageProps) {
  const { locale, name } = await params
  setRequestLocale(locale)

  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const activeDetail = activeName ? await getAbilityDetail(activeName) : null

  if (activeDetail) {
    return <AbilityDetailView activeDetail={activeDetail} locale={locale} />
  }

  return <AbilityEmptyView locale={locale} />
}
