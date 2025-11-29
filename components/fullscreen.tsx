'use client'

import { useState, useEffect, useCallback } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.warn('Fullscreen API not supported or failed:', error)
      // Fallback: simulate fullscreen by adding a class
      if (!isFullscreen) {
        document.documentElement.classList.add('simulated-fullscreen')
        setIsFullscreen(true)
      } else {
        document.documentElement.classList.remove('simulated-fullscreen')
        setIsFullscreen(false)
      }
    }
  }, [isFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.documentElement.classList.remove('simulated-fullscreen')
    }
  }, [])

  return { isFullscreen, toggleFullscreen }
}

export function FullscreenButton() {
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed bottom-6 right-6 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full p-3 hover:bg-zinc-700/80 transition-all duration-300 group z-50"
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? (
        <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </button>
  )
}