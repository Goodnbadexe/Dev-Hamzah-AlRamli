'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MatrixBackground } from '@/components/matrix-background'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  const [glitchText, setGlitchText] = useState('ERROR')
  const [showDetails, setShowDetails] = useState(false)

  const errorTypes = {
    '500': { 
      title: 'INTERNAL_SERVER_ERROR', 
      message: 'The server encountered an unexpected condition',
      color: 'text-red-400',
      icon: '🔥'
    },
    '404': { 
      title: 'PAGE_NOT_FOUND', 
      message: 'The requested resource could not be located',
      color: 'text-yellow-400',
      icon: '🕳️'
    },
    '403': { 
      title: 'FORBIDDEN', 
      message: 'You don\'t have permission to access this resource',
      color: 'text-orange-400',
      icon: '🔒'
    },
    '401': { 
      title: 'UNAUTHORIZED', 
      message: 'Authentication is required to access this resource',
      color: 'text-blue-400',
      icon: '🔑'
    },
    'default': { 
      title: 'SYSTEM_ERROR', 
      message: 'An unexpected error has occurred',
      color: 'text-purple-400',
      icon: '💥'
    }
  }

  const getErrorType = () => {
    const errorMessage = error.message || ''
    if (errorMessage.includes('404')) return errorTypes['404']
    if (errorMessage.includes('403')) return errorTypes['403']
    if (errorMessage.includes('401')) return errorTypes['401']
    if (errorMessage.includes('500')) return errorTypes['500']
    return errorTypes['default']
  }

  const errorType = getErrorType()

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = '░▒▓█▀▄▌▐■□▪▫▬▭▮▯▰▱▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◉◊○◌◍◎●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯'
      const randomGlitch = Array.from({ length: 5 }, () => 
        Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : 'ERROR'
      ).join('')
      setGlitchText(randomGlitch)
      
      setTimeout(() => setGlitchText('ERROR'), 100)
    }, 4000)

    const detailsTimer = setTimeout(() => setShowDetails(true), 2000)

    return () => {
      clearInterval(glitchInterval)
      clearTimeout(detailsTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixBackground />
      
      {/* Animated matrix characters */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl">
          {/* Error Header with Glitch */}
          <div className="mb-8">
            <div className="text-6xl mb-4">{errorType.icon}</div>
            <h1 className="text-7xl font-bold mb-4 glitch-stack" data-text={glitchText}>
              {glitchText}
            </h1>
            <div className={`text-2xl mb-2 font-mono ${errorType.color}`}>
              {errorType.title}
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <p className="text-zinc-300 text-lg mb-4">
              {errorType.message}
            </p>
            
            {showDetails && (
              <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 mb-6 animate-slide-in-up">
                <div className="text-emerald-400 font-mono text-sm mb-2">
                  Error Details:
                </div>
                <div className="text-zinc-400 font-mono text-xs">
                  {error.message || 'Unknown error occurred'}
                </div>
                {error.digest && (
                  <div className="text-zinc-500 font-mono text-xs mt-2">
                    Error ID: {error.digest}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={reset}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 hover:bg-emerald-500/20 transition-all group"
            >
              <div className="text-emerald-400 font-semibold group-hover:text-emerald-300">
                RETRY_OPERATION
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Try the action again
              </div>
            </button>
            
            <Link 
              href="/"
              className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 hover:bg-blue-500/20 transition-all group"
            >
              <div className="text-blue-400 font-semibold group-hover:text-blue-300">
                RETURN_HOME
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Go to main page
              </div>
            </Link>
            
            <Link 
              href="/debug/status"
              className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 hover:bg-purple-500/20 transition-all group"
            >
              <div className="text-purple-400 font-semibold group-hover:text-purple-300">
                DEBUG_INFO
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                System status
              </div>
            </Link>
          </div>

          {/* Hacker Tips */}
          <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-900/30">
            <div className="text-yellow-400 font-mono text-sm mb-2">
              [SYSTEM_ANALYSIS] Troubleshooting tips:
            </div>
            <div className="text-zinc-400 font-mono text-xs space-y-1 text-left">
              <div>• Check your network connection</div>
              <div>• Verify the URL is correct</div>
              <div>• Clear your browser cache</div>
              <div>• Try accessing from a different device</div>
              <div>• Contact support if the issue persists</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}