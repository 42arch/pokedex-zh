import type { PokedexEntry } from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Props {
  data: PokedexEntry[]
}

export default function FlavorText({ data }: Props) {
  const hasVersionData = data.filter(g => g.versions.length > 0)

  return (
    <>
      {hasVersionData.map((generation) => {
        return (
          <Accordion
            key={generation.name}
            type="single"
            collapsible
            defaultValue={hasVersionData[0].name}
          >
            <AccordionItem value={generation.name}>
              <AccordionTrigger className="hover:no-underline">
                {generation.name}
              </AccordionTrigger>
              <AccordionContent>
                {generation.versions.map((version) => {
                  return (
                    <div key={version.name} className="mb-2 flex w-full gap-2">
                      <div className="flex w-32 items-center">
                        <span className="min-w-16 rounded-full px-3 py-1 text-center text-xs text-gray-700">
                          {version.name}
                        </span>
                      </div>
                      <div className="w-[calc(100%-8rem)] grow wrap-break-word">
                        {version.text}
                      </div>
                    </div>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </>
  )
}
