"use client";

import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
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

export default function TechStack() {
  // Split into two rows for symmetry and visual interest
  const row1 = techStack.slice(0, Math.ceil(techStack.length / 2));
  const row2 = techStack.slice(Math.ceil(techStack.length / 2));

  const items1 = row1.map((tech) => ({
    name: tech.name,
    icon: <StackIcon name={tech.icon} className="w-12 h-12" />,
  }));

  const items2 = row2.map((tech) => ({
    name: tech.name,
    icon: <StackIcon name={tech.icon} className="w-12 h-12" />,
  }));

  return (
    <section
      id="tech-stack"
      className="min-h-screen flex flex-col justify-center bg-background dark:bg-black relative overflow-hidden py-32"
    >
      {/* Background Animation - Digital Rain / Particles */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            Tech Stack
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The tools and technologies I use to build digital products.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          <InfiniteMovingCards
            items={items1}
            direction="left"
            speed="normal"
            className="bg-transparent"
          />
          <InfiniteMovingCards
            items={items2}
            direction="right"
            speed="normal"
            className="bg-transparent"
          />
        </div>
      </div>
    </section>
  );
}
