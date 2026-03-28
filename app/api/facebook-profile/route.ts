import { NextResponse } from 'next/server'

const GRAPH_API_VERSION = 'v23.0'
const GRAPH_FIELDS = ['id', 'name', 'picture.width(400).height(400)', 'about', 'link', 'quotes'].join(',')

export async function GET() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN
  const profileId = process.env.FACEBOOK_PROFILE_ID || 'me'

  if (!token) {
    return NextResponse.json(
      {
        error: 'facebook_not_configured',
        message: 'Missing FACEBOOK_ACCESS_TOKEN in environment.',
      },
      { status: 503 },
    )
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${profileId}?fields=${encodeURIComponent(GRAPH_FIELDS)}&access_token=${encodeURIComponent(token)}`

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        {
          error: 'facebook_upstream_error',
          message: `Facebook API request failed with status ${response.status}.`,
          upstream: errorBody.slice(0, 500),
        },
        { status: response.status },
      )
    }

    const profile = await response.json()
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json(
      {
        error: 'facebook_fetch_failed',
        message: 'Failed to reach Facebook Graph API.',
      },
      { status: 502 },
    )
  }
}
