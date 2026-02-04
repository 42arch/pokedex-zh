'use client'

import type { AbilityDetail } from '@/types'
import { use, useEffect, useState } from 'react'
import { getAbilityInfo } from '@/http/ability'
import Detail from './ability-detail'
import MobilePage from './mobile-page'
import TopBar from './top-bar'

interface Props {
  params: Promise<{ name: string }>
}

export default function Page({ params }: Props) {
  const { name } = use(params)
  const [data, setData] = useState<AbilityDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const decodedName = decodeURIComponent(name)
        const detailData = await getAbilityInfo(decodedName)
        setData(detailData)
      }
      catch (e) {
        console.error(e)
      }
      finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [name])

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center">加载中...</div>
  }

  if (!data) {
    return <div className="flex h-full w-full items-center justify-center">未找到特性</div>
  }

  return (
    <>
      <div className="relative hidden w-full lg:block lg:w-2/3">
        <TopBar name={data.name_zh} index={data.id} />
        <Detail data={data} />
      </div>
      <MobilePage data={data} />
    </>
  )
}
