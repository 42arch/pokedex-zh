import type { PropsWithChildren } from 'react'
import type { AbilityDetail as AbilityDetailType, Type } from '@/types'
import Link from 'next/link'
import TypeBadge from '@/components/type-badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  data: AbilityDetailType
}

// const GEN_MAP: Record<number, string> = {
//   1: '第一世代',
//   2: '第二世代',
//   3: '第三世代',
//   4: '第四世代',
//   5: '第五世代',
//   6: '第六世代',
//   7: '第七世代',
//   8: '第八世代',
//   9: '第九世代',
// }

function AbilityDetail({ className, data }: Props) {
  return (
    <div
      className={cn(
        className,
        'relative h-[calc(100%-49px)] w-[calc(100%-0.5rem)] items-center justify-center overflow-x-hidden p-2 lg:p-4',
      )}
    >
      <ScrollArea className="h-full">
        <section className="mt-2 indent-7 text-sm">
          <p>
            {data.name_zh}
            （日文︰
            {data.name_ja}
            ，英文︰
            {data.name_en}
            ）是
            {/* The generation field is not in detail data based on schema provided earlier, only in list data.
                Wait, previous schema update might have missed it or it is not in detail json.
                Let's check schema. AbilityDetailSchema has 'id', 'name_zh', 'name_ja', 'name_en', 'basic_info', 'introduction', 'effect', 'pokemon_list'.
                It does NOT have 'generation'. So we can't display it here unless we fetch it from list or it is added.
                For now, let's omit generation display or rely on list passing it (but here we fetch detail separately).
                Actually, usually detail pages might not show generation if it's not in JSON.
                Let's check the previous code: it showed generation.
                If the new JSON doesn't have it, we can't show it easily without extra fetch.
                Let's remove generation display for now or keep it if I missed it in schema.
                Looking at schema update: AbilityDetailSchema indeed lacks generation.
                I will remove the generation part from the intro text.
            */}
            宝可梦的特性。
          </p>
          <p>{data.introduction}</p>
        </section>

        <SectionTitle>效果</SectionTitle>
        <section className="text-sm">
          {data.effect.split('\n').map((line, idx) => (
            <p key={idx} className="whitespace-pre-line indent-7">
              {line}
            </p>
          ))}
        </section>
        <SectionTitle>基本信息</SectionTitle>
        <section className="text-sm">
          <ul
            role="list"
            className="marker:text-primary-400 list-disc space-y-2  pl-5"
          >
            {data.basic_info.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>
        <SectionTitle>具有该特性的宝可梦</SectionTitle>
        <section className="flex flex-col gap-2">
          {data.pokemon_list.map((poke) => {
            const linkName = poke.name.split('-')[0]
            const abilityType
              = poke.first_ability === data.name_zh
                ? '第一特性'
                : poke.second_ability === data.name_zh
                  ? '第二特性'
                  : '隐藏特性'
            return (
              <Link
                key={poke.id + poke.name + poke.form}
                href={`/pokemon/${linkName}`}
                prefetch={false}
                className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
              >
                <div className="flex items-center">
                  <span
                    className="pokemon-icon"
                    style={{
                      backgroundPosition: poke.icon,
                    }}
                  >
                  </span>
                </div>
                <div className="ml-2 flex grow flex-col items-center">
                  <div className="flex h-[56px] w-full items-center justify-between">
                    <div className="flex h-full flex-col justify-evenly">
                      <span>{poke.name}</span>
                      {poke.form && <span className="text-xs text-muted-foreground">{poke.form}</span>}

                      <div className="flex gap-2">
                        {poke.types.map(type => (
                          <TypeBadge key={type} type={type as Type} size="small" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs">{abilityType}</span>
                  </div>
                  <div></div>
                </div>
              </Link>
            )
          })}
        </section>
      </ScrollArea>
    </div>
  )
}

export default AbilityDetail

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <>
      <Separator className="my-4 mt-6" />
      <h2 className="mb-4 mt-2 font-bold">{children}</h2>
    </>
  )
}
