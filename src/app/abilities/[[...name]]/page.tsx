import type { Metadata } from 'next'
import * as React from 'react'
import { StaticAbilityDetailPage } from '@/components/static-detail-pages'
import { translateText } from '@/lib/chinese'
import { BASE_URL } from '@/lib/constants'
import { getAbilityDetail, getAbilityList } from '@/services/pokemon'

export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: Promise<{ name?: string[] }>
}

async function resolveAbilitySourceName(activeName: string, locale: string) {
  if (!activeName)
    return ''

  const abilities = await getAbilityList()
  const matchedAbility = abilities.find((ability) => {
    const localizedName = translateText(ability.name_zh, locale)
    return activeName === localizedName || activeName === ability.name_zh
  })

  return matchedAbility?.name_zh || activeName
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const locale = 'zh'
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = BASE_URL
  const path = activeName ? `/abilities/${encodeURIComponent(activeName)}` : '/abilities'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh': `${baseUrl}${path}`,
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

  const sourceName = await resolveAbilitySourceName(activeName, locale)
  const detail = await getAbilityDetail(sourceName)
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
  return [{ name: [] }]
}

export default async function AbilitiesPage() {
  return <StaticAbilityDetailPage />
}
