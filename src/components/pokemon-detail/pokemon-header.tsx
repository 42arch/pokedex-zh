import type { PokemonDetail } from '@/services/pokemon'
import { translateText } from '@/lib/chinese'
import { ASSET_URL } from '@/lib/constants'
import { getTypeGradient } from '@/lib/pokemon-helpers'
import { cn } from '@/lib/utils'
import { TypeBadge } from '../type-badge'

interface PokemonHeaderProps {
  detail: PokemonDetail
  activeFormIndex: number
  setActiveFormIndex: (idx: number) => void
  locale: string
}

export function PokemonHeader({
  detail,
  activeFormIndex,
  setActiveFormIndex,
  locale,
}: PokemonHeaderProps) {
  const activeForm = detail.forms[activeFormIndex] || detail.forms[0]

  return (
    <div
      className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 transition-all duration-300"
      style={{ background: getTypeGradient(activeForm.types) }}
    >
      {/* Glassmorphic overlay blur */}
      <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl -z-10" />

      {/* Floating background Poke Ball */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 text-black/[0.03] dark:text-white/[0.02] pointer-events-none -z-10">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      {/* Pokemon Image Section */}
      <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-44">
        <div className="relative flex items-center justify-center w-36 h-36 md:w-40 md:h-40 rounded-full bg-white/20 dark:bg-black/10 shadow-inner group hover:scale-[1.02] transition-transform duration-300">
          <img
            src={`${ASSET_URL}/images/official/${activeForm.image}`}
            alt={detail.name_zh}
            className="w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl select-none group-hover:rotate-2 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = `${ASSET_URL}/images/official/${activeForm.image}`
            }}
          />
        </div>
      </div>

      {/* Name and Basic details */}
      <div className="flex-1 text-center md:text-left space-y-3.5 w-full">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span className="font-mono text-sm md:text-base font-bold bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full text-zinc-700 dark:text-zinc-300 shadow-sm">
            #
            {detail.pokedex_id}
          </span>
          <div className="flex gap-1.5 items-center flex-wrap">
            {activeForm.types.map(type => (
              <TypeBadge key={type} type={type} className="rounded-full border border-white/10 text-xs" />
            ))}
          </div>
        </div>
        <div className="h-6">
          {activeForm.category && (
            <span className="px-3.5 py-1 rounded-full bg-white/30 dark:bg-zinc-900/30 border border-white/20 dark:border-zinc-800/40 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-md">
              {translateText(activeForm.category, locale)}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
            {translateText(detail.name_zh, locale)}
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {detail.name_en}
            {' '}
            ·
            {detail.name_ja}
          </p>
        </div>

        {/* Form switch buttons (if multiple forms exist) */}
        {detail.forms.length > 1 && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              {translateText('不同形态', locale)}
            </label>
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
              {detail.forms.map((form, idx) => (
                <button
                  key={form.name}
                  onClick={() => setActiveFormIndex(idx)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer',
                    activeFormIndex === idx
                      ? 'bg-red-500 text-red-foreground border-transparent shadow-md'
                      : 'bg-white/70 dark:bg-zinc-900/70 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100',
                  )}
                >
                  {translateText(form.name, locale)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
