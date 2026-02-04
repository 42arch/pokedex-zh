import type { HomeImage } from '@/types'
import Image from '@/components/image'
import { IMAGE_PATH } from '@/lib/constants'

export default function SpriteImage({ data }: { data: HomeImage }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border p-4">
      <div className="flex gap-4">
        {data.image
          ? (
              <div className="flex flex-col items-center gap-1">
                <Image
                  src={`${IMAGE_PATH}home/${data.image}`}
                  alt={data.name}
                  width={100}
                  height={100}
                />
                <p className="text-xs text-muted-foreground">普通</p>
              </div>
            )
          : null}
        {data.shiny
          ? (
              <div className="flex flex-col items-center gap-1">
                <Image
                  src={`${IMAGE_PATH}home/${data.shiny}`}
                  alt={data.name}
                  width={100}
                  height={100}
                />
                <p className="text-xs text-muted-foreground">异色</p>
              </div>
            )
          : null}
      </div>
      <p className="mt-2 text-center text-xs font-medium">{data.name}</p>
    </div>
  )
}
