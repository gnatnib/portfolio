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

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

interface SpotifyData {
  isPlaying: boolean;
  currentTrack?: SpotifyTrack | null;
  lastPlayed?: SpotifyTrack | null;
  recentlyPlayed?: TrackItem[];
  topTracks?: TrackItem[];
  topArtists?: ArtistItem[];
}

const SPOTIFY_GREEN = "#1DB954";
/* Deliberately small — this is a footnote, not a portfolio section */
const MAX_COVERS = 7;
const MAX_ARTISTS = 6;

function SpotifyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/* Small square album cover with a link out to the track */
function Cover({ track }: { track: TrackItem }) {
  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${track.title} — ${track.artist}`}
      className="group relative block w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 overflow-hidden border border-border bg-muted"
    >
      {track.albumImageUrl && (
        <Image
          src={track.albumImageUrl}
          alt={track.title}
          fill
          sizes="40px"
          className="object-cover opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
          unoptimized
        />
      )}
    </a>
  );
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/spotify");
        const json = await res.json();
        // Even if the API returns 500, it sends structured JSON with fallback arrays
        if (mounted) setData(json);
      } catch {
        // Network-level failure — still set data so we don't show loading forever
        if (mounted) setData({ isPlaying: false, currentTrack: null, lastPlayed: null });
      }
    };

    fetchData();
    /* 60s is plenty — the route caches upstream anyway, and the old 30s
       interval was fanning out to five Spotify endpoints each time. */
    const interval = setInterval(fetchData, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const heroTrack = data?.currentTrack || data?.lastPlayed || null;
  const covers = (data?.topTracks?.length ? data.topTracks : data?.recentlyPlayed ?? [])
    .slice(0, MAX_COVERS);
  const artists = (data?.topArtists ?? []).slice(0, MAX_ARTISTS);

  return (
    <Section sectionNumber="04" label="Music">
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <ViewAnimation
          initial={{ opacity: 0, translateY: -4 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.2}
          viewport={{ once: true }}
        >
          <div className="panel">
            {/* Header strip */}
            <div className="flex items-center gap-2.5 px-3 sm:px-4 h-9 border-b border-border">
              <SpotifyGlyph className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/85" />
              <span className="font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/85">
                {data?.isPlaying ? "Now Playing" : "Spotify"}
              </span>

              {data?.isPlaying && (
                <div className="flex items-end gap-[2px] h-3 ml-auto">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[2px]"
                      style={{ backgroundColor: SPOTIFY_GREEN }}
                      animate={{ height: ["3px", "12px", "3px"] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="grid sm:grid-cols-[minmax(0,1fr)_auto] items-center">
              {/* Current / last track */}
              <div className="px-3 sm:px-4 py-3 sm:border-r border-border min-w-0">
                {data === null ? (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-muted animate-pulse flex-shrink-0" />
                    <div className="space-y-1.5">
                      <div className="w-32 h-3 bg-muted animate-pulse" />
                      <div className="w-20 h-2.5 bg-muted animate-pulse" />
                    </div>
                  </div>
                ) : heroTrack ? (
                  <a
                    href={heroTrack.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group min-w-0"
                  >
                    {heroTrack.albumImageUrl && (
                      <div className="relative w-11 h-11 flex-shrink-0 overflow-hidden border border-border bg-muted">
                        <Image
                          src={heroTrack.albumImageUrl}
                          alt={heroTrack.title}
                          fill
                          sizes="44px"
                          className="object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate group-hover:text-[hsl(var(--blueprint))] transition-colors">
                        {heroTrack.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {heroTrack.artist}
                      </p>
                    </div>
                  </a>
                ) : (
                  <p className="text-[11px] text-muted-foreground/75">
                    Nothing playing right now.
                  </p>
                )}
              </div>

              {/* Recent rotation */}
              {covers.length > 0 && (
                <div className="px-3 sm:px-4 py-3 border-t sm:border-t-0 border-border">
                  <span className="font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/70 block mb-2">
                    Recent
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                    {covers.map((track, i) => (
                      <Cover key={`${track.songUrl}-${i}`} track={track} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Artists as a single quiet line of text */}
            {artists.length > 0 && (
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-3 sm:px-4 py-2.5 border-t border-border">
                <span className="font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  Top Artists
                </span>
                <span className="text-[11px] text-muted-foreground/85 min-w-0">
                  {artists.map((artist, i) => (
                    <span key={artist.url}>
                      {i > 0 && <span className="text-muted-foreground/80"> · </span>}
                      <a
                        href={artist.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {artist.name}
                      </a>
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </ViewAnimation>
      </div>
    </Section>
  );
}
