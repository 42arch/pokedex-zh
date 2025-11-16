import type { Metadata } from 'next'
import type {
  MoveDetail as MoveDetailType,
  MoveList,
  PokemonList,
} from '@/types'
import { notFound } from 'next/navigation'
import { findFile, readFile } from '@/lib/file'
import MobilePage from './mobile-page'
import MoveDetail from './move-detail'
import TopBar from './top-bar'

interface Props {
  params: Promise<{ name: string }>
}

async function getDetailData(name: string) {
  try {
    const file = await findFile(name, 'move')
    if (file) {
      const data = await readFile<MoveDetailType>(`move/${file}`)
      const pokemonList = await readFile<PokemonList>('/pokedex/pokedex_national.json')

      data.pokemon.egg.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.level.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.machine.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.tutor.forEach((poke) => {
        const detail = pokemonList.find(p => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      return data
    }
    return null
  }
  catch (error) {
    console.error(error)
    return null
  }
}

export async function generateStaticParams() {
  const list = await readFile<MoveList>('move_list.json')
  return list.map(item => ({
    name: item.name,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const data = await getDetailData(name)
  if (!data) {
    notFound()
  }

  return {
    title: `宝可梦图鉴 | ${data.name}`,
    description: `宝可梦图鉴, ${data.name}`,
    keywords: [data.name],
  }
}

export default async function Page({ params }: Props) {
  const { name } = await params
  const data = await getDetailData(name)
  if (!data) {
    notFound()
  }

  return (
    <>
      <div className="relative hidden w-full lg:block lg:w-2/3">
        <TopBar name={data.name} />
        <MoveDetail data={data} />
      </div>
      <MobilePage data={data} />
    </>
  )
}
