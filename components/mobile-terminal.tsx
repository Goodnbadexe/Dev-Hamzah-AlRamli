'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryEntry {
  content: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  isError?: boolean;
}

export function MobileTerminal({ isOpen, onClose }: MobileTerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [currentDirectory, setCurrentDirectory] = useState('~')
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Simple command processor for mobile
  const processCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    
    switch (cmd) {
      case 'help':
        return "Available commands: help, clear, whoami, ls, pwd, about, contact, projects, skills\nTip: Use the desktop version for the full hacker terminal experience! 🚀"
      case 'clear':
        return 'CLEAR_TERMINAL'
      case 'whoami':
        return "goodnbad@exe - Hamzah Al-Ramli\nFresh Graduate & Lead Front-End Developer\nCybersecurity Enthusiast 🔐"
      case 'ls':
        return "projects/  skills/  experience/  contact/  certifications/  README.md"
      case 'pwd':
        return currentDirectory
      case 'about':
        return "👨‍💻 Hamzah Al-Ramli\n🎓 Fresh Graduate & Developer\n🚀 Passionate about problem-solving\n🔒 Cybersecurity & Web Development\n📍 Riyadh, Saudi Arabia"
      case 'contact':
        return "📧 alramli.hamzah@gmail.com\n📱 +966 50 850 1717\n💼 linkedin.com/in/hamzah-al-ramli-505\n🐙 github.com/goodnbadexe"
      case 'projects':
        return "🌐 Magic Browser - goodnbadexe.github.io/MagicB/\n🎮 Pixel Game X&O - v0-pixel-game-idea-two.vercel.app/\n🎯 Prompting Engineering - v0-prompting-is-all-you-need-ashy-delta.vercel.app/\n🎨 Raining Characters - v0-raining-characters-ten-livid.vercel.app/"
      case 'skills':
        return "💻 Full-Stack Development\n🔒 Cybersecurity & Risk Management\n📱 Mobile App Development (React Native, Swift, Java)\n🛠️ React, Next.js, Node.js, Python\n☁️ Cloud & DevOps Tools"
      default:
        if (cmd.includes('too many config') || cmd.includes('2 many config') || 
            cmd.includes('many configuration') || cmd.includes('configurations')) {
          return "🤖 Configuration overload detected! Even mobile terminals need a break from configs! 😄"
        }
        return `Command not found: ${command}\nType 'help' for available commands.`
    }
  }

  const handleCommand = (command: string) => {
    if (!command.trim()) {
      setHistory(prev => [
        ...prev,
        { type: 'input', content: `goodnbad@exe ${currentDirectory} $ ${command}` }
      ])
      setCurrentInput('')
      return
    }

    const result = processCommand(command)
    
    if (result === 'CLEAR_TERMINAL') {
      setHistory([
        { type: 'output', content: '✨ Look now it\'s clean! Have you found any keys or passwords? Something funny? 🔍' },
        { type: 'output', content: '' },
        { type: 'output', content: '📱 Mobile Terminal v1.0 - Lite Edition' },
        { type: 'output', content: 'Welcome! Type "help" for commands or switch to desktop for full experience.' },
        { type: 'output', content: '' }
      ])
    } else {
      setHistory(prev => [
        ...prev,
        { type: 'input', content: `goodnbad@exe ${currentDirectory} $ ${command}` },
        { type: 'output', content: result }
      ])
    }
    
    setCurrentInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput)
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Initialize terminal
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([
        { type: 'output', content: '📱 Mobile Terminal v1.0 - Lite Edition' },
        { type: 'output', content: 'Welcome! Type "help" for commands or switch to desktop for full experience.' },
        { type: 'output', content: '' }
      ])
    }
  }, [isOpen, history.length])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden">
      <div className="absolute inset-4 bg-zinc-900 rounded-lg border border-emerald-500/30 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm">Mobile Terminal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 text-emerald-400" />
          </Button>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-auto p-4 font-mono text-sm text-emerald-300 bg-black/50"
        >
          {history.map((entry, index) => (
            <div key={index} className="whitespace-pre-wrap mb-1">
              {entry.type === 'input' ? (
                <span className="text-emerald-500">{entry.content}</span>
              ) : (
                <span className={entry.isError ? 'text-red-400' : 'text-emerald-300'}>
                  {entry.content}
                </span>
              )}
            </div>
          ))}
          
          {/* Input Line */}
          <div className="flex items-center mt-2">
            <span className="text-emerald-500 mr-2">
              goodnbad@exe {currentDirectory} $
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-emerald-300 caret-emerald-300"
              placeholder="Type a command..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-emerald-500/30 text-center">
          <p className="text-xs text-zinc-400">
            💡 Switch to desktop for the full hacker terminal experience!
          </p>
        </div>
      </div>
    </div>
  )
}