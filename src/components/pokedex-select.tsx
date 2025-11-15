"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { POKEDEX_LIST } from "@/lib/constants"

interface PokedexProps {
  value: string
  onChange: (value: string) => void
}

export function PokedexSelect({ value, onChange }: PokedexProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] font-semibold justify-between"
        >
          {value
            ? POKEDEX_LIST.find((pokedex) => pokedex.value === value)?.label
            : "全国图鉴"}
          <ChevronsUpDown className="opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {POKEDEX_LIST.map((pokedex) => (
                <CommandItem
                  key={pokedex.value}
                  value={pokedex.value}
                  onSelect={(currentValue) => {
                    // setValue(currentValue === value ? "" : currentValue)
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  {pokedex.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === pokedex.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
