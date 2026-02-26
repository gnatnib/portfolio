"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ width: isHovered ? 170 : size, height: size, transition: "width 0.3s ease" }}
      >
        {/* Background box */}
        <div
          className="absolute inset-0 rounded-sm transition-colors duration-200"
          style={{
            backgroundColor: (isLanding || isHovered) ? "hsl(var(--foreground))" : "transparent",
          }}
        />

        {/* Logo — always in the left slot */}
        <div
          className="absolute top-0 left-0 flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <LogoSvg
            color={(isLanding || isHovered) ? "white" : "hsl(var(--foreground))"}
            cutout={(isLanding || isHovered) ? "hsl(var(--foreground))" : "hsl(var(--background))"}
          />
        </div>

        {/* Name text — slides in from behind logo */}
        <div
          className="absolute top-0 right-0 flex flex-col justify-center overflow-hidden h-full pr-3"
          style={{
            width: isHovered ? 170 - size : 0,
            opacity: isHovered ? 1 : 0,
            transition: "width 0.3s ease, opacity 0.2s ease 0.1s",
          }}
        >
          <span className="text-background text-xs font-semibold whitespace-nowrap">
            Bintang
          </span>
          <span className="text-background/60 text-[10px] font-medium whitespace-nowrap">
            Syafrian
          </span>
        </div>
      </div>
    </Link>
  );
}
