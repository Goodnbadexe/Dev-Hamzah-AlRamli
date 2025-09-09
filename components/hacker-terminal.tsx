"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

export function HackerTerminal() {
  const [history, setHistory] = useState<{ type: "input" | "output"; content: string }[]>([
    { type: "output", content: "Last login: " + new Date().toLocaleString() + " on ttys001" },
    { type: "output", content: "Welcome to Goodnbad.exe Terminal v1.0.0" },
    { type: "output", content: "Type 'help' to see available commands" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentDirectory, setCurrentDirectory] = useState("~")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleCommand = (command: string) => {
    const args = command.trim().split(" ")
    const cmd = args[0].toLowerCase()

    let output = ""

    switch (cmd) {
      case "help":
        output =
          "Available commands:\n\n" +
          "ls                  List directory contents\n" +
          "cd [directory]      Change directory\n" +
          "cat [file]          Display file contents\n" +
          "clear               Clear terminal\n" +
          "whoami              Display user information\n" +
          "skills              Display skills summary\n" +
          "projects            List all projects\n" +
          "experience          Show work experience\n" +
          "certifications      Show certifications\n" +
          "contact             Display contact information\n" +
          "github              Open GitHub profile\n" +
          "pwd                 Print working directory\n" +
          "date                Show current date and time\n" +
          "echo [text]         Display text"
        break

      case "ls":
        const dir = args[1] || currentDirectory
        const targetDir =
          dir.startsWith("/") || dir.startsWith("~")
            ? dir
            : currentDirectory === "~"
              ? `~/${dir}`
              : `${currentDirectory}/${dir}`

        const normalizedDir = targetDir.replace(/\/\//g, "/")

        if (fileSystem[normalizedDir]) {
          output = fileSystem[normalizedDir].join("\n")
        } else {
          output = `ls: ${dir}: No such file or directory`
        }
        break

      case "cd":
        if (args.length === 1 || args[1] === "~") {
          setCurrentDirectory("~")
        } else if (args[1] === "..") {
          if (currentDirectory === "~") {
            output = "cd: cannot go above home directory"
          } else {
            const parts = currentDirectory.split("/")
            parts.pop()
            setCurrentDirectory(parts.join("/") || "~")
          }
        } else {
          const targetDir =
            args[1].startsWith("~/") || args[1].startsWith("/")
              ? args[1]
              : currentDirectory === "~"
                ? `~/${args[1]}`
                : `${currentDirectory}/${args[1]}`

          const simplifiedTarget = targetDir.replace(/\/\//g, "/")

          if (fileSystem[simplifiedTarget]) {
            setCurrentDirectory(simplifiedTarget)
          } else {
            output = `cd: ${args[1]}: No such file or directory`
          }
        }
        break

      case "cat":
        if (args.length < 2) {
          output = "cat: missing file operand"
        } else {
          const filePath =
            args[1].startsWith("~/") || args[1].startsWith("/")
              ? args[1]
              : currentDirectory === "~"
                ? `~/${args[1]}`
                : `${currentDirectory}/${args[1]}`

          const normalizedPath = filePath.replace(/\/\//g, "/")

          if (fileContents[normalizedPath]) {
            output = fileContents[normalizedPath]
          } else {
            // Check if it's a directory
            if (fileSystem[normalizedPath]) {
              output = `cat: ${args[1]}: Is a directory`
            } else {
              output = `cat: ${args[1]}: No such file or directory`
            }
          }
        }
        break

      case "clear":
        setHistory([])
        return

      case "whoami":
        output =
          "Hamzah Al-Ramli\n" +
          "Fresh Graduate & Developer\n" +
          "A fresh graduate and lead front-end developer with hands-on experience in web services,\n" +
          "passionate about machine problem-solving, and continuously learns through mentorship,\n" +
          "certifications, and practical experiences."
        break

      case "skills":
        output =
          "Technical Skills:\n\n" +
          "• Security Risk Management & Network Security\n" +
          "• Full-Stack Development (React, Next.js, Node.js)\n" +
          "• Mobile App Development (React Native, Swift, Java)\n" +
          "• Leadership & Project Management\n" +
          "• Cybersecurity & Vulnerability Management\n\n" +
          "Use 'cd skills' and 'ls' to explore specific skill categories."
        break

      case "projects":
        output =
          "Featured Projects:\n\n" +
          "1. Magic Browser\n   Revolutionary browser concept enhancing productivity\n   URL: https://goodnbadexe.github.io/MagicB/\n\n" +
          "2. Raining Characters\n   Interactive animation with character rain effects\n   URL: https://v0-raining-characters-ten-livid.vercel.app/\n\n" +
          "3. Prompting Is All You Need\n   Demonstration of prompt engineering techniques\n   URL: https://v0-prompting-is-all-you-need-ashy-delta.vercel.app/\n\n" +
          "4. Pixel Game X and O\n   Classic Tic-Tac-Toe with pixel art styling\n   URL: https://v0-pixel-game-idea-two.vercel.app/\n\n" +
          "5. Masarat Events Website\n   Corporate website with modern design\n   URL: https://www.masaratevents.com\n\n" +
          "6. My First Website - HOS\n   A milestone in my web development journey\n   URL: https://goodnbadexe.github.io/HOS/\n\n" +
          "Use 'cd projects' and 'cat [filename]' to see project details."
        break

      case "experience":
        output =
          "Work Experience:\n\n" +
          "• Head of Technology\n  Masarat Events - Riyadh, Saudi Arabia\n\n" +
          "• System Administrator\n  Masarat Decor - Riyadh, Saudi Arabia\n\n" +
          "• Web Developer\n  ThunderQuote - Malaysia\n\n" +
          "• Full-stack Developer\n  Kabel - Malaysia\n\n" +
          "Use 'cd experience' and 'cat [filename]' to see detailed experience."
        break

      case "certifications":
        output =
          "Recent Certifications:\n\n" +
          "• Google Cybersecurity Professional Certificate (March 2025)\n" +
          "• IBM Cybersecurity Assessment: CompTIA Security+ & CYSA+ (May 2025)\n" +
          "• Generative AI: Boost Your Cybersecurity Career - IBM (May 2025)\n" +
          "• Google Analytics Certification (May 2025)\n" +
          "• Taylor's University Award 2024 (December 2024)\n\n" +
          "Use 'cd certifications' and 'cat [filename]' to see certificate details."
        break

      case "contact":
        output =
          "Contact Information:\n\n" +
          "Email: alramli.hamzah@gmail.com\n" +
          "Phone: +966 50 850 1717\n" +
          "Location: Riyadh, Saudi Arabia\n" +
          "LinkedIn: linkedin.com/in/hamzah-al-ramli-505\n" +
          "GitHub: github.com/goodnbadexe\n\n" +
          "Use 'cd contact' and 'cat [filename]' to see specific contact details."
        break

      case "github":
        output = "Opening GitHub profile...\n" + "URL: https://github.com/goodnbadexe"
        break

      case "pwd":
        output = currentDirectory
        break

      case "date":
        output = new Date().toString()
        break

      case "echo":
        output = args.slice(1).join(" ")
        break

      case "":
        // Empty command, just show a new prompt
        break

      default:
        output = `bash: command not found: ${cmd}`
    }

    // Add command to history
    setHistory((prev) => [
      ...prev,
      { type: "input", content: getPrompt() + command },
      ...(output ? [{ type: "output", content: output }] : []),
    ])

    setCurrentInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentInput)
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

  return (
    <div
      className="flex flex-col h-full bg-black/80 text-emerald-400 font-mono text-sm rounded-md overflow-hidden border border-emerald-500/30"
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }}
    >
      <div className="flex items-center bg-zinc-900 px-4 py-2 border-b border-emerald-500/30">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-xs text-zinc-400">goodnbad.exe - Terminal</div>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-auto p-4 custom-scrollbar">
        {history.map((entry, index) => (
          <div
            key={index}
            className={cn("whitespace-pre-wrap mb-1", entry.type === "input" ? "text-emerald-500" : "text-emerald-300")}
          >
            {entry.content}
          </div>
        ))}

        <div className="flex items-center">
          <span className="text-emerald-500">{getPrompt()}</span>
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
  )
}
