import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { ToolsLayout } from '@/components/tools-layout'
import { BASE_URL } from '@/lib/constants'
import { getCombinedPokedex } from '@/services/pokemon'

export const dynamic = 'force-static'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = BASE_URL
  const isHant = locale === 'zh-Hant'
  const alternates = {
    canonical: `${baseUrl}/tools`,
    languages: {
      'zh-Hans': `${baseUrl}/tools`,
      'zh-Hant': `${baseUrl}/zh-Hant/tools`,
      'x-default': `${baseUrl}/tools`,
    },
  }
  return {
    title: isHant ? '寶可夢工具箱 | 寶可夢圖鑑 Pokedex' : '宝可梦工具箱 | 宝可梦图鉴 Pokedex',
    description: isHant
      ? '提供寶可夢隊伍規劃器、性格加成對照表、屬性克製計算器等輔助工具，助您輕鬆培育寶可夢。'
      : '提供宝可梦队伍规划器、性格加成对照表、属性克制计算器等辅助工具，助您轻松培育宝可梦。',
    alternates,
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'zh-Hant' }]
}

export default async function ToolsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const pokemonList = await getCombinedPokedex()

  return (
    <ToolsLayout
      pokemonList={pokemonList}
    />
  )
}
