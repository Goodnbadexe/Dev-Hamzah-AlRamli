'use client'

import { useState, useEffect } from 'react'

export function InteractiveHackerElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showTracking, setShowTracking] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleMouseEnter = () => setShowTracking(true)
  const handleMouseLeave = () => setShowTracking(false)

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
        className="absolute top-4 left-4 text-emerald-400/30 hover:text-emerald-400 transition-colors duration-300 cursor-pointer pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="font-mono text-xs">
          <div>IP: 192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}</div>
          <div>STATUS: {showTracking ? 'TRACKING' : 'IDLE'}</div>
          <div>X: {mousePosition.x} Y: {mousePosition.y}</div>
        </div>
      </div>

      <div className="absolute top-4 right-4 text-emerald-400/30 hover:text-emerald-400 transition-colors duration-300 pointer-events-auto">
        <div className="font-mono text-xs text-right">
          <div>SYSTEM: ONLINE</div>
          <div>FIREWALL: ACTIVE</div>
          <div>PACKETS: {Math.floor(Math.random() * 9999)}</div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-emerald-400/30 hover:text-emerald-400 transition-colors duration-300 pointer-events-auto">
        <div className="font-mono text-xs">
          <div>PORT: 8080</div>
          <div>PROTOCOL: HTTPS</div>
          <div>ENCRYPTION: AES-256</div>
        </div>
      </div>

      {/* Animated status indicators */}
      <div className="absolute bottom-4 right-4 space-y-2 pointer-events-auto">
        {['SCANNING', 'MONITORING', 'PROTECTING'].map((status, index) => (
          <div key={status} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
            <span className="text-emerald-400/60 text-xs font-mono">{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FloatingBinaryBackground() {
  const [binaryChars, setBinaryChars] = useState<Array<{id: number, char: string, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    const chars = Array.from({ length: 50 }, (_, i) => ({
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