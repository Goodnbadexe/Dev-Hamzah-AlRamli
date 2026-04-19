import { ExternalLink, FileText } from "lucide-react"
import { fetchBlogspotPosts } from "@/lib/blogspot/feed"

interface BlogspotFeedProps {
  /** The blogspot host, e.g. "goodnbadexe.blogspot.com" */
  host: string
  /** Max number of posts to show */
  limit?: number
}

function relativeTime(iso: string): string {
  if (!iso) return ""
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ""
  const diffDays = Math.floor((Date.now() - then) / 86_400_000)
  if (diffDays < 1)  return "today"
  if (diffDays < 2)  return "yesterday"
  if (diffDays < 30) return `${diffDays}d ago`
  const months = Math.floor(diffDays / 30)
  if (months < 12)   return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}

/**
 * BlogspotFeed — server component that fetches the latest posts from a Blogspot
 * blog via its Atom feed and renders them as a clean list. Cached via ISR.
 */
export async function BlogspotFeed({ host, limit = 6 }: BlogspotFeedProps) {
  const posts = await fetchBlogspotPosts(host, limit)

  if (posts.length === 0) {
    return (
      <div className="rounded border border-zinc-800 bg-zinc-950/50 p-4 text-xs text-zinc-500">
        Blog feed is temporarily unavailable — visit{" "}
        <a href={`https://${host}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
          {host}
        </a>{" "}
        directly.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <a
          key={post.id || post.url}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded border border-zinc-800 bg-zinc-950/40 p-4 transition hover:border-emerald-800 hover:bg-zinc-900/50"
        >
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600 group-hover:text-emerald-500" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-emerald-300">
                  {post.title}
                </h3>
                <ExternalLink className="h-3 w-3 shrink-0 text-zinc-700 group-hover:text-emerald-500" />
              </div>
              {post.summary && (
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{post.summary}</p>
              )}
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-700">
                {relativeTime(post.publishedAt)}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
