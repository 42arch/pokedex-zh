import { z } from 'zod'

export const orderSchema = z.enum(['asc', 'desc'])

export type Order = z.infer<typeof orderSchema>

export const generationSchema = z.enum([
  '第一世代',
  '第二世代',
  '第三世代',
  '第四世代',
  '第五世代',
  '第六世代',
  '第七世代',
  '第八世代',
  '第九世代'
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
  '未知'
])

export type Type = z.infer<typeof typeSchema>

export const PaginatedResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  contents: z.array(z.any())
})

export const pokemonSimpleSchema = z.object({
  index: z.number(),
  name: z.string(),
  name_jp: z.string(),
  name_en: z.string(),
  generation: z.string(),
  types: z.array(typeSchema),
  meta: z.object({
    filter: z.string(),
    icon_position: z.string()
  })
})

export const pokemonListSchema = z.array(pokemonSimpleSchema)

export const statLabelSchema = z.enum([
  'hp',
  'attack',
  'defense',
  'sp_attack',
  'sp_defense',
  'speed'
])

export type StatLabel = z.infer<typeof statLabelSchema>

export const statSchema = z.object({
  form: z.string().default('一般'),
  data: z.record(statLabelSchema, z.string())
})

export type Stat = z.infer<typeof statSchema>

export const homeImageSchema = z.object({
  name: z.string(),
  image: z.string().nullable(),
  shiny: z.string().nullable()
})

export type HomeImage = z.infer<typeof homeImageSchema>

export const flavorTextSchema = z.object({
  name: z.string(),
  versions: z.array(
    z.object({
      name: z.string(),
      group: z.string(),
      text: z.string()
    })
  )
})

export type FlavorText = z.infer<typeof flavorTextSchema>

export const evolutionChainSchema = z.array(
  z.object({
    name: z.string(),
    stage: z.string(),
    text: z.string().nullable(),
    image: z.string(),
    back_text: z.string().nullable(),
    from: z.string().nullable(),
    form_name: z.string().nullable()
  })
)

export type EvolutionChain = z.infer<typeof evolutionChainSchema>

export const moveSchema = z.object({
  level_learned_at: z.string().nullable(),
  machine_used: z.string().nullable(),
  method: z.string(),
  name: z.string(),
  flavor_text: z.string(),
  type: typeSchema,
  category: categorySchema,
  power: z.string(),
  accuracy: z.string(),
  pp: z.string()
})

export type Move = z.infer<typeof moveSchema>

export const formMoveSchema = z.object({
  form: z.string(),
  data: z.array(moveSchema)
})

export type FormMove = z.infer<typeof formMoveSchema>

export const formAbilitySchema = z.object({
  name: z.string(),
  is_hidden: z.boolean(),
  text: z.string().nullable()
})

export type FormAbility = z.infer<typeof formAbilitySchema>

export const pokemonDetailSchema = z.object({
  name: z.string(),
  index: z.string(),
  name_en: z.string(),
  name_jp: z.string(),
  profile: z.string(),
  forms: z.array(
    z.object({
      name: z.string(),
      index: z.string(),
      is_mega: z.boolean(),
      is_gmax: z.boolean(),
      image: z.string(),
      types: z.array(typeSchema),
      genus: z.string(),
      ability: z.array(formAbilitySchema),
      experience: z.object({
        number: z.string(),
        speed: z.string()
      }),
      height: z.string(),
      weight: z.string(),
      gender_rate: z
        .object({
          male: z.string(),
          female: z.string()
        })
        .nullable(),
      shape: z.string(),
      color: z.string(),
      catch_rate: z.object({
        number: z.string(),
        rate: z.string()
      }),
      egg_groups: z.array(z.string())
    })
  ),
  stats: z.array(statSchema),
  flavor_texts: z.array(
    z.object({
      name: z.string(),
      versions: z.array(
        z.object({
          name: z.string(),
          group: z.string(),
          text: z.string()
        })
      )
    })
  ),
  names: z.object({
    zh_hans: z.string(),
    zh_hant: z.string(),
    en: z.string(),
    fr: z.string(),
    de: z.string(),
    it: z.string(),
    es: z.string(),
    ja: z.string(),
    ko: z.string()
  }),
  moves: z.object({
    learned: z.array(formMoveSchema),
    machine: z.array(formMoveSchema)
  }),
  evolution_chains: z.array(evolutionChainSchema),
  home_images: z.array(homeImageSchema)
})

export type PokemonSimple = z.infer<typeof pokemonSimpleSchema>
export type PokemonList = z.infer<typeof pokemonListSchema>
export type PokemonDetail = z.infer<typeof pokemonDetailSchema>

export const abilityDetailSchema = z.object({
  index: z.string(),
  generation: generationSchema,
  name: z.string(),
  name_jp: z.string(),
  name_en: z.string(),
  text: z.string(),
  common_count: z.number(),
  hidden_count: z.number(),
  effect: z.string(),
  info: z.array(z.string()),
  pokemon: z.array(
    z.object({
      index: z.string(),
      name: z.string(),
      types: z.array(typeSchema),
      first: z.string(),
      second: z.string(),
      hidden: z.string(),
      meta: z
        .object({
          icon_position: z.string()
        })
        .nullable()
    })
  )
})

export const abilitySimpleSchema = z.object({
  index: z.string(),
  generation: generationSchema,
  name: z.string(),
  name_jp: z.string(),
  name_en: z.string(),
  text: z.string(),
  common_count: z.number(),
  hidden_count: z.number()
})

export const abilityListSchema = z.array(abilitySimpleSchema)

export type AbilitySimple = z.infer<typeof abilitySimpleSchema>
export type AbilityList = z.infer<typeof abilityListSchema>
export type AbilityDetail = z.infer<typeof abilityDetailSchema>

export const moveSimpleSchema = z.object({
  index: z.string(),
  generation: generationSchema,
  name: z.string(),
  name_jp: z.string(),
  name_en: z.string(),
  type: typeSchema,
  category: categorySchema,
  power: z.string(),
  accuracy: z.string(),
  pp: z.string(),
  text: z.string()
})
export const moveListSchema = z.array(moveSimpleSchema)

const movePokemonSchema = z.object({
  index: z.string(),
  name: z.string(),
  types: z.array(typeSchema),
  meta: z
    .object({
      icon_position: z.string()
    })
    .nullable()
})

export type MovePokemon = z.infer<typeof movePokemonSchema>

export const moveDetailSchema = z.object({
  index: z.string(),
  generation: generationSchema,
  name: z.string(),
  name_jp: z.string(),
  name_en: z.string(),
  type: typeSchema,
  category: categorySchema,
  power: z.string(),
  accuracy: z.string(),
  pp: z.string(),
  text: z.string(),
  effect: z.string(),
  info: z.array(z.string()),
  range: z.string(),
  pokemon: z.object({
    level: z.array(movePokemonSchema),
    machine: z.array(movePokemonSchema),
    egg: z.array(movePokemonSchema),
    tutor: z.array(movePokemonSchema)
  })
})

export type MoveSimple = z.infer<typeof moveSimpleSchema>
export type MoveList = z.infer<typeof moveListSchema>
export type MoveDetail = z.infer<typeof moveDetailSchema>

export type PaginatedResponse<T> = z.infer<typeof PaginatedResponseSchema> & {
  result: T[]
}
