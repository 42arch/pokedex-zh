'use client'

import { ArrowUDownLeft } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <ArrowUDownLeft size={20} />
      </Button>
    </div>
  )
}

export default BackButton
