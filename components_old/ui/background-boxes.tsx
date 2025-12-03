"use client";
import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Update isMobile state on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Adjust grid size based on device
  const rows = new Array(isMobile ? 20 : 80).fill(1);
  const cols = new Array(isMobile ? 15 : 62).fill(1);

  const colors = useMemo(
    () => [
      "--sky-300",
      "--pink-300",
      "--green-300",
      "--yellow-300",
      "--blue-300",
      "--indigo-300",
    ],
    []
  );

  const getRandomColor = useMemo(
    () => () => {
      return colors[Math.floor(Math.random() * colors.length)];
    },
    [colors]
  );

  // Only enable hover animations on desktop
  const motionConfig = useMemo(
    () => ({
      whileHover: !isMobile
        ? {
            backgroundColor: `var(${getRandomColor()})`,
            transition: { duration: 0 },
          }
        : {},
      animate: {
        transition: { duration: 2 },
      },
    }),
    [isMobile, getRandomColor]
  );

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(${
          isMobile ? 0.5 : 0.675
        }) rotate(-6deg) translateZ(0)`,
        willChange: "transform",
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row${i}`}
          className="w-16 h-8 border-l border-slate-700/[0.1] relative"
          initial={false}
        >
          {cols.map((_, j) => (
            <motion.div
              key={`col${j}`}
              {...motionConfig}
              initial={false}
              className="w-16 h-8 border-r border-t border-slate-700/[0.2] relative"
            >
              {/* Only render plus signs on desktop or every 4th intersection on mobile */}
              {(!isMobile && j % 2 === 0 && i % 2 === 0) ||
              (isMobile && j % 4 === 0 && i % 4 === 0) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700/[0.2] stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
