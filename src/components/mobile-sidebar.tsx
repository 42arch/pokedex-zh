import type { PropsWithChildren } from 'react'
import { Sidebar } from './sidebar'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

function MobileSidebar({ children }: PropsWithChildren) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
