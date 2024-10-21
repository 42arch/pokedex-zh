import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { PokemonDetail as PokemonDetailType } from '@/types'
import Image from 'next/image'
import TypeBadge from '@/components/type-badge'
import StatChart from './stat-chart'
import SpriteImage from './sprite-image'
import FlavorText from './flavor-text'
import PokemonMove from './pokemon-move'
import { PropsWithChildren, ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import EvolutionChain from './evolution-chain'
import Ability from './ability'
import { GenderFemale, GenderMale } from '@phosphor-icons/react/dist/ssr'

interface Props {
  className?: string
  data: PokemonDetailType
}

function PokemonDetail({ className, data }: Props) {
  return (
    <div
      className={cn(
        className,
        'relative h-[calc(100%-49px)] w-[calc(100%-0.5rem)] items-center justify-center overflow-x-hidden p-2 lg:p-4'
      )}
    >
      <ScrollArea className='h-full'>
        <Tabs defaultValue={data.forms[0]?.name} className='w-full'>
          <TabsList className='w-full'>
            {data.forms.map((form, index) => {
              const formNames = form.name.split('-')
              const formName = formNames[formNames.length - 1]
              return (
                <TabsTrigger
                  key={index}
                  value={form.name}
                  className='block w-24 truncate lg:w-auto'
                  title={form.name}
                >
                  {formName}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {data.forms.map((form, index) => (
            <TabsContent key={index} value={form.name}>
              <div className='mt-2 flex flex-col items-center justify-center gap-4'>
                <Image
                  src={`/images/official/${form.image}`}
                  alt={form.name}
                  width={180}
                  height={180}
                />

                <section className='flex gap-2'>
                  {form.types.map((type) => (
                    <TypeBadge key={type} size='normal' type={type} />
                  ))}
                </section>
                <span className='rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700'>
                  {form.genus}
                </span>

                <section className='grid grid-cols-2 gap-x-4 gap-y-2 lg:gap-x-8'>
                  <InfoCell title='高度' value={form.height} />
                  <InfoCell title='重量' value={form.weight} />
                  <InfoCell title='体型' value={form.shape} />
                  <InfoCell
                    title='经验值'
                    value={
                      <span>
                        {form.experience.number}
                        <span className='text-xs'>
                          （{form.experience.speed}）
                        </span>
                      </span>
                    }
                  />
                  <InfoCell title='蛋群' value={form.egg_groups.join(',')} />
                  <InfoCell title='图鉴颜色' value={form.color} />
                  <InfoCell
                    title='捕获率'
                    value={
                      <span>
                        {form.catch_rate.number}
                        <span className='text-xs'>
                          （{form.catch_rate.rate}）
                        </span>
                      </span>
                    }
                  />
                  <InfoCell
                    title='性别比例'
                    value={
                      form.gender_rate ? (
                        <div className='flex items-center justify-center gap-2'>
                          {form.gender_rate.male ? (
                            <div className='flex items-end justify-end gap-1'>
                              <GenderMale
                                size={16}
                                color='#60a5fa'
                                weight='bold'
                              />
                              <span className='text-xs'>
                                {form.gender_rate.male}
                              </span>
                            </div>
                          ) : null}

                          {form.gender_rate.female ? (
                            <div className='flex items-end justify-end gap-1'>
                              <GenderFemale
                                size={16}
                                color='#f87171'
                                weight='bold'
                              />
                              <span className='text-xs'>
                                {form.gender_rate.female}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        '无性别'
                      )
                    }
                  />
                </section>

                <section className=' w-full '>
                  <SectionTitle>特性</SectionTitle>
                  <div className='flex flex-col items-center justify-center gap-4'>
                    {form.ability.map((a) => (
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
            </TabsContent>
          ))}
        </Tabs>

        <SectionTitle>简介</SectionTitle>
        <section className='text-sm'>
          {data.profile.split('\n').map((line, idx) => (
            <p key={idx} className='whitespace-pre-line indent-7'>
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
        <section className='flex w-full flex-row flex-wrap items-center justify-center gap-4'>
          {data.home_images.map((item, idx) => (
            <SpriteImage key={idx} data={item} />
          ))}
        </section>

        <SectionTitle>图鉴介绍</SectionTitle>
        <section>
          <FlavorText data={data.flavor_texts} />
        </section>

        <SectionTitle>招式列表（通过提升等级）</SectionTitle>
        <section>
          <PokemonMove data={data.moves.learned} type='learned' />
        </section>
        <SectionTitle>招式列表（通过招式学习器）</SectionTitle>
        <section>
          <PokemonMove data={data.moves.machine} type='machine' />
        </section>
      </ScrollArea>
    </div>
  )
}

export default PokemonDetail

function InfoCell({ title, value }: { title: string; value: ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-between rounded-lg bg-gray-100 px-4 py-2 lg:px-6'>
      <div className='w-16 text-center text-sm text-muted-foreground'>
        {title}
      </div>
      <span className='text-center text-sm font-medium'>{value}</span>
    </div>
  )
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <>
      <Separator className='my-4 mt-6' />
      <h2 className='mb-4 mt-2 font-bold'>{children}</h2>
    </>
  )
}
