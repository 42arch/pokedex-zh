import type { Metadata } from 'next'
import * as React from 'react'
import { ToolsLayout } from '@/components/tools-layout'
import { BASE_URL } from '@/lib/constants'
import { getCombinedPokedex } from '@/services/pokemon'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = BASE_URL
  const alternates = {
    canonical: `${baseUrl}/tools`,
    languages: {
      'zh': `${baseUrl}/tools`,
      'x-default': `${baseUrl}/tools`,
    },
  }
  return {
    title: '宝可梦工具箱 | 宝可梦图鉴 Pokedex',
    description: '提供宝可梦队伍规划器、性格加成对照表、属性克制计算器等辅助工具，助您轻松培育宝可梦。',
    alternates,
  }
}

export default async function ToolsPage() {
  const pokemonList = await getCombinedPokedex()

  return (
    <ToolsLayout
      pokemonList={pokemonList}
    />
  )
}
