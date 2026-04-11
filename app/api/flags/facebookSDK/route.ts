import { NextResponse } from "next/server"
import { facebookSDK } from "@/flags"

function isAuthorized(request: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return false
  const authHeader = request.headers.get("authorization") ?? ""
  return authHeader === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }
  const token = await facebookSDK()
  return NextResponse.json({ present: Boolean(token) })
}
