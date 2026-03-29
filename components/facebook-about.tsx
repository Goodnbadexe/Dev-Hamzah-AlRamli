'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Loader2, UserCircle, Link as LinkIcon, CalendarDays, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FACEBOOK_PROFILE, INSTAGRAM_PROFILES, PERSONAL_BRAND } from '@/lib/social/profiles';

type FacebookApiResponse = {
  id?: string;
  name?: string;
  picture?: string;
  verified?: boolean | null;
}

type FacebookPost = {
  permalink_url?: string;
}

export function FacebookAbout() {
  const [fbData, setFbData] = useState<FacebookApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  useEffect(() => {
    async function fetchFacebookData() {
      try {
        const response = await fetch(`/api/social/facebook`, { cache: "no-store" });
        if (!response.ok) {
          let msg = "Data unavailable";
          try {
            const err = await response.json();
            msg = err?.error || err?.message || msg;
          } catch {
            // ignore
          }
          setError(msg);
        } else {
          const data = await response.json();
          setFbData(data);
        }
        const postsRes = await fetch(`/api/social/facebook/posts`, { cache: "no-store" });
        if (postsRes.ok) {
          const p = await postsRes.json();
          setPosts(Array.isArray(p?.data) ? p.data : []);
        }
      } catch (err) {
        console.warn("Facebook fetch warning:", err);
        setError("Could not load Facebook profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchFacebookData();
  }, []);

  // Load FB SDK and enable interactive embeds/comments
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("facebook-jssdk")) return;
    (window as any).fbAsyncInit = function() {
      if ((window as any).FB && appId) {
        (window as any).FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: 'v26.0'
        });
        (window as any).FB.AppEvents?.logPageView?.();
      }
    };
    const js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.async = true;
    const fjs = document.getElementsByTagName("script")[0];
    fjs?.parentNode?.insertBefore(js, fjs);
  }, [appId]);

  const inferTags = () => {
    return [];
  }

  const metaLabel = "Facebook profile";

  if (loading) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700 h-full flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </Card>
    );
  }

  if (error || !fbData) {
    // Silent fallback or error state
    return (
      <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-500" />
            Social Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm">{error || "Data unavailable"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Facebook className="h-5 w-5" />
            {metaLabel}
          </CardTitle>
          <a href={FACEBOOK_PROFILE.href} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
            <LinkIcon className="h-3 w-3" /> View on FB
          </a>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors flex-shrink-0">
            {fbData.picture ? (
              <Image 
                src={fbData.picture} 
                alt={fbData.name || "Facebook Profile"} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                <UserCircle className="h-10 w-10 text-zinc-400" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
              {fbData.name || PERSONAL_BRAND.name}
              {fbData.verified === true && (
                <span className="inline-flex items-center ml-2 align-middle">
                  <CheckCircle className="h-4 w-4 text-blue-400" aria-label="Verified on Facebook" />
                </span>
              )}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
               <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                 Facebook
               </Badge>
               {INSTAGRAM_PROFILES.map((profile) => (
                 <Link key={profile.href} href={profile.href} target="_blank" className="inline-flex">
                   <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500/20">
                     <Instagram className="mr-1 h-3 w-3" />
                     {profile.label}
                   </Badge>
                 </Link>
               ))}
               {fbData.id && (
                 <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                   ID: {fbData.id.slice(0, 5)}...
                 </Badge>
               )}
               {inferTags().map(t => (
                 <Badge key={t} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                   {t}
                 </Badge>
               ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs sm:justify-start">
              <Link href={FACEBOOK_PROFILE.href} target="_blank" className="text-blue-300 hover:text-blue-200">
                Meta profile
              </Link>
              {INSTAGRAM_PROFILES.map((profile) => (
                <Link key={profile.handle} href={profile.href} target="_blank" className="text-pink-300 hover:text-pink-200">
                  {profile.handle}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {posts.length > 0 && (
          <div className="mt-6">
            <div className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> Recent posts (permission dependent)
            </div>
            {/* Interactive embeds with likes/comments if posts are public */}
            <div id="fb-root" />
            <div className="space-y-4">
              {posts.slice(0, 2).map((p, i) => (
                <div key={i} className="rounded border border-zinc-700 p-2 bg-zinc-900/50">
                  <div className="fb-post" data-href={p.permalink_url} data-show-text="true" data-width="500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
