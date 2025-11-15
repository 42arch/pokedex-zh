import type {
  AbilityDetail as AbilityDetailType,
  AbilityList,
  PokemonList
} from '@/types'
import TopBar from './top-bar'
import AbilityDetail from './ability-detail'
import MobilePage from './mobile-page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findFile, readFile } from '@/lib/file'

type Props = {
  params: { name: string }
}

const getDetailData = async (name: string) => {
  try {
    const file = await findFile(name, 'ability')
    if (file) {
      const data = await readFile<AbilityDetailType>(`ability/${file}`)
      const pokemonList = await readFile<PokemonList>('/pokedex/pokedex_national.json')
      data.pokemon.forEach((poke) => {
        const detail = pokemonList.find((p) => p.name === poke.name)
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
  const list = await readFile<AbilityList>('ability_list.json')
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
        <TopBar name={data.name} index={data.index} />
        <AbilityDetail data={data} />
      </div>
      <MobilePage data={data} />
    </>
  )
}
