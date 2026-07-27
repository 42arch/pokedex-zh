import type { Metadata } from 'next'
import {
  BagIcon,
  GameControllerIcon,
  LightningIcon,
  SparkleIcon,
  SwordIcon,
  WrenchIcon,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { RandomPokemonCard } from '@/components/random-pokemon-card'
import { Card } from '@/components/ui/card'
import { BASE_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { getCombinedPokedex, getPokemonDetail } from '@/services/pokemon'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = BASE_URL
  const alternates = {
    canonical: `${baseUrl}`,
    languages: {
      'zh': `${baseUrl}`,
      'x-default': `${baseUrl}`,
    },
  }
  return {
    title: '宝可梦中文图鉴 Pokedex | 宝可梦中文资料站',
    description: '快速查询，随时了解你的宝可梦伙伴！ 全面收录宝可梦（神奇宝贝）全国图鉴、地区图鉴、属性克制、性格修正，以及招式、特性、道具的详细中英文资料。',
    alternates,
  }
}

export default async function HomePage() {
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

  // Navigation Links definition
  const navCards = [
    {
      title: t('pokedex'),
      desc: t('pokedexDesc'),
      href: '/pokemon',
      icon: SwordIcon,
      iconBg: 'text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-500/15',
      badge: '1025 只',
    },
    {
      title: t('moves'),
      desc: t('movesDesc'),
      href: '/moves',
      icon: LightningIcon,
      iconBg: 'text-amber-600 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/15',
      badge: '900+ 招式',
    },
    {
      title: t('abilities'),
      desc: t('abilitiesDesc'),
      href: '/abilities',
      icon: SparkleIcon,
      iconBg: 'text-violet-600 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-500/15',
      badge: '300+ 特性',
    },
    {
      title: t('items'),
      desc: t('itemsDesc'),
      href: '/items',
      icon: BagIcon,
      iconBg: 'text-teal-600 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-500/15',
      badge: '1000+ 道具',
    },
    {
      title: t('tools'),
      desc: t('toolsDesc'),
      href: '/tools',
      icon: WrenchIcon,
      iconBg: 'text-primary bg-primary/10 dark:bg-primary/15',
      badge: '辅助工具',
    },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto relative bg-background selection:bg-red-500/10">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-10 md:gap-12 z-10 w-full">

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-300 text-xs font-bold border border-red-500/20 shadow-sm">
            <GameControllerIcon className="w-3.5 h-3.5" weight="fill" />
            宝可梦数据库站
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm select-none">
            <span className="mr-2">宝可梦</span>
            中文图鉴
          </h1>

          <p className="text-base md:text-lg font-medium text-muted-foreground max-w-xl">
            {t('subtitle')}
          </p>

          {/* WeChat Mini Program Card */}
          <Card className="w-full mt-2 border-border/70 shadow-sm bg-card/80 backdrop-blur-sm relative p-5 rounded-2xl text-left hover:shadow-md transition-shadow">
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
                <h3 className="text-xs font-bold text-card-foreground leading-snug">
                  {t('wechatPromoTitle')}
                </h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                  或者微信搜索
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mx-0.5">
                    “训练家口袋图鉴”
                  </span>
                  ，功能更全，更新更及时！
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Highlight Grid Area (Main Cards + Side Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Main Navigation (left 3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-foreground px-1">
              探索图鉴板块
            </h2>
            <div className="flex flex-col gap-4">
              {navCards.map((card) => {
                const CardIcon = card.icon
                return (
                  <Link
                    prefetch={false}
                    key={card.href}
                    href={card.href}
                    className="group"
                  >
                    <div className="flex items-start gap-4.5 p-5 rounded-2xl border border-border/70 bg-card/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-red-500/30 dark:hover:border-red-500/25 transition-all duration-300 backdrop-blur-sm">
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
                          <span className="font-bold text-card-foreground text-base group-hover:text-red-500 dark:group-hover:text-red-300 transition-colors">
                            {card.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                            {card.badge}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
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
