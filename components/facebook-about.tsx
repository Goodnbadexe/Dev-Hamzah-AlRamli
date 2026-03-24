'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook, Loader2, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { GlitchText } from '@/components/glitch-text';

export function FacebookAbout() {
  const [fbData, setFbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFacebookData() {
      try {
        const token = "EAAb75ZCw1boMBRKixK8aejnzPSMiD6Eal8WDcl0FrSKHRZC4uCN21UdJbPg6TZChJg6K6TV6dRHn7mfP3EtBbUkLZAmZAKxUKaiQH8EEILO6kNRKcrFVdImsdfIVVfdSzeYNEuGM6oA6e719B0WibMirkwS8UIoqs7b8rkRPe6H3RZABgUDLJO19VxKZAV2wfs1RTxTYjc3LjKdnBaBrCQ9rotqPW2rKa4xwX6v8go0K6gY60wv7CBMxEOLRoneU8qB3ZCTtYYWCzL8AanlqIjzTckZCkhL5Q";
        // Fetch data from Facebook Graph API
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,picture.width(400).height(400),about,link,quotes&access_token=${token}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Facebook data');
        }
        
        const data = await response.json();
        setFbData(data);
      } catch (err) {
        console.error("Facebook fetch error:", err);
        setError("Could not load Facebook profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchFacebookData();
  }, []);

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
            Verified Profile
          </CardTitle>
          {fbData.link && (
            <a href={fbData.link} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
              View on FB
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors flex-shrink-0">
            {fbData.picture?.data?.url ? (
              <Image 
                src={fbData.picture.data.url} 
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
              {fbData.name || "Hamzah Ammar Alramli"}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
               <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                 Verified
               </Badge>
               {fbData.id && (
                 <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                   ID: {fbData.id.slice(0, 5)}...
                 </Badge>
               )}
            </div>
            {fbData.about && (
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                {fbData.about}
              </p>
            )}
            {fbData.quotes && (
              <blockquote className="mt-3 text-sm italic text-zinc-400 border-l-2 border-blue-500/30 pl-3">
                "{fbData.quotes}"
              </blockquote>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
