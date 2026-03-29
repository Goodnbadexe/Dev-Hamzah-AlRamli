import { NextResponse } from "next/server"
import { facebookSDK } from "@/flags"

export async function GET() {
  try {
    const token = await facebookSDK()
    if (!token) {
      return NextResponse.json({ error: "facebookSDK flag missing" }, { status: 401 })
    }

    const url = `https://graph.facebook.com/v26.0/me?fields=id,name,picture{url}&access_token=${token}`
    const res = await fetch(url, { cache: "no-store" })

    if (!res.ok) {
      let details: any = null
      try {
        details = await res.json()
      } catch {
        details = await res.text()
      }
      return NextResponse.json(
        { error: "Graph request failed", details },
        { status: res.status || 500 }
      )
    }

    const data = await res.json()
    const normalized = {
      id: data?.id ?? "",
      name: data?.name ?? "",
      picture: data?.picture?.data?.url ?? "",
      verified: null as null,
    }
    return NextResponse.json(normalized)
  } catch (e: any) {
    return NextResponse.json({ error: "Server error", details: String(e?.message || e) }, { status: 500 })
  }
}
