export type SocialProfile = {
  platform: "facebook" | "instagram"
  label: string
  handle: string
  href: string
  verified: boolean
}

export const PERSONAL_BRAND = {
  name: "Hamzah Al-Ramli",
  alias: "Goodnbad.exe",
  title: "Cybersecurity & Automation Architect",
  location: "Riyadh, Saudi Arabia",
  fallbackAvatar: "/placeholder-user.jpg",
}

export const VERIFIED_SOCIALS: SocialProfile[] = [
  {
    platform: "facebook",
    label: "Facebook",
    handle: "hamzah.ramli.790",
    href: "https://www.facebook.com/hamzah.ramli.790",
    verified: true,
  },
  {
    platform: "instagram",
    label: "Instagram Brand",
    handle: "@Goodnbad.exe",
    href: "https://www.instagram.com/Goodnbad.exe/",
    verified: true,
  },
  {
    platform: "instagram",
    label: "Instagram Personal",
    handle: "@hamzah-al-ramli",
    href: "https://instagram.com/hamzah-al-ramli",
    verified: true,
  },
]

export const FACEBOOK_PROFILE =
  VERIFIED_SOCIALS.find((profile) => profile.platform === "facebook") ?? VERIFIED_SOCIALS[0]

export const INSTAGRAM_PROFILES = VERIFIED_SOCIALS.filter(
  (profile) => profile.platform === "instagram",
)
