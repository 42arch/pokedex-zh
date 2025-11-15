import { Filter, Generation, Order, Type } from "@/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { FILTER_LIST, GENERATIONS, TYPES } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import TypeBadge from '@/components/type-badge'

export interface FilterOptions {
  type1: Type | null
  type2: Type | null
  filter: Filter | null
  generation: Generation | null
  order: Order
}

export default function PokemonFilter({
  options,
  onOptionsChange
}: {
  options: FilterOptions
  onOptionsChange: (v: FilterOptions) => void
}) {
  const handleTypeClick = (type: Type) => {
    const newOptions = { ...options }

    if (!options.type1) {
      newOptions.type1 = type
      newOptions.type2 = null
    } else {
      if (options.type1 === type) {
        if (options.type2) {
          newOptions.type1 = options.type2
          newOptions.type2 = null
        } else {
          newOptions.type1 = null
        }
      } else {
        if (!options.type2) {
          newOptions.type2 = type
        } else {
          if (options.type2 === type) {
            newOptions.type2 = null
          } else {
            newOptions.type2 = type
          }
        }
      }
    }
    onOptionsChange(newOptions)
  }

  const handleFilterClick = (filter: Filter) => {
    const newOptions = { ...options }

    if (newOptions.filter === filter) {
      newOptions.filter = null
    } else {
      newOptions.filter = filter
    }
    onOptionsChange(newOptions)
  }

  const handleGenClick = (gen: Generation) => {
    const newOptions = { ...options }

    if (newOptions.generation === gen) {
      newOptions.generation = null
    } else {
      newOptions.generation = gen
    }
    onOptionsChange(newOptions)
  }

  const handleOrderChange = (v: Order) => {
    onOptionsChange({
      ...options,
      order: v
    })
  }

  const handleClear = () => {
    onOptionsChange({
      ...options,
      type1: null,
      type2: null,
      generation: null
    })
  }

  return (
    <Accordion type='single' collapsible className=' pr-4'>
      <AccordionItem value='filter' className='border-b-0'>
        <AccordionTrigger className='justify-end gap-2 hover:no-underline'>
          筛选
        </AccordionTrigger>
        <AccordionContent className=''>
          <div className='flex flex-wrap gap-2'>
            {TYPES.filter((t) => t !== '未知').map((type) => (
              <TypeBadge
                key={type}
                type={type}
                active={options.type1 === type || options.type2 === type}
                size='normal'
                onClick={handleTypeClick}
              />
            ))}
            <Separator className='my-1 h-[0.5px]' />
            {
              FILTER_LIST.map((filter) => (
                <div
                  key={filter.value}
                  className={cn(
                    'cursor-pointer rounded px-2 py-0.5 bg-muted',
                    options.filter !== filter.value
                      ? 'text-muted-foreground '
                      : 'text-primary-foreground'
                  )}
                  style={{
                    backgroundColor: options.filter !== filter.value ? 'hsl(var(--muted))' : filter.color
                  }}
                  onClick={() => handleFilterClick(filter.value)}
                >
                  {filter.label}
                </div>
              ))
            }
            <Separator className='my-1 h-[0.5px]' />
            {GENERATIONS.map((gen) => (
              <div
                key={gen}
                className={cn(
                  'cursor-pointer rounded px-2 py-0.5',
                  options.generation === gen
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
                onClick={() => handleGenClick(gen)}
              >
                {gen}
              </div>
            ))}
            <Separator className='my-1 h-[0.5px]' />
            <RadioGroup
              className='flex gap-2'
              defaultValue={options.order}
              onValueChange={handleOrderChange}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='asc' id='r1' />
                <Label htmlFor='r1'>顺序排列</Label>
              </div>
              <Separator orientation='vertical' className='mx-2 h-[0.5px]' />
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='desc' id='r2' />
                <Label htmlFor='r2'>倒序排列</Label>
              </div>
            </RadioGroup>
          </div>
          <div className='text-right'>
            <Button variant='ghost' onClick={handleClear}>
              清除筛选
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}