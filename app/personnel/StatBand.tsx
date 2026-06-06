"use client"

import { useEffect, useRef, useState } from "react"

export type Stat = {
  /** Final value the counter climbs to. */
  to: number
  /** Render a superscript "+" after the number (e.g. 20+). */
  plus?: boolean
  label: string
  /** Bar fill, 0–100. */
  fill: number
}

/**
 * StatBand — the dossier's animated metric strip.
 *
 * Client island (the rest of /personnel stays a server component so metadata
 * and SSR are preserved). Numbers render at their FINAL value on the server /
 * first paint — so no-JS visitors and crawlers see the real figures — then, as
 * a pure enhancement, count up from 0 and the bars sweep in on mount. Honors
 * prefers-reduced-motion by skipping the animation entirely.
 */
export function StatBand({ stats }: { stats: Stat[] }) {
  const [run, setRun] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduced.current) setRun(true)
  }, [])

  return (
    <div className="grid grid-cols-2 border-t border-zinc-800/70 sm:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={[
            "relative px-6 py-5",
            "border-zinc-800/70",
            i < stats.length - 1 ? "sm:border-r" : "",
            i % 2 === 0 ? "border-r" : "",
            i < 2 ? "border-b sm:border-b-0" : "",
          ].join(" ")}
        >
          <div className="font-mono text-[clamp(30px,4vw,42px)] font-semibold leading-none tabular-nums text-zinc-100">
            <Counter to={s.to} run={run} />
            {s.plus && <span className="align-super text-[0.6em] text-emerald-500">+</span>}
          </div>
          <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
            {s.label}
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-sm bg-zinc-800">
            <span
              className="block h-full rounded-sm bg-gradient-to-r from-emerald-900 to-emerald-500"
              style={{ width: run ? `${s.fill}%` : "0%", transition: "width 1100ms cubic-bezier(0.2,0.7,0.2,1)" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Counter({ to, run }: { to: number; run: boolean }) {
  // Initialise to the final value so server render + first paint show the real
  // number (SEO / no-JS safe); animate from 0 only once `run` flips on mount.
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (!run) return
    let cur = 0
    const step = Math.max(1, Math.ceil(to / 22))
    setValue(0)
    const id = setInterval(() => {
      cur += step
      if (cur >= to) {
        cur = to
        clearInterval(id)
      }
      setValue(cur)
    }, 45)
    return () => clearInterval(id)
  }, [to, run])

  return <>{value}</>
}
