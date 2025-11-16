import type { FormMove } from '@/types'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  type: 'learned' | 'machine'
  data: FormMove[]
}

export default function PokemonMove({ type, data }: Props) {
  return (
    <Tabs defaultValue={data[0].form} className="w-full">
      <TabsList className="w-full">
        {data.map((form, index) => (
          <TabsTrigger
            key={index}
            value={form.form}
            className="block w-28 truncate lg:w-auto"
            title={form.form}
          >
            {form.form}
          </TabsTrigger>
        ))}
      </TabsList>
      {data.map((form, index) => (
        <TabsContent key={index} value={form.form}>
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
              {form.data.map((move, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-center">
                    {type === 'learned'
                      ? move.level_learned_at
                      : move.machine_used?.replace('招式学习器', '')}
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
                    <TypeBadge type={move.type} size="small" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CategoryBadge type={move.category} size="small" />
                  </TableCell>
                  <TableCell className="text-center">{move.power}</TableCell>
                  <TableCell className="text-center">{move.accuracy}</TableCell>
                  <TableCell className="text-center">{move.pp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      ))}
    </Tabs>
  )
}
