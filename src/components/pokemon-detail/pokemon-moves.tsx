import type { PokemonDetail } from '@/services/pokemon'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { translateText } from '@/lib/chinese'
import { cn, getLocalizedPath } from '@/lib/utils'
import { CategoryBadge, TypeBadge } from '../type-badge'

interface PokemonMovesProps {
  detail: PokemonDetail
  activeForm: any
  activeFormIndex: number
  setActiveFormIndex: (idx: number) => void
  locale: string
}

export function PokemonMoves({
  detail,
  activeForm,
  activeFormIndex,
  setActiveFormIndex,
  locale,
}: PokemonMovesProps) {
  return (
    <div className="space-y-4">
      {detail.forms.length > 1 && (
        <div className="flex flex-wrap gap-1 p-1 bg-zinc-150/40 dark:bg-zinc-900/40 rounded-xl w-fit">
          {detail.forms.map((form: any, idx: number) => (
            <button
              key={form.name}
              onClick={() => setActiveFormIndex(idx)}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none',
                activeFormIndex === idx
                  ? 'bg-red-500 text-red-foreground shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
              )}
            >
              {translateText(form.name, locale)}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-950 p-4 md:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-base tracking-tight">
            {translateText('学习招式表', locale)}
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {translateText('显示当前形态在不同等级下可以习得的招式目录', locale)}
          </p>
        </div>

        <Tabs defaultValue="level" className="w-full">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-9">
            <TabsTrigger value="level" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('等级提升', locale)}</TabsTrigger>
            <TabsTrigger value="machine" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('招式学习器', locale)}</TabsTrigger>
            <TabsTrigger value="egg" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('蛋招式', locale)}</TabsTrigger>
          </TabsList>

          {/* 1. Level-up moves */}
          <TabsContent value="level" className="mt-3 focus-visible:outline-none">
            <div className="overflow-x-auto pr-1">
              <table className="w-full min-w-[600px] text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    <th className="py-2.5 px-3 w-16">{translateText('等级', locale)}</th>
                    <th className="py-2.5 px-3 min-w-[130px]">{translateText('招式名称', locale)}</th>
                    <th className="py-2.5 px-3 w-28 text-center">{translateText('属性', locale)}</th>
                    <th className="py-2.5 px-3 w-28 text-center">{translateText('分类', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">PP</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.learnable_moves.find(m => m.form === activeForm.name) || detail.learnable_moves[0])?.data.map((move: any, idx: number) => {
                    const translatedMoveName = translateText(move.name, locale)

                    return (
                      <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium">
                        <td className="py-3 px-3 font-mono font-bold text-zinc-500 dark:text-zinc-400">{move.level}</td>
                        <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                          <Link
                            prefetch={false}
                            href={getLocalizedPath(`/moves/${encodeURIComponent(move.name)}`, locale)}
                            className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            {translatedMoveName}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <TypeBadge type={move.type} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <CategoryBadge category={move.category} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.power}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.accuracy}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.pp}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* 2. Machine moves */}
          <TabsContent value="machine" className="mt-3 focus-visible:outline-none">
            <div className="overflow-x-auto pr-1">
              <table className="w-full min-w-[600px] text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    <th className="py-2.5 px-3 w-28">{translateText('学习器', locale)}</th>
                    <th className="py-2.5 px-3 min-w-[130px]">{translateText('招式名称', locale)}</th>
                    <th className="py-2.5 px-3 w-28 text-center">{translateText('属性', locale)}</th>
                    <th className="py-2.5 px-3 w-28 text-center">{translateText('分类', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">PP</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.machine_moves.find(m => m.form === activeForm.name) || detail.machine_moves[0])?.data.map((move: any, idx: number) => {
                    const translatedMoveName = translateText(move.name, locale)
                    const translatedMachine = translateText(move.machine, locale)

                    return (
                      <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium whitespace-nowrap">
                        <td className="py-3 px-3 font-semibold text-zinc-505 dark:text-zinc-400">{translatedMachine}</td>
                        <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-55 animate-pulse-none">
                          <Link
                            prefetch={false}
                            href={getLocalizedPath(`/moves/${encodeURIComponent(move.name)}`, locale)}
                            className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            {translatedMoveName}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <TypeBadge type={move.type} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <CategoryBadge category={move.category} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.power}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.accuracy}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.pp}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* 3. Egg moves */}
          <TabsContent value="egg" className="mt-3 focus-visible:outline-none">
            <div className="overflow-x-auto pr-1">
              <table className="w-full min-w-[650px] text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    <th className="py-2.5 px-3 min-w-[130px]">{translateText('招式名称', locale)}</th>
                    <th className="py-2.5 px-3 w-28 text-center">{translateText('属性', locale)}</th>
                    <th className="py-2.5 px-3 w-28 text-center">{translateText('分类', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">{translateText('威力', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">{translateText('命中', locale)}</th>
                    <th className="py-2.5 px-3 w-16 text-center">PP</th>
                    <th className="py-2.5 px-3 w-40">{translateText('遗传亲代 (部分)', locale)}</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.egg_moves.find(m => m.form === activeForm.name) || detail.egg_moves[0])?.data.map((move: any, idx: number) => {
                    const translatedMoveName = translateText(move.name, locale)
                    const translatedParents = move.parents.map((p: any) => translateText(p.name, locale)).slice(0, 4).join(', ')

                    return (
                      <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 font-medium whitespace-nowrap">
                        <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-55 animate-pulse-none">
                          <Link
                            prefetch={false}
                            href={getLocalizedPath(`/moves/${encodeURIComponent(move.name)}`, locale)}
                            className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            {translatedMoveName}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <TypeBadge type={move.type} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <CategoryBadge category={move.category} className="w-16 justify-center text-[10px] py-0.5 rounded-md" />
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.power}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.accuracy}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{move.pp}</td>
                        <td className="py-3 px-3 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold truncate max-w-[160px]">{translatedParents}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
