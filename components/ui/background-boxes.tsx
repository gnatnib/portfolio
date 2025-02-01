"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(45).fill(1); // Reduced for better performance
  const cols = new Array(45).fill(1); // Made square grid
  let colors = [
    "--sky-300",
    "--pink-300",
    "--green-300",
    "--yellow-300",
    "--red-300",
    "--purple-300",
    "--blue-300",
    "--indigo-300",
    "--violet-300",
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `scale(1.5)`, // Adjust scale as needed
      }}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center w-full h-full z-0",
        className
      )}
      {...rest}
    >
      <div className="grid">
        {rows.map((_, i) => (
          <div key={`row${i}`} className="flex">
            {cols.map((_, j) => (
              <motion.div
                whileHover={{
                  backgroundColor: `var(${getRandomColor()})`,
                  transition: { duration: 0 },
                }}
                animate={{
                  transition: { duration: 2 },
                }}
                key={`col${j}`}
                className="w-8 h-8 border border-slate-700/[0.13] relative"
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700/[0.1] stroke-[1px] pointer-events-none"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
