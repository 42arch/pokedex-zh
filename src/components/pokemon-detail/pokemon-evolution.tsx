import type { PokemonDetail } from '@/services/pokemon'
import Link from 'next/link'
import * as React from 'react'
import { translateText } from '@/lib/chinese'
import { ASSET_URL } from '@/lib/constants'
import { cn, getLocalizedPath } from '@/lib/utils'

interface PokemonEvolutionProps {
  detail: PokemonDetail
  activeFormIndex: number
  setActiveFormIndex: (idx: number) => void
  locale: string
}

export function PokemonEvolution({
  detail,
  activeFormIndex,
  setActiveFormIndex,
  locale,
}: PokemonEvolutionProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
      <h3 className="font-bold text-base tracking-tight">
        {translateText('进化链分支', locale)}
      </h3>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max flex flex-col gap-4">
          {detail.evolution_chains.map((chain, chainIdx) => (
            <div key={chainIdx} className="flex flex-row items-center justify-start md:justify-center gap-4 py-4 relative">
              {chain.map((stage, stageIdx) => {
                const translatedStageName = translateText(stage.name, locale)
                const isCurrent = stage.name === detail.name_zh

                return (
                  <React.Fragment key={stage.name}>
                    {/* Evolution condition arrow */}
                    {stageIdx > 0 && (
                      <div className="flex flex-col items-center justify-center shrink-0 w-24 text-center my-2 md:my-0 select-none">
                        <span className="text-zinc-400 dark:text-zinc-650 text-lg">➔</span>
                        {stage.text && (
                          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200/30 dark:border-zinc-800/30 mt-1 max-w-[120px] truncate">
                            {translateText(stage.text, locale)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Pokemon node card */}
                    <Link
                      prefetch={false}
                      href={getLocalizedPath(`/pokemon/${encodeURIComponent(translateText(stage.name, locale))}`, locale)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm select-none hover:scale-[1.03]',
                        isCurrent
                          ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                          : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700',
                      )}
                    >
                      <div className="relative w-20 h-20 flex items-center justify-center rounded-xl p-1 border border-zinc-100/30 dark:border-zinc-800/30">
                        <img
                          src={`${ASSET_URL}/images/dream/${stage.image}`}
                          alt={stage.name}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            if (e.currentTarget.src.includes('/dream/')) {
                              e.currentTarget.src = `${ASSET_URL}/images/official/${stage.image}`
                            }
                            else {
                              e.currentTarget.src = '/file.svg'
                            }
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-32">
                          {translatedStageName}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">
                          {translateText(stage.stage, locale)}
                        </p>
                      </div>
                    </Link>
                  </React.Fragment>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 超级进化 (Mega Evolution) */}
      {detail.mega_evolution && detail.mega_evolution.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
          <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            {translateText('超级进化', locale)}
          </h4>
          <div className="flex flex-wrap gap-4">
            {detail.mega_evolution.map((mega, idx) => {
              const matchedIdx = detail.forms.findIndex((f) => {
                const norm = (s: string) => s.toLowerCase().replace(/[\s._·★-]+/g, '').replace('极', '级').replace('ｘ', 'x').replace('ｙ', 'y')
                const fn = norm(f.name)
                const target = norm(mega.form_name)
                const targetAlt = norm(`${mega.name}${mega.form_name}`)
                return fn === target || fn === targetAlt || fn.includes(target) || target.includes(fn)
              })

              const isCurrent = matchedIdx !== -1 && activeFormIndex === matchedIdx

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (matchedIdx !== -1)
                      setActiveFormIndex(matchedIdx)
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm select-none hover:scale-[1.03]',
                    isCurrent
                      ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                      : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700',
                  )}
                >
                  <div className="relative w-20 h-20 flex items-center justify-center rounded-xl p-1 border border-zinc-100/30 dark:border-zinc-800/30">
                    <img
                      src={`${ASSET_URL}/images/dream/${mega.image}`}
                      alt={mega.form_name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        if (e.currentTarget.src.includes('/dream/')) {
                          e.currentTarget.src = `${ASSET_URL}/images/official/${mega.image}`
                        }
                        else {
                          e.currentTarget.src = '/file.svg'
                        }
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-32">
                      {translateText(mega.form_name, locale)}
                    </p>
                    <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase mt-0.5">
                      {translateText('超级进化', locale)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 超级巨化 (Gigantamax) */}
      {detail.gigantamax_evolution && detail.gigantamax_evolution.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
          <h4 className="font-bold text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            {translateText('超级巨化', locale)}
          </h4>
          <div className="flex flex-wrap gap-4">
            {detail.gigantamax_evolution.map((gmax, idx) => {
              const matchedIdx = detail.forms.findIndex((f) => {
                const norm = (s: string) => s.toLowerCase().replace(/[\s._·★-]+/g, '').replace('极', '级')
                const fn = norm(f.name)
                const target = norm(gmax.form_name)
                const targetAlt = norm(`${gmax.name}${gmax.form_name}`)
                return fn === target || fn === targetAlt || fn.includes(target) || target.includes(fn)
              })

              const isCurrent = matchedIdx !== -1 && activeFormIndex === matchedIdx

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (matchedIdx !== -1)
                      setActiveFormIndex(matchedIdx)
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm select-none hover:scale-[1.03]',
                    isCurrent
                      ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900/10 dark:border-zinc-100/10 ring-1 ring-zinc-900/5 dark:ring-zinc-100/5'
                      : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700',
                  )}
                >
                  <div className="relative w-20 h-20 flex items-center justify-center rounded-xl p-1 border border-zinc-100/30 dark:border-zinc-800/30">
                    <img
                      src={`${ASSET_URL}/images/dream/${gmax.image}`}
                      alt={gmax.form_name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        if (e.currentTarget.src.includes('/dream/')) {
                          e.currentTarget.src = `${ASSET_URL}/images/official/${gmax.image}`
                        }
                        else {
                          e.currentTarget.src = '/file.svg'
                        }
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-32">
                      {translateText(gmax.form_name, locale)}
                    </p>
                    <p className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase mt-0.5">
                      {translateText('超级巨化', locale)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
