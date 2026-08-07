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
const GRID_GAP = 3;
/* The cell size flexes to fill the card on wide screens and bottoms out at
   MIN_CELL on narrow ones, where the graph scrolls horizontally instead. */
const MIN_CELL = 10;
const MAX_CELL = 15;
const LEFT_PAD = 28; // space for day labels
const TOP_PAD = 18;  // space for month labels
/* A month label is ~22px wide; don't draw one that would collide with the
   previous. A partial leading week (e.g. Dec 29–31 before Jan 1) used to
   render "Dec" one column before "Jan", printing as "DecJan". */
const MIN_LABEL_COLUMNS = 3;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* ── Contribution scale ────────────────────────── */
/* GitHub's own dark-theme ramp — the opacity-based ramp washed out
   to near-invisible against the dark background. */
const LEVEL_FILLS = [
  "hsl(220 10% 14%)", // 0 — empty
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

function getLevelFill(level: number): string {
  return LEVEL_FILLS[Math.max(0, Math.min(level, 4))];
}

/* Legend fills for the footer */
const LEGEND_FILLS = LEVEL_FILLS;

/* ── Tooltip state ─────────────────────────────── */

interface TooltipInfo {
  text: string;
  triggerRect: DOMRect;
}

/* ── SVG Contribution Graph ────────────────────── */

function ContributionGraph({
  weeks,
  cell,
  onHover,
  onLeave,
}: {
  weeks: ContributionWeek[];
  cell: number;
  onHover: (info: TooltipInfo) => void;
  onLeave: () => void;
}) {
  const step = cell + GRID_GAP;

  /* Compute month label positions */
  const monthPositions = useMemo(() => {
    /* The grid starts on the Sunday of the week containing Jan 1, so its first
       column usually holds a few days from the previous December. Labelling
       that column printed a leading "Dec" and pushed "Jan" out as a collision.
       Only label months belonging to the year this grid is actually showing. */
    const yearCounts = new Map<number, number>();
    for (const week of weeks) {
      for (const day of week.days) {
        const y = Number(day.date.slice(0, 4));
        yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
      }
    }
    let gridYear = -1;
    let best = -1;
    yearCounts.forEach((count, y) => {
      if (count > best) {
        best = count;
        gridYear = y;
      }
    });

    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    let lastLabelCol = -Infinity;

    for (let wi = 0; wi < weeks.length; wi++) {
      const firstDay = weeks[wi].days[0];
      if (!firstDay) continue;
      const date = new Date(firstDay.date + "T00:00:00Z");
      const month = date.getUTCMonth();
      if (month === lastMonth) continue;
      lastMonth = month;
      if (date.getUTCFullYear() !== gridYear) continue;
      // Drop labels that would overlap the one before it
      if (wi - lastLabelCol < MIN_LABEL_COLUMNS) continue;
      positions.push({ label: MONTH_LABELS[month], col: wi });
      lastLabelCol = wi;
    }

    return positions;
  }, [weeks]);

  const svgWidth = LEFT_PAD + weeks.length * step + 4;
  const svgHeight = TOP_PAD + 7 * step + 4;

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
            x={m.col * step}
            y={-6}
            className="fill-muted-foreground/75"
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
            y={[1, 3, 5][i] * step + cell - 1}
            className="fill-muted-foreground/70"
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
              x={wi * step}
              y={di * step}
              width={cell}
              height={cell}
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
  /* Mutable: assigned by the attachTrack callback ref below */
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [available, setAvailable] = useState(0);

  /* Track the usable track width so the cells can grow to fill the card.
     Attached via a callback ref because the loading state renders a different
     element — a mount-time effect ran while the real container didn't exist
     yet and never re-attached, pinning the cells at their minimum size. */
  const observerRef = useRef<ResizeObserver | null>(null);
  const attachTrack = useCallback((el: HTMLDivElement | null) => {
    scrollRef.current = el;
    observerRef.current?.disconnect();
    if (!el) return;
    setAvailable(el.clientWidth);
    const ro = new ResizeObserver(() => setAvailable(el.clientWidth));
    ro.observe(el);
    observerRef.current = ro;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

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
        /* Always scope to the selected year. Omitting it made the API fall back
           to a rolling 12-month window, so "2026" actually rendered Aug 2025 →
           Aug 2026 — five leading months from the previous year, and a total
           that didn't match the year shown in the footer. */
        const url = `/api/github?year=${selectedYear}`;

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

  /* Render the full calendar year — a stable 53-week grid. Trimming trailing
     empty weeks made the graph change width through the year and shrink into a
     small block adrift in a wide card. */
  const heatmapWeeks = useMemo(() => data?.weeks ?? [], [data]);

  /* Grow the cells to fill the card, clamped so they stay square-ish and
     legible. Below MIN_CELL the track overflows and scrolls instead. */
  const cell = useMemo(() => {
    if (!available || !heatmapWeeks.length) return MIN_CELL;
    const perWeek = (available - LEFT_PAD - 4) / heatmapWeeks.length;
    return Math.max(MIN_CELL, Math.min(MAX_CELL, Math.floor(perWeek - GRID_GAP)));
  }, [available, heatmapWeeks.length]);

  /* When the graph overflows (mobile), open on the most recent *activity*
     rather than the far right edge — scrolling fully right lands on a run of
     empty future weeks, which reads as "no contributions". */
  useEffect(() => {
    if (!scrollRef.current || !heatmapWeeks.length) return;
    const el = scrollRef.current;
    if (el.scrollWidth <= el.clientWidth) return;

    let lastActive = -1;
    for (let i = heatmapWeeks.length - 1; i >= 0; i--) {
      if (heatmapWeeks[i].days.some((d) => d.count > 0)) {
        lastActive = i;
        break;
      }
    }

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (lastActive === -1) {
      el.scrollLeft = maxScroll;
      return;
    }

    // Put the last active week near the right edge, clamped to the track.
    const target =
      LEFT_PAD + (lastActive + 1) * (cell + GRID_GAP) - el.clientWidth + 16;
    el.scrollLeft = Math.max(0, Math.min(target, maxScroll));
  }, [heatmapWeeks, cell]);

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
          <span className="font-mono-accent text-[9px] uppercase tracking-widest text-muted-foreground/85">
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
            <div className="flex items-center gap-1.5 font-mono-accent text-[8px] uppercase tracking-widest text-muted-foreground/70">
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

      {/* Contribution Graph — centered, scrollable on mobile */}
      {/* `justify-center` on an overflowing scroll container puts the start of
          the content at a negative offset that scrollLeft can never reach, so
          the earlier months were unreachable on mobile. `w-fit mx-auto` on the
          child centres it while it fits and left-aligns it once it overflows,
          keeping the whole year scrollable. */}
      <div
        ref={attachTrack}
        className="overflow-x-auto scrollbar-hide px-2 pt-1 pb-1 sm:px-3"
      >
        {heatmapWeeks.length > 0 ? (
          <div className="w-fit mx-auto">
            <ContributionGraph
              weeks={heatmapWeeks}
              cell={cell}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          </div>
        ) : (
          /* No weeks means the API returned nothing (e.g. an expired token) —
             show a message rather than collapsing into an empty stub */
          <p className="font-mono-accent text-[10px] text-muted-foreground/75 py-10 text-center">
            Contribution data unavailable
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 sm:px-4 sm:pb-4">
        <span className="font-mono-accent text-[8px] uppercase tracking-widest text-muted-foreground/75">
          @{data?.username || "gnatnib"}
        </span>

        <div className="flex items-center gap-2">
          <span className="font-mono-accent text-[8px] text-muted-foreground/70">
            Less
          </span>
          <div className="flex items-center gap-[2px]">
            {LEGEND_FILLS.map((fill, i) => (
              <div
                key={i}
                className="rounded-[2px]"
                style={{ width: 8, height: 8, backgroundColor: fill }}
              />
            ))}
          </div>
          <span className="font-mono-accent text-[8px] text-muted-foreground/70">
            More
          </span>

          <span className="font-mono-accent text-[8px] tracking-widest text-muted-foreground/75 ml-2">
            {data?.totalContributions || 0} total in {selectedYear}
          </span>
        </div>
      </div>

      {/* Portal-based tooltip */}
      <Tooltip info={tooltipInfo} />
    </div>
  );
}
