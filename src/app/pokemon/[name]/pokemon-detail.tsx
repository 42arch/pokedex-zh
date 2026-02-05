import type { PropsWithChildren, ReactNode } from 'react'
import type { PokemonDetail as PokemonDetailType, Type } from '@/types'
import { GenderFemale, GenderMale } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import Image from '@/components/image'
import TypeBadge from '@/components/type-badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { IMAGE_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Ability from './ability'
import EvolutionChain from './evolution-chain'
import FlavorText from './flavor-text'
import PokemonMove from './pokemon-move'
import SpriteImage from './sprite-image'
import StatChart from './stat-chart'

interface Props {
  className?: string
  data: PokemonDetailType
}

function PokemonDetail({ className, data }: Props) {
  const [selectedFormIndex, setSelectedFormIndex] = useState(0)
  const form = data.forms[selectedFormIndex]

  return (
    <div
      className={cn(
        className,
        'relative h-[calc(100%-49px)] w-[calc(100%-0.5rem)] items-center justify-center overflow-x-hidden p-2 lg:p-4',
      )}
    >
      <ScrollArea className="h-full">
        <div className="flex w-full items-center justify-center gap-2">
          {data.forms.map((f, index) => {
            const formNames = f.name.split('-')
            const formName = formNames[formNames.length - 1]
            const isSelected = selectedFormIndex === index
            return (
              <button
                key={index}
                className={cn(
                  'rounded-full px-4 py-1 text-sm transition-all',
                  !isSelected
                    ? 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    : 'bg-primary/20 text-primary shadow-sm',
                )}
                onClick={() => setSelectedFormIndex(index)}
              >
                {formName}
              </button>
            )
          })}
        </div>

        <div className="mt-2 flex flex-col items-center justify-center gap-4 pt-4">
          <Image
            src={`${IMAGE_PATH}official/${form.image}`}
            alt={form.name}
            width={180}
            height={180}
          />
          <section className="flex gap-2">
            {form.types.map(type => (
              <TypeBadge key={type} size="normal" type={type as Type} />
            ))}
          </section>
          <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
            {form.category}
          </span>

          <section className="grid grid-cols-2 gap-x-4 gap-y-2 lg:gap-x-8">
            <InfoCell title="英文名" value={data.name_en} />
            <InfoCell title="日文名" value={data.name_ja} />
            <InfoCell title="高度" value={form.height} />
            <InfoCell title="重量" value={form.weight} />
            <InfoCell title="体型" value={form.shape} />
            <InfoCell
              title="100级经验值"
              value={(
                <span>
                  {form.experience_100}
                </span>
              )}
            />
            <InfoCell title="蛋群" value={form.egg_groups.join(',')} />
            <InfoCell title="图鉴颜色" value={form.color} />
            <InfoCell
              title="捕获率"
              value={(
                <span>
                  {form.catch_rate}
                </span>
              )}
            />
            <InfoCell
              title="性别比例"
              value={
                form.gender_ratio
                  ? (
                      <div className="flex items-center justify-center gap-2">
                        {form.gender_ratio.male
                          ? (
                              <div className="flex items-end justify-end gap-1">
                                <GenderMale
                                  size={16}
                                  color="#60a5fa"
                                  weight="bold"
                                />
                                <span className="text-xs">
                                  {form.gender_ratio.male}
                                  %
                                </span>
                              </div>
                            )
                          : null}

                        {form.gender_ratio.female
                          ? (
                              <div className="flex items-end justify-end gap-1">
                                <GenderFemale
                                  size={16}
                                  color="#f87171"
                                  weight="bold"
                                />
                                <span className="text-xs">
                                  {form.gender_ratio.female}
                                  %
                                </span>
                              </div>
                            )
                          : null}
                      </div>
                    )
                  : (
                      '无性别'
                    )
              }
            />
          </section>
          <section className="w-full ">
            <SectionTitle>特性</SectionTitle>
            <div className="flex flex-col items-center justify-center gap-4">
              {form.abilities.map(a => (
                <Ability
                  key={a.name}
                  name={a.name}
                  is_hidden={a.is_hidden}
                  text={a.text}
                />
              ))}
            </div>
          </section>
        </div>

        <SectionTitle>简介</SectionTitle>
        <section className="text-sm">
          {data.profile.split('\n').map((line, idx) => (
            <p key={idx} className="whitespace-pre-line indent-7">
              {line}
            </p>
          ))}
        </section>

        <SectionTitle>种族值</SectionTitle>
        <section>
          <StatChart stats={data.stats} />
        </section>

        <SectionTitle>进化</SectionTitle>
        <section>
          <EvolutionChain data={data.evolution_chains} />
        </section>

        <SectionTitle>形象</SectionTitle>
        <section className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
          {data.home_images.map((item, idx) => (
            <SpriteImage key={idx} data={item} />
          ))}
        </section>

        <SectionTitle>图鉴介绍</SectionTitle>
        <section>
          <FlavorText data={data.pokedex_entries} />
        </section>

        <SectionTitle>招式列表（通过提升等级）</SectionTitle>
        <section>
          <PokemonMove data={data.learnable_moves} type="learned" />
        </section>
        <SectionTitle>招式列表（通过招式学习器）</SectionTitle>
        <section>
          <PokemonMove data={data.machine_moves} type="machine" />
        </section>
      </ScrollArea>
    </div>
  )
}

export default PokemonDetail

function InfoCell({ title, value }: { title: string, value: ReactNode }) {
  return (
    <div className="flex min-w-40 flex-col items-center justify-between gap-1 rounded-lg bg-primary/10 px-4 py-2 lg:px-6">
      <div className="text-center text-xs text-muted-foreground">{title}</div>
      <span className="text-center text-sm font-medium">{value}</span>
    </div>
  )
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <>
      <Separator className="my-4 mt-6" />
      <h2 className="mb-4 mt-2 font-bold">{children}</h2>
    </>
  )
}
