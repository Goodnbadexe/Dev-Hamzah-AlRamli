"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <span className={cn("relative inline-block", className)}>
      <span className={cn("relative z-10", isGlitching && "opacity-90")}>{text}</span>

      {isGlitching && (
        <>
          <span className="absolute inset-0 text-emerald-500 opacity-70 translate-x-[2px] translate-y-[-2px] z-0">
            {text}
          </span>
          <span className="absolute inset-0 text-red-500 opacity-70 translate-x-[-2px] translate-y-[2px] z-0">
            {text}
          </span>
        </>
      )}
    </span>
  )
}
