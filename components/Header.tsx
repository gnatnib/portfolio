"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotMatrixLogo from "@/components/DotMatrixLogo";

const navItems = [
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Work", href: "/work" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNavHovered, setIsNavHovered] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-center px-4 sm:px-6 pt-3 relative z-50">
        <motion.nav
          ref={navRef}
          className="pointer-events-auto relative w-full sm:w-auto flex items-center h-[52px] rounded-full overflow-hidden"
          initial={{ y: -20, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-full nav-gradient-border" />

          {/* Glass background */}
          <div className="absolute inset-[1px] rounded-full bg-background/75 backdrop-blur-2xl" />

          {/* Mouse spotlight glow */}
          <div
            className="absolute pointer-events-none transition-opacity duration-300 z-[2]"
            style={{
              left: mousePos.x - 75,
              top: mousePos.y - 75,
              width: 150,
              height: 150,
              background: "radial-gradient(circle, hsl(var(--foreground) / 0.04), transparent 70%)",
              opacity: isNavHovered ? 1 : 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center w-full px-1.5 sm:px-2">
            <DotMatrixLogo size={40} />

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-0.5 ml-3 mr-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3.5 py-1.5 text-[13px] rounded-full transition-colors duration-200 ${
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-foreground/[0.07] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                    <span className="relative">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            <div className="hidden sm:block h-4 w-px bg-border/40 mx-1.5" />

            {/* Available for work */}
            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Available
            </Link>

            {/* Mobile spacer */}
            <div className="sm:hidden flex-1" />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 relative z-50"
              aria-label="Toggle menu"
            >
              <div className="w-[18px] flex flex-col gap-[5px]">
                <motion.div
                  className="h-[1.5px] bg-foreground origin-center"
                  animate={isMobileMenuOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="h-[1.5px] bg-foreground origin-center"
                  animate={isMobileMenuOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="sm:hidden pointer-events-auto fixed inset-0 bg-background/95 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col p-8 pt-24 gap-2">
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
                    className={`block py-4 text-2xl font-medium transition-colors ${
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
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
    </header>
  );
}
