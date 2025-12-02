"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, FileText, Terminal, Brain } from "lucide-react"
import { GlitchText } from "@/components/glitch-text"

interface MobileNavProps {
  showTerminal: boolean
  onToggleTerminal: () => void
}

export function MobileNav({ showTerminal, onToggleTerminal }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-emerald-500">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 bg-zinc-900 border-zinc-800 p-0 [&>button]:hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo-green.png"
                  alt="Goodnbad.exe Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <GlitchText text="Goodnbad.exe" className="font-bold text-lg" />
            </div>
          </div>

          <nav className="flex-1 overflow-auto py-6 px-4">
            <ul className="space-y-6">
              {[
                { href: "#about", label: "About" },
                { href: "#skills", label: "Skills" },
                { href: "#projects", label: "Projects" },
                { href: "#experience", label: "Experience" },
                { href: "#portfolio", label: "Portfolio" },
                { href: "#contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-lg font-medium text-zinc-200 hover:text-emerald-400 transition-colors flex items-center"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-emerald-500 mr-2">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4">
              <Button 
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-emerald-400 border border-emerald-500/30 min-h-[44px]" 
                onClick={() => {
                   onToggleTerminal()
                   setOpen(false)
                 }}
              >
                <Terminal className="mr-2 h-4 w-4" /> 
                {showTerminal ? 'Hide Terminal' : 'Open Terminal'}
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white min-h-[44px]" asChild>
                <Link href="/cybersecurity-ai" onClick={() => setOpen(false)}>
                  <Brain className="mr-2 h-4 w-4" /> Cybersecurity AI
                </Link>
              </Button>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black min-h-[44px]" asChild>
                <Link href="/files/hamzah-al-ramli-resume.pdf" target="_blank" onClick={() => setOpen(false)}>
                  <FileText className="mr-2 h-4 w-4" /> Download Resume
                </Link>
              </Button>
            </div>
          </nav>

          <div className="p-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Hamzah Al-Ramli
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
