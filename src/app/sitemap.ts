import type { MetadataRoute } from 'next'
import { translateText } from '@/lib/chinese'
import { BASE_URL } from '@/lib/constants'
import { getNationalPokedex } from '@/services/pokemon'

export const dynamic = 'force-static'

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

  for (const route of staticRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' || route === '/pokemon' ? 1.0 : 0.8,
    })
  }

  // 2. Dynamic routes - Pokemons
  try {
    const pokemons = await getNationalPokedex()
    for (const p of pokemons) {
      const nameHans = translateText(p.name, 'zh')
      sitemapEntries.push({
        url: `${baseUrl}/pokemon/${encodeURIComponent(nameHans)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }
  catch (e) {
    console.error('Sitemap pokemon fetch error:', e)
  }

  return sitemapEntries
}
