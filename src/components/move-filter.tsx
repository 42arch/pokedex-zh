import type { Category, Generation, Order, Type } from '@/types'
import { GENERATIONS, TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import TypeBadge from './type-badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Separator } from './ui/separator'

export interface MoveFilterOptions {
  type: Type | null
  category: Category | null
  generation: Generation | null
  order: Order
}

export default function MoveFilter({
  options,
  onOptionsChange,
}: {
  options: MoveFilterOptions
  onOptionsChange: (v: MoveFilterOptions) => void
}) {
  const handleTypeClick = (type: Type) => {
    const newOptions = { ...options }

    if (!options.type) {
      newOptions.type = type
    }
    else {
      newOptions.type = null
    }
    onOptionsChange(newOptions)
  }

  const handleGenClick = (gen: Generation) => {
    const newOptions = { ...options }

    if (newOptions.generation === gen) {
      newOptions.generation = null
    }
    else {
      newOptions.generation = gen
    }
    onOptionsChange(newOptions)
  }

  const handleOrderChange = (v: Order) => {
    onOptionsChange({
      ...options,
      order: v,
    })
  }

  const handleClear = () => {
    onOptionsChange({
      ...options,
      type: null,
      category: null,
      generation: null,
    })
  }

  return (
    <Accordion type="single" collapsible className="pr-4">
      <AccordionItem value="filter" className="border-b-0">
        <AccordionTrigger className="justify-end gap-2 hover:no-underline">
          筛选
        </AccordionTrigger>
        <AccordionContent className="">
          <div className="flex flex-wrap gap-2">
            {TYPES.filter(t => t !== '未知').map(type => (
              <TypeBadge
                key={type}
                type={type}
                active={options.type === type}
                size="normal"
                onClick={handleTypeClick}
              />
            ))}
            <Separator className="my-1 h-[0.5px]" />
            {GENERATIONS.map(gen => (
              <div
                key={gen}
                className={cn(
                  'cursor-pointer rounded px-2 py-0.5',
                  options.generation === gen
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
                onClick={() => handleGenClick(gen)}
              >
                {gen}
              </div>
            ))}
            <Separator className="my-1 h-[0.5px]" />
            <RadioGroup
              className="flex gap-2"
              defaultValue={options.order}
              onValueChange={handleOrderChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="r1" />
                <Label htmlFor="r1">顺序排列</Label>
              </div>
              <Separator orientation="vertical" className="mx-2 h-[0.5px]" />
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="r2" />
                <Label htmlFor="r2">倒序排列</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="text-right">
            <Button variant="ghost" onClick={handleClear}>
              清除筛选
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
