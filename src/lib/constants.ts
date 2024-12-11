import {
  Category,
  categorySchema,
  generationSchema,
  Order,
  orderSchema,
  Type,
  typeSchema
} from '@/types'

export const ORDERS = orderSchema.options

export const ORDER_LABEL: Record<Order, string> = {
  asc: '顺序',
  desc: '倒序'
}

export const TYPES = typeSchema.options

export const CATEGORIES = categorySchema.options

export const GENERATIONS = generationSchema.options

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
  未知: '#44685e'
}

export const CATEGORY_TYPE: Record<Category, string> = {
  物理: '#ff4400',
  特殊: '#2266cc',
  变化: '#999999'
}
