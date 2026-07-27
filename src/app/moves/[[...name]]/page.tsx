import type { Metadata } from 'next'
import * as React from 'react'
import { StaticMoveDetailPage } from '@/components/static-detail-pages'
import { translateText } from '@/lib/chinese'
import { BASE_URL } from '@/lib/constants'
import { getMoveDetail, getMoveList } from '@/services/pokemon'

export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: Promise<{ name?: string[] }>
}

async function resolveMoveSourceName(activeName: string, locale: string) {
  if (!activeName)
    return ''

  const moves = await getMoveList()
  const matchedMove = moves.find((move) => {
    const localizedName = translateText(move.name_zh, locale)
    return activeName === localizedName || activeName === move.name_zh
  })

  return matchedMove?.name_zh || activeName
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const locale = 'zh'
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = BASE_URL
  const path = activeName ? `/moves/${encodeURIComponent(activeName)}` : '/moves'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh': `${baseUrl}${path}`,
      'x-default': `${baseUrl}${path}`,
    },
  }

  if (!activeName) {
    return {
      title: '宝可梦招式列表 | 宝可梦图鉴 Pokedex',
      description: '查询宝可梦的全部招式（技能）列表，包括物理、特殊、变化类招式的属性、威力、命中、PP等参数。',
      alternates,
    }
  }

  const sourceName = await resolveMoveSourceName(activeName, locale)
  const detail = await getMoveDetail(sourceName)
  if (!detail) {
    return {
      title: '未找到招式 | 宝可梦图鉴 Pokedex',
      alternates,
    }
  }

  const nameZh = translateText(detail.name_zh, locale)
  const description = detail.description || `查看宝可梦招式“${nameZh}”的详细资料，包含招式分类、属性、威力、命中率、技能效果及可以学习该招式的宝可梦列表。`

  return {
    title: `${nameZh} (招式) | 宝可梦图鉴 Pokedex`,
    description: description.slice(0, 150),
    alternates,
  }
}

export async function generateStaticParams() {
  return [{ name: [] }]
}

export default async function MovesPage() {
  return <StaticMoveDetailPage />
}
