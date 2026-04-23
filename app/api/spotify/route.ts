import { NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=8";
const SPOTIFY_TOP_TRACKS_URL = "https://api.spotify.com/v1/me/top/tracks?limit=8&time_range=short_term";
const SPOTIFY_TOP_ARTISTS_URL = "https://api.spotify.com/v1/me/top/artists?limit=8&time_range=short_term";
const SPOTIFY_PLAYLISTS_URL = "https://api.spotify.com/v1/me/playlists?limit=6";

// Force dynamic — never cache this route on Vercel
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("Missing Spotify env vars:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRefreshToken: !!refreshToken,
    });
    throw new Error("Missing Spotify credentials in env");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Spotify token error:", response.status, errText);
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  return response.json();
}

async function safeFetch(url: string, token: string) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 204) return null;
    if (!res.ok) {
      console.error(`Spotify API error for ${url}:`, res.status);
      return null;
    }
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err);
    return null;
  }
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    // Fetch all data in parallel — each call is independent
    const [nowPlayingData, recentlyPlayedData, topTracksData, topArtistsData, playlistsData] =
      await Promise.all([
        safeFetch(SPOTIFY_NOW_PLAYING_URL, access_token),
        safeFetch(SPOTIFY_RECENTLY_PLAYED_URL, access_token),
        safeFetch(SPOTIFY_TOP_TRACKS_URL, access_token),
        safeFetch(SPOTIFY_TOP_ARTISTS_URL, access_token),
        safeFetch(SPOTIFY_PLAYLISTS_URL, access_token),
      ]);

    // Currently playing
    let currentTrack = null;
    let isPlaying = false;

    if (nowPlayingData?.item) {
      isPlaying = nowPlayingData.is_playing === true;
      const item = nowPlayingData.item;
      currentTrack = {
        title: item.name,
        artist: item.artists?.map((a: any) => a.name).join(", ") || "",
        album: item.album?.name || "",
        albumImageUrl: item.album?.images?.[0]?.url || "",
        songUrl: item.external_urls?.spotify || "",
      };
    }

    // Recently played (individual tracks)
    const recentlyPlayed = (recentlyPlayedData?.items || []).map((item: any) => ({
      title: item.track?.name || "",
      artist: item.track?.artists?.map((a: any) => a.name).join(", ") || "",
      albumImageUrl: item.track?.album?.images?.[1]?.url || item.track?.album?.images?.[0]?.url || "",
      songUrl: item.track?.external_urls?.spotify || "",
    }));

    // Fallback: if nothing currently playing, show first recently played as "last played"
    let lastPlayed = null;
    if (!currentTrack && recentlyPlayed.length > 0) {
      const first = recentlyPlayed[0];
      lastPlayed = {
        title: first.title,
        artist: first.artist,
        album: "",
        albumImageUrl: first.albumImageUrl,
        songUrl: first.songUrl,
      };
    }

    // Top tracks
    const topTracks = (topTracksData?.items || []).map((track: any) => ({
      title: track.name || "",
      artist: track.artists?.map((a: any) => a.name).join(", ") || "",
      albumImageUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || "",
      songUrl: track.external_urls?.spotify || "",
    }));

    // Top artists
    const topArtists = (topArtistsData?.items || []).map((artist: any) => ({
      name: artist.name || "",
      genres: (artist.genres || []).slice(0, 2),
      imageUrl: artist.images?.[1]?.url || artist.images?.[0]?.url || "",
      url: artist.external_urls?.spotify || "",
    }));

    // Playlists
    const playlists = (playlistsData?.items || [])
      .filter((pl: any) => pl != null)
      .map((pl: any) => ({
        name: pl.name || "",
        imageUrl: pl.images?.[0]?.url || "",
        trackCount: pl.tracks?.total || 0,
        url: pl.external_urls?.spotify || "",
      }));

    return NextResponse.json({
      isPlaying,
      currentTrack,
      lastPlayed,
      recentlyPlayed,
      topTracks,
      topArtists,
      playlists,
    });
  } catch (err: any) {
    console.error("Spotify API handler error:", err.message);
    return NextResponse.json(
      {
        isPlaying: false,
        currentTrack: null,
        lastPlayed: null,
        recentlyPlayed: [],
        topTracks: [],
        topArtists: [],
        playlists: [],
        error: err.message,
      },
      { status: 200 } // Return 200 even on error so the client can still parse it
    );
  }
}
