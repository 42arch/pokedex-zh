import type { FormAbility } from '@/types'
import Link from 'next/link'

export default function Ability({ name, is_hidden, text }: FormAbility) {
  return (
    <Link
      href={`/ability/${name}`}
      className="flex w-full max-w-xs cursor-pointer flex-col items-center gap-1 rounded-lg border border-border hover:bg-accent px-2 py-2 md:w-3/4 lg:px-4"
    >
      <p>
        <span className="text-sm">{name}</span>
        <span className="text-xs">{is_hidden ? '（隐藏）' : ''}</span>
      </p>
      <p className="text-xs text-muted-foreground">{text}</p>
    </Link>
  )
}
