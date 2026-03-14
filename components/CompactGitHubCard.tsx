"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Github, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────── */

interface ContributionDay {
  date: string;
  count: number;
  level: number;
  tooltip: string;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface GitHubActivityData {
  username: string;
  totalContributions: number;
  weeks: ContributionWeek[];
}

/* ── Constants ─────────────────────────────────── */

const REFRESH_INTERVAL = 2 * 60 * 1000;
const GRID_SIZE = 10;
const GRID_GAP = 3;
const CELL_STEP = GRID_SIZE + GRID_GAP; // 13
const LEFT_PAD = 28; // space for day labels
const TOP_PAD = 18;  // space for month labels

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* ── GitHub-style green palette (distinct shades) ── */
const LEVEL_FILLS = [
  "hsl(var(--border) / 0.3)",  // 0 — empty
  "#9be9a8",                    // 1 — light green
  "#40c463",                    // 2 — medium green
  "#30a14e",                    // 3 — dark green
  "#216e39",                    // 4 — darkest green
];

function getLevelFill(level: number): string {
  return LEVEL_FILLS[Math.min(Math.max(level, 0), 4)];
}

/* ── Tooltip state ─────────────────────────────── */

interface TooltipInfo {
  text: string;
  triggerRect: DOMRect;
}

/* ── Trim trailing empty weeks ──────────────────── */
/* Removes weeks at the end that have zero contributions
   (so the graph doesn't show a long empty tail for future weeks) */
function trimTrailingEmptyWeeks(weeks: ContributionWeek[]): ContributionWeek[] {
  let lastNonEmpty = weeks.length - 1;
  while (lastNonEmpty >= 0) {
    const week = weeks[lastNonEmpty];
    if (week.days.some((d) => d.count > 0)) break;
    lastNonEmpty--;
  }
  // Keep 1 extra empty week after the last non-empty one for visual padding
  return weeks.slice(0, Math.min(lastNonEmpty + 2, weeks.length));
}

/* ── SVG Contribution Graph ────────────────────── */

function ContributionGraph({
  weeks,
  onHover,
  onLeave,
}: {
  weeks: ContributionWeek[];
  onHover: (info: TooltipInfo) => void;
  onLeave: () => void;
}) {
  /* Compute month label positions */
  const monthPositions = useMemo(() => {
    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let wi = 0; wi < weeks.length; wi++) {
      const firstDay = weeks[wi].days[0];
      if (!firstDay) continue;
      const month = new Date(firstDay.date + "T00:00:00Z").getUTCMonth();
      if (month !== lastMonth) {
        positions.push({ label: MONTH_LABELS[month], col: wi });
        lastMonth = month;
      }
    }

    return positions;
  }, [weeks]);

  const svgWidth = LEFT_PAD + weeks.length * CELL_STEP + 4;
  const svgHeight = TOP_PAD + 7 * CELL_STEP + 4;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{ display: "block" }}
      className="select-none"
    >
      <g transform={`translate(${LEFT_PAD}, ${TOP_PAD})`}>
        {/* Month labels */}
        {monthPositions.map((m, i) => (
          <text
            key={`month-${i}`}
            x={m.col * CELL_STEP}
            y={-6}
            className="fill-muted-foreground/50"
            style={{
              fontSize: "9px",
              fontFamily:
                "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            }}
          >
            {m.label}
          </text>
        ))}

        {/* Day labels */}
        {["Mon", "Wed", "Fri"].map((label, i) => (
          <text
            key={label}
            x={-LEFT_PAD + 2}
            y={[1, 3, 5][i] * CELL_STEP + GRID_SIZE - 1}
            className="fill-muted-foreground/45"
            style={{
              fontSize: "9px",
              fontFamily:
                "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            }}
          >
            {label}
          </text>
        ))}

        {/* Heatmap cells */}
        {weeks.map((week, wi) =>
          week.days.map((day, di) => (
            <rect
              key={day.date}
              x={wi * CELL_STEP}
              y={di * CELL_STEP}
              width={GRID_SIZE}
              height={GRID_SIZE}
              rx={2}
              fill={getLevelFill(day.level)}
              className="cursor-pointer"
              style={{ outline: "none" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as SVGRectElement;
                el.setAttribute("stroke", "hsl(var(--foreground) / 0.5)");
                el.setAttribute("stroke-width", "1.5");
                const rect = el.getBoundingClientRect();
                onHover({
                  text:
                    day.tooltip ||
                    `${day.count} contributions on ${day.date}`,
                  triggerRect: rect,
                });
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as SVGRectElement;
                el.removeAttribute("stroke");
                el.removeAttribute("stroke-width");
                onLeave();
              }}
            />
          ))
        )}
      </g>
    </svg>
  );
}

/* ── Portal Tooltip ────────────────────────────── */

function Tooltip({ info }: { info: TooltipInfo | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!info) return;
    const { triggerRect } = info;
    const triggerCenter = triggerRect.left + triggerRect.width / 2;

    requestAnimationFrame(() => {
      if (!ref.current) return;
      const tooltipW = ref.current.offsetWidth;
      const left = Math.min(
        Math.max(8, triggerCenter - tooltipW / 2),
        window.innerWidth - tooltipW - 8
      );
      const top = triggerRect.top + window.scrollY - 10;
      setPos({ left: left + window.scrollX, top });
    });
  }, [info]);

  if (typeof window === "undefined" || !info) return null;

  return createPortal(
    <>
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: pos.left,
          top: pos.top,
          transform: "translateY(-100%)",
          background: "hsl(var(--foreground))",
          color: "hsl(var(--background))",
          fontSize: "11px",
          fontWeight: 500,
          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
          padding: "5px 10px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {info.text}
      </div>
      <div
        style={{
          position: "absolute",
          left:
            info.triggerRect.left +
            info.triggerRect.width / 2 -
            5 +
            window.scrollX,
          top: info.triggerRect.top + window.scrollY - 10,
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid hsl(var(--foreground))",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>,
    document.body
  );
}

/* ── Main Component ────────────────────────────── */

export default function CompactGitHubCard({
  className,
}: {
  className?: string;
}) {
  const [data, setData] = useState<GitHubActivityData | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const years = [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString(),
  ];

  /* ── Fetch ── */
  useEffect(() => {
    let mounted = true;

    async function fetchActivity() {
      try {
        const url =
          selectedYear === currentYear.toString()
            ? "/api/github"
            : `/api/github?year=${selectedYear}`;

        const response = await fetch(url, { cache: "no-store" });
        const json = await response.json();
        if (mounted) setData(json);
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
      }
    }

    setData(null);
    void fetchActivity();

    if (selectedYear === currentYear.toString()) {
      const interval = setInterval(fetchActivity, REFRESH_INTERVAL);
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
    };
  }, [selectedYear, currentYear]);

  /* Trim trailing empty weeks so the graph is shorter */
  const heatmapWeeks = useMemo(
    () => trimTrailingEmptyWeeks(data?.weeks ?? []),
    [data]
  );

  /* Auto‑scroll to the right (latest months) on mobile after data loads */
  useEffect(() => {
    if (!scrollRef.current || !heatmapWeeks.length) return;
    const el = scrollRef.current;
    // Only auto-scroll if content overflows (i.e. on mobile)
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    }
  }, [heatmapWeeks]);

  const handleHover = useCallback(
    (info: TooltipInfo) => setTooltipInfo(info),
    []
  );
  const handleLeave = useCallback(() => setTooltipInfo(null), []);

  /* ── Loading state ── */
  if (!data && !heatmapWeeks.length) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-sm border border-border/60 bg-muted/20 w-full",
          className
        )}
        style={{ height: 140 }}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-sm border border-border/60 bg-background/50 backdrop-blur-sm relative",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-3 pt-3 sm:px-4 sm:pt-4 relative z-10">
        <div className="flex items-center gap-2">
          <Github className="h-3.5 w-3.5 text-foreground/70" />
          <span className="font-mono-accent text-[9px] uppercase tracking-widest text-muted-foreground/60">
            GitHub Pulse
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Year Selector */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none font-mono-accent text-[9px] uppercase tracking-widest bg-muted/30 hover:bg-muted/50 text-foreground border border-border/50 rounded-sm py-0.5 pl-1.5 pr-4 cursor-pointer focus:outline-none transition-colors"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground pointer-events-none" />
          </div>

          {selectedYear === currentYear.toString() && (
            <div className="flex items-center gap-1.5 font-mono-accent text-[8px] uppercase tracking-widest text-muted-foreground/40">
              <motion.span
                className="block h-1 w-1 rounded-full bg-[#1db954]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Live
            </div>
          )}
        </div>
      </div>

      {/* Contribution Graph — centered on desktop, scrollable on mobile */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide px-2 pt-1 pb-1 sm:px-3"
      >
        <div style={{ minWidth: "fit-content", margin: "0 auto", width: "fit-content" }}>
          <ContributionGraph
            weeks={heatmapWeeks}
            onHover={handleHover}
            onLeave={handleLeave}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 sm:px-4 sm:pb-4">
        <span className="font-mono-accent text-[8px] uppercase tracking-widest text-muted-foreground/50">
          @{data?.username || "gnatnib"}
        </span>

        <div className="flex items-center gap-2">
          <span className="font-mono-accent text-[8px] text-muted-foreground/40">
            Less
          </span>
          <div className="flex items-center gap-[2px]">
            {LEVEL_FILLS.map((fill, i) => (
              <div
                key={i}
                className="rounded-[2px]"
                style={{ width: 8, height: 8, backgroundColor: fill }}
              />
            ))}
          </div>
          <span className="font-mono-accent text-[8px] text-muted-foreground/40">
            More
          </span>

          <span className="font-mono-accent text-[8px] tracking-widest text-muted-foreground/50 ml-2">
            {data?.totalContributions || 0} total in {selectedYear}
          </span>
        </div>
      </div>

      {/* Portal-based tooltip */}
      <Tooltip info={tooltipInfo} />
    </div>
  );
}
