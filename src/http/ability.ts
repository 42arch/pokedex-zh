import type { AbilityDetail, AbilityList } from '@/types'

export async function getAbilityList() {
  const response = await fetch('https://s.starllow.com/pokedex/ability_list.json')
  const data = await response.json() as AbilityList
  return data
}

export async function getAbilityInfo(name: string) {
  const response = await fetch(`https://s.starllow.com/pokedex/abilities/${name}.json`)
  const data = await response.json() as AbilityDetail
  return data
}
