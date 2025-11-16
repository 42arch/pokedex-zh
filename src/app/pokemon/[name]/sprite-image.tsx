import type { HomeImage } from '@/types'
import { Sparkle } from '@phosphor-icons/react/dist/ssr'
import Image from '@/components/image'

interface Props {
  data: HomeImage
}

export default function SpriteImage({ data }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {data.image && (
        <div className="flex flex-col items-center">
          <Image
            src={`/images/home/${data.image}`}
            width={100}
            height={100}
            alt={data.name}
          />
          <p className="pt-2 text-center text-xs text-muted-foreground">
            {data.name}
          </p>
        </div>
      )}
      {data.shiny && (
        <div className="flex flex-col items-center">
          <Image
            src={`/images/home/${data.shiny}`}
            width={100}
            height={100}
            alt={data.name}
          />
          <div className="flex gap-1 pt-2 text-center text-xs text-muted-foreground">
            {data.name}
            {' '}
            <Sparkle size={14} weight="fill" color="#e1c614" />
          </div>
        </div>
      )}
    </div>
  )
}
