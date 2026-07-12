import type { Metadata } from 'next'
import type { FlattenedItem } from '@/components/items-layout'
import type { ItemNode } from '@/services/pokemon'
import { setRequestLocale } from 'next-intl/server'
import { ItemDetailView, ItemEmptyView } from '@/components/items-layout'
import { translateText } from '@/lib/chinese'
import { getItemList } from '@/services/pokemon'

interface PageProps {
  params: Promise<{ locale: string, name?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, name } = await params
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = 'https://pokedex.starllow.com'
  const path = activeName ? `/items/${encodeURIComponent(activeName)}` : '/items'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh-Hans': `${baseUrl}${path}`,
      'zh-Hant': `${baseUrl}/zh-Hant${path}`,
      'x-default': `${baseUrl}${path}`,
    },
  }

  if (!activeName) {
    return {
      title: '宝可梦道具列表 | 宝可梦图鉴 Pokedex',
      description: '查询宝可梦游戏中的全部道具（物品）列表，包括精灵球、药水、携带道具、进化道具、关键道具等详细分类与作用。',
      alternates,
    }
  }

  const nameZh = translateText(activeName, locale)
  return {
    title: `${nameZh} (道具) | 宝可梦图鉴 Pokedex`,
    description: `查看宝可梦道具“${nameZh}”的详细资料，包含道具介绍、主要作用与获取方式。`,
    alternates,
  }
}

function flattenItemsDetail(nodes: ItemNode[], currentPath: string[] = []): FlattenedItem[] {
  let result: FlattenedItem[] = []
  for (const node of nodes) {
    if (node.type === 'category') {
      const nextPath = [...currentPath, node.name || '']
      if (node.children) {
        result = [...result, ...flattenItemsDetail(node.children, nextPath)]
      }
    }
    else if (node.type === 'item' && node.name_zh) {
      result.push({
        name_zh: node.name_zh,
        name_ja: node.name_ja || '',
        name_en: node.name_en || '',
        description: node.description || '',
        icon: node.icon || '',
        categoryPath: currentPath,
      })
    }
  }
  return result
}

export async function generateStaticParams() {
  return []
}

export default async function ItemsPage({ params }: PageProps) {
  const { locale, name } = await params
  setRequestLocale(locale)

  const itemList = await getItemList()
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const allItems = flattenItemsDetail(itemList)
  const activeItem = allItems.find(item => item.name_zh === activeName) || null

  if (activeItem) {
    return <ItemDetailView activeItem={activeItem} locale={locale} />
  }

  return <ItemEmptyView locale={locale} />
}
