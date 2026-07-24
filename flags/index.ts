import { flag } from "flags/next"
import { vercelAdapter } from "@flags-sdk/vercel"

const facebookSDKAdapter =
  process.env.FLAGS ? vercelAdapter<string | undefined, any>() : undefined

export const facebookSDK = flag<string | undefined>({
  key: "facebookSDK",
  description: "Facebook user access token for server-side Graph API calls",
  ...(facebookSDKAdapter ? { adapter: facebookSDKAdapter } : {}),
  async decide() {
    return process.env.FACEBOOK_TOKEN
  },
  defaultValue: process.env.FACEBOOK_TOKEN,
})

/**
 * Learning Lab kill switch (docs/learning-lab/PRD.md §9).
 * Dev: always on. Production: opt-in via LEARNING_LAB_ENABLED=true — checked by the
 * /learn page AND (in Phase 3) every /api/learn/* handler; the middleware dark-ship
 * only covers pages, so the flag is the authoritative gate for the API surface.
 */
export const learningLab = flag<boolean>({
  key: "learningLab",
  description: "Enables the Learning Lab (/learn) surface",
  async decide() {
    if (process.env.NODE_ENV !== "production") return true
    return process.env.LEARNING_LAB_ENABLED === "true"
  },
  defaultValue: false,
})
