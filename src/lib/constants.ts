import type {
  Category,
  Filter,
  Order,
  Type,
} from '@/types'
import {
  categorySchema,
  filterSchema,
  generationSchema,
  orderSchema,
  typeSchema,
} from '@/types'

export const PAGE_SIZE = 50

export const ORDERS = orderSchema.options

export const ORDER_LABEL: Record<Order, string> = {
  asc: '顺序',
  desc: '倒序',
}

export const FILTERS = filterSchema.options
export const FILTER_LIST: { value: Filter, label: string, color: string }[] = [{
  value: '初',
  label: '最初的伙伴',
  color: '#ffd733',
}, {
  value: '鼠',
  label: '电鼠类宝可梦',
  color: '#ffcc33',
}, {
  value: '石',
  label: '化石复原宝可梦',
  color: '#bbaa66',
}, {
  value: '准',
  label: '大器晚成的宝可梦',
  color: '#7766ee',
}, {
  value: '地',
  label: '有地区形态',
  color: '#5ac8fa',
}, {
  value: '超',
  label: '有超级进化',
  color: '#025da6',
}, {
  value: 'Z',
  label: '有专属Z招式',
  color: '#5ac8fa',
}, {
  value: '极',
  label: '有超级巨化',
  color: '#ac379e',
}, {
  value: '传',
  label: '传说的宝可梦',
  color: '#e7b43d',
}, {
  value: '幻',
  label: '幻之宝可梦',
  color: '#e67091',
}, {
  value: '究',
  label: '究极异兽',
  color: '#222222',
}, {
  value: '悖',
  label: '悖谬宝可梦',
  color: '#d45455',
}]

export const TYPES = typeSchema.options

export const CATEGORIES = categorySchema.options

export const GENERATIONS = generationSchema.options

export const POKEDEX_LIST = [
  {
    value: 'national',
    label: '全国图鉴',
  },
  {
    value: 'kanto',
    label: '关都地区',
  },
  {
    value: 'johto',
    label: '成都地区',
  },
  {
    value: 'hoenn',
    label: '丰缘地区',
  },
  {
    value: 'sinnoh',
    label: '神奥地区',
  },
  {
    value: 'unova',
    label: '合众地区',
  },
  {
    value: 'kalos_coastal',
    label: '卡洛斯-海岸地区',
  },
  {
    value: 'kalos_central',
    label: '卡洛斯-中央地区',
  },
  {
    value: 'kalos_mountain',
    label: '卡洛斯-山岳地区',
  },
  {
    value: 'alola',
    label: '阿罗拉地区',
  },
  {
    value: 'alola_melemele',
    label: '阿罗拉-美乐美乐岛',
  },
  {
    value: 'alola_akala',
    label: '阿罗拉-阿卡拉岛',
  },
  {
    value: 'alola_ulaula',
    label: '阿罗拉-乌拉乌拉岛',
  },
  {
    value: 'alola_poni',
    label: '阿罗拉-波尼岛',
  },
  {
    value: 'galar',
    label: '伽勒尔地区',
  },
  {
    value: 'isle_of_armor',
    label: '铠岛',
  },
  {
    value: 'crown_of_tundra',
    label: '王冠雪原',
  },
  {
    value: 'hisui',
    label: '洗翠地区',
  },
  {
    value: 'paldea',
    label: '帕底亚地区',
  },
  {
    value: 'kitakami',
    label: '北上乡',
  },
  {
    value: 'blueberry',
    label: '蓝莓学院',
  },
  {
    value: 'lumiose',
    label: '密阿雷市',
  },
  {
    value: 'lumiose_mega',
    label: '密阿雷-超级进化',
  },
]

export const TYPE_COLORS: Record<Type, string> = {
  一般: '#9fa19f',
  格斗: '#ff8000',
  飞行: '#81b9ef',
  毒: '#9141cb',
  地面: '#915121',
  岩石: '#afa981',
  虫: '#91a119',
  幽灵: '#704170',
  钢: '#60a1b8',
  火: '#e62829',
  水: '#2980ef',
  草: '#3fa129',
  电: '#fac000',
  超能力: '#ef4179',
  冰: '#3fd8ff',
  龙: '#5060e1',
  恶: '#50413f',
  妖精: '#ef70ef',
  未知: '#44685e',
}

export const CATEGORY_TYPE: Record<Category, string> = {
  物理: '#ff4400',
  特殊: '#2266cc',
  变化: '#999999',
}
