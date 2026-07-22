import { useQuery } from '@tanstack/react-query'
import {
  getAbilityDetail,
  getAbilityList,
  getItemList,
  getMoveDetail,
  getMoveList,
  getPokemonDetail,
} from '@/services/pokemon'

export function useMoveList() {
  return useQuery({
    queryKey: ['moveList'],
    queryFn: () => getMoveList(),
  })
}

export function useMoveDetail(name: string) {
  return useQuery({
    queryKey: ['moveDetail', name],
    queryFn: () => getMoveDetail(name),
    enabled: !!name,
  })
}

export function useAbilityList() {
  return useQuery({
    queryKey: ['abilityList'],
    queryFn: () => getAbilityList(),
  })
}

export function useAbilityDetail(name: string) {
  return useQuery({
    queryKey: ['abilityDetail', name],
    queryFn: () => getAbilityDetail(name),
    enabled: !!name,
  })
}

export function useItemList() {
  return useQuery({
    queryKey: ['itemList'],
    queryFn: () => getItemList(),
  })
}

export function usePokemonDetail(index: string) {
  return useQuery({
    queryKey: ['pokemonDetail', index],
    queryFn: () => getPokemonDetail(index),
    enabled: !!index,
  })
}
