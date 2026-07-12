import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import * as React from 'react'
import { PokemonDetailView } from '@/components/pokemon-detail'
import { translateText } from '@/lib/chinese'
import { ASSET_URL } from '@/lib/constants'
import { getLocalizedPath } from '@/lib/utils'
import { getCombinedPokedex, getPokemonDetail } from '@/services/pokemon'

interface PageProps {
  params: Promise<{ locale: string, id?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params
  const activeId = id?.[0]
  const baseUrl = 'https://pokedex.starllow.com'
  const path = activeId ? `/pokemon/${activeId}` : '/pokemon'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh-Hans': `${baseUrl}${path}`,
      'zh-Hant': `${baseUrl}/zh-Hant${path}`,
      'x-default': `${baseUrl}${path}`,
    },
  }

  if (!activeId) {
    return {
      title: '宝可梦图鉴 Pokedex | 宝可梦中文资料站',
      description: '浏览全国图鉴及地区图鉴宝可梦列表，按属性、世代、分类进行检索筛选。',
      alternates,
    }
  }

  const detail = await getPokemonDetail(activeId)
  if (!detail) {
    return {
      title: '未找到宝可梦 | 宝可梦图鉴 Pokedex',
      alternates,
    }
  }

  const name = translateText(detail.name_zh, locale)
  const description = detail.description || `查看宝可梦 ${name} (#${activeId}) 的详细图鉴资料，包含属性、种族值、克制关系、进化链以及可学习招式。`

  const firstForm = detail.forms?.[0]
  const ogImageUrl = firstForm?.image ? `${ASSET_URL}/images/official/${firstForm.image}` : ''

  return {
    title: `${name} (#${activeId}) | 宝可梦图鉴 Pokedex`,
    description: description.slice(0, 150),
    alternates,
    openGraph: ogImageUrl
      ? {
          title: `${name} (#${activeId}) | 宝可梦图鉴 Pokedex`,
          description: description.slice(0, 150),
          images: [
            {
              url: ogImageUrl,
              alt: name,
            },
          ],
        }
      : undefined,
    twitter: ogImageUrl
      ? {
          card: 'summary',
          title: `${name} (#${activeId}) | 宝可梦图鉴 Pokedex`,
          description: description.slice(0, 150),
          images: [ogImageUrl],
        }
      : undefined,
  }
}

export async function generateStaticParams() {
  const locales = ['zh', 'zh-Hant']
  const pokemons = await getCombinedPokedex()
  const params: { locale: string, id: string[] }[] = []

  for (const locale of locales) {
    // For /pokemon
    params.push({ locale, id: [] })
    for (const p of pokemons) {
      params.push({ locale, id: [p.id] })
    }
  }
  return params
}

export default async function PokemonPage({ params }: PageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  // Get active Pokemon ID if any
  const activeId = id?.[0]

  if (!activeId) {
    return (
      <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-450 border border-zinc-200/50 dark:border-zinc-800/50">
          🔍
        </div>
        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
          {translateText('请在左侧列表选择宝可梦以查看详情', locale)}
        </p>
      </div>
    )
  }

  const pokemonDetail = await getPokemonDetail(activeId)

  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link href={getLocalizedPath('/pokemon', locale)} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">
          <span>←</span>
          {' '}
          {translateText('返回图鉴列表', locale)}
        </Link>
      </div>

      {pokemonDetail
        ? (
            <PokemonDetailView detail={pokemonDetail} />
          )
        : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-zinc-300 dark:text-zinc-700 text-5xl">⚠️</span>
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-4">
                {translateText('未找到该宝可梦的详细资料', locale)}
              </p>
            </div>
          )}
    </div>
  )
}
