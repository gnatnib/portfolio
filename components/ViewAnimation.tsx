"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface ViewAnimationProps {
  initial?: Record<string, string | number>;
  whileInView?: Record<string, string | number>;
  animate?: Record<string, string | number>;
  delay?: number;
  className?: string;
  children: ReactNode;
  viewport?: {
    once?: boolean;
    amount?: "some" | "all" | number;
    margin?: string;
  };
}

/* Expo-out: moves fast, settles gently. Reads as deliberate rather than floaty. */
const EASE = [0.16, 1, 0.3, 1] as const;

const ViewAnimation = ({
  initial,
  whileInView,
  animate,
  delay,
  className,
  children,
  /* Trigger as soon as a sliver is visible and slightly before the element
     reaches the viewport edge, so content is already settled by the time it is
     actually looked at. The old 0.5 threshold made tall blocks animate late,
     which is what made scrolling feel like it was lagging behind. */
  viewport = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" },
}: ViewAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      /* Transform + opacity only. This previously animated `filter: blur()`,
         which repaints the whole subtree every frame and was the main source
         of stutter while scrolling. */
      initial={{ opacity: 0, translateY: 14, ...initial }}
      whileInView={{ opacity: 1, translateY: 0, ...whileInView }}
      className={className}
      viewport={viewport}
      transition={{ delay: delay ?? 0, duration: 0.55, ease: EASE }}
      {...(animate ? { animate } : {})}
    >
      {children}
    </motion.div>
  );
};

export default ViewAnimation;
