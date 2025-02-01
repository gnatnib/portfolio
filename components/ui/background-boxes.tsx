"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(50).fill(1);
  const cols = new Array(30).fill(1);

  // Memoize the colors array
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

  // Memoize the random color function
  const getRandomColor = useMemo(
    () => () => {
      return colors[Math.floor(Math.random() * colors.length)];
    },
    [colors]
  );

  // Optimize animation settings
  const motionConfig = {
    whileHover: {
      backgroundColor: `var(${getRandomColor()})`,
      transition: { duration: 0 },
    },
    animate: {
      transition: { duration: 2 },
    },
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(6deg) translateZ(0)`,
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
          initial={false} // Disable initial animation
        >
          {cols.map((_, j) => (
            <motion.div
              key={`col${j}`}
              {...motionConfig}
              initial={false} // Disable initial animation
              className="w-16 h-8 border-r border-t border-slate-700/[0.1] relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700/[0.1] stroke-[1px] pointer-events-none"
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

// Memoize the entire component
export const Boxes = React.memo(BoxesCore);
