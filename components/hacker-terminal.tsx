'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommandProcessor } from './terminal/CommandProcessor';
import { AuthManager } from './terminal/auth/AuthManager';
import { GameStateManager } from './terminal/game/GameStateManager';
import { TerminalContext, CommandResult } from './terminal/types';
import { asciiArt } from './terminal/utils/ascii-art';
import { cn } from "@/lib/utils"

interface HistoryEntry {
  command: string;
  output: string;
  timestamp: string;
  type?: 'command' | 'system' | 'error' | 'success';
}

export function HackerTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const [currentDirectory, setCurrentDirectory] = useState('~')
  const [isInitialized, setIsInitialized] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Core system managers - initialize only on client side
  const [commandProcessor, setCommandProcessor] = useState<CommandProcessor | null>(null)
  const [authManager, setAuthManager] = useState<AuthManager | null>(null)
  const [gameManager, setGameManager] = useState<GameStateManager | null>(null)
  const [floatingXP, setFloatingXP] = useState<{id: number, amount: number, timestamp: number}[]>([])

  // Initialize managers on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCommandProcessor(new CommandProcessor());
      setAuthManager(new AuthManager());
      setGameManager(new GameStateManager());
    }
  }, []);

  // Mock file system
  const fileSystem = {
    "~": ["projects", "skills", "experience", "contact", "certifications", "README.md"],
    "~/projects": [
      "magic-browser.js",
      "raining-characters.js",
      "prompting-engineering.js",
      "pixel-game.js",
      "masarat-events.js",
      "first-website.html",
    ],
    "~/skills": ["security.txt", "development.txt", "leadership.txt", "tools.txt"],
    "~/experience": ["masarat-events.md", "masarat-decor.md", "thunderquote.md", "kabel.md"],
    "~/contact": ["email.txt", "phone.txt", "social.json"],
    "~/certifications": [
      "google-cybersecurity.cert",
      "ibm-cybersecurity.cert",
      "google-analytics.cert",
      "taylors-award.cert",
    ],
  }

  // File contents
  const fileContents = {
    "~/README.md":
      "# Hamzah Al-Ramli\nFresh Graduate & Developer\nStay curious. Break limits. Build meaning.\n\nExplore my terminal to learn more about me!",
    "~/projects/magic-browser.js":
      "/**\n * Magic Browser\n * A project revolutionizing internet browsing\n * URL: https://goodnbadexe.github.io/MagicB/\n */",
    "~/projects/raining-characters.js":
      "/**\n * Raining Characters\n * Simple interface with animated character rain effect\n * URL: https://v0-raining-characters-ten-livid.vercel.app/\n */",
    "~/projects/prompting-engineering.js":
      "/**\n * Prompting Is All You Need\n * Demonstration of prompt engineering techniques\n * URL: https://v0-prompting-is-all-you-need-ashy-delta.vercel.app/\n */",
    "~/projects/pixel-game.js":
      "/**\n * Pixel Game X and O\n * Classic Tic-Tac-Toe with pixel art styling\n * URL: https://v0-pixel-game-idea-two.vercel.app/\n */",
    "~/projects/masarat-events.js":
      "/**\n * Masarat Events Website\n * Corporate website with modern design\n * URL: https://www.masaratevents.com\n */",
    "~/projects/first-website.html":
      "<!--\n  My First Website - HOS\n  A milestone in my web development journey\n  URL: https://goodnbadexe.github.io/HOS/\n-->",
    "~/skills/security.txt":
      "Security Risk Management\nNetwork Security\nVulnerability Management\nMDR (Managed Detection and Response)\nCybersecurity Foundations",
    "~/skills/development.txt":
      "Full-Stack Development\nMobile App Development\nReact, React Native\nNext.js, Node.js\nSwift, Java\nHTML, CSS, JavaScript\nPHP, MySQL",
    "~/skills/leadership.txt": "Leadership\nCollaboration\nProject Management\nTeam Coordination\nCommunication",
    "~/skills/tools.txt":
      "React, Next.js, Node.js\nSwift, Java, Python\nMySQL, MongoDB\nGit, Docker\nLinux, SQL\nCybersecurity Tools",
    "~/contact/email.txt": "alramli.hamzah@gmail.com",
    "~/contact/phone.txt": "+966 50 850 1717",
    "~/contact/social.json":
      '{\n  "linkedin": "linkedin.com/in/hamzah-al-ramli-505",\n  "github": "github.com/goodnbadexe",\n  "location": "Riyadh, Saudi Arabia"\n}',
    "~/certifications/google-cybersecurity.cert":
      "Google Cybersecurity Professional Certificate\nIssuer: Google\nDate: March 2025\nCredential ID: YBHSSJ3B13V8\nURL: https://www.coursera.org/account/accomplishments/professional-cert/YBHSSJ3B13V8",
    "~/certifications/ibm-cybersecurity.cert":
      "Cybersecurity Assessment: CompTIA Security+ & CYSA+\nIssuer: IBM\nDate: May 2025\nCredential ID: OHC26D9YE3RX\nURL: https://coursera.org/verify/OHC26D9YE3RX",
    "~/certifications/google-analytics.cert":
      "Google Analytics Certification\nIssuer: Google Digital Academy\nDate: May 2025\nCredential ID: 143306854\nURL: https://skillshop.credential.net/f6dd7dc8-877d-434b-b6e0-618f9ff96b5a",
    "~/certifications/taylors-award.cert":
      "Taylor's University Award 2024\nIssuer: Taylor's University\nDate: December 2024\nCredential ID: 126164641\nURL: https://credentials.taylors.edu.my/a320a345-9d00-4aa3-b15e-25ae46231588",
  }

  const getPrompt = () => {
    return `goodnbad@exe ${currentDirectory} $ `
  }

  const handleCommand = async (command: string) => {
    if (!command.trim()) {
      setHistory((prev) => [
        ...prev,
        { type: "input", content: getPrompt() + command },
      ])
      setCurrentInput("")
      return
    }

    // Track interactions and enable expansion after 2+ interactions
    setInteractionCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 2 && !isExpanded) {
        setIsExpanded(true);
      }
      return newCount;
    });

    // Check if managers are initialized
    if (!commandProcessor || !authManager || !gameManager) {
      setHistory((prev) => [
        ...prev,
        { type: "input", content: getPrompt() + command },
        { type: "output", content: "Terminal is still initializing. Please wait..." }
      ])
      setCurrentInput("")
      return
    }

    // Create terminal context
    const context: TerminalContext = {
      currentDirectory,
      fileSystem,
      user: authManager.getCurrentUser(),
      session: authManager.getCurrentSession(),
      behaviorTracker: {
        commandCounts: new Map<string, number>(),
        patterns: [],
        lastCommandTime: new Date(),
        consecutiveHelps: 0,
        discoveredSecrets: []
      },
      gameState: gameManager.getGameState()
    }

    try {
      // Process command through the advanced system
      const result = await commandProcessor.executeCommand(command, context)
      
      // Handle special commands
      if (result.command === 'clear') {
        // Complete terminal reset - back to initial state
        const welcomeMessage = [
          asciiArt.banner,
          "",
          "🚀 Welcome to Goodnbad.exe Terminal v2.0.0 - Advanced Hacker Edition",
          "Last login: " + new Date().toLocaleString() + " on ttys001",
          "",
          "💡 Type 'help' to see available commands",
          "🎯 Try 'hack', 'matrix', or 'whoami' to get started",
          "🏆 Complete challenges to unlock achievements and gain XP!",
          ""
        ]
        
        setHistory(welcomeMessage.map(line => ({ type: "output", content: line })))
        setCurrentInput("")
        setInteractionCount(0)
        setIsExpanded(false)
        setFloatingXP([])
        return
      }

      // Handle expansion trigger effect
      if (result.triggerEffect === 'fullscreen') {
        setIsExpanded(true)
      }

      // Add command and result to history
      setHistory((prev) => [
        ...prev,
        { type: "input", content: getPrompt() + command },
        ...(result.output ? [{ type: "output", content: result.output }] : []),
      ])

      // Handle achievements
      if (result.achievements && result.achievements.length > 0) {
        result.achievements.forEach(achievement => {
          setHistory((prev) => [
            ...prev,
            { type: "output", content: `🏆 Achievement Unlocked: ${achievement.name} - ${achievement.description}` }
          ])
        })
      }

      // Handle experience gain
      if (result.experienceGained && result.experienceGained > 0) {
        // Add to history
        setHistory((prev) => [
          ...prev,
          { type: "output", content: `+${result.experienceGained} XP` }
        ])
        
        // Create floating XP notification
        const newXP = {
          id: Date.now() + Math.random(),
          amount: result.experienceGained,
          timestamp: Date.now()
        };
        setFloatingXP(prev => [...prev, newXP]);
        
        // Remove floating XP after 5 seconds
        setTimeout(() => {
          setFloatingXP(prev => prev.filter(xp => xp.id !== newXP.id));
        }, 5000);
      }

    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { type: "input", content: getPrompt() + command },
        { type: "output", content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
      ])
    }

    setCurrentInput("")
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleCommand(currentInput)
    } else if (e.key === "Escape" && isExpanded) {
      setIsExpanded(false)
    }
  }

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal is focused
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Initialize terminal systems and show welcome message
  useEffect(() => {
    if (!isInitialized && commandProcessor && authManager && gameManager) {
      // Show enhanced welcome message with ASCII art
      const welcomeMessage = [
        asciiArt.banner,
        "",
        "🚀 Welcome to Goodnbad.exe Terminal v2.0.0 - Advanced Hacker Edition",
        "Last login: " + new Date().toLocaleString() + " on ttys001",
        "",
        "💡 Type 'help' to see available commands",
        "🎯 Try 'hack', 'matrix', or 'whoami' to get started",
        "🏆 Complete challenges to unlock achievements and gain XP!",
        ""
      ]

      setHistory(welcomeMessage.map(line => ({ type: "output", content: line })))
      setIsInitialized(true)
    }
  }, [isInitialized, commandProcessor, authManager, gameManager])

  return (
    <div className={cn(
      "grid transition-all duration-700 ease-in-out gap-12 items-center",
      isExpanded 
        ? "grid-cols-1 md:grid-cols-[300px_1fr]" 
        : "grid-cols-1 md:grid-cols-2"
    )}>
      {/* Hero Content */}
      <div className={cn(
        "transition-all duration-700 ease-in-out",
        isExpanded ? "md:transform md:-translate-x-4 opacity-90" : ""
      )}>
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" x2="20" y1="19" y2="19"></line>
          </svg>
          DEV
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 glitch-stack">
          <span className="relative inline-block text-white">
            <span className="relative z-10">Hamzah</span>
          </span>
          <span className="relative inline-block text-emerald-500">
            <span className="relative z-10">Al-Ramli</span>
          </span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8 border-l-2 border-emerald-500 pl-4">
          A fresh graduate and lead front-end developer with hands-on experience in web services, passionate about
          machine problem-solving, and continuously learns through mentorship, certifications, and practical
          experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black group relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              View Projects
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
            <span className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
          </button>
          <a target="_blank" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent h-10 px-4 py-2 border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 group" href="/files/hamzah-al-ramli-resume.pdf">
            <span className="flex items-center">
              Download Resume
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" x2="12" y1="15" y2="3"></line>
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Terminal Section */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-3xl"></div>
        <div className="relative bg-zinc-800/80 p-4 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
          <div
            className={cn(
              "flex flex-col bg-black/80 text-emerald-400 font-mono text-sm overflow-hidden border border-emerald-500/30 transition-all duration-700 ease-in-out rounded-md",
              isExpanded ? "h-[600px]" : "h-full"
            )}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-3 border-b border-emerald-500/50 shadow-lg">
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(false)
                  }}
                  className="w-3 h-3 rounded-full bg-red-500 animate-pulse hover:bg-red-400 transition-colors cursor-pointer"
                  title="Close"
                ></button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(false)
                  }}
                  className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse hover:bg-yellow-400 transition-colors cursor-pointer" 
                  style={{animationDelay: '0.2s'}}
                  title="Minimize"
                ></button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                  className="w-3 h-3 rounded-full bg-green-500 animate-pulse hover:bg-green-400 transition-colors cursor-pointer" 
                  style={{animationDelay: '0.4s'}}
                  title="Maximize"
                ></button>
              </div>
              <div className="flex-1 text-center">
                 <div className="text-sm font-bold text-emerald-400 tracking-wider">
                   🚀 GOODNBAD.EXE - HACKER TERMINAL
                 </div>
                 <div className="text-xs text-emerald-300/70 mt-1">
                   {isExpanded ? '[EXPANDED CTF MODE] - Ready for Challenges' : '[NORMAL MODE] - Ready for Commands'}
                 </div>
               </div>
            </div>

            {/* Terminal Content */}
            <div ref={terminalRef} className="flex-1 overflow-auto p-8 custom-scrollbar max-w-5xl mx-auto w-full">
               {history.map((entry, index) => (
                 <div key={index} className="whitespace-pre-wrap mb-1">
                   {entry.type === 'input' ? (
                     <span className="text-emerald-500">
                       {currentDirectory === '~' ? 'goodnbad@exe ~ $ ' : `goodnbad@exe ${currentDirectory} $ `}{entry.content}
                     </span>
                   ) : (
                     <span className={entry.isError ? 'text-red-400' : 'text-emerald-300'}>
                       {entry.content}
                     </span>
                   )}
                 </div>
               ))}
               
               {/* Current Input Line */}
               <div className="flex items-center">
                 <span className="text-emerald-500">
                   {currentDirectory === '~' ? 'goodnbad@exe ~ $ ' : `goodnbad@exe ${currentDirectory} $ `}
                 </span>
                 <input
                   ref={inputRef}
                   type="text"
                   value={currentInput}
                   onChange={(e) => setCurrentInput(e.target.value)}
                   onKeyDown={handleKeyDown}
                   className="flex-1 bg-transparent border-none outline-none text-emerald-300 caret-emerald-300 ml-1"
                   autoFocus
                 />
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Floating XP Notifications */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        {floatingXP.map((xp, index) => (
          <div
            key={xp.id}
            className="mb-2 animate-bounce"
            style={{
              animation: `floatUp 5s ease-out forwards`,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg border border-green-400 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="font-bold text-lg">+{xp.amount} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
