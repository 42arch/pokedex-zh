import type { Metadata } from 'next'
import { MagnifyingGlassIcon, WarningCircleIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { PokemonDetailView } from '@/components/pokemon-detail'
import { translateText } from '@/lib/chinese'
import { ASSET_URL, BASE_URL } from '@/lib/constants'
import { getNationalPokedex, getPokemonDetail } from '@/services/pokemon'

export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: Promise<{ name?: string[] }>
}

async function resolvePokemonDetailName(activeName: string, locale: string) {
  if (!activeName)
    return ''

  const pokemons = await getNationalPokedex()
  const matchedPokemon = pokemons.find((pokemon) => {
    const localizedName = translateText(pokemon.name, locale)
    return activeName === localizedName || activeName === pokemon.name || activeName === pokemon.id
  })

  return matchedPokemon?.name || activeName
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const locale = 'zh'
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = BASE_URL
  const path = activeName ? `/pokemon/${encodeURIComponent(activeName)}` : '/pokemon'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh': `${baseUrl}${path}`,
      'x-default': `${baseUrl}${path}`,
    },
  }

  if (!activeName) {
    return {
      title: '宝可梦图鉴 Pokedex | 宝可梦中文资料站',
      description: '浏览全国图鉴及地区图鉴宝可梦列表，按属性、世代、分类进行检索筛选。',
      alternates,
    }
  }

  const detailName = await resolvePokemonDetailName(activeName, locale)
  const detail = await getPokemonDetail(detailName)
  if (!detail) {
    return {
      title: '未找到宝可梦 | 宝可梦图鉴 Pokedex',
      alternates,
    }
  }

  const localizedName = translateText(detail.name_zh, locale)
  const description = detail.description || `查看宝可梦 ${localizedName} (#${detail.pokedex_id}) 的详细图鉴资料，包含属性、种族值、克制关系、进化链以及可学习招式。`

  const firstForm = detail.forms?.[0]
  const ogImageUrl = firstForm?.image ? `${ASSET_URL}/images/official/${firstForm.image}` : ''

  return {
    title: `${localizedName} (#${detail.pokedex_id}) | 宝可梦图鉴 Pokedex`,
    description: description.slice(0, 150),
    alternates,
    openGraph: ogImageUrl
      ? {
          title: `${localizedName} (#${detail.pokedex_id}) | 宝可梦图鉴 Pokedex`,
          description: description.slice(0, 150),
          images: [
            {
              url: ogImageUrl,
              alt: localizedName,
            },
          ],
        }
      : undefined,
    twitter: ogImageUrl
      ? {
          card: 'summary',
          title: `${localizedName} (#${detail.pokedex_id}) | 宝可梦图鉴 Pokedex`,
          description: description.slice(0, 150),
          images: [ogImageUrl],
        }
      : undefined,
  }
}

export async function generateStaticParams() {
  const pokemons = await getNationalPokedex()
  const ids = [...new Set(pokemons.map(pokemon => pokemon.id))]
  const names = [...new Set(pokemons.map(pokemon => pokemon.name))]
  const params = [
    { name: [] },
    ...ids.map(id => ({ name: [id] })),
  ]

  // Next dev compares the encoded browser pathname verbatim when `output` is
  // `export`, while production needs the raw name to emit the correct files.
  const routeNames = process.env.NODE_ENV === 'development'
    ? names.map(name => encodeURIComponent(name))
    : names
  params.push(...routeNames.map(name => ({ name: [name] })))

  return params
}

export default async function PokemonPage({ params }: PageProps) {
  const { name } = await params
  const locale = 'zh'

  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''

  if (!activeName) {
    return (
      <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-450 border border-zinc-200/50 dark:border-zinc-800/50">
          <MagnifyingGlassIcon className="w-7 h-7" weight="duotone" />
        </div>
        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
          {translateText('请在左侧列表选择宝可梦以查看详情', locale)}
        </p>
      </div>
    )
  }

  const detailName = await resolvePokemonDetailName(activeName, locale)
  const pokemonDetail = await getPokemonDetail(detailName)

  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link prefetch={false} href="/pokemon" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">
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
              <WarningCircleIcon className="w-12 h-12 text-muted-foreground/45" weight="duotone" />
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-4">
                {translateText('未找到该宝可梦的详细资料', locale)}
              </p>
            </div>
          )}
    </div>
  )
}
