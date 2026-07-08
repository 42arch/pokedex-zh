'use client'

import * as React from 'react'
import { useDefaultLayout } from 'react-resizable-panels'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { cn } from '@/lib/utils'

interface ResizableLayoutProps {
  id: string
  defaultSize?: number | string
  minSize?: number | string
  maxSize?: number | string
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  isActiveDetail: boolean
  leftPanelClassName?: string
  rightPanelClassName?: string
}

export function ResizableLayout({
  id,
  defaultSize = '25%',
  minSize = '25%',
  maxSize = '35%',
  leftPanel,
  rightPanel,
  isActiveDetail,
  leftPanelClassName,
  rightPanelClassName,
}: ResizableLayoutProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id,
  })

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderFallback = () => (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)] md:h-screen">
      <div className={cn(
        'w-full md:w-1/4 shrink-0 h-full overflow-hidden flex flex-col',
        isActiveDetail && 'hidden md:block',
        leftPanelClassName,
      )}
      >
        {leftPanel}
      </div>
      <div className={cn(
        'flex-1 h-full overflow-y-auto',
        !isActiveDetail && 'hidden md:block',
        rightPanelClassName,
      )}
      >
        {rightPanel}
      </div>
    </div>
  )

  if (!isMounted) {
    return renderFallback()
  }

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)] md:h-screen">
      {/* On desktop, use ResizablePanelGroup */}
      <div className="hidden md:flex flex-1 h-full overflow-hidden">
        <ResizablePanelGroup
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChanged={onLayoutChanged}
        >
          <ResizablePanel
            defaultSize={defaultLayout ? undefined : defaultSize}
            minSize={minSize}
            maxSize={maxSize}
            collapsible={false}
          >
            <div className={cn('h-full overflow-hidden flex flex-col', leftPanelClassName)}>
              {leftPanel}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className={cn('h-full overflow-y-auto', rightPanelClassName)}>
              {rightPanel}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* On mobile, standard layout */}
      <div className={cn(
        'md:hidden flex flex-1 h-full overflow-hidden',
        isActiveDetail ? 'flex-col' : '',
      )}
      >
        <div className={cn(
          'w-full h-full overflow-hidden flex flex-col',
          isActiveDetail && 'hidden',
          leftPanelClassName,
        )}
        >
          {leftPanel}
        </div>
        <div className={cn(
          'flex-1 h-full overflow-y-auto',
          !isActiveDetail && 'hidden',
          rightPanelClassName,
        )}
        >
          {rightPanel}
        </div>
      </div>
    </div>
  )
}
