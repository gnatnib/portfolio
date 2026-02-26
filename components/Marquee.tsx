"use client";

import StackIcon from "tech-stack-icons";

const techStack = [
  { name: "JavaScript", icon: "js" },
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "reactjs" },
  { name: "Next.js", icon: "nextjs2" },
  { name: "shadcn/ui", icon: "shadcnui" },
  { name: "Framer", icon: "framer" },
  { name: "Node.js", icon: "nodejs" },
  { name: "PHP", icon: "php" },
  { name: "Laravel", icon: "laravel" },
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css3" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Python", icon: "python" },
  { name: "MySQL", icon: "mysql" },
  { name: "Prisma", icon: "prisma" },
  { name: "Git", icon: "git" },
];

function MarqueeRow({ direction = "left" }: { direction?: "left" | "right" }) {
  return (
    <div className="overflow-hidden whitespace-nowrap marquee-pause">
      <div
        className={`inline-flex items-center gap-10 sm:gap-14 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {/* Duplicate for seamless loop */}
        {[...techStack, ...techStack].map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="inline-flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 opacity-50 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-0">
              <StackIcon name={item.icon} className="w-full h-full" />
            </div>
            <span className="font-mono-accent text-xs sm:text-sm text-muted-foreground/40 tracking-wider group-hover:text-muted-foreground/70 transition-colors">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="py-6 sm:py-8 border-y border-border/40 space-y-3 select-none overflow-hidden">
      <MarqueeRow direction="left" />
      <MarqueeRow direction="right" />
    </div>
  );
}
