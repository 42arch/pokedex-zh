'use client'

import * as React from 'react'
import { useDefaultLayout } from 'react-resizable-panels'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SidebarNav } from './sidebar-nav'

interface AppLayoutClientProps {
  children: React.ReactNode
  mobileHeader: React.ReactNode
}

function AppLayoutClientInner({ children, mobileHeader }: AppLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'pokedex-sidebar',
  })

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* On desktop, use ResizablePanelGroup */}
      <div className="hidden md:flex flex-1 h-full overflow-hidden">
        <ResizablePanelGroup
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChanged={onLayoutChanged}
        >
          <ResizablePanel
            defaultSize={defaultLayout ? undefined : 256}
            minSize={200}
            maxSize={320}
            collapsible={true}
            collapsedSize={70}
            onResize={(size) => {
              setIsCollapsed(size.inPixels <= 70)
            }}
          >
            <SidebarNav isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
              <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {children}
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* On mobile, standard layout */}
      <div className="md:hidden flex flex-col flex-1 min-h-0 overflow-hidden">
        {mobileHeader}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AppLayoutClient({ children, mobileHeader }: AppLayoutClientProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Avoid layout shift/SSR mismatch by rendering a static default structure
    return (
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        {/* Desktop Sidebar fallback */}
        <aside className="hidden md:flex flex-col w-64 h-full border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
          <SidebarNav isCollapsed={false} />
        </aside>

        {/* Main Area fallback */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {mobileHeader}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return <AppLayoutClientInner children={children} mobileHeader={mobileHeader} />
}
