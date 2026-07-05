import fs from 'fs/promises'
import path from 'path'

export interface SimplePokemon {
  index: string
  name_zh: string
  name_jp: string
  name_en: string
}

export interface NationalPokemon {
  id: string
  name: string
  types: string[]
  icon: string
  filter: string
  gen: number
}

export interface CombinedPokemon {
  id: string
  name: string
  name_jp: string
  name_en: string
  types: string[]
  icon: string
  filter: string
  gen: number
}

export interface PokemonDetail {
  name_zh: string
  name_ja: string
  name_en: string
  pokedex_id: string
  description: string
  profile: string
  prototype: string
  detail: string
  names: { language: string; name: string; origin: string }[]
  forms: {
    name: string
    types: string[]
    category: string
    abilities: { name: string; is_hidden: boolean }[]
    height: string
    weight: string
    color: string
    catch_rate: string
    egg_groups: string[]
    experience_100: string
    base_points: { stat: string; value: number }[]
    base_exp: string
    battle_exp: string
    gender_ratio: { male: number; female: number } | string
    egg_cycles: string
    shape: string
    footprint: string
    image: string
  }[]
  stats: {
    form: string
    data: {
      hp: string
      attack: string
      defense: string
      sp_attack: string
      sp_defense: string
      speed: string
    }
  }[]
  type_effectiveness: {
    form: string
    types: string[]
    data: { type: string; damage: string }[]
  }[]
  obtainment_methods: {
    generation: string
    versions: {
      version: string
      methods: { method: string; location: string; remark: string; icon: string }[]
    }[]
  }[]
  pokedex_entries: {
    name: string
    versions: { name: string; group: string; text: string }[]
  }[]
  evolution_chains: {
    name: string
    stage: string
    text: string | null
    image: string
    back_text: string | null
    from: string | null
    form_name: string | null
  }[][]
  mega_evolution?: any[]
  gigantamax_evolution?: any[]
  learnable_moves: {
    form: string
    data: { level: string; name: string; type: string; category: string; power: string; accuracy: string; pp: string }[]
  }[]
  machine_moves: {
    form: string
    data: { machine: string; name: string; type: string; category: string; power: string; accuracy: string; pp: string }[]
  }[]
  egg_moves: {
    form: string
    data: { parents: { id: string; name: string }[]; name: string; type: string; category: string; power: string; accuracy: string; pp: string }[]
  }[]
  home_images: {
    name: string
    image: string
    shiny: string
  }[]
}

export interface SimpleAbility {
  id: string
  name_zh: string
  name_ja: string
  name_en: string
  description: string
  common_count: number
  hidden_count: number
  generation: number
  caption: string
}

export interface AbilityDetail {
  name_zh: string
  name_ja: string
  name_en: string
  description: string
  effect: string
  detail_effect: string
  generation: string
  pokemons: {
    id: string
    name: string
    is_hidden: boolean
    form: string | null
  }[]
}

export interface SimpleMove {
  id: string
  name_zh: string
  name_jp: string
  name_en: string
  type: string
  category: string
  power: string
  accuracy: string;
  pp: string
  description: string
  generation: number
  is_z: boolean | null
}

export interface MoveDetail {
  name_zh: string
  name_ja: string
  name_en: string
  type: string
  category: string
  power: string
  accuracy: string
  pp: string
  description: string
  effect: string
  target: string
  priority: string
  critical_rate: string
  makes_contact: string
  affected_by_protect: string
  affected_by_magic_coat: string
  affected_by_snatch: string
  affected_by_mirror_move: string
  affected_by_kings_rock: string
  generation: string
  pokemons: {
    form: string
    level_learn: { level: string; id: string; name: string }[]
    machine_learn: { machine: string; id: string; name: string }[]
    egg_learn: { id: string; name: string }[]
    tutor_learn: { id: string; name: string }[]
  }[]
}

export interface ItemNode {
  type: 'category' | 'item'
  name?: string
  children?: ItemNode[]
  name_zh?: string
  name_ja?: string
  name_en?: string
  description?: string | string[]
  icon?: string | string[]
}

const DATA_DIR = path.join(process.cwd(), 'public/data')

// Read files using fs/promises
async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(DATA_DIR, relativePath)
  const read = fs.readFile
  const content = await read(filePath, 'utf-8')
  return JSON.parse(content) as T
}

// Memory Cache
let simplePokedexCache: SimplePokemon[] | null = null
let nationalPokedexCache: NationalPokemon[] | null = null
let combinedPokedexCache: CombinedPokemon[] | null = null


let abilityListCache: SimpleAbility[] | null = null
let moveListCache: SimpleMove[] | null = null
let itemListCache: ItemNode[] | null = null

export async function getSimplePokedex(): Promise<SimplePokemon[]> {
  if (simplePokedexCache) return simplePokedexCache
  simplePokedexCache = await readJsonFile<SimplePokemon[]>('simple_pokedex.json')
  return simplePokedexCache
}

export async function getNationalPokedex(): Promise<NationalPokemon[]> {
  if (nationalPokedexCache) return nationalPokedexCache
  nationalPokedexCache = await readJsonFile<NationalPokemon[]>(path.join('pokedex', 'national.json'))
  return nationalPokedexCache
}

export async function getCombinedPokedex(): Promise<CombinedPokemon[]> {
  if (combinedPokedexCache) return combinedPokedexCache

  const [national, simple] = await Promise.all([
    getNationalPokedex(),
    getSimplePokedex()
  ])

  const simpleMap = new Map(simple.map(p => [p.index, p]))

  combinedPokedexCache = national.map(p => {
    const s = simpleMap.get(p.id)
    return {
      id: p.id,
      name: p.name,
      name_jp: s?.name_jp || '',
      name_en: s?.name_en || '',
      types: p.types,
      icon: p.icon,
      filter: p.filter,
      gen: p.gen
    }
  })

  return combinedPokedexCache
}

// Region key → file url mapping (mirrors POKEDEX_LIST in constants.ts)
const REGION_FILES: { regionKey: string; subKey: string; url: string }[] = [
  { regionKey: '关都', subKey: '关都', url: '关都.json' },
  { regionKey: '城都', subKey: '城都', url: '城都.json' },
  { regionKey: '丰缘', subKey: '丰缘', url: '丰缘.json' },
  { regionKey: '神奥', subKey: '神奥', url: '神奥.json' },
  { regionKey: '合众', subKey: '合众', url: '合众.json' },
  { regionKey: '卡洛斯', subKey: '卡洛斯-中央', url: '卡洛斯-中央.json' },
  { regionKey: '卡洛斯', subKey: '卡洛斯-海岸', url: '卡洛斯-海岸.json' },
  { regionKey: '卡洛斯', subKey: '卡洛斯-山岳', url: '卡洛斯-山岳.json' },
  { regionKey: '阿罗拉', subKey: '阿罗拉-美乐美乐', url: '阿罗拉-美乐美乐.json' },
  { regionKey: '阿罗拉', subKey: '阿罗拉-阿卡拉', url: '阿罗拉-阿卡拉.json' },
  { regionKey: '阿罗拉', subKey: '阿罗拉-乌拉乌拉', url: '阿罗拉-乌拉乌拉.json' },
  { regionKey: '阿罗拉', subKey: '阿罗拉-波尼', url: '阿罗拉-波尼.json' },
  { regionKey: '伽勒尔', subKey: '伽勒尔', url: '伽勒尔.json' },
  { regionKey: '伽勒尔', subKey: '伽勒尔-铠岛', url: '伽勒尔-铠岛.json' },
  { regionKey: '伽勒尔', subKey: '伽勒尔-王冠雪原', url: '伽勒尔-王冠雪原.json' },
  { regionKey: '洗翠', subKey: '洗翠', url: '洗翠.json' },
  { regionKey: '帕底亚', subKey: '帕底亚', url: '帕底亚.json' },
  { regionKey: '帕底亚', subKey: '帕底亚-北上', url: '帕底亚-北上.json' },
  { regionKey: '帕底亚', subKey: '帕底亚-蓝莓', url: '帕底亚-蓝莓.json' },
  { regionKey: '密阿雷', subKey: '密阿雷', url: '密阿雷.json' },
  { regionKey: '密阿雷', subKey: '密阿雷-异次元', url: '密阿雷-异次元.json' },
  { regionKey: '密阿雷', subKey: '密阿雷-超级进化', url: '密阿雷-超级进化.json' },
]

export interface RegionalPokedexMap {
  /** national_id → region keys it appears in (e.g. "关都", "阿罗拉") */
  byRegion: Record<string, string[]>
  /** national_id → sub-dex keys it appears in (e.g. "卡洛斯-中央", "阿罗拉-波尼") */
  bySub: Record<string, string[]>
}

let regionalPokedexMapCache: RegionalPokedexMap | null = null

/**
 * Returns maps: national_id → region keys, and national_id → sub-dex keys.
 */
export async function getRegionalPokedexMap(): Promise<RegionalPokedexMap> {
  if (regionalPokedexMapCache) return regionalPokedexMapCache

  const results = await Promise.all(
    REGION_FILES.map(({ regionKey, subKey, url }) =>
      readJsonFile<{ national_id: string }[]>(path.join('pokedex', url))
        .then(entries => ({ regionKey, subKey, entries }))
        .catch(() => ({ regionKey, subKey, entries: [] as { national_id: string }[] }))
    )
  )

  const byRegion: Record<string, string[]> = {}
  const bySub: Record<string, string[]> = {}

  for (const { regionKey, subKey, entries } of results) {
    for (const entry of entries) {
      const id = entry.national_id
      if (!byRegion[id]) byRegion[id] = []
      if (!byRegion[id].includes(regionKey)) byRegion[id].push(regionKey)
      if (!bySub[id]) bySub[id] = []
      if (!bySub[id].includes(subKey)) bySub[id].push(subKey)
    }
  }

  regionalPokedexMapCache = { byRegion, bySub }
  return regionalPokedexMapCache
}

export async function getPokemonDetail(index: string): Promise<PokemonDetail | null> {
  try {
    const list = await getSimplePokedex()
    const pokemon = list.find((p) => p.index === index)
    if (!pokemon) return null

    const fileName = `${index}-${pokemon.name_zh}.json`
    const detail = await readJsonFile<PokemonDetail>(path.join('pokemon', fileName))
    return detail
  } catch (error) {
    console.error(`Error loading pokemon detail for ${index}:`, error)
    return null
  }
}

export async function getAbilityList(): Promise<SimpleAbility[]> {
  if (abilityListCache) return abilityListCache
  abilityListCache = await readJsonFile<SimpleAbility[]>('ability_list.json')
  return abilityListCache
}

export async function getAbilityDetail(name: string): Promise<AbilityDetail | null> {
  try {
    const raw = await readJsonFile<any>(path.join('abilities', `${name}.json`))
    
    // Map pokemon_list to pokemons
    const pokemons = (raw.pokemon_list || []).map((item: any) => ({
      id: item.id || '',
      name: item.name || '',
      form: item.form || '',
      is_hidden: item.hidden_ability === raw.name_zh
    }))

    return {
      name_zh: raw.name_zh || '',
      name_ja: raw.name_ja || raw.name_jp || '',
      name_en: raw.name_en || '',
      description: raw.description || raw.introduction || '',
      effect: raw.effect || '',
      detail_effect: raw.detail_effect || '',
      generation: raw.generation || raw.id || '',
      pokemons
    }
  } catch (error) {
    console.error(`Error loading ability detail for ${name}:`, error)
    return null
  }
}

export async function getMoveList(): Promise<SimpleMove[]> {
  if (moveListCache) return moveListCache
  moveListCache = await readJsonFile<SimpleMove[]>('move_list.json')
  return moveListCache
}

export async function getMoveDetail(name: string): Promise<MoveDetail | null> {
  try {
    const raw = await readJsonFile<any>(path.join('moves', `${name}.json`))

    const pokemonMap = new Map<string, {
      id: string
      name: string
      form: string
      level_learn: { level: string; id: string; name: string }[]
      machine_learn: { machine: string; id: string; name: string }[]
      egg_learn: { id: string; name: string }[]
      tutor_learn: { id: string; name: string }[]
    }>()

    const getOrCreate = (id: string, fullName: string) => {
      let name = fullName
      let form = ''
      if (fullName.includes('-')) {
        const parts = fullName.split('-')
        name = parts[0]
        form = parts[1]
      }
      const key = `${id}-${form}`
      if (!pokemonMap.has(key)) {
        pokemonMap.set(key, {
          id,
          name,
          form,
          level_learn: [],
          machine_learn: [],
          egg_learn: [],
          tutor_learn: []
        })
      }
      return pokemonMap.get(key)!
    }

    if (Array.isArray(raw.learn_by_level_up)) {
      raw.learn_by_level_up.forEach((p: any) => {
        const pk = getOrCreate(p.id, p.name)
        pk.level_learn.push({ level: '✓', id: p.id, name: pk.name })
      })
    }

    if (Array.isArray(raw.learn_by_tm)) {
      raw.learn_by_tm.forEach((p: any) => {
        const pk = getOrCreate(p.id, p.name)
        pk.machine_learn.push({ machine: 'TM', id: p.id, name: pk.name })
      })
    }

    if (Array.isArray(raw.learn_by_breeding)) {
      raw.learn_by_breeding.forEach((p: any) => {
        const pk = getOrCreate(p.id, p.name)
        pk.egg_learn.push({ id: p.id, name: pk.name })
      })
    }

    if (Array.isArray(raw.learn_by_tutor)) {
      raw.learn_by_tutor.forEach((p: any) => {
        const pk = getOrCreate(p.id, p.name)
        pk.tutor_learn.push({ id: p.id, name: pk.name })
      })
    }

    const pokemons = Array.from(pokemonMap.values())

    return {
      name_zh: raw.name_zh || '',
      name_ja: raw.name_ja || raw.name_jp || '',
      name_en: raw.name_en || '',
      type: raw.type || '一般',
      category: raw.category || '物理',
      power: raw.power || '—',
      accuracy: raw.accuracy || '—',
      pp: raw.pp || '—',
      description: raw.description || raw.intro || '',
      effect: Array.isArray(raw.effect) ? raw.effect.join('\n') : (raw.effect || ''),
      target: raw.range || '',
      priority: raw.priority || '0',
      critical_rate: raw.critical_rate || '0',
      makes_contact: raw.makes_contact || '否',
      affected_by_protect: raw.affected_by_protect || '否',
      affected_by_magic_coat: raw.affected_by_magic_coat || '否',
      affected_by_snatch: raw.affected_by_snatch || '否',
      affected_by_mirror_move: raw.affected_by_mirror_move || '否',
      affected_by_kings_rock: raw.affected_by_kings_rock || '否',
      generation: raw.generation || raw.id || '',
      pokemons
    }
  } catch (error) {
    console.error(`Error loading move detail for ${name}:`, error)
    return null
  }
}

export async function getItemList(): Promise<ItemNode[]> {
  if (itemListCache) return itemListCache
  itemListCache = await readJsonFile<ItemNode[]>('item_list.json')
  return itemListCache
}
