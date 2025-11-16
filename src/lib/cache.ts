import type { NextResponse } from 'next/server'

export function cache(response: NextResponse) {
  response.headers.set(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60',
  )
}
