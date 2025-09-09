"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, FileText } from "lucide-react"
import { GlitchText } from "@/components/glitch-text"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-emerald-500">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 bg-zinc-900 border-zinc-800 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
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
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5 text-emerald-500" />
              <span className="sr-only">Close</span>
            </Button>
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

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black" asChild>
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
