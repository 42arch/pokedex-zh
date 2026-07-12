import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { MoveDetailView, MoveEmptyView } from '@/components/moves-layout'
import { translateText } from '@/lib/chinese'
import { getMoveDetail } from '@/services/pokemon'

interface PageProps {
  params: Promise<{ locale: string, name?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, name } = await params
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = 'https://pokedex.starllow.com'
  const path = activeName ? `/moves/${encodeURIComponent(activeName)}` : '/moves'

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
      title: '宝可梦招式列表 | 宝可梦图鉴 Pokedex',
      description: '查询宝可梦的全部招式（技能）列表，包括物理、特殊、变化类招式的属性、威力、命中、PP等参数。',
      alternates,
    }
  }

  const detail = await getMoveDetail(activeName)
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
  return []
}

export default async function MovesPage({ params }: PageProps) {
  const { locale, name } = await params
  setRequestLocale(locale)

  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const activeDetail = activeName ? await getMoveDetail(activeName) : null

  if (activeDetail) {
    return <MoveDetailView activeDetail={activeDetail} locale={locale} />
  }

  return <MoveEmptyView locale={locale} />
}
