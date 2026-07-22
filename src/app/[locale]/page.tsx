import type { Metadata } from 'next'
import {
  BagIcon,
  LightningIcon,
  SparkleIcon,
  SwordIcon,
  WrenchIcon,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { RandomPokemonCard } from '@/components/random-pokemon-card'
import { Card } from '@/components/ui/card'
import { BASE_URL } from '@/lib/constants'
import { cn, getLocalizedPath } from '@/lib/utils'
import { getCombinedPokedex, getPokemonDetail } from '@/services/pokemon'

export const dynamic = 'force-static'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = BASE_URL
  const isHant = locale === 'zh-Hant'
  const alternates = {
    canonical: `${baseUrl}`,
    languages: {
      'zh-Hans': `${baseUrl}`,
      'zh-Hant': `${baseUrl}/zh-Hant`,
      'x-default': `${baseUrl}`,
    },
  }
  return {
    title: isHant ? '寶可夢中文圖鑑 Pokedex | 寶可夢中文資料站' : '宝可梦中文图鉴 Pokedex | 宝可梦中文资料站',
    description: isHant
      ? '快速查詢，隨時了解你的寶可夢夥伴！ 全面收錄寶可夢（神奇寶貝）全國圖鑑、地區圖鑑、屬性克製、性格修正，以及招式、特性、道具的詳細中英文資料。'
      : '快速查询，随时了解你的宝可梦伙伴！ 全面收录宝可梦（神奇宝贝）全国图鉴、地区图鉴、属性克制、性格修正，以及招式、特性、道具的详细中英文资料。',
    alternates,
  }
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'zh-Hant' }]
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Home')
  const pokemonList = await getCombinedPokedex()

  // Pick an initial random Pokemon on the server
  let initialRandomPokemon = null
  let initialRandomPokemonDetail = null

  if (pokemonList && pokemonList.length > 0) {
    const randomIndex = Math.floor(Math.random() * pokemonList.length)
    initialRandomPokemon = pokemonList[randomIndex]
    initialRandomPokemonDetail = await getPokemonDetail(initialRandomPokemon.id)
  }

  const localPath = (path: string) => getLocalizedPath(path, locale)

  // Navigation Links definition
  const navCards = [
    {
      title: t('pokedex'),
      desc: t('pokedexDesc'),
      href: '/pokemon',
      icon: SwordIcon,
      iconBg: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20',
      badge: locale === 'zh-Hant' ? '1025 隻' : '1025 只',
    },
    {
      title: t('moves'),
      desc: t('movesDesc'),
      href: '/moves',
      icon: LightningIcon,
      iconBg: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20',
      badge: '900+ 招式',
    },
    {
      title: t('abilities'),
      desc: t('abilitiesDesc'),
      href: '/abilities',
      icon: SparkleIcon,
      iconBg: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20',
      badge: '300+ 特性',
    },
    {
      title: t('items'),
      desc: t('itemsDesc'),
      href: '/items',
      icon: BagIcon,
      iconBg: 'text-teal-500 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-500/20',
      badge: '1000+ 道具',
    },
    {
      title: t('tools'),
      desc: t('toolsDesc'),
      href: '/tools',
      icon: WrenchIcon,
      iconBg: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20',
      badge: locale === 'zh-Hant' ? '輔助工具' : '辅助工具',
    },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto relative bg-zinc-50/20 dark:bg-zinc-950/20 selection:bg-red-500/10">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-10 md:gap-12 z-10 w-full">

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20 shadow-sm animate-pulse-slow">
            🎮
            {' '}
            {locale === 'zh-Hant' ? '寶可夢數據庫站' : '宝可梦数据库站'}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm select-none">
            <span className="mr-2">{locale === 'zh-Hant' ? '寶可夢' : '宝可梦'}</span>
            {locale === 'zh-Hant' ? '中文圖鑑' : '中文图鉴'}
          </h1>

          <p className="text-base md:text-lg font-medium text-zinc-500 dark:text-zinc-400 max-w-xl">
            {t('subtitle')}
          </p>

          {/* WeChat Mini Program Card */}
          <Card className="w-full mt-2 border-zinc-150 dark:border-zinc-900 shadow-sm bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm relative p-5 rounded-2xl text-left hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {/* QR Code Container */}
              <div className="shrink-0 relative">
                <div className="bg-white p-1.5 rounded-xl shadow-inner border border-zinc-100">
                  <img
                    src="/images/wechat-qrcode.png"
                    alt="WeChat Mini Program QR Code"
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Content Text */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  {t('wechatPromoBadge')}
                </div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {t('wechatPromoTitle')}
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                  {locale === 'zh-Hant' ? '或者微信搜索' : '或者微信搜索'}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mx-0.5">
                    “训练家口袋图鉴”
                  </span>
                  {locale === 'zh-Hant' ? '，功能更全，更新更及時！' : '，功能更全，更新更及时！'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Highlight Grid Area (Main Cards + Side Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Main Navigation (left 3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-300 px-1">
              {locale === 'zh-Hant' ? '探索圖鑑板塊' : '探索图鉴板块'}
            </h2>
            <div className="flex flex-col gap-4">
              {navCards.map((card) => {
                const CardIcon = card.icon
                return (
                  <Link
                    prefetch={false}
                    key={card.href}
                    href={localPath(card.href)}
                    className="group"
                  >
                    <div className="flex items-start gap-4.5 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-900 bg-white/70 dark:bg-zinc-900/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-red-500/30 dark:hover:border-red-500/20 transition-all duration-300 backdrop-blur-sm">
                      <div
                        className={cn(
                          'p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110',
                          card.iconBg,
                        )}
                      >
                        <CardIcon className="w-6.5 h-6.5" weight="bold" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 dark:text-zinc-50 text-base group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                            {card.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-zinc-800/80 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                            {card.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Side Showcase (right 2 columns) */}
          <div className="lg:col-span-2">
            <RandomPokemonCard
              pokemonList={pokemonList}
              initialRandomPokemon={initialRandomPokemon}
              initialRandomPokemonDetail={initialRandomPokemonDetail}
            />
          </div>

        </div>

      </div>
    </div>
  )
}
