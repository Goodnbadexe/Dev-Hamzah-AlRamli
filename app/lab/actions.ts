"use server"

import { createHash, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const COOKIE_NAME = "goodnbad_lab_access"
const COOKIE_MAX_AGE = 60 * 60 * 8

function hashPassphrase(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex")
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)

  if (left.length !== right.length) {
    return false
  }

  return timingSafeEqual(left, right)
}

export async function hasLabAccess() {
  const passphrase = process.env.LAB_PASSPHRASE

  if (!passphrase) {
    return false
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return false
  }

  return safeEqual(token, hashPassphrase(passphrase))
}

export async function unlockLab(formData: FormData) {
  const passphrase = process.env.LAB_PASSPHRASE

  if (!passphrase) {
    redirect("/lab?error=not-configured")
  }

  const submitted = String(formData.get("passphrase") ?? "")

  if (!safeEqual(hashPassphrase(submitted), hashPassphrase(passphrase))) {
    redirect("/lab?error=denied")
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, hashPassphrase(passphrase), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/lab",
  })

  redirect("/lab")
}
