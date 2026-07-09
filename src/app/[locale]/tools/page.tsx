import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import * as React from 'react'
import { ToolsLayout } from '@/components/tools-layout'
import { getCombinedPokedex } from '@/services/pokemon'

export const metadata: Metadata = {
  title: '宝可梦工具箱 | 宝可梦图鉴 Pokedex',
  description: '提供宝可梦队伍规划器、性格加成对照表、属性克制计算器等辅助工具，助您轻松培育宝可梦。',
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
