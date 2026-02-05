'use client'

import type { PokemonDetail as PokemonDetailType } from '@/types'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/back-button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import useMediaQuery from '@/hooks/useMediaQuery'
import PokemonDetail from './pokemon-detail'
import TopBar from './top-bar'

interface Props {
  data: PokemonDetailType
}

export default function MobilePage({ data }: Props) {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const router = useRouter()
  if (!isMobile)
    return null

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
    >
      <DialogContent className="h-full p-2">
        <DialogTitle className="sr-only">{data.name_zh}</DialogTitle>
        <TopBar name={data.name_zh} index={data.pokedex_id} />
        <PokemonDetail data={data} />
        <BackButton />
      </DialogContent>
    </Dialog>
  )
}
