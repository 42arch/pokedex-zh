import type { MovePokemon, Type } from '@/types'
import Link from 'next/link'
import TypeBadge from '@/components/type-badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Props {
  level: MovePokemon[]
  machine: MovePokemon[]
  egg: MovePokemon[]
  tutor: MovePokemon[]
}

function PokemonList({ level, machine, egg, tutor }: Props) {
  const sections = [
    { value: 'level', label: '通过升级方式', data: level },
    { value: 'machine', label: '通过招式学习器', data: machine },
    { value: 'egg', label: '通过遗传', data: egg },
    { value: 'tutor', label: '通过教授招式', data: tutor },
  ].filter(section => section.data && section.data.length > 0)

  if (sections.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">暂无宝可梦可学会此招式</div>
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={sections[0]?.value}
    >
      {sections.map(section => (
        <AccordionItem key={section.value} value={section.value}>
          <AccordionTrigger className="hover:no-underline">
            {section.label}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 px-2">
            {section.data.map((poke, idx) => (
              <PokemonItem key={idx} pokemon={poke} />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default PokemonList

function PokemonItem({ pokemon }: { pokemon: MovePokemon }) {
  const linkName = pokemon.name.split('-')[0]

  return (
    <Link
      key={pokemon.name}
      href={`/pokemon/${linkName}`}
      prefetch={false}
      className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
    >
      <div className="flex items-center">
        <span
          className="pokemon-icon"
          style={{
            backgroundPosition: pokemon.icon,
          }}
        >
        </span>
      </div>
      <div className="ml-2 flex grow flex-col items-center">
        <div className="flex h-[56px] w-full items-center justify-between">
          <div className="flex h-full flex-col justify-evenly">
            <span>{pokemon.name}</span>

            <div className="flex gap-2">
              {pokemon.types.map(type => (
                <TypeBadge key={type} type={type as Type} size="small" />
              ))}
            </div>
          </div>
          <span className="text-xs">
            #
            {pokemon.id}
          </span>
        </div>
      </div>
    </Link>
  )
}
