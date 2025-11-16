'use client'

import type { Category } from '@/types'
import { CATEGORY_TYPE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  type: Category
  size: 'normal' | 'small'
}

function CategoryBadge({ type, size }: Props) {
  const color = CATEGORY_TYPE[type]

  return (
    <div
      className="flex items-center justify-center gap-2 rounded px-2 py-0.5 text-white"
      style={{
        backgroundColor: color,
      }}
    >
      {size === 'normal' && (
        <span className={cn('type', `type-${type}`)}></span>
      )}

      {size === 'normal'
        ? (
            <span className="text-sm">{type}</span>
          )
        : (
            <span className="text-xs brightness-200">{type}</span>
          )}
    </div>
  )
}

export default CategoryBadge
