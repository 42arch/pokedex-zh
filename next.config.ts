import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  experimental: {
    workerThreads: true,
    staticGenerationMaxConcurrency: 1,
  },
}

export default withNextIntl(nextConfig)
