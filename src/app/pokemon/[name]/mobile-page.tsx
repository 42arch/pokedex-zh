'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import useMediaQuery from '@/hooks/useMediaQuery'
import type { PokemonDetail as PokemonDetailType } from '@/types'
import TopBar from './top-bar'
import PokemonDetail from './pokemon-detail'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/back-button'

interface Props {
  data: PokemonDetailType
}

export default function MobilePage({ data }: Props) {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const router = useRouter()
  if (!isMobile) return null

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
    >
      <DialogContent className='h-full p-2'>
        <TopBar name={data.name} index={data.forms[0].index} />
        <PokemonDetail data={data} />
        <BackButton />
      </DialogContent>
    </Dialog>
  )
}
