"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SocialButtonProps {
  icon: React.ReactNode
  label: string
  href: string
}

export function SocialButton({ icon, label, href }: SocialButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="outline"
      className={cn(
        "relative overflow-hidden border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300 h-auto py-3",
        isHovered ? "border-emerald-500 text-emerald-500" : "",
      )}
      asChild
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} target="_blank">
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "transform transition-transform duration-300",
              isHovered ? "-translate-y-10" : "translate-y-0",
            )}
          >
            {icon}
          </div>
          <div
            className={cn(
              "absolute transform transition-transform duration-300",
              isHovered ? "translate-y-0" : "translate-y-10",
            )}
          >
            {label}
          </div>
        </div>
      </Link>
    </Button>
  )
}
