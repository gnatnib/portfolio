"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotMatrixLogo from "@/components/DotMatrixLogo";

const navItems = [
  { name: "About", href: "/about", num: "01" },
  { name: "Experience", href: "/experience", num: "02" },
  { name: "Work", href: "/work", num: "03" },
  { name: "Gallery", href: "/gallery", num: "04" },
  { name: "Contact", href: "/contact", num: "05" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Frosted glass bg */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/40" />

      <div className="relative container mx-auto max-w-5xl">
        <nav className="flex items-center justify-between h-[64px] sm:h-[76px] px-4 sm:px-6">
          {/* Logo */}
          <DotMatrixLogo size={48} />

          {/* Desktop Navigation — numbered items */}
          <div className="hidden sm:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm transition-colors duration-200 group ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-mono-accent text-[10px] text-muted-foreground/40 mr-1 group-hover:text-muted-foreground/60 transition-colors">
                    {item.num}
                  </span>
                  {item.name}
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-px bg-foreground"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 text-sm border border-border/60 rounded-sm hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Available for work
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 relative z-50"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <motion.div
                className="h-px bg-foreground origin-center"
                animate={isMobileMenuOpen ? { rotate: 45, y: 2.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="h-px bg-foreground origin-center"
                animate={isMobileMenuOpen ? { rotate: -45, y: -2.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </nav>

        {/* Mobile Menu — Full-screen overlay with staggered reveal */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="sm:hidden fixed inset-0 top-[64px] bg-background/98 backdrop-blur-lg z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col p-8 pt-12 gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 py-4 text-2xl font-medium transition-colors ${
                        pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      <span className="font-mono-accent text-xs text-muted-foreground/30 w-6">
                        {item.num}
                      </span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 pt-6 border-t border-border/30"
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                    Available for work
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
