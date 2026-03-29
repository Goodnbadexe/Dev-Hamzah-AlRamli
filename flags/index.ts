import { flag } from "flags/next"

export const facebookSDK = flag<string>({
  key: "facebookSDK",
  async decide() {
    return undefined
  },
  description: "Facebook user access token for server-side Graph API calls",
  defaultValue: undefined,
})
