import type { APIRoute } from "astro";

/* Listening activity for the Spotify strip in the footer. Rendered on demand and cached at
   the edge for 30 seconds (stale for 5 minutes), so Spotify sees a few calls a
   minute at most however many people have the page open.

   Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN. The
   refresh token must carry user-read-currently-playing,
   user-read-recently-played and user-top-read. */
export const prerender = false;

const API = "https://api.spotify.com/v1/me";

type Image = { url: string; width: number | null };
type Track = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: Image[] };
  external_urls: { spotify: string };
};

// Spotify lists covers largest first; pick the smallest one at least `min` px wide.
const cover = (images: Image[] | undefined, min: number) =>
  [...(images ?? [])].reverse().find((i) => (i.width ?? 0) >= min)?.url ?? images?.[0]?.url ?? "";

const track = (t: Track) => ({
  title: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  album: t.album.name,
  image: cover(t.album.images, 128),
  url: t.external_urls.spotify,
});

async function accessToken() {
  const id = import.meta.env.SPOTIFY_CLIENT_ID;
  const secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
  const refresh = import.meta.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) throw new Error("Spotify credentials are not configured");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
  });
  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status} ${await res.text()}`);
  const data: unknown = await res.json();
  if (!data || typeof data !== "object" || !("access_token" in data) || typeof data.access_token !== "string") {
    throw new Error("Spotify token response had no access_token");
  }
  return data.access_token;
}

async function get<T>(path: string, token: string): Promise<T | null> {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  // 204 is Spotify's "nothing playing": a real, empty answer.
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`Spotify ${path} ${res.status}`);
  return (await res.json()) as T;
}

export const GET: APIRoute = async () => {
  try {
    const token = await accessToken();
    // Now playing is the core; the lists are extras that may fail on their own.
    const [now, recent, topTracks] = await Promise.all([
      get<{ is_playing: boolean; item: Track | null }>("/player/currently-playing", token),
      get<{ items: { track: Track; played_at: string }[] }>("/player/recently-played?limit=1", token).catch(() => null),
      get<{ items: Track[] }>("/top/tracks?limit=8&time_range=short_term", token).catch(() => null),
    ]);

    const last = recent?.items[0];
    const body = {
      playing: Boolean(now?.is_playing && now.item),
      current: now?.item ? track(now.item) : last ? { ...track(last.track), playedAt: last.played_at } : null,
      topTracks: (topTracks?.items ?? []).map(track),
    };
    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("api/spotify:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
};
