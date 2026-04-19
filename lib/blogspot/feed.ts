/**
 * Blogspot feed fetcher — pulls the Atom feed from a Blogger blog and extracts
 * the latest posts. Uses only regex (no XML parsing dependencies).
 *
 * Blogger exposes an Atom feed at:
 *   https://<name>.blogspot.com/feeds/posts/default
 */

export interface BlogspotPost {
  id: string
  title: string
  url: string
  publishedAt: string
  summary: string
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g,  "<")
    .replace(/&gt;/g,  ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g,  "&")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8217;/g, "\u2019")
}

function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim()
}

function firstMatch(haystack: string, pattern: RegExp): string {
  const m = pattern.exec(haystack)
  return m ? m[1] : ""
}

export async function fetchBlogspotPosts(blogspotHost: string, limit = 6): Promise<BlogspotPost[]> {
  const feedUrl = `https://${blogspotHost}/feeds/posts/default?alt=atom&max-results=${limit}`
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 900 }, // 15-minute ISR cache
      headers: { Accept: "application/atom+xml, application/xml, text/xml" },
    })
    if (!res.ok) return []
    const xml = await res.text()

    // Each <entry>...</entry> is a post
    const entries = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/g)].map((m) => m[0])

    return entries.slice(0, limit).map((entry): BlogspotPost => {
      const id        = firstMatch(entry, /<id>([^<]+)<\/id>/)
      const title     = stripHtml(firstMatch(entry, /<title[^>]*>([\s\S]*?)<\/title>/))
      // Prefer the alternate link (the post URL on blogspot.com)
      const linkMatch = /<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/.exec(entry)
              || /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']alternate["']/.exec(entry)
      const url       = linkMatch ? linkMatch[1] : ""
      const publishedAt = firstMatch(entry, /<published>([^<]+)<\/published>/) ||
                          firstMatch(entry, /<updated>([^<]+)<\/updated>/)
      const rawSummary = firstMatch(entry, /<summary[^>]*>([\s\S]*?)<\/summary>/) ||
                         firstMatch(entry, /<content[^>]*>([\s\S]*?)<\/content>/)
      const summary   = stripHtml(rawSummary).slice(0, 240)

      return { id, title, url, publishedAt, summary }
    }).filter((p) => p.url && p.title)
  } catch {
    return []
  }
}
