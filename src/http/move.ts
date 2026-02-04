import type { MoveDetail, MoveList } from '@/types'

export async function getMoveList() {
  const response = await fetch('https://s.starllow.com/pokedex/move_list.json')
  const data = await response.json() as MoveList
  return data
}

export async function getMoveInfo(name: string) {
  const response = await fetch(`https://s.starllow.com/pokedex/moves/${name}.json`)
  const data = await response.json() as MoveDetail
  return data
}
