'use client'

import type { Type } from '@/types'
import { TYPE_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  type: Type
  size: 'normal' | 'small'
  active?: boolean
  onClick?: (v: Type) => void
}

function TypeBadge({ type, size, active = true, onClick }: Props) {
  const color = TYPE_COLORS[type]

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2 rounded px-2 py-0.5',
        active ? 'text-white' : 'bg-muted text-muted-foreground',
        size === 'normal' ? 'min-w-20' : '',
      )}
      style={{
        backgroundColor: active ? color : '',
      }}
      onClick={() => onClick?.(type)}
    >
      {size === 'normal' && (
        <span className={cn('type', `type-${type}`)}></span>
      )}

      {size === 'normal'
        ? (
            <span className="text-center text-sm">{type}</span>
          )
        : (
            <span className="text-xs brightness-200">{type}</span>
          )}
    </div>
  )
}

export default TypeBadge
