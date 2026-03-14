"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Flame, Github, GitCommitHorizontal, Layers3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface RecentCommit {
  sha: string;
  shortSha: string;
  message: string;
  repo: string;
  url: string;
  pushedAt: string;
}

interface GitHubActivityData {
  username: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  totalContributions: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  last7DaysContributions: number;
  weeks: ContributionWeek[];
  recentCommits: RecentCommit[];
  updatedAt: string;
}

interface GitHubActivityCardProps {
  className?: string;
}

const REFRESH_INTERVAL = 2 * 60 * 1000;

const FALLBACK_DATA: GitHubActivityData = {
  username: "gnatnib",
  profileUrl: "https://github.com/gnatnib",
  publicRepos: 0,
  followers: 0,
  totalContributions: 0,
  activeDays: 0,
  currentStreak: 0,
  longestStreak: 0,
  last7DaysContributions: 0,
  weeks: [],
  recentCommits: [],
  updatedAt: new Date(0).toISOString(),
};

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const diffMs = timestamp - Date.now();
  const absSeconds = Math.round(Math.abs(diffMs) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) {
    return rtf.format(Math.round(diffMs / 1000), "second");
  }

  const absMinutes = Math.round(absSeconds / 60);

  if (absMinutes < 60) {
    return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
  }

  const absHours = Math.round(absMinutes / 60);

  if (absHours < 24) {
    return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
  }

  return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
}

function getHeatLevelClass(level: number) {
  if (level >= 4) return "border-foreground/80 bg-foreground/80";
  if (level === 3) return "border-foreground/35 bg-foreground/25";
  if (level === 2) return "border-muted-foreground/20 bg-muted-foreground/15";
  if (level === 1) return "border-muted-foreground/15 bg-muted/80";
  return "border-border/70 bg-background/20";
}

function LoadingCard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {[0, 1, 2].map((value) => (
          <div key={value} className="h-16 animate-pulse rounded-sm border border-border/60 bg-muted/40" />
        ))}
      </div>
      <div className="h-24 animate-pulse rounded-sm border border-border/60 bg-muted/30" />
      <div className="grid gap-2">
        {[0, 1, 2].map((value) => (
          <div key={value} className="h-12 animate-pulse rounded-sm border border-border/60 bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

export default function GitHubActivityCard({ className }: GitHubActivityCardProps) {
  const [data, setData] = useState<GitHubActivityData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchActivity(background = false) {
      if (background) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch("/api/github", { cache: "no-store" });
        const json = (await response.json()) as GitHubActivityData;

        if (mounted) {
          setData(json);
        }
      } catch {
        if (mounted) {
          setData((current) => current ?? FALLBACK_DATA);
        }
      } finally {
        if (mounted) {
          setIsRefreshing(false);
        }
      }
    }

    void fetchActivity();

    const interval = setInterval(() => {
      void fetchActivity(true);
    }, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const heatmapWeeks = useMemo(() => {
    return data?.weeks.slice(-18) ?? [];
  }, [data]);

  const commits = useMemo(() => {
    return data?.recentCommits.slice(0, 3) ?? [];
  }, [data]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border border-border/60 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Github className="h-4 w-4 text-foreground/80" />
              <span className="font-mono-accent text-[11px] uppercase tracking-widest text-muted-foreground/55">
                Live GitHub Activity
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Commit pulse from <span className="text-foreground">@{data?.username || "gnatnib"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/45">
            <motion.span
              className="block h-2 w-2 rounded-full bg-foreground"
              animate={{ opacity: isRefreshing ? [0.35, 1, 0.35] : 1 }}
              transition={{ duration: 1.1, repeat: isRefreshing ? Infinity : 0, ease: "easeInOut" }}
            />
            {data ? "Synced" : "Loading"}
          </div>
        </div>

        {data === null ? (
          <LoadingCard />
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-sm border border-border/60 bg-background/75 p-3">
                <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/45">
                  Last Year
                </p>
                <p className="text-lg font-medium tracking-tight sm:text-xl">{data.totalContributions}</p>
                <p className="text-[11px] text-muted-foreground/55">contributions</p>
              </div>

              <div className="rounded-sm border border-border/60 bg-background/75 p-3">
                <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/45">
                  Streak
                </p>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-foreground" />
                  <p className="text-lg font-medium tracking-tight sm:text-xl">{data.currentStreak}</p>
                </div>
                <p className="text-[11px] text-muted-foreground/55">days active</p>
              </div>

              <div className="rounded-sm border border-border/60 bg-background/75 p-3">
                <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/45">
                  Last 7 Days
                </p>
                <div className="flex items-center gap-2">
                  <GitCommitHorizontal className="h-4 w-4 text-foreground/70" />
                  <p className="text-lg font-medium tracking-tight sm:text-xl">{data.last7DaysContributions}</p>
                </div>
                <p className="text-[11px] text-muted-foreground/55">commit activity</p>
              </div>
            </div>

            <div className="rounded-sm border border-border/60 bg-gradient-to-br from-background via-background to-muted/40 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/45">
                  Contribution Map
                </p>
                <p className="text-[11px] text-muted-foreground/55">{data.activeDays} active days</p>
              </div>

              <div className="scrollbar-hide overflow-x-auto pb-1">
                <div className="inline-grid min-w-max grid-flow-col gap-1">
                  {heatmapWeeks.map((week, weekIndex) => (
                    <div key={`${weekIndex}-${week.days[0]?.date || "week"}`} className="grid grid-rows-7 gap-1">
                      {week.days.map((day) => (
                        <div
                          key={day.date}
                          className={cn("h-2.5 w-2.5 rounded-sm border transition-colors", getHeatLevelClass(day.level))}
                          title={`${day.count} contributions on ${day.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/40">
                <span>{data.publicRepos} public repos</span>
                <span>best streak {data.longestStreak}d</span>
              </div>
            </div>

            <div className="rounded-sm border border-border/60 bg-background/75 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-foreground/70" />
                  <p className="font-mono-accent text-[10px] uppercase tracking-widest text-muted-foreground/45">
                    Recent Pushes
                  </p>
                </div>

                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  View profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="grid gap-2">
                {commits.length > 0 ? (
                  commits.map((commit) => (
                    <a
                      key={commit.sha}
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-3 rounded-sm border border-border/50 bg-background/80 px-3 py-2.5 transition-colors hover:border-foreground/20"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground/90 transition-colors group-hover:text-foreground">
                          {commit.message}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground/55">
                          <span className="truncate font-mono-accent">{commit.repo}</span>
                          <span>/{commit.shortSha}</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[11px] text-muted-foreground/45">
                        {formatRelativeTime(commit.pushedAt)}
                      </span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground/55">No recent public push events detected yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
