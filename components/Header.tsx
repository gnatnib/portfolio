"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotMatrixLogo from "@/components/DotMatrixLogo";

const navItems = [
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Work", href: "/work" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* The active-link underline is one element that never unmounts, positioned by
     measurement. A framer `layoutId` was used here before, but on a route
     change the old link unmounts while the new one mounts, so the shared-layout
     projection measured stale document-relative coordinates and the underline
     visibly flew in from below the header before snapping into place. */
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const [indicatorReady, setIndicatorReady] = useState(false);

  const measureIndicator = useCallback(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLAnchorElement>('[data-active="true"]');
    if (!nav || !active) {
      setIndicator(null);
      return;
    }
    const navBox = nav.getBoundingClientRect();
    const linkBox = active.getBoundingClientRect();
    setIndicator({
      left: linkBox.left - navBox.left,
      width: linkBox.width,
    });
  }, []);

  useEffect(() => {
    measureIndicator();
    /* Fonts land after first paint and shift link widths — re-measure once settled */
    const raf = requestAnimationFrame(measureIndicator);
    document.fonts?.ready.then(measureIndicator).catch(() => {});
    window.addEventListener("resize", measureIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureIndicator);
    };
  }, [pathname, measureIndicator]);

  /* Skip the transition on the very first placement so it doesn't slide in from x=0 */
  useEffect(() => {
    if (indicator && !indicatorReady) {
      const id = requestAnimationFrame(() => setIndicatorReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, [indicator, indicatorReady]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Stop the page behind the mobile menu from scrolling under it */
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  /* A resize past the mobile breakpoint should not leave the menu stuck open */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => mq.matches && setIsMobileMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-colors duration-300 border-b ${
          scrolled
            ? "border-border bg-background/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* max-w-5xl matches the Section wrapper, so the logo and status sit
            inside the same vertical guide lines as the page content. */}
        <nav className="container mx-auto max-w-5xl h-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center justify-start min-w-0">
            <DotMatrixLogo size={32} />
          </div>

          {/* Desktop navigation — centre track */}
          <div ref={navRef} className="relative hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-active={isActive}
                  className={`relative px-3 py-2 text-[13px] whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {indicator && (
              <span
                aria-hidden
                className="absolute bottom-0 h-px bg-foreground"
                style={{
                  left: indicator.left + 12,
                  width: Math.max(0, indicator.width - 24),
                  transition: indicatorReady
                    ? "left 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "none",
                }}
              />
            )}
          </div>

          {/* Spacer keeps the centre track centred on mobile, where the nav is hidden */}
          <div className="sm:hidden" />

          <div className="flex items-center justify-end min-w-0">
            {/* Availability status */}
            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-2 text-[13px] whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              Available
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 -mr-2 relative z-50"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-[18px] flex flex-col gap-[5px]">
                <motion.div
                  className="h-px bg-foreground origin-center"
                  animate={isMobileMenuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="h-px bg-foreground origin-center"
                  animate={isMobileMenuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="sm:hidden fixed inset-0 top-14 bg-background/97 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col px-6 pt-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-baseline gap-4 py-4 border-b border-border/60 transition-colors ${
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="font-mono-accent text-[10px] text-muted-foreground/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl font-medium tracking-tight">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <span className="inline-flex items-center gap-2 font-mono-accent text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-[hsl(var(--blueprint))] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 bg-[hsl(var(--blueprint))]" />
                  </span>
                  Available for work
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
