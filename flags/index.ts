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
