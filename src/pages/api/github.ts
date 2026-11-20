import type { APIRoute } from "astro";

/* Live GitHub activity for the Activity section. Rendered on demand and
   cached at Vercel's edge for an hour, so GitHub sees at most a few requests
   an hour no matter how many people open the page. */
export const prerender = false;

const USER = import.meta.env.GITHUB_USERNAME || "gnatnib";
const DAY_MS = 86_400_000;

type Day = { date: string; count: number; level: number };

const iso = (d: Date) => d.toISOString().slice(0, 10);

async function githubJson<T>(url: string): Promise<T> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "gnatnib.site" };
  let res = await fetch(url, { headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers });
  // These endpoints are public; a stale token must not take the widget down.
  if (res.status === 401 && token) res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

async function contributions(): Promise<Day[]> {
  const to = new Date();
  const from = new Date(to.getTime() - 364 * DAY_MS);
  // Align to Sunday so the grid starts on a full week column.
  from.setUTCDate(from.getUTCDate() - from.getUTCDay());

  const res = await fetch(`https://github.com/users/${USER}/contributions?from=${iso(from)}&to=${iso(to)}`, {
    headers: { "User-Agent": "gnatnib.site" },
  });
  if (!res.ok) throw new Error(`GitHub contributions ${res.status}`);
  const html = await res.text();

  const tips = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/(\d+)\s+contribution/);
    tips.set(m[1], n ? Number(n[1]) : 0);
  }

  const byDate = new Map<string, Day>();
  for (const m of html.matchAll(/<td[^>]*data-date="[^"]+"[^>]*>/g)) {
    const cell = m[0];
    const date = cell.match(/data-date="([^"]+)"/)![1];
    const level = Number(cell.match(/data-level="(\d)"/)?.[1] ?? 0);
    const id = cell.match(/id="([^"]+)"/)?.[1];
    byDate.set(date, { date, level, count: (id && tips.get(id)) || 0 });
  }

  const days: Day[] = [];
  for (let t = from.getTime(); t <= to.getTime(); t += DAY_MS) {
    const date = iso(new Date(t));
    days.push(byDate.get(date) ?? { date, count: 0, level: 0 });
  }
  return days;
}

function streaks(days: Day[]) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Today without a contribution yet should not break the current streak.
  let current = 0;
  let i = days.length - 1;
  if (days[i]?.count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { longest, current };
}

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  html_url: string;
  fork: boolean;
};

// The public events feed is often empty for this account, so latest activity
// comes from the repositories list sorted by last push instead.
async function recentRepos() {
  const repos = await githubJson<Repo[]>(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=12&type=owner`);
  return repos
    .filter((r) => !r.fork)
    .slice(0, 6)
    .map((r) => ({ name: r.name, description: r.description, language: r.language, url: r.html_url, at: r.pushed_at }));
}

export const GET: APIRoute = async () => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  };
  try {
    // The heatmap is required; profile and repo list are extras that may fail alone.
    const [days, user, recent] = await Promise.all([
      contributions(),
      githubJson<{ public_repos?: number }>(`https://api.github.com/users/${USER}`).catch(() => ({})),
      recentRepos().catch(() => []),
    ]);
    const body = {
      user: USER,
      total: days.reduce((n, d) => n + d.count, 0),
      activeDays: days.filter((d) => d.count > 0).length,
      ...streaks(days),
      repos: "public_repos" in user ? user.public_repos : null,
      days,
      recent,
      updatedAt: new Date().toISOString(),
    };
    return new Response(JSON.stringify(body), { headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("api/github:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
};
