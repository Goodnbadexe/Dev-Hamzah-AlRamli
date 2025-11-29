'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MatrixBackground } from '@/components/matrix-background'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalText, setTerminalText] = useState('')
  const [currentCommand, setCurrentCommand] = useState(0)

  const commands = [
    'ping goodnbad.info',
    'traceroute 404.page',
    'nmap -sV hidden.paths',
    'sqlmap -u "http://goodnbad.info/*"',
    'hydra -l admin -P wordlist.txt goodnbad.info'
  ]

  const errorCodes = [
    { code: '404', message: 'PAGE_NOT_FOUND', description: 'The requested resource could not be located' },
    { code: '403', message: 'ACCESS_DENIED', description: 'You don\'t have permission to access this' },
    { code: '500', message: 'INTERNAL_ERROR', description: 'Something went wrong on our end' },
    { code: '418', message: 'I_AM_A_TEAPOT', description: 'The server refuses to brew coffee because it is a teapot' },
    { code: '1337', message: 'HACKER_DETECTED', description: 'Elite status achieved' },
    { code: '9001', message: 'POWER_LEVEL_OVER', description: 'It\'s over 9000!' }
  ]

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = '░▒▓█▀▄▌▐■□▪▫▬▭▮▯▰▱▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◉◊○◌◍◎●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯'
      const randomGlitch = Array.from({ length: 3 }, () => 
        Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : '404'
      ).join('')
      setGlitchText(randomGlitch)
      
      setTimeout(() => setGlitchText('404'), 100)
    }, 3000)

    const terminalInterval = setInterval(() => {
      setShowTerminal(true)
      const command = commands[currentCommand]
      setTerminalText(`$ ${command}`)
      
      setTimeout(() => {
        setTerminalText(`$ ${command}\n> Command failed: Page not found`)
      }, 1500)
      
      setCurrentCommand((prev) => (prev + 1) % commands.length)
    }, 5000)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(terminalInterval)
    }
  }, [currentCommand])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixBackground />
      
      {/* Matrix rain overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl px-6">
          {/* Glitch Effect Title */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold mb-4 glitch-stack" data-text={glitchText}>
              {glitchText}
            </h1>
            <div className="text-emerald-400 text-xl mb-2 font-mono typewriter-effect">
              SYSTEM_BREACH_DETECTED
            </div>
          </div>

          {/* Error Code Carousel */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {errorCodes.map((error, index) => (
              <div 
                key={error.code}
                className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-emerald-400 font-mono text-sm group-hover:text-emerald-300">
                  {error.code}
                </div>
                <div className="text-zinc-300 text-xs mt-1">
                  {error.message}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Simulation */}
          {showTerminal && (
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-lg p-4 mb-8 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-zinc-400 text-sm ml-2">terminal@goodnbad:~</span>
              </div>
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-line terminal-cursor">
                {terminalText}
              </pre>
            </div>
          )}

          {/* Hacker Messages */}
          <div className="space-y-4 mb-8">
            <p className="text-zinc-300 text-lg">
              "Not all paths are obvious. Some pages hide in plain sight."
            </p>
            <p className="text-emerald-400 font-mono">
              // Try exploring unusual routes, headers, or patterns
            </p>
            <p className="text-purple-400 font-mono text-sm">
              /* There might be a flag nearby... */
            </p>
          </div>

          {/* Navigation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link 
              href="/"
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 hover:bg-emerald-500/20 transition-all group"
            >
              <div className="text-emerald-400 font-semibold group-hover:text-emerald-300">
                RETURN_TO_HOME
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Navigate back to safety
              </div>
            </Link>
            
            <Link 
              href="/security"
              className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 hover:bg-purple-500/20 transition-all group"
            >
              <div className="text-purple-400 font-semibold group-hover:text-purple-300">
                SECURITY_ATLAS
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Learn about cyber threats
              </div>
            </Link>
          </div>

          {/* Hidden CTF Hint */}
          <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-900/30">
            <div className="text-yellow-400 font-mono text-sm mb-2">
              [HINT] Look for hidden directories:
            </div>
            <div className="text-zinc-400 font-mono text-xs space-y-1">
              <div>• /flag.txt</div>
              <div>• /.git/HEAD</div>
              <div>• /robots.txt</div>
              <div>• /sitemap.xml</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}