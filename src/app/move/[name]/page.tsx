import type {
  MoveDetail as MoveDetailType,
  MoveList,
  PokemonList
} from '@/types'
import TopBar from './top-bar'
import MoveDetail from './move-detail'
import MobilePage from './mobile-page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findFile, readFile } from '@/lib/file'

type Props = {
  params: { name: string }
}

const getDetailData = async (name: string) => {
  try {
    const file = await findFile(name, 'move')
    if (file) {
      const data = await readFile<MoveDetailType>(`move/${file}`)
      const pokemonList = await readFile<PokemonList>('/pokedex/pokedex_national.json')

      data.pokemon.egg.forEach((poke) => {
        const detail = pokemonList.find((p) => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.level.forEach((poke) => {
        const detail = pokemonList.find((p) => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.machine.forEach((poke) => {
        const detail = pokemonList.find((p) => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      data.pokemon.tutor.forEach((poke) => {
        const detail = pokemonList.find((p) => p.name === poke.name)
        poke.types = detail?.types ?? []
        poke.meta = detail ? detail.meta : null
      })
      return data
    }
    return null
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  const list = await readFile<MoveList>('move_list.json')
  return list.map((item) => ({
    name: item.name
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = params.name
  const data = await getDetailData(name)
  if (!data) {
    notFound()
  }

  return {
    title: `宝可梦图鉴 | ${data.name}`,
    description: `宝可梦图鉴, ${data.name}`,
    keywords: [data.name]
  }
}

export default async function Page({ params }: Props) {
  const name = params.name
  const data = await getDetailData(name)
  if (!data) {
    notFound()
  }

  return (
    <>
      <div className='relative hidden w-full lg:block lg:w-2/3'>
        <TopBar name={data.name} />
        <MoveDetail data={data} />
      </div>
      <MobilePage data={data} />
    </>
  )
}
