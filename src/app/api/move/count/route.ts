import type { MoveList } from '@/types'
import { NextResponse } from 'next/server'
import { readFile } from '@/lib/file'

export async function GET() {
  const allData = await readFile<MoveList>('move_list.json')
  const total = allData.length
  return NextResponse.json(total)
}
