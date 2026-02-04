import { z } from 'zod'

export const orderSchema = z.enum(['asc', 'desc'])

export type Order = z.infer<typeof orderSchema>

export const filterSchema = z.enum(['初', '鼠', '石', '准', '地', '超', 'Z', '极', '传', '幻', '究', '悖'])
export type Filter = z.infer<typeof filterSchema>

export const generationSchema = z.enum([
  '第一世代',
  '第二世代',
  '第三世代',
  '第四世代',
  '第五世代',
  '第六世代',
  '第七世代',
  '第八世代',
  '第九世代',
])

export type Generation = z.infer<typeof generationSchema>

export const categorySchema = z.enum(['物理', '特殊', '变化'])

export type Category = z.infer<typeof categorySchema>

export const typeSchema = z.enum([
  '一般',
  '格斗',
  '飞行',
  '毒',
  '地面',
  '岩石',
  '虫',
  '幽灵',
  '钢',
  '火',
  '水',
  '草',
  '电',
  '超能力',
  '冰',
  '龙',
  '恶',
  '妖精',
  '未知',
])

export type Type = z.infer<typeof typeSchema>

export const PaginatedResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  contents: z.array(z.any()),
})

// Updated to match national.json structure
export const pokemonSimpleSchema = z.object({
  id: z.string(),
  name: z.string(),
  types: z.array(z.string()),
  icon: z.string(),
  filter: z.string(),
  gen: z.number(),
  name_en: z.string().optional(),
  name_jp: z.string().optional(),
  generation: z.string().optional(),
})

export const pokemonListSchema = z.array(pokemonSimpleSchema)

export const statLabelSchema = z.enum([
  'hp',
  'attack',
  'defense',
  'sp_attack',
  'sp_defense',
  'speed',
])

export type StatLabel = z.infer<typeof statLabelSchema>

export const statDataSchema = z.object({
  hp: z.string(),
  attack: z.string(),
  defense: z.string(),
  sp_attack: z.string(),
  sp_defense: z.string(),
  speed: z.string(),
})

export const statSchema = z.object({
  form: z.string(),
  data: statDataSchema,
})

export type Stat = z.infer<typeof statSchema>

export const homeImageSchema = z.object({
  name: z.string(),
  image: z.string(),
  shiny: z.string(),
})

export type HomeImage = z.infer<typeof homeImageSchema>

export const pokedexEntrySchema = z.object({
  name: z.string(),
  versions: z.array(
    z.object({
      name: z.string(),
      group: z.string(),
      text: z.string(),
    }),
  ),
})

export type PokedexEntry = z.infer<typeof pokedexEntrySchema>

export const evolutionChainSchema = z.array(
  z.object({
    name: z.string(),
    stage: z.string(),
    text: z.string().nullable(),
    image: z.string(),
    back_text: z.string().nullable(),
    from: z.string().nullable(),
    form_name: z.string().nullable(),
  }),
)

export type EvolutionChain = z.infer<typeof evolutionChainSchema>

export const evolutionSchema = z.object({
  name: z.string(),
  form_name: z.string(),
  image: z.string(),
})

export const learnableMoveSchema = z.object({
  level: z.string(),
  name: z.string(),
  type: z.string(), // or typeSchema
  category: z.string(), // or categorySchema
  power: z.string(),
  accuracy: z.string(),
  pp: z.string(),
})

export type Move = z.infer<typeof learnableMoveSchema>

export const machineMoveSchema = learnableMoveSchema.extend({
  machine: z.string(),
})

export type MachineMove = z.infer<typeof machineMoveSchema>

export const eggMoveSchema = learnableMoveSchema.omit({ level: true }).extend({
  parents: z.array(z.object({
    id: z.string().nullable(),
    name: z.string(),
  })),
})

export type EggMove = z.infer<typeof eggMoveSchema>

export const formAbilitySchema = z.object({
  name: z.string(),
  is_hidden: z.boolean(),
  text: z.string().optional(), // Added optional text field for compatibility/future use
})

export type FormAbility = z.infer<typeof formAbilitySchema>

export const pokemonNameSchema = z.object({
  language: z.string(),
  name: z.string(),
  origin: z.string(),
})

export const formSchema = z.object({
  name: z.string(),
  types: z.array(z.string()),
  category: z.string(),
  abilities: z.array(formAbilitySchema),
  height: z.string(),
  weight: z.string(),
  color: z.string(),
  catch_rate: z.string(),
  egg_groups: z.array(z.string()),
  experience_100: z.string(),
  base_points: z.array(z.object({
    stat: statLabelSchema,
    value: z.number(),
  })),
  base_exp: z.string(),
  battle_exp: z.string(),
  gender_ratio: z.object({
    male: z.number(),
    female: z.number(),
  }),
  egg_cycles: z.string(),
  shape: z.string(),
  footprint: z.string(),
  image: z.string(),
  // Derived/mapped fields for compatibility
  genus: z.string().optional(),
})

export type Form = z.infer<typeof formSchema>

export const typeEffectivenessSchema = z.object({
  form: z.string(),
  types: z.array(z.string()),
  data: z.array(z.object({
    type: z.string(),
    damage: z.string(),
  })),
})

export const pokemonDetailSchema = z.object({
  name_zh: z.string(),
  name_ja: z.string(),
  name_en: z.string(),
  pokedex_id: z.string(),
  description: z.string(),
  profile: z.string(),
  prototype: z.string(),
  detail: z.string(),
  names: z.array(pokemonNameSchema),
  forms: z.array(formSchema),
  stats: z.array(statSchema),
  type_effectiveness: z.array(typeEffectivenessSchema),
  pokedex_entries: z.array(pokedexEntrySchema),
  evolution_chains: z.array(evolutionChainSchema),
  mega_evolution: z.array(evolutionSchema).optional(),
  gigantamax_evolution: z.array(evolutionSchema).optional(),
  learnable_moves: z.array(learnableMoveSchema),
  machine_moves: z.array(machineMoveSchema),
  egg_moves: z.array(eggMoveSchema),
  home_images: z.array(homeImageSchema),
  // Mapped fields for compatibility if needed, or we just update the components
  flavor_texts: z.array(z.any()).optional(), // deprecated
})

export type PokemonSimple = z.infer<typeof pokemonSimpleSchema>
export type PokemonList = z.infer<typeof pokemonListSchema>
export type PokemonDetail = z.infer<typeof pokemonDetailSchema>

// Ability Schemas
export const abilitySimpleSchema = z.object({
  id: z.string(),
  name_zh: z.string(),
  name_ja: z.string(),
  name_en: z.string(),
  description: z.string(),
  common_count: z.number(),
  hidden_count: z.number(),
  generation: z.number(),
  caption: z.string(),
})

export const abilityListSchema = z.array(abilitySimpleSchema)

export const abilityPokemonSchema = z.object({
  id: z.string(),
  name: z.string(),
  form: z.string(),
  icon: z.string(),
  types: z.array(z.string()),
  first_ability: z.string(),
  second_ability: z.string(),
  hidden_ability: z.string(),
})

export const abilityDetailSchema = z.object({
  id: z.string(),
  name_zh: z.string(),
  name_ja: z.string(),
  name_en: z.string(),
  basic_info: z.array(z.string()),
  introduction: z.string(),
  effect: z.string(),
  pokemon_list: z.array(abilityPokemonSchema),
})

export type AbilitySimple = z.infer<typeof abilitySimpleSchema>
export type AbilityList = z.infer<typeof abilityListSchema>
export type AbilityDetail = z.infer<typeof abilityDetailSchema>

// Move Schemas
export const moveSimpleSchema = z.object({
  id: z.string(),
  name_zh: z.string(),
  name_jp: z.string(),
  name_en: z.string(),
  type: typeSchema,
  category: categorySchema,
  power: z.string(),
  accuracy: z.string(),
  pp: z.string(),
  description: z.string(),
  generation: z.number(),
  is_z: z.string().nullable(),
})
export const moveListSchema = z.array(moveSimpleSchema)

export const movePokemonSchema = z.object({
  id: z.string(),
  name: z.string(),
  types: z.array(z.string()),
  icon: z.string(),
})

export type MovePokemon = z.infer<typeof movePokemonSchema>

export const moveDetailSchema = z.object({
  name_zh: z.string(),
  name_ja: z.string(),
  name_en: z.string(),
  type: typeSchema,
  category: categorySchema,
  pp: z.string(),
  power: z.string(),
  accuracy: z.string(),
  range: z.string(),
  description: z.string(),
  intro: z.string(),
  effect: z.array(z.string()),
  additional_effect: z.string(),
  details: z.string(),
  move_changes: z.string(),
  learn_by_level_up: z.array(movePokemonSchema).optional(),
  learn_by_tm: z.array(movePokemonSchema).optional(),
  learn_by_breeding: z.array(movePokemonSchema).optional(),
  learn_by_tutor: z.array(movePokemonSchema).optional(),
})

export type MoveSimple = z.infer<typeof moveSimpleSchema>
export type MoveList = z.infer<typeof moveListSchema>
export type MoveDetail = z.infer<typeof moveDetailSchema>

export type PaginatedResponse<T> = z.infer<typeof PaginatedResponseSchema> & {
  result: T[]
}
