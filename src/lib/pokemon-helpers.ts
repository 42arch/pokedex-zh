import { translateText } from './chinese'
import { TYPE_COLORS } from './constants'

/** @deprecated Use TYPE_COLORS from constants directly where possible */
export function getTypeColor(type: string): string {
  const t = type.trim()
  return (TYPE_COLORS as Record<string, string>)[t] || '#68A090'
}

export function getTypeGradient(types: string[]): string {
  if (!types || types.length === 0) {
    return 'linear-gradient(135deg, #A8A77A, #705746)'
  }
  if (types.length === 1) {
    const color = getTypeColor(types[0])
    return `linear-gradient(135deg, ${color}33, ${color}66)`
  }
  const color1 = getTypeColor(types[0])
  const color2 = getTypeColor(types[1])
  return `linear-gradient(135deg, ${color1}44, ${color2}44)`
}

export function getTypeBadgeStyle(type: string): { backgroundColor: string, color: string } {
  const color = getTypeColor(type)
  return {
    backgroundColor: color,
    color: '#ffffff',
  }
}

export const statTranslationMap: Record<string, string> = {
  hp: 'HP',
  attack: '攻击',
  defense: '防御',
  sp_attack: '特攻',
  sp_defense: '特防',
  speed: '速度',
}

export function getStatName(stat: string, locale: string): string {
  const key = stat.toLowerCase()
  const name = statTranslationMap[key] || stat
  return translateText(name, locale)
}

export function getStatColor(stat: string): string {
  const key = stat.toLowerCase()
  switch (key) {
    case 'hp':
      return 'bg-rose-500 dark:bg-rose-600'
    case 'attack':
      return 'bg-orange-500 dark:bg-orange-600'
    case 'defense':
      return 'bg-amber-500 dark:bg-amber-600'
    case 'sp_attack':
      return 'bg-sky-500 dark:bg-sky-600'
    case 'sp_defense':
      return 'bg-emerald-500 dark:bg-emerald-600'
    case 'speed':
      return 'bg-indigo-500 dark:bg-indigo-600'
    default:
      return 'bg-zinc-500'
  }
}

export function getGenerationFromIndex(index: string): number {
  const num = parseInt(index, 10)
  if (Number.isNaN(num))
    return 1
  if (num <= 151)
    return 1
  if (num <= 251)
    return 2
  if (num <= 386)
    return 3
  if (num <= 493)
    return 4
  if (num <= 649)
    return 5
  if (num <= 721)
    return 6
  if (num <= 809)
    return 7
  if (num <= 905)
    return 8
  return 9
}

export const generationNamesMap: Record<number, string> = {
  1: '第一世代 (关都)',
  2: '第二世代 (城都)',
  3: '第三世代 (丰缘)',
  4: '第四世代 (神奥)',
  5: '第五世代 (合众)',
  6: '第六世代 (卡洛斯)',
  7: '第七世代 (阿罗拉)',
  8: '第八世代 (洗翠/伽勒尔)',
  9: '第九世代 (帕底亚)',
}

export function getGenerationName(gen: number, locale: string): string {
  const name = generationNamesMap[gen] || `第 ${gen} 世代`
  return translateText(name, locale)
}
