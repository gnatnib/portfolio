"use client";

import Link from "next/link";

interface DotMatrixLogoProps {
  size?: number;
}

export default function DotMatrixLogo({ size = 32 }: DotMatrixLogoProps) {
  const svgW = size - 10;
  const svgH = (svgW * 226) / 360;

  return (
    <Link
      href="/"
      className="group relative z-50 flex items-center gap-2.5 flex-shrink-0"
      aria-label="Home"
    >
      <span
        className="flex items-center justify-center border border-border group-hover:border-muted-foreground/70 transition-colors duration-200"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 360 226"
          xmlns="http://www.w3.org/2000/svg"
          width={svgW}
          height={svgH}
          fill="none"
        >
          <path
            d="M40 200L120 20H320L240 200H40Z"
            className="fill-foreground/80 group-hover:fill-foreground transition-colors duration-200"
          />
          <path d="M135 170L200 50H250L185 170H135Z" className="fill-background" />
          <path d="M80 170L110 110H140L110 170H80Z" className="fill-background" />
        </svg>
      </span>

      <span className="hidden sm:block text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
        gnatnib
      </span>
    </Link>
  );
}
