'use client'

import React, { useEffect, useState } from 'react'
import { GameStateManager } from './terminal/game/GameStateManager'

export default function CluesDock() {
  const [mgr, setMgr] = useState<GameStateManager | null>(null)
  const [hintMsg, setHintMsg] = useState('')
  const [progress, setProgress] = useState('')
  const [nextTitle, setNextTitle] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState<{x: number, y: number} | null>(null)

  useEffect(() => {
    const m = new GameStateManager()
    setMgr(m)
    setProgress(m.getProgress())
    try {
      const solved = m.getGameState().solvedChallenges || []
      const { getNextChallenge } = require('./terminal/config/ctf-challenges')
      const next = getNextChallenge(solved)
      setNextTitle(next ? next.title : null)
    } catch {}

    try {
      const stored = localStorage.getItem('clues_dock_pos')
      if (stored) {
        const p = JSON.parse(stored)
        setPos(p)
      } else {
        setPos({ x: window.innerWidth - 220, y: 100 })
      }
    } catch {}

    const onModeChange = (e: any) => setVisible(!!(e?.detail))
    window.addEventListener('ctf-mode-change', onModeChange as EventListener)
    return () => window.removeEventListener('ctf-mode-change', onModeChange as EventListener)
  }, [])

  return (
    <div
      className={`fixed z-30 ${visible ? '' : 'hidden'}`}
      style={{ top: pos ? `${pos.y}px` : '100px', left: pos ? `${pos.x}px` : 'calc(100% - 220px)' }}
    >
      <div
        className="bg-zinc-900/90 border border-emerald-500/40 rounded-xl px-4 pt-5 pb-3 shadow-lg text-sm text-emerald-300 flex items-center gap-3 cursor-move relative"
        onMouseDown={(e) => {
          const start = { mx: e.clientX, my: e.clientY, x: pos?.x || (window.innerWidth - 220), y: pos?.y || 100 }
          const onMove = (ev: MouseEvent) => {
            const newPos = { x: start.x + (ev.clientX - start.mx), y: start.y + (ev.clientY - start.my) }
            setPos(newPos)
            try { localStorage.setItem('clues_dock_pos', JSON.stringify(newPos)) } catch {}
          }
          const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
          }
          window.addEventListener('mousemove', onMove)
          window.addEventListener('mouseup', onUp)
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0]
          const start = { mx: touch.clientX, my: touch.clientY, x: pos?.x || (window.innerWidth - 220), y: pos?.y || 100 }
          const onMove = (ev: TouchEvent) => {
            const t = ev.touches[0]
            const newPos = { x: start.x + (t.clientX - start.mx), y: start.y + (t.clientY - start.my) }
            setPos(newPos)
            try { localStorage.setItem('clues_dock_pos', JSON.stringify(newPos)) } catch {}
          }
          const onUp = () => {
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('touchend', onUp)
          }
          window.addEventListener('touchmove', onMove, { passive: false })
          window.addEventListener('touchend', onUp)
        }}
      >
        <div className="absolute left-3 top-2 flex items-center gap-2">
          <button aria-label="Close" className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" onClick={() => setVisible(false)} />
          <button aria-label="Minimize" className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500" onClick={() => setVisible(false)} />
          <button aria-label="Maximize" className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" onClick={() => setVisible(true)} />
        </div>
        <span className="font-mono">{progress}</span>
        {nextTitle && <span className="font-mono">• Next: {nextTitle}</span>}
        <button
          className="ml-2 px-2 py-1 border border-emerald-500 rounded hover:bg-emerald-500/10"
          onClick={() => {
            if (!mgr) return
            const res = mgr.useHint()
            setHintMsg(res.message)
            setTimeout(() => setHintMsg(''), 8000)
          }}
        >
          Get Hint
        </button>
        <button
          className="px-2 py-1 border border-zinc-600 rounded hover:bg-zinc-700/50 text-zinc-300"
          onClick={() => setVisible(false)}
        >
          Hide
        </button>
      </div>
      {hintMsg && (
        <div className="mt-2 bg-zinc-900/90 border border-emerald-500/40 rounded-xl px-4 py-2 text-emerald-300 text-xs font-mono text-center">
          {hintMsg}
        </div>
      )}
    </div>
  )
}
