"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface DotMatrixLogoProps {
  size?: number;
}

export default function DotMatrixLogo({ size = 48 }: DotMatrixLogoProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const svgW = size - 12;
  const svgH = (svgW * 226) / 360;
  const expandedWidth = size + 100;
  const showFilled = isLanding || isHovered;

  const LogoSvg = ({ color, cutout }: { color: string; cutout: string }) => (
    <svg
      viewBox="0 0 360 226"
      xmlns="http://www.w3.org/2000/svg"
      width={svgW}
      height={svgH}
      fill="none"
    >
      <path d="M40 200L120 20H320L240 200H40Z" fill={color} />
      <path d="M135 170L200 50H250L185 170H135Z" fill={cutout} />
      <path d="M80 170L110 110H140L110 170H80Z" fill={cutout} />
    </svg>
  );

  return (
    <Link href="/" className="relative z-50 block flex-shrink-0">
      <motion.div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ width: isHovered ? expandedWidth : size }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        style={{ height: size }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            backgroundColor: showFilled
              ? "hsl(var(--foreground))"
              : "hsla(0, 0%, 0%, 0)",
          }}
          transition={{ duration: 0.2 }}
        />

        <div
          className="absolute top-0 left-0 flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <LogoSvg
            color={showFilled ? "white" : "hsl(var(--foreground))"}
            cutout={showFilled ? "hsl(var(--foreground))" : "hsl(var(--background))"}
          />
        </div>

        <motion.div
          className="absolute top-0 right-0 flex flex-col justify-center overflow-hidden h-full pr-3"
          animate={{
            width: isHovered ? expandedWidth - size : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            width: { type: "spring", stiffness: 500, damping: 32 },
            opacity: { duration: 0.15, delay: isHovered ? 0.06 : 0 },
          }}
        >
          <span className="text-background text-[11px] font-semibold whitespace-nowrap leading-tight">
            Bintang
          </span>
          <span className="text-background/50 text-[9px] font-medium whitespace-nowrap leading-tight">
            Syafrian
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}
