"use client";

import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTailwindcss,
  SiShadcnui,
  SiFramer,
  SiLaravel,
  SiPhp,
  SiPrisma,
  SiHtml5,
  SiCss,
  SiPython,
  SiPandas,
  SiNumpy,
  SiJupyter,
  SiPytorch,
  SiStreamlit,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiLinux,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { motion } from "framer-motion";

/* Official brand glyphs from react-icons (Simple Icons / Font Awesome).
   Colours are each brand's own hex, nudged lighter where the official value
   would disappear against the near-black background. */
type TechItem = { name: string; glyph: IconType; color: string };

/* Row 1 — product & web engineering */
const webStack: TechItem[] = [
  { name: "TypeScript", glyph: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", glyph: SiJavascript, color: "#F7DF1E" },
  { name: "React", glyph: SiReact, color: "#61DAFB" },
  { name: "Next.js", glyph: SiNextdotjs, color: "#FFFFFF" },
  { name: "Node.js", glyph: SiNodedotjs, color: "#5FA04E" },
  { name: "Tailwind CSS", glyph: SiTailwindcss, color: "#06B6D4" },
  { name: "shadcn/ui", glyph: SiShadcnui, color: "#FFFFFF" },
  { name: "Framer Motion", glyph: SiFramer, color: "#0099FF" },
  { name: "Laravel", glyph: SiLaravel, color: "#FF2D20" },
  { name: "PHP", glyph: SiPhp, color: "#8892BF" },
  { name: "Prisma", glyph: SiPrisma, color: "#E2E8F0" },
  { name: "HTML", glyph: SiHtml5, color: "#E34F26" },
  { name: "CSS", glyph: SiCss, color: "#8B5CF6" },
];

/* Row 2 — data, ML & cloud */
const dataStack: TechItem[] = [
  { name: "Python", glyph: SiPython, color: "#4B8BBE" },
  // Official pandas navy (#150458) is invisible on a dark background
  { name: "pandas", glyph: SiPandas, color: "#E70488" },
  { name: "NumPy", glyph: SiNumpy, color: "#4DABCF" },
  { name: "Jupyter", glyph: SiJupyter, color: "#F37726" },
  { name: "PyTorch", glyph: SiPytorch, color: "#EE4C2C" },
  { name: "Streamlit", glyph: SiStreamlit, color: "#FF4B4B" },
  { name: "MySQL", glyph: SiMysql, color: "#4479A1" },
  { name: "PostgreSQL", glyph: SiPostgresql, color: "#4169E1" },
  { name: "Git", glyph: SiGit, color: "#F05032" },
  { name: "GitHub", glyph: SiGithub, color: "#FFFFFF" },
  { name: "Docker", glyph: SiDocker, color: "#2496ED" },
  { name: "Linux", glyph: SiLinux, color: "#FCC624" },
  { name: "AWS", glyph: FaAws, color: "#FF9900" },
];

/* Edge-fade mask: transparent -> opaque -> transparent */
const edgeFadeMask =
  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

function MarqueeRow({
  items,
  direction = "left",
}: {
  items: TechItem[];
  direction?: "left" | "right";
}) {
  return (
    <div
      className="overflow-hidden whitespace-nowrap marquee-pause"
      style={{
        WebkitMaskImage: edgeFadeMask,
        maskImage: edgeFadeMask,
      }}
    >
      <div
        className={`inline-flex items-center gap-10 sm:gap-14 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((item, i) => {
          const Glyph = item.glyph;
          return (
            <div
              key={`${item.name}-${i}`}
              className="inline-flex items-center gap-2.5 flex-shrink-0 group"
            >
              <Glyph
                aria-hidden
                className="w-5 h-5 sm:w-[22px] sm:h-[22px] flex-shrink-0 opacity-45 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                style={{ color: item.color }}
              />
              <span className="font-mono-accent text-xs text-muted-foreground/50 tracking-wider group-hover:text-muted-foreground transition-colors duration-300">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <motion.div
      className="py-6 sm:py-8 border-y border-border/60 space-y-3 select-none overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <MarqueeRow items={webStack} direction="left" />
      <MarqueeRow items={dataStack} direction="right" />
    </motion.div>
  );
}
