'use client'

import type { NationalPokemon, PokemonDetail } from '@/services/pokemon'
import { ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import * as React from 'react'
import { TypeBadge } from '@/components/type-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { translateText } from '@/lib/chinese'
import { ASSET_URL } from '@/lib/constants'
import { cn, getLocalizedPath } from '@/lib/utils'

interface RandomPokemonCardProps {
  pokemonList: NationalPokemon[]
  initialRandomPokemon: NationalPokemon | null
  initialRandomPokemonDetail: PokemonDetail | null
}

export function RandomPokemonCard({
  pokemonList,
  initialRandomPokemon,
  initialRandomPokemonDetail,
}: RandomPokemonCardProps) {
  const locale = useLocale()

  // Random Pokemon States
  const [randomPoke, setRandomPoke] = React.useState<NationalPokemon | null>(initialRandomPokemon)
  const [randomPokeDetail, setRandomPokeDetail] = React.useState<PokemonDetail | null>(initialRandomPokemonDetail)
  const [isRandomizing, setIsRandomizing] = React.useState(false)

  // Get localized path helper
  const localPath = (path: string) => getLocalizedPath(path, locale)

  // Fetch new random Pokemon details
  const drawRandomPokemon = async () => {
    if (isRandomizing || !pokemonList || pokemonList.length === 0)
      return
    setIsRandomizing(true)

    try {
      const randomIndex = Math.floor(Math.random() * pokemonList.length)
      const nextPoke = pokemonList[randomIndex]

      const fileName = `${nextPoke.id}-${nextPoke.name}.json`
      const url = `${ASSET_URL}/pokemon/${encodeURIComponent(fileName)}`

      const response = await fetch(url)
      if (response.ok) {
        const detail = await response.json() as PokemonDetail
        setRandomPoke(nextPoke)
        setRandomPokeDetail(detail)
      }
    }
    catch (err) {
      console.error('Failed to load random pokemon:', err)
    }
    finally {
      setIsRandomizing(false)
    }
  }

  // Setup random Pokemon display variables
  const currentForm = randomPokeDetail?.forms?.[0]
  const randomPokeImg = currentForm?.image ? `${ASSET_URL}/images/official/${currentForm.image}` : null
  const randomPokeTypes = currentForm?.types || randomPoke?.types || []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-300">
          随机宝可梦伙伴
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={drawRandomPokemon}
          disabled={isRandomizing}
          className="h-8 rounded-lg gap-1.5 text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-500/5 dark:hover:bg-red-500/10 font-bold"
        >
          <ArrowsClockwiseIcon className={cn('w-4 h-4', isRandomizing && 'animate-spin')} />
          换一只
        </Button>
      </div>

      {randomPoke && (
        <Card className="overflow-hidden border-zinc-200/80 dark:border-zinc-800/80 shadow-md shadow-zinc-200/20 dark:shadow-black/20 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md relative group/poke text-card-foreground">
          <CardContent className="p-6 flex flex-col items-center text-center">

            {/* Decorative glowing back light */}
            <div className="absolute top-6 w-32 h-32 bg-red-500/10 dark:bg-red-500/5 rounded-full filter blur-[30px] group-hover/poke:scale-125 transition-transform duration-500" />

            {/* ID / Name */}
            <div className="space-y-1.5 z-10 w-full">
              <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">
                #
                {randomPoke.id}
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {translateText(randomPoke.name, locale)}
              </h3>
            </div>

            {/* Artwork Image Display */}
            <div className="h-44 flex items-center justify-center my-4 relative z-10 w-full select-none">
              {randomPokeImg
                ? (
                    <img
                      src={randomPokeImg}
                      alt={randomPoke.name}
                      className={cn(
                        'max-h-full max-w-[85%] object-contain drop-shadow-md transition-all duration-300 group-hover/poke:scale-108',
                        isRandomizing ? 'opacity-35 scale-90 blur-xs' : 'opacity-100 scale-100',
                      )}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )
                : (
                    <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                      No Image
                    </div>
                  )}
            </div>

            {/* Types */}
            <div className="flex gap-2 mb-5 z-10">
              {randomPokeTypes.map(type => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>

            {/* Heights/Weights profile detail */}
            {randomPokeDetail && currentForm && (
              <div className="grid grid-cols-2 gap-4 w-full px-4 py-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-850/60 border border-zinc-200/30 dark:border-zinc-700/30 mb-5 text-left text-xs z-10 font-semibold text-zinc-500 dark:text-zinc-400">
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mb-0.5 uppercase tracking-wider">
                    身高
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold font-mono">{currentForm.height}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mb-0.5 uppercase tracking-wider">
                    体重
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold font-mono">{currentForm.weight}</span>
                </div>
              </div>
            )}

            {/* Pokedex Entry Description */}
            {randomPokeDetail && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm line-clamp-3 z-10 font-medium italic min-h-[54px]">
                &ldquo;
                {translateText(randomPokeDetail.description || '暂无该宝可梦的图鉴文字介绍。', locale)}
                &rdquo;
              </p>
            )}

            <Link
              prefetch={false}
              href={localPath(`/pokemon/${encodeURIComponent(translateText(randomPoke.name, locale))}`)}
              className="w-full mt-6 z-10"
            >
              <Button
                className="w-full py-5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md font-bold text-sm transition-all duration-200"
              >
                查看详细图鉴 →
              </Button>
            </Link>

          </CardContent>
        </Card>
      )}
    </div>
  )
}
