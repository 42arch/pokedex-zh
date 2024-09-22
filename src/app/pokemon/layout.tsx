import { PropsWithChildren } from 'react'
import PokemonList from './pokemon-list'

export default async function Page({ children }: PropsWithChildren) {
  return (
    <div className='relative flex h-full w-full overflow-hidden'>
      <PokemonList className='w-full border-l border-l-muted md:w-full md:border-l-0 lg:w-1/3 ' />
      <div className='relative hidden w-full p-2 lg:flex lg:w-2/3 '>
        {children}
      </div>
      {/* <PokemonDetail className='hidden lg:flex ' /> */}
    </div>
  )
}