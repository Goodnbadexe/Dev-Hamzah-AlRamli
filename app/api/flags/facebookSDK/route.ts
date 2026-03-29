import { NextResponse } from "next/server"
import { facebookSDK } from "@/flags"

export async function GET() {
  const token = await facebookSDK()
  return NextResponse.json({ present: Boolean(token) })
}
