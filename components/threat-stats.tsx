'use client'

import { useEffect, useRef, useState } from 'react'

interface StatItem {
  label: string
  target: number
  suffix?: string
}

const STATS: StatItem[] = [
  { label: 'Total Threats Today', target: 47293 },
  { label: 'Active APT Groups', target: 183 },
  { label: 'CVEs Disclosed', target: 2847 },
  { label: 'Incidents Mitigated', target: 1204 },
]

function useCountUp(target: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!started) return

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      startTimeRef.current = null
    }
  }, [target, duration, started])

  return count
}

function StatCard({ label, target, index }: StatItem & { index: number }) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const count = useCountUp(target, 2000, started)

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg gap-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <span className="font-mono text-2xl md:text-3xl font-bold text-emerald-400 tabular-nums">
        {count.toLocaleString()}
      </span>
      <span className="text-zinc-400 text-xs text-center leading-tight">{label}</span>
    </div>
  )
}

export function ThreatStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}
