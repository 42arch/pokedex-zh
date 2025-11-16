import type { MoveDetail, MovePokemon } from '@/types'
import Link from 'next/link'
import TypeBadge from '@/components/type-badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function PokemonList({ data }: { data: MoveDetail['pokemon'] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="level"
    >
      <AccordionItem value="level">
        <AccordionTrigger className="hover:no-underline">
          通过升级方式
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 px-2">
          {data.level.map((poke, idx) => (
            <PokemonItem key={idx} pokemon={poke} />
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="machine">
        <AccordionTrigger className="hover:no-underline">
          通过招式学习器
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {data.machine.map((poke, idx) => (
            <PokemonItem key={idx} pokemon={poke} />
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="egg">
        <AccordionTrigger className="hover:no-underline">
          通过遗传
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {data.egg.map((poke, idx) => (
            <PokemonItem key={idx} pokemon={poke} />
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tutor">
        <AccordionTrigger className="hover:no-underline">
          通过教授招式
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {data.tutor.map((poke, idx) => (
            <PokemonItem key={idx} pokemon={poke} />
          ))}
        </AccordionContent>
      </AccordionItem>
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
      className="flex flex-row items-center gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-all hover:bg-accent"
    >
      <div className="flex items-center">
        <span
          className="pokemon-normal"
          style={{
            backgroundPosition: pokemon.meta?.icon_position,
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
                <TypeBadge key={type} type={type} size="small" />
              ))}
            </div>
          </div>
          <span className="text-xs">
            #
            {pokemon.index}
          </span>
        </div>
      </div>
    </Link>
  )
}
