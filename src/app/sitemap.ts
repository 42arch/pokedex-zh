import type { MetadataRoute } from 'next'
import { translateText } from '@/lib/chinese'
import { BASE_URL } from '@/lib/constants'
import { getAbilityList, getItemList, getMoveList, getNationalPokedex } from '@/services/pokemon'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL

  // 1. Static routes
  const staticRoutes = [
    '',
    '/pokemon',
    '/moves',
    '/abilities',
    '/items',
    '/tools',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes for 'zh' and 'zh-Hant'
  for (const route of staticRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' || route === '/pokemon' ? 1.0 : 0.8,
    })
    sitemapEntries.push({
      url: `${baseUrl}/zh-Hant${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' || route === '/pokemon' ? 0.9 : 0.7,
    })
  }

  // 2. Dynamic routes - Pokemons
  try {
    const pokemons = await getNationalPokedex()
    for (const p of pokemons) {
      const nameHans = translateText(p.name, 'zh-Hans')
      const nameHant = translateText(p.name, 'zh-Hant')
      sitemapEntries.push({
        url: `${baseUrl}/pokemon/${encodeURIComponent(nameHans)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
      sitemapEntries.push({
        url: `${baseUrl}/zh-Hant/pokemon/${encodeURIComponent(nameHant)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  catch (e) {
    console.error('Sitemap pokemon fetch error:', e)
  }

  // 3. Dynamic routes - Abilities
  try {
    const abilities = await getAbilityList()
    for (const a of abilities) {
      if (a.name_zh) {
        const encoded = encodeURIComponent(a.name_zh)
        sitemapEntries.push({
          url: `${baseUrl}/abilities/${encoded}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
        sitemapEntries.push({
          url: `${baseUrl}/zh-Hant/abilities/${encoded}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  }
  catch (e) {
    console.error('Sitemap ability fetch error:', e)
  }

  // 4. Dynamic routes - Moves
  try {
    const moves = await getMoveList()
    for (const m of moves) {
      if (m.name_zh) {
        const encoded = encodeURIComponent(m.name_zh)
        sitemapEntries.push({
          url: `${baseUrl}/moves/${encoded}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
        sitemapEntries.push({
          url: `${baseUrl}/zh-Hant/moves/${encoded}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  }
  catch (e) {
    console.error('Sitemap move fetch error:', e)
  }

  // 5. Dynamic routes - Items
  try {
    const itemsTree = await getItemList()
    const itemNames: string[] = []

    const recurse = (node: any) => {
      if (node.type === 'item' && node.name_zh) {
        itemNames.push(node.name_zh)
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(recurse)
      }
    }
    itemsTree.forEach(recurse)

    for (const name of itemNames) {
      const encoded = encodeURIComponent(name)
      sitemapEntries.push({
        url: `${baseUrl}/items/${encoded}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
      sitemapEntries.push({
        url: `${baseUrl}/zh-Hant/items/${encoded}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      })
    }
  }
  catch (e) {
    console.error('Sitemap item fetch error:', e)
  }

  return sitemapEntries
}
