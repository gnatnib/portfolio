"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion } from "framer-motion";

interface TrackItem {
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
}

interface ArtistItem {
  name: string;
  genres: string[];
  imageUrl: string;
  url: string;
}

interface PlaylistItem {
  name: string;
  imageUrl: string;
  trackCount: number;
  url: string;
}

interface SpotifyData {
  isPlaying: boolean;
  currentTrack?: {
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
  } | null;
  lastPlayed?: {
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
  } | null;
  recentlyPlayed?: TrackItem[];
  topTracks?: TrackItem[];
  topArtists?: ArtistItem[];
  playlists?: PlaylistItem[];
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 w-max pb-2">{children}</div>
    </div>
  );
}

function TrackCard({ track }: { track: TrackItem }) {
  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-28 sm:w-32 group"
    >
      <div className="relative aspect-square overflow-hidden bg-muted rounded-sm mb-2">
        {track.albumImageUrl ? (
          <Image
            src={track.albumImageUrl}
            alt={track.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-[11px] font-medium truncate group-hover:text-muted-foreground transition-colors">
        {track.title}
      </p>
      <p className="text-[10px] text-muted-foreground/50 truncate">{track.artist}</p>
    </a>
  );
}

function ArtistCard({ artist }: { artist: ArtistItem }) {
  return (
    <a
      href={artist.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-20 sm:w-24 group text-center"
    >
      <div className="relative overflow-hidden bg-muted rounded-full mb-2 mx-auto w-16 h-16 sm:w-20 sm:h-20">
        {artist.imageUrl ? (
          <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center rounded-full">
            <svg className="w-6 h-6 text-muted-foreground/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-[11px] font-medium truncate group-hover:text-muted-foreground transition-colors">
        {artist.name}
      </p>
    </a>
  );
}

function PlaylistCard({ playlist }: { playlist: PlaylistItem }) {
  return (
    <a
      href={playlist.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-28 sm:w-32 group"
    >
      <div className="relative aspect-square overflow-hidden bg-muted rounded-sm mb-2">
        {playlist.imageUrl ? (
          <Image src={playlist.imageUrl} alt={playlist.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-[11px] font-medium truncate group-hover:text-muted-foreground transition-colors">{playlist.name}</p>
      <p className="font-mono-accent text-[9px] text-muted-foreground/40">{playlist.trackCount} tracks</p>
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono-accent text-[11px] text-muted-foreground/50 tracking-widest uppercase mb-3">
      {children}
    </h3>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-muted rounded-sm animate-pulse" />
        <div className="space-y-2">
          <div className="w-36 h-4 bg-muted rounded animate-pulse" />
          <div className="w-24 h-3 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-28">
            <div className="aspect-square bg-muted rounded-sm animate-pulse mb-2" />
            <div className="w-20 h-3 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/spotify");
        const json = await res.json();
        // Even if the API returns 500, it sends structured JSON with fallback arrays
        setData(json);
      } catch {
        // Network-level failure — still set data so we don't show loading forever
        setData({
          isPlaying: false,
          currentTrack: null,
          lastPlayed: null,
          recentlyPlayed: [],
          topTracks: [],
          topArtists: [],
          playlists: [],
        });
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const heroTrack = data?.currentTrack || data?.lastPlayed || null;
  const hasContent =
    heroTrack ||
    (data?.topTracks && data.topTracks.length > 0) ||
    (data?.topArtists && data.topArtists.length > 0) ||
    (data?.recentlyPlayed && data.recentlyPlayed.length > 0) ||
    (data?.playlists && data.playlists.length > 0);

  return (
    <Section sectionNumber="03" label="Music">
      <div className="py-12 sm:py-20 overflow-hidden">
        <div className="px-4 sm:px-6">
          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.2}
            viewport={{ once: true }}
          >
            {/* Header with Spotify icon */}
            <div className="flex items-center gap-3 mb-8">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1DB954] flex-shrink-0" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="font-mono-accent text-[11px] text-muted-foreground/50 tracking-widest uppercase">
                {data?.isPlaying ? "Now Playing" : "Spotify"}
              </span>
              {data?.isPlaying && (
                <div className="flex items-end gap-[2px] h-3.5 ml-auto">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-[2px] bg-[#1DB954] rounded-full"
                      animate={{ height: ["3px", "14px", "3px"] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              )}
            </div>
          </ViewAnimation>

          {data === null ? (
            <LoadingSkeleton />
          ) : !hasContent ? (
            <p className="text-sm text-muted-foreground/50">No listening data available right now.</p>
          ) : (
            <div className="space-y-8">
              {/* Hero track */}
              {heroTrack && (
                <ViewAnimation
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  delay={0.3}
                  viewport={{ once: true }}
                >
                  <a
                    href={heroTrack.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    {heroTrack.albumImageUrl && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-sm overflow-hidden flex-shrink-0 bg-muted">
                        <Image src={heroTrack.albumImageUrl} alt={heroTrack.title} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium truncate group-hover:text-muted-foreground transition-colors">
                        {heroTrack.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{heroTrack.artist}</p>
                      {!data.isPlaying && (
                        <p className="font-mono-accent text-[9px] text-muted-foreground/40 mt-0.5">Last played</p>
                      )}
                    </div>
                  </a>
                </ViewAnimation>
              )}

              {data.topTracks && data.topTracks.length > 0 && (
                <div>
                  <SectionLabel>Top Tracks</SectionLabel>
                  <ScrollRow>{data.topTracks.map((t, i) => <TrackCard key={i} track={t} />)}</ScrollRow>
                </div>
              )}

              {data.recentlyPlayed && data.recentlyPlayed.length > 0 && (
                <div>
                  <SectionLabel>Recently Played</SectionLabel>
                  <ScrollRow>{data.recentlyPlayed.map((t, i) => <TrackCard key={i} track={t} />)}</ScrollRow>
                </div>
              )}

              {data.topArtists && data.topArtists.length > 0 && (
                <div>
                  <SectionLabel>Top Artists</SectionLabel>
                  <ScrollRow>{data.topArtists.map((a, i) => <ArtistCard key={i} artist={a} />)}</ScrollRow>
                </div>
              )}

              {data.playlists && data.playlists.length > 0 && (
                <div>
                  <SectionLabel>Playlists</SectionLabel>
                  <ScrollRow>{data.playlists.map((p, i) => <PlaylistCard key={i} playlist={p} />)}</ScrollRow>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
