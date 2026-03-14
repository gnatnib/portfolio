import { NextResponse } from "next/server";

const GITHUB_API_BASE = "https://api.github.com";
const DAY_MS = 24 * 60 * 60 * 1000;

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ContributionDay {
  date: string;
  count: number;
  level: number;
  tooltip: string;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface GitHubUserResponse {
  html_url?: string;
  public_repos?: number;
  followers?: number;
}

interface GitHubPushCommit {
  sha?: string;
  message?: string;
}

interface GitHubEvent {
  type?: string;
  created_at?: string;
  repo?: {
    name?: string;
  };
  payload?: {
    commits?: GitHubPushCommit[];
  };
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function startOfWeek(date: Date) {
  const next = parseDate(formatDate(date));
  next.setUTCDate(next.getUTCDate() - next.getUTCDay());
  return next;
}

function endOfWeek(date: Date) {
  const next = startOfWeek(date);
  next.setUTCDate(next.getUTCDate() + 6);
  return next;
}

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getGitHubHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function extractAttribute(source: string, attribute: string) {
  const match = source.match(new RegExp(`${attribute}="([^"]*)"`));
  return match?.[1] ?? "";
}

async function fetchContributionWeeks(username: string, year?: string) {
  let to = formatDate(new Date());
  let from = "";
  
  if (year) {
    const currentYear = new Date().getUTCFullYear().toString();
    if (year === currentYear) {
      const fromDate = new Date(`${year}-01-01T00:00:00Z`);
      from = formatDate(fromDate);
    } else {
      from = `${year}-01-01`;
      to = `${year}-12-31`;
    }
  } else {
    const fromDate = new Date();
    fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
    from = formatDate(fromDate);
  }

  const response = await fetch(
    `https://github.com/users/${username}/contributions?from=${from}&to=${to}`,
    {
      headers: {
        "User-Agent": "portfolio-site",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub contributions request failed: ${response.status}`);
  }

  const html = await response.text();

  // GitHub now uses <td> elements instead of <rect> SVG elements.
  // Each <td> has data-date and data-level attributes.
  // The contribution count is inside a <tool-tip> child element.
  const cells = html.match(/<td[^>]*data-date="[^"]+"[^>]*>[\s\S]*?<\/td>/g) ?? [];
  const tooltips = html.match(/<tool-tip[^>]*for="[^"]*"[^>]*>([^<]*)<\/tool-tip>/g) ?? [];
  const tooltipMap = new Map<string, string>();

  for (const ttip of tooltips) {
    const idMatch = ttip.match(/for="([^"]+)"/);
    const textMatch = ttip.match(/>([^<]+)<\/tool-tip>/);
    if (idMatch && textMatch) {
      tooltipMap.set(idMatch[1], textMatch[1].trim());
    }
  }

  const contributionsByDate = new Map<string, ContributionDay>();

  for (const cell of cells) {
    const date = extractAttribute(cell, "data-date");
    if (!date) continue;

    const id = extractAttribute(cell, "id");
    const level = Number.parseInt(extractAttribute(cell, "data-level") || "0", 10);
    let count = 0;
    let tooltip = "No contributions";

    if (id && tooltipMap.has(id)) {
      tooltip = tooltipMap.get(id) || "";
      const countMatch = tooltip.match(/(\d+)\s+contribution/);
      if (countMatch) {
        count = Number.parseInt(countMatch[1], 10);
      }
    } else if (level > 0) {
      count = level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 6 : 10;
      tooltip = `${count} contributions`;
    }

    if (tooltip === "No contributions" || tooltip.startsWith("0 ")) {
      tooltip = `No contributions on ${date}`;
    }

    contributionsByDate.set(date, { date, count, level, tooltip });
  }

  const firstDay = startOfWeek(parseDate(from));
  const lastDay = endOfWeek(parseDate(to));
  const weeks: ContributionWeek[] = [];
  let cursor = new Date(firstDay);

  while (cursor <= lastDay) {
    const days: ContributionDay[] = [];

    for (let index = 0; index < 7; index += 1) {
      const date = formatDate(cursor);
      days.push(
        contributionsByDate.get(date) || {
          date,
          count: 0,
          level: 0,
          tooltip: `No contributions on ${date}`
        }
      );
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    weeks.push({ days });
  }

  return {
    from,
    to,
    days: weeks.flatMap((week) => week.days),
    weeks,
  };
}

function calculateStreaks(days: ContributionDay[]) {
  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of days) {
    if (day.count > 0) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
      continue;
    }

    runningStreak = 0;
  }

  let lastActiveIndex = -1;

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count > 0) {
      lastActiveIndex = index;
      break;
    }
  }

  if (lastActiveIndex === -1) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const today = parseDate(formatDate(new Date()));
  const lastActiveDate = parseDate(days[lastActiveIndex].date);
  const daysSinceLastContribution = Math.floor(
    (today.getTime() - lastActiveDate.getTime()) / DAY_MS
  );

  let currentStreak = 0;

  if (daysSinceLastContribution <= 1) {
    for (let index = lastActiveIndex; index >= 0; index -= 1) {
      if (days[index].count === 0) {
        break;
      }

      currentStreak += 1;
    }
  }

  return { currentStreak, longestStreak };
}

function normalizeCommitMessage(message: string) {
  return message.split("\n")[0].trim();
}

async function fetchRecentCommits(username: string) {
  const events = await fetchJson<GitHubEvent[]>(
    `${GITHUB_API_BASE}/users/${username}/events/public?per_page=100`
  );
  const commits: Array<{
    sha: string;
    shortSha: string;
    message: string;
    repo: string;
    url: string;
    pushedAt: string;
  }> = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (event.type !== "PushEvent" || !event.repo?.name || !event.created_at) {
      continue;
    }

    for (const commit of event.payload?.commits ?? []) {
      if (!commit.sha || !commit.message || seen.has(commit.sha)) {
        continue;
      }

      seen.add(commit.sha);

      commits.push({
        sha: commit.sha,
        shortSha: commit.sha.slice(0, 7),
        message: normalizeCommitMessage(commit.message),
        repo: event.repo.name,
        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
        pushedAt: event.created_at,
      });

      if (commits.length >= 6) {
        return commits;
      }
    }
  }

  return commits;
}

export async function GET(request: Request) {
  const username = process.env.GITHUB_USERNAME || "gnatnib";
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  try {
    const [{ from, to, days, weeks }, user, recentCommits] = await Promise.all([
      fetchContributionWeeks(username, year || undefined),
      fetchJson<GitHubUserResponse>(`${GITHUB_API_BASE}/users/${username}`),
      fetchRecentCommits(username),
    ]);
    const requestedDays = days.filter((day) => day.date >= from && day.date <= to);

    const totalContributions = requestedDays.reduce((sum, day) => sum + day.count, 0);
    const activeDays = requestedDays.filter((day) => day.count > 0).length;
    const last7DaysContributions = requestedDays
      .slice(-7)
      .reduce((sum, day) => sum + day.count, 0);
    const { currentStreak, longestStreak } = calculateStreaks(requestedDays);

    return NextResponse.json(
      {
        username,
        profileUrl: user.html_url || `https://github.com/${username}`,
        publicRepos: user.public_repos || 0,
        followers: user.followers || 0,
        totalContributions,
        activeDays,
        currentStreak,
        longestStreak,
        last7DaysContributions,
        range: { from, to },
        weeks,
        recentCommits,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub API error";
    console.error("GitHub activity route error:", message);

    return NextResponse.json(
      {
        username,
        profileUrl: `https://github.com/${username}`,
        publicRepos: 0,
        followers: 0,
        totalContributions: 0,
        activeDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        last7DaysContributions: 0,
        range: {
          from: formatDate(new Date(Date.now() - 365 * DAY_MS)),
          to: formatDate(new Date()),
        },
        weeks: [],
        recentCommits: [],
        updatedAt: new Date().toISOString(),
        error: message,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
