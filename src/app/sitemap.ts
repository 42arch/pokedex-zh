import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://pokedex-zh.netlify.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: 'https://pokedex-zh.netlify.app/pokemon',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: 'https://pokedex-zh.netlify.app/ability',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5
    },
    {
      url: 'https://pokedex-zh.netlify.app/move',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5
    }
  ]
}
