"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FACEBOOK_PROFILE, INSTAGRAM_PROFILES, PERSONAL_BRAND } from "@/lib/social/profiles"

type FacebookApiResponse = {
  name?: string
  link?: string
  picture?: {
    data?: {
      url?: string
    }
  }
}

type SocialIdentityProps = {
  variant?: "footer" | "mobile"
  className?: string
}

export function SocialIdentity({
  variant = "footer",
  className,
}: SocialIdentityProps) {
  const [fbData, setFbData] = useState<FacebookApiResponse | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadFacebookProfile() {
      try {
        const response = await fetch("/api/social/facebook", { cache: "no-store" })
        if (!response.ok) return

        const data = (await response.json()) as FacebookApiResponse
        if (mounted) {
          setFbData(data)
        }
      } catch {
        // Keep the profile block stable even if the social API is unavailable.
      }
    }

    loadFacebookProfile()

    return () => {
      mounted = false
    }
  }, [])

  const avatarSize =
    variant === "footer" ? "h-20 w-20" : "h-12 w-12"

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        variant === "footer" ? "items-start" : "items-center",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-full border border-emerald-500/40 bg-zinc-900",
          avatarSize,
        )}
      >
        <Image
          src={fbData?.picture?.data?.url || PERSONAL_BRAND.fallbackAvatar}
          alt={fbData?.name || PERSONAL_BRAND.name}
          fill
          sizes={variant === "footer" ? "80px" : "56px"}
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-base font-semibold text-white">
            {fbData?.name || PERSONAL_BRAND.name}
          </span>
        </div>

        <p className="text-sm text-zinc-300">{PERSONAL_BRAND.title}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span>{PERSONAL_BRAND.alias}</span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-emerald-400" />
            {PERSONAL_BRAND.location}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={fbData?.link || FACEBOOK_PROFILE.href} target="_blank">
            <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20">
              <Facebook className="mr-1 h-3 w-3" />
              Facebook
            </Badge>
          </Link>
          {INSTAGRAM_PROFILES.map((profile) => (
            <Link key={profile.href} href={profile.href} target="_blank">
              <Badge className="border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20">
                <Instagram className="mr-1 h-3 w-3" />
                {profile.handle}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
