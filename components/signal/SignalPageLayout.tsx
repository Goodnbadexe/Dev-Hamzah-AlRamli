"use client"

/**
 * SignalPageLayout — client wrapper that splits the signal surface 50/50.
 *
 * Left column:  the live signal feed (server-provided items, refreshable).
 * Right column: the live IOC inspector surface (placement="inline").
 *
 * The page itself stays a server component (it does the data fetch); this
 * wrapper exists only because IocInspector + SignalFeedSection are client
 * components and the IOC inspector needs local state for hover/recent.
 *
 * Below the `lg` breakpoint the two columns stack: feed on top, IOC below.
 */

import { useState } from "react"
import { OSWindow } from "@/components/os"
import { IocInspector } from "@/components/signal/IocInspector"
import { SignalFeedSection } from "@/components/signal/SignalFeedSection"
import type { ThreatIoc } from "@/app/api/threats/route"
import type { SignalFeedItem } from "@/lib/signal-feed/types"

interface SignalPageLayoutProps {
  initialItems: SignalFeedItem[]
  fetchedAt: string
  sourceErrors: string[]
}

export function SignalPageLayout({ initialItems, fetchedAt, sourceErrors }: SignalPageLayoutProps) {
  // Live IOC stream + hover state. The inspector manages its own pinned card
  // internally; we only own `recent` and `hovered` here.
  const [recentIocs] = useState<ThreatIoc[]>([])
  const [hoveredIoc] = useState<ThreatIoc | null>(null)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* LEFT — signal feed */}
      <div className="min-w-0">
        <OSWindow
          label="threat.signals"
          title={`${initialItems.length} signals active`}
          status={initialItems.length > 0 ? "active" : "idle"}
          className="os-panel-in"
        >
          <SignalFeedSection
            initialItems={initialItems}
            fetchedAt={fetchedAt}
            sourceErrors={sourceErrors}
          />
        </OSWindow>
      </div>

      {/* RIGHT — live IOC surface */}
      <div className="min-w-0">
        <OSWindow label="ioc.surface" title="live · indicators" status="active" className="os-panel-in">
          <IocInspector recent={recentIocs} hovered={hoveredIoc} placement="inline" />
        </OSWindow>
      </div>
    </div>
  )
}
