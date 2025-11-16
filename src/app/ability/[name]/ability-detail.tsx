import type { PropsWithChildren } from 'react'
import type { AbilityDetail as AbilityDetailType } from '@/types'
import Link from 'next/link'
import TypeBadge from '@/components/type-badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  data: AbilityDetailType
}

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
            {data.name}
            （日文︰
            {data.name_jp}
            ，英文︰
            {data.name_en}
            ）是
            {data.generation}
            引入的宝可梦的特性。
          </p>
          <p>{data.text}</p>
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
            {data.info.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>
        <SectionTitle>具有该特性的宝可梦</SectionTitle>
        <section className="flex flex-col gap-2">
          {data.pokemon.map((poke) => {
            const linkName = poke.name.split('-')[0]
            const abilityType
              = poke.first === data.name
                ? '第一特性'
                : poke.second === data.name
                  ? '第二特性'
                  : '隐藏特性'
            return (
              <Link
                key={poke.name}
                href={`/pokemon/${linkName}`}
                prefetch={false}
                className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
              >
                <div className="flex items-center">
                  <span
                    className="pokemon-normal"
                    style={{
                      backgroundPosition: poke.meta?.icon_position,
                    }}
                  >
                  </span>
                </div>
                <div className="ml-2 flex grow flex-col items-center">
                  <div className="flex h-[56px] w-full items-center justify-between">
                    <div className="flex h-full flex-col justify-evenly">
                      <span>{poke.name}</span>

                      <div className="flex gap-2">
                        {poke.types.map(type => (
                          <TypeBadge key={type} type={type} size="small" />
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
