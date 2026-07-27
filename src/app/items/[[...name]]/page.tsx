import type { Metadata } from 'next'
import { StaticItemDetailPage } from '@/components/static-detail-pages'
import { translateText } from '@/lib/chinese'
import { BASE_URL } from '@/lib/constants'

export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: Promise<{ name?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const locale = 'zh'
  const activeName = name?.[0] ? decodeURIComponent(name[0]) : ''
  const baseUrl = BASE_URL
  const path = activeName ? `/items/${encodeURIComponent(activeName)}` : '/items'

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: {
      'zh': `${baseUrl}${path}`,
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

export async function generateStaticParams() {
  return [{ name: [] }]
}

export default async function ItemsPage() {
  return <StaticItemDetailPage />
}
