import type { MachineMove, Move } from '@/types'
import Link from 'next/link'
import CategoryBadge from '@/components/category-badge'
import TypeBadge from '@/components/type-badge'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Props {
  type: 'learned' | 'machine'
  data: (Move | MachineMove)[]
}

export default function PokemonMove({ type, data }: Props) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">暂无招式数据</div>
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {type === 'learned'
              ? (
                  <TableHead className="text-center">等级</TableHead>
                )
              : (
                  <TableHead className="w-20 text-center">招式学习器</TableHead>
                )}
            <TableHead className="text-center">招式</TableHead>
            <TableHead className="hidden w-20 text-center md:table-cell">
              属性
            </TableHead>
            <TableHead className="w-20 text-center">分类</TableHead>
            <TableHead className="text-center">威力</TableHead>
            <TableHead className="text-center">命中</TableHead>
            <TableHead className="text-center">PP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((move, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-center">
                {type === 'learned'
                  ? (move as Move).level
                  : (move as MachineMove).machine?.replace('招式学习器', '')}
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/move/${move.name}`}
                  className="hover:underline"
                >
                  {move.name}
                </Link>
              </TableCell>
              <TableCell className="hidden text-center md:table-cell">
                <TypeBadge type={move.type as any} size="small" />
              </TableCell>
              <TableCell className="text-center">
                <CategoryBadge type={move.category as any} size="small" />
              </TableCell>
              <TableCell className="text-center">{move.power}</TableCell>
              <TableCell className="text-center">{move.accuracy}</TableCell>
              <TableCell className="text-center">{move.pp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
