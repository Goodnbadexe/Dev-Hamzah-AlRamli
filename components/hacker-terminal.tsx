'use client';

// === METADATA ===
// Purpose: Interactive terminal UI with commands, auth, game stats, and effects.
// Author: @Goodnbad.exe
// Inputs: User keyboard input, internal state from managers
// Outputs: Terminal-like UI interactions, history, and animations
// Assumptions: Client-side rendering; relies on managers initialized in browser
// Tests: `npm run test` (includes GameStateManager tests) ; manual UI via dev server
// Security: No secrets; sanitizes command input; local-only state
// Complexity: Event-driven; per interaction O(k) based on history entries
// === END METADATA ===

import React, { useState, useEffect, useRef } from 'react';
import { CommandProcessor } from './terminal/CommandProcessor';
import { AuthManager } from './terminal/auth/AuthManager';
import { GameStateManager } from './terminal/game/GameStateManager';
import { TerminalContext, CommandResult } from './terminal/types';
import { asciiArt, startURLAnimation, createMultiEmojiAnimation, createWaveAnimation, createLoadingAnimation } from './terminal/utils/ascii-art';
import { getNextChallenge } from './terminal/config/ctf-challenges';

const userSkull = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠟⠃⠀⠀⠙⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠋⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠾⢛⠒⠀⠀⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣶⣄⡈⠓⢄⠠⡀⠀⠀⠀⣄⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣷⠀⠈⠱⡄⠑⣌⠆⠀⠀⡜⢻⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡿⠳⡆⠐⢿⣆⠈⢿⠀⠀⡇⠘⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣷⡇⠀⠀⠈⢆⠈⠆⢸⠀⠀⢣⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣧⠀⠀⠈⢂⠀⡇⠀⠀⢨⠓⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣦⣤⠖⡏⡸⠀⣀⡴⠋⠀⠈⠢⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠁⣹⣿⣿⣿⣷⣾⠽⠖⠊⢹⣀⠄⠀⠀⠀⠈⢣⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⣇⣰⢫⢻⢉⠉⠀⣿⡆⠀⠀⡸⡏⠀⠀⠀⠀⠀⠀⢇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢨⡇⡇⠈⢸⢸⢸⠀⠀⡇⡇⠀⠀⠁⠻⡄⡠⠂⠀⠀⠀⠘
⢤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠛⠓⡇⠀⠸⡆⢸⠀⢠⣿⠀⠀⠀⠀⣰⣿⣵⡆⠀⠀⠀⠀
⠈⢻⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⣦⣀⡇⠀⢧⡇⠀⠀⢺⡟⠀⠀⠀⢰⠉⣰⠟⠊⣠⠂⠀⡸
⠀⠀⢻⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢧⡙⠺⠿⡇⠀⠘⠇⠀⠀⢸⣧⠀⠀⢠⠃⣾⣌⠉⠩⠭⠍⣉⡇
⠀⠀⠀⠻⣿⣿⣿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣞⣋⠀⠈⠀⡳⣧⠀⠀⠀⠀⠀⢸⡏⠀⠀⡞⢰⠉⠉⠉⠉⠉⠓⢻⠃
⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⢀⣀⠠⠤⣤⣤⠤⠞⠓⢠⠈⡆⠀⢣⣸⣾⠆⠀⠀⠀⠀⠀⢀⣀⡼⠁⡿⠈⣉⣉⣒⡒⠢⡼⠀
⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣎⣽⣶⣤⡶⢋⣤⠃⣠⡦⢀⡼⢦⣾⡤⠚⣟⣁⣀⣀⣀⣀⠀⣀⣈⣀⣠⣾⣅⠀⠑⠂⠤⠌⣩⡇⠀
⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁⣺⢁⣞⣉⡴⠟⡀⠀⠀⠀⠁⠸⡅⠀⠈⢷⠈⠏⠙⠀⢹⡛⠀⢉⠀⠀⠀⣀⣀⣼⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⡟⢡⠖⣡⡴⠂⣀⣀⣀⣰⣁⣀⣀⣸⠀⠀⠀⠀⠈⠁⠀⠀⠈⠀⣠⠜⠋⣠⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡟⢿⣿⣿⣷⡟⢋⣥⣖⣉⠀⠈⢁⡀⠤⠚⠿⣷⡦⢀⣠⣀⠢⣄⣀⡠⠔⠋⠁⠀⣼⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⡄⠈⠻⣿⣿⢿⣛⣩⠤⠒⠉⠁⠀⠀⠀⠀⠀⠉⠒⢤⡀⠉⠁⠀⠀⠀⠀⠀⢀⡿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣤⣤⠴⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠤⠀⠀⠀⠀⠀⢩⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
import { cn } from "@/lib/utils"

// Add CSS animations
const styles = `
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0px);
    }
    100% {
      opacity: 0;
      transform: translateY(-50px);
    }
  }
  
  @keyframes ctf-flare {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
    }
    20% {
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    80% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8) rotate(10deg);
    }
  }
  
  @keyframes terminal-glow {
    0%, 100% {
      box-shadow: 0 0 5px #00ff00;
    }
    50% {
      box-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00;
    }
  }

  @keyframes glitchText {
    0% { transform: skew(0deg); opacity: 1; }
    20% { transform: skew(2deg); opacity: 0.9; }
    40% { transform: skew(-2deg); opacity: 1; }
    60% { transform: skew(1deg); opacity: 0.95; }
    80% { transform: skew(-1deg); opacity: 1; }
    100% { transform: skew(0deg); opacity: 1; }
  }
`

interface HistoryEntry {
  content: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  isError?: boolean;
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
  
  // Command history for arrow key navigation
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // CTF completion notifications
  const [ctfNotifications, setCTFNotifications] = useState<{id: number, message: string, timestamp: number, nextChallengeId?: string | null, nextChallengeTitle?: string | null}[]>([])
  const [notifPos, setNotifPos] = useState<{x: number, y: number} | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{mx: number, my: number, x: number, y: number} | null>(null)
  const [terminalPos, setTerminalPos] = useState<{x: number, y: number} | null>(null)

  useEffect(() => {
    if (isExpanded && !terminalPos) {
      try {
        setTerminalPos({ x: window.innerWidth / 2, y: window.innerHeight - 120 })
      } catch {}
    }
  }, [isExpanded, terminalPos])

  const setCTFMode = (active: boolean) => {
    try {
      localStorage.setItem('ctf_mode', active ? 'true' : 'false')
      window.dispatchEvent(new CustomEvent('ctf-mode-change', { detail: active }))
    } catch {}
  }
  
  // URL Animation cleanup functions
  const [urlAnimationCleanup, setUrlAnimationCleanup] = useState<(() => void) | null>(null)
  // Core system managers - initialize only on client side
  const [commandProcessor, setCommandProcessor] = useState<CommandProcessor | null>(null)
  const [authManager, setAuthManager] = useState<AuthManager | null>(null)
  const [gameManager, setGameManager] = useState<GameStateManager | null>(null)
  const [floatingXP, setFloatingXP] = useState<{id: number, amount: number, timestamp: number}[]>([])
  const [breachEffect, setBreachEffect] = useState<{id: number} | null>(null)
  const [gameSnapshot, setGameSnapshot] = useState<{ level: number; experience: number } | null>(null)

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
      setHistoryIndex(-1)
      return
    }
    
    // Add command to history (avoid duplicates)
    const trimmedCommand = command.trim()
    setCommandHistory(prev => {
      const filtered = prev.filter(cmd => cmd !== trimmedCommand)
      return [trimmedCommand, ...filtered].slice(0, 50) // Keep last 50 commands
    })
    setHistoryIndex(-1)

    // Easter egg for common typos
    const lowerCommand = command.toLowerCase().trim()
    if (lowerCommand.includes('too many config') || lowerCommand.includes('2 many config') || 
        lowerCommand.includes('many configuration') || lowerCommand.includes('configurations')) {
      setHistory((prev) => [
        ...prev,
        { type: "input", content: getPrompt() + command },
        { type: "output", content: "🤖 Ah, I see you're experiencing configuration overload! Don't worry, even the best hackers get lost in config files sometimes. Try 'help' to find your way back to sanity! 😄" }
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
    const currentUser = authManager.getCurrentUser();
    const currentSession = authManager.getCurrentSession();
    
    if (!currentUser || !currentSession) {
      setHistory(prev => [
        ...prev,
        { type: "input", content: getPrompt() + command },
        { type: "output", content: "Error: No active session. Please restart the terminal." }
      ]);
      setCurrentInput("");
      return;
    }

    const context: TerminalContext = {
      user: currentUser,
      session: currentSession,
      behaviorTracker: {
        commandCounts: new Map<string, number>(),
        patterns: [],
        lastCommandTime: new Date(),
        consecutiveHelps: 0,
        discoveredSecrets: []
      },
      gameState: gameManager.getGameState(),
      currentDirectory,
      fileSystem,
      gameManager: gameManager
    }

    try {
      // Process command through the advanced system
      const result = await commandProcessor.executeCommand(command, context)
      
      // Handle special commands
      if (result.type === 'clear') {
        // Complete terminal reset - back to initial state with fun message
        const welcomeMessage = [
          "✨ Look now it's clean! Have you found any keys or passwords? Something funny? 🔍",
          "",
          asciiArt.banner,
          "",
          "Welcome to GOODNBAD OS Terminal Env [Version 2.5]",
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
      // Combine all history updates into a single array
      const newHistoryEntries: HistoryEntry[] = [
        { type: "input", content: getPrompt() + command }
      ];

      // Handle animated loading for scan command
      if (command.trim().startsWith('scan') && result.triggerEffect === 'scan_animation') {
        // Start URL animation during scan
        if (urlAnimationCleanup) {
          urlAnimationCleanup();
        }
        const cleanup = startURLAnimation('loading', 150);
        setUrlAnimationCleanup(() => cleanup);
        
        // Add initial loading message
        newHistoryEntries.push({ type: "output", content: "🎯 NETWORK RECONNAISSANCE INITIATED\n📡 Target: " + (command.split(' ')[1] || 'localhost') + "\n" });
        
        // Update history with initial state
        setHistory(prev => [...prev, ...newHistoryEntries]);
        setCurrentInput("");
        
        // Animate loading steps
        const loadingSteps = [
          "🔄 Initializing port scanner...",
          "🔍 Resolving hostname... ████░░░░░░ 20%",
          "⚡ Scanning TCP ports... ████████░░ 45%",
          "🛡️ Checking UDP services... ███████░░░ 70%",
          "📊 Analyzing responses... █████████░ 90%",
          "📋 Generating report... ██████████ 100%",
          "\n✅ SCAN COMPLETE\n\n🔍 Open Ports Found:\n  • 22/tcp   SSH     OpenSSH 8.0\n  • 80/tcp   HTTP    nginx 1.18.0\n  • 443/tcp  HTTPS   nginx 1.18.0\n  • 3000/tcp HTTP    Node.js Express\n\n🛡️ Security Assessment:\n  ⚠️  SSH service detected - potential entry point\n  ✅ HTTPS properly configured\n  ⚠️  Development server running on port 3000\n\n💡 Recommendations:\n  • Disable unnecessary services\n  • Update SSH configuration\n  • Secure development environment"
        ];
        
        // Animate each step with delays
        loadingSteps.forEach((step, index) => {
          setTimeout(() => {
            setHistory(prev => {
              const newHistory = [...prev];
              if (newHistory.length > 0) {
                // Update the last output entry with the new loading step
                const lastIndex = newHistory.length - 1;
                if (newHistory[lastIndex].type === 'output') {
                  newHistory[lastIndex] = {
                    ...newHistory[lastIndex],
                    content: newHistory[lastIndex].content + step + (index < loadingSteps.length - 1 ? '\n' : '')
                  };
                }
              }
              return newHistory;
            });
            
            // Stop URL animation when scan is complete
            if (index === loadingSteps.length - 1) {
              setTimeout(() => {
                if (urlAnimationCleanup) {
                  urlAnimationCleanup();
                  setUrlAnimationCleanup(null);
                }
              }, 1000);
            }
          }, index * 800);
        });
        
        return;
      }

      // Handle matrix effect with URL animation
      if (result.triggerEffect === 'matrix_rain') {
        if (urlAnimationCleanup) {
          urlAnimationCleanup();
        }
        const cleanup = createMultiEmojiAnimation(['🟢', '🔴', '🟡', '🔵', '🟣', '🟠'], 15);
        setUrlAnimationCleanup(() => cleanup);
        
        // Stop animation after 10 seconds
        setTimeout(() => {
          if (cleanup) {
            cleanup();
            setUrlAnimationCleanup(null);
          }
        }, 10000);
      }

      // Handle hack command with animated loading sequence
      if (result.triggerEffect === 'screen_glitch') {
        if (urlAnimationCleanup) {
          urlAnimationCleanup();
        }
        const cleanup = createWaveAnimation();
        setUrlAnimationCleanup(() => cleanup);
        
        // Add initial hack output without the loading lines
        const initialOutput = result.output?.split('\n').filter(line => 
          !line.includes('Extracting sensitive data') && 
          !line.includes('Planting backdoor') && 
          !line.includes('Covering tracks')
        ).join('\n') || '';
        
        newHistoryEntries.push({ type: "output", content: initialOutput });
        
        // Update history with initial state
        setHistory(prev => [...prev, ...newHistoryEntries]);
        setCurrentInput("");
        
        // Animate the loading steps with dynamic spinner
        const loadingMessages = [
          'Extracting sensitive data...',
          'Planting backdoor...',
          'Covering tracks...'
        ];
        
        loadingMessages.forEach((message, index) => {
          // Start each loading message after a delay
          setTimeout(() => {
            let spinnerStep = 0;
            const messageInterval = setInterval(() => {
              const spinner = createLoadingAnimation(spinnerStep);
              const loadingLine = `${spinner} ${message}`;
              
              setHistory(prev => {
                const newHistory = [...prev];
                const lastIndex = newHistory.length - 1;
                
                // Find or create the loading section
                if (newHistory[lastIndex] && newHistory[lastIndex].type === 'output') {
                  const lines = newHistory[lastIndex].content.split('\n');
                  const loadingStartIndex = lines.findIndex(line => line.includes('Extracting') || line.includes('Planting') || line.includes('Covering'));
                  
                  if (loadingStartIndex === -1) {
                    // First loading message
                    lines.push('', loadingLine);
                  } else {
                    // Update existing loading messages
                    const loadingLines = lines.slice(loadingStartIndex);
                    const currentMessageIndex = loadingLines.findIndex(line => line.includes(message.split('...')[0]));
                    
                    if (currentMessageIndex === -1) {
                      // Add new loading message
                      lines.push(loadingLine);
                    } else {
                      // Update existing message
                      lines[loadingStartIndex + currentMessageIndex] = loadingLine;
                    }
                  }
                  
                  newHistory[lastIndex] = {
                    ...newHistory[lastIndex],
                    content: lines.join('\n')
                  };
                }
                
                return newHistory;
              });
              
              spinnerStep++;
              
              // Stop this message's animation after 3 seconds
              if (spinnerStep >= 20) { // About 3 seconds at 150ms intervals
                clearInterval(messageInterval);
                
                // Replace spinner with checkmark
                setHistory(prev => {
                  const newHistory = [...prev];
                  const lastIndex = newHistory.length - 1;
                  
                  if (newHistory[lastIndex] && newHistory[lastIndex].type === 'output') {
                    const content = newHistory[lastIndex].content.replace(
                      new RegExp(`[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏] ${message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
                      `✅ ${message.replace('...', ' - Complete!')}`
                    );
                    
                    newHistory[lastIndex] = {
                      ...newHistory[lastIndex],
                      content: content
                    };
                  }
                  
                  return newHistory;
                });
              }
            }, 150);
          }, index * 1000); // Stagger each message by 1 second
        });
        
        // Stop URL animation after all loading is complete
        setTimeout(() => {
          if (cleanup) {
            cleanup();
            setUrlAnimationCleanup(null);
          }
        }, 8000);
        
        return;
      }

      if (result.output) {
        newHistoryEntries.push({ type: "output", content: result.output });
      }

      // Add achievement entries if any
      // Add achievements to history if any exist
      if (result.achievements && Array.isArray(result.achievements) && result.achievements.length > 0) {
        for (const achievement of result.achievements) {
          if (achievement?.name && achievement?.description) {
            newHistoryEntries.push({
              type: "success",
              content: `🏆 Achievement Unlocked: ${achievement.name} - ${achievement.description}`
            });
            
            // Add CTF completion notification with flare animation
            const notificationId = Date.now() + Math.random();
            let nextId: string | null = null;
            let nextTitle: string | null = null;
            try {
              const solved = gameManager.getGameState().solvedChallenges || [];
              const next = getNextChallenge(solved);
              if (next) { nextId = next.id; nextTitle = next.title || null; }
            } catch {}
            setTimeout(() => {
              setCTFNotifications(prev => [...prev, {
                id: notificationId,
                message: `🎉 FLAG CAPTURED! ${achievement.name}`,
                timestamp: Date.now(),
                nextChallengeId: nextId,
                nextChallengeTitle: nextTitle
              }]);
              try {
                const rect = terminalRef.current?.getBoundingClientRect()
                if (rect) {
                  setNotifPos({ x: rect.left + rect.width / 2, y: rect.bottom - 60 })
                }
              } catch {}
              setTimeout(() => {
                setCTFNotifications(prev => prev.filter(n => n.id !== notificationId));
              }, 10000);
            }, 3000);
          }
        }
      }
      
      // Check if this was a CTF flag submission success
      if (result.type === 'success' && result.playSound === 'victory') {
        const notificationId = Date.now() + Math.random();
        let nextId: string | null = null;
        let nextTitle: string | null = null;
        try {
          const solved = gameManager.getGameState().solvedChallenges || [];
          const next = getNextChallenge(solved);
          if (next) { nextId = next.id; nextTitle = next.title || null; }
        } catch {}
        setIsExpanded(true);
        setTimeout(() => {
          setCTFNotifications([{ id: notificationId, message: '🚩 FLAG COMPLETED! Great job, hacker!', timestamp: Date.now(), nextChallengeId: nextId, nextChallengeTitle: nextTitle }]);
          try {
            const rect = terminalRef.current?.getBoundingClientRect()
            if (rect) {
              setNotifPos({ x: rect.left + rect.width / 2, y: rect.bottom - 60 })
            }
          } catch {}
          setTimeout(() => { setCTFNotifications([]); }, 10000);
        }, 3000);

        // Trigger breach visual effect overlay briefly
        setBreachEffect({ id: notificationId });
        if (urlAnimationCleanup) { urlAnimationCleanup(); }
        {
          const cleanup = createMultiEmojiAnimation(['🟢', '🟩', '🟢'], 20);
          setUrlAnimationCleanup(() => cleanup);
          setTimeout(() => { try { cleanup(); } catch {} setUrlAnimationCleanup(null); }, 3000);
        }
        setTimeout(() => {
          setBreachEffect(null);
        }, 3000);
      }

      // Ensure overlay triggers for CTF submissions even without playSound
      if (lowerCommand.startsWith('ctf submit')) {
        const id = Date.now() + Math.random();
        const isSuccessLike = result.type === 'success' || (typeof result.output === 'string' && (result.output.includes('Correct! Flag accepted') || result.output.includes('already solved')));
        if (isSuccessLike) {
          // Breach effect
          setBreachEffect({ id });
          if (urlAnimationCleanup) { urlAnimationCleanup(); }
          {
            const cleanup = createMultiEmojiAnimation(['🟢', '🟩', '🟢'], 20);
            setUrlAnimationCleanup(() => cleanup);
            setTimeout(() => { try { cleanup(); } catch {} setUrlAnimationCleanup(null); }, 3000);
          }
          setTimeout(() => setBreachEffect(null), 3000);

          // Notification with next challenge info
          let nextId: string | null = null;
          let nextTitle: string | null = null;
          try {
            const solved = gameManager.getGameState().solvedChallenges || [];
            const next = getNextChallenge(solved);
            if (next) { nextId = next.id; nextTitle = next.title || null; }
          } catch {}
          const notifId = Date.now() + Math.random();
          setTimeout(() => {
            setCTFNotifications([{ id: notifId, message: '⚡ SECURITY BREACH: Flag Captured!', timestamp: Date.now(), nextChallengeId: nextId, nextChallengeTitle: nextTitle }]);
            try {
              const rect = terminalRef.current?.getBoundingClientRect()
              if (rect) {
                setNotifPos({ x: rect.left + rect.width / 2, y: rect.bottom - 60 })
              }
            } catch {}
            setTimeout(() => { setCTFNotifications([]); }, 10000);
          }, 3000);
        }
      }

      // Handle XP gains and notifications
      if (typeof result.experienceGained === 'number' && result.experienceGained > 0) {
        newHistoryEntries.push({
          type: "output", 
          content: `+${result.experienceGained} XP`
        });

        // Create unique XP notification object
        const newXP = {
          id: Date.now() + Math.random(), // Ensure unique ID
          amount: Math.floor(result.experienceGained), // Ensure integer
          timestamp: Date.now()
        };

        setFloatingXP(prev => [...prev, newXP]);

        // Cleanup floating XP after animation
        setTimeout(() => {
          setFloatingXP(prev => prev.filter(xp => xp.id !== newXP.id));
        }, 5000);
      }

      // Update history with all new entries at once
      setHistory(prev => [...prev, ...newHistoryEntries]);

      // Update XP snapshot panel
      try {
        const snap = gameManager.getGameState();
        setGameSnapshot({ level: snap.level, experience: snap.experience });
      } catch {}

      // Enable/Disable CTF mode visibility based on commands
      if (lowerCommand.startsWith('ctf')) {
        setCTFMode(true)
      } else if (lowerCommand === 'logout') {
        setCTFMode(false)
      }
    } catch (error) {
      setHistory(prev => [
        ...prev,
        { type: "input", content: getPrompt() + command },
        { 
          type: "error", 
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isError: true
        }
      ]);
    }

    setCurrentInput("");
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInput.trim()) {
      await handleCommand(currentInput.trim());
    } else if (e.key === "Escape" && isExpanded) {
      setIsExpanded(false);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
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
      // Inject CSS animations
      const styleElement = document.createElement('style')
      styleElement.textContent = styles
      document.head.appendChild(styleElement)
      
      // Show enhanced welcome message with ASCII art
      const welcomeMessage = [
        asciiArt.banner,
        "",
        "Welcome to GOODNBAD OS Terminal Env [Version 2.5]",
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

  const handleOverlayClose = () => {
    try {
      setCTFNotifications([])
      setBreachEffect(null)
      setCTFMode(false)
      handleCommand('logout')
      setIsExpanded(false)
    } catch {}
  }

  const handleOverlayMinimize = () => {
    try {
      setIsExpanded(false)
      setNotifPos(null)
    } catch {}
  }

  const handleOverlayMaximize = () => {
    try {
      setIsExpanded(true)
    } catch {}
  }

  return (
    <>
      <div className="relative w-full h-[500px] md:h-[600px] shadow-2xl">
        <div
          className="flex flex-col bg-zinc-950/90 text-emerald-400 font-mono text-sm overflow-hidden border border-zinc-800/80 transition-all duration-700 ease-in-out rounded-lg h-full w-full backdrop-blur-md"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          {/* Minimal OS Status Bar */}
          <div className="flex items-center bg-zinc-950 px-4 py-2 border-b border-zinc-800/80 select-none">
            <div className="flex-1 text-left">
              <div className="text-xs font-medium text-zinc-500 tracking-wider">
                goodnbad.exe — terminal.sh
              </div>
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
  
          {/* Terminal Content */}
          <div ref={terminalRef} className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar w-full">
             {history.map((entry, index) => {
               const isBanner = entry.content === asciiArt.banner;
               return (
                 <div key={index} className={`mb-1 ${isBanner ? 'overflow-x-auto' : 'whitespace-pre-wrap'}`}>
                   {entry.type === 'input' ? (
                     <span className="text-emerald-500">
                       {currentDirectory === '~' ? 'goodnbad@exe ~ $ ' : `goodnbad@exe ${currentDirectory} $ `}{entry.content}
                     </span>
                   ) : isBanner ? (
                     <pre className="text-[5px] xs:text-[8px] sm:text-[10px] md:text-sm leading-none text-emerald-300 font-bold tracking-tighter whitespace-pre font-mono">
                       {entry.content}
                     </pre>
                   ) : (
                     <span className={entry.isError ? 'text-red-400' : 'text-emerald-300'}>
                       {entry.content}
                     </span>
                   )}
                 </div>
               );
             })}
             
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
      
      <div className="fixed inset-0 z-40 pointer-events-none">
        {ctfNotifications.map((notification) => (
          <div
            key={notification.id}
            className="absolute"
            style={{ 
              animation: 'ctf-flare 5s ease-out forwards',
              top: notifPos ? `${notifPos.y}px` : 'calc(100% - 80px)',
              left: notifPos ? `${notifPos.x}px` : '50%',
              transform: notifPos ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)'
            }}
          >
            <div className="relative bg-zinc-950/90 border border-emerald-500/50 rounded-xl px-8 pt-6 pb-6 shadow-2xl backdrop-blur text-center pointer-events-auto">
              <div className="absolute left-3 top-2 flex items-center gap-2">
                <button aria-label="Close"
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                  onClick={handleOverlayClose}
                />
                <button aria-label="Minimize"
                  className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500"
                  onClick={handleOverlayMinimize}
                />
                <button aria-label="Maximize"
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
                  onClick={handleOverlayMaximize}
                />
              </div>
              <div
                onMouseDown={(e) => {
                  if (!isExpanded) return
                  const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
                  const start = { mx: e.clientX, my: e.clientY, x: rect.left + rect.width/2, y: rect.top + rect.height/2 }
                  setDragging(true)
                  setDragStart(start)
                  const onMove = (ev: MouseEvent) => {
                    setNotifPos({ x: start.x + (ev.clientX - start.mx), y: start.y + (ev.clientY - start.my) })
                  }
                  const onUp = () => {
                    setDragging(false)
                    setDragStart(null)
                    window.removeEventListener('mousemove', onMove)
                    window.removeEventListener('mouseup', onUp)
                  }
                  window.addEventListener('mousemove', onMove)
                  window.addEventListener('mouseup', onUp)
                }}
                className="absolute inset-0 opacity-[0.06] cursor-move"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(16,185,129,0.3) 0 2px, transparent 2px 4px)'
                }} />
              <div className="text-emerald-400 text-xs tracking-widest mb-1" style={{ animation: 'glitchText 1.5s infinite' }}>ACCESS GRANTED</div>
              <div className="text-2xl font-bold text-white mb-2" style={{ animation: 'glitchText 1.5s infinite' }}>FLAG CAPTURED</div>
              <div className="text-sm text-emerald-300 mb-3">{notification.message}</div>
              <pre className="text-emerald-400 font-mono text-[10px] md:text-[12px] whitespace-pre leading-none max-w-sm max-h-56 mx-auto overflow-hidden p-1">
{userSkull}
              </pre>
              {notification.nextChallengeId ? (
                <button
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-500 text-emerald-400 rounded hover:bg-emerald-500/10"
                  onClick={() => handleCommand(`ctf start ${notification.nextChallengeId}`)}
                >
                  Start your next flag
                </button>
              ) : (
                <div className="mt-3 text-xs text-zinc-400">All challenges complete. 🎖️</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {breachEffect && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.07) 0 2px, transparent 2px 4px)'
          }} />
        </div>
      )}
    </>
  )
}
