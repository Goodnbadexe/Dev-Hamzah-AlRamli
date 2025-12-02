'use client'

import { useState, useEffect } from 'react'

export function InteractiveHackerElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showTracking, setShowTracking] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        setMousePosition({ x: touch.clientX, y: touch.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const handleMouseEnter = () => setShowTracking(true)
  const handleMouseLeave = () => setShowTracking(false)
  const handleTouchStart = () => setShowTracking(true)
  const handleTouchEnd = () => setShowTracking(false)

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Mouse tracking crosshair */}
      {showTracking && (
        <>
          <div 
            className="absolute w-px h-6 bg-emerald-400/50 transition-all duration-100"
            style={{ 
              left: mousePosition.x, 
              top: mousePosition.y - 12,
              transform: 'translateY(-50%)'
            }}
          />
          <div 
            className="absolute h-px w-6 bg-emerald-400/50 transition-all duration-100"
            style={{ 
              left: mousePosition.x - 12, 
              top: mousePosition.y,
              transform: 'translateX(-50%)'
            }}
          />
          <div 
            className="absolute w-2 h-2 bg-emerald-400 rounded-full transition-all duration-100"
            style={{ 
              left: mousePosition.x - 4, 
              top: mousePosition.y - 4
            }}
          />
        </>
      )}

      {/* Interactive corner elements */}
      <div 
        className="absolute top-16 left-2 md:top-4 md:left-4 text-emerald-400/30 hover:text-emerald-400 transition-colors duration-300 cursor-pointer pointer-events-auto z-30"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="font-mono text-xs">
          <div className="hidden sm:block">IP: 192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}</div>
          <div>STATUS: {showTracking ? 'TRACKING' : 'IDLE'}</div>
          <div className="hidden md:block">X: {mousePosition.x} Y: {mousePosition.y}</div>
        </div>
      </div>

      <div className="absolute top-16 right-2 md:top-4 md:right-4 text-emerald-400/30 hover:text-emerald-400 transition-colors duration-300 pointer-events-auto z-30">
        <div className="font-mono text-xs text-right">
          <div className="hidden sm:block">SYSTEM: ONLINE</div>
          <div>FIREWALL: ACTIVE</div>
          <div className="hidden lg:block">PACKETS: {Math.floor(Math.random() * 9999)}</div>
        </div>
      </div>

      <div className="absolute bottom-20 left-2 md:bottom-4 md:left-4 text-emerald-400/30 hover:text-emerald-400 transition-colors duration-300 pointer-events-auto z-30">
        <div className="font-mono text-xs">
          <div className="hidden sm:block">PORT: 8080</div>
          <div className="hidden md:block">PROTOCOL: HTTPS</div>
          <div className="hidden lg:block">ENCRYPTION: AES-256</div>
        </div>
      </div>

      {/* Animated status indicators */}
      <div className="absolute bottom-16 right-2 md:bottom-4 md:right-4 space-y-1 md:space-y-2 pointer-events-auto z-40">
        {['SCANNING', 'MONITORING', 'PROTECTING'].map((status, index) => (
          <div key={status} className="flex items-center gap-1 md:gap-2">
            <div 
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
            <span className="text-emerald-400/60 text-xs font-mono hidden sm:inline">{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FloatingBinaryBackground() {
  const [binaryChars, setBinaryChars] = useState<Array<{id: number, char: string, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    const chars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      char: Math.random() > 0.5 ? '1' : '0',
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }))
    setBinaryChars(chars)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {binaryChars.map((char) => (
        <div
          key={char.id}
          className="absolute text-emerald-400/10 font-mono text-sm animate-pulse"
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            animationDelay: `${char.delay}s`,
            animationDuration: '3s'
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  )
}