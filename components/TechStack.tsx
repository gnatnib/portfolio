"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card } from "@/components/ui/card";
import StackIcon from "tech-stack-icons";

const techStack = [
  {
    name: "JavaScript",
    icon: "js",
    color: "#F7DF1E",
    category: "Frontend",
  },
  {
    name: "TypeScript",
    icon: "typescript",
    color: "#3178C6",
    category: "Frontend",
  },
  {
    name: "React",
    icon: "reactjs",
    color: "#61DAFB",
    category: "Frontend",
  },
  {
    name: "Next.js",
    icon: "nextjs2",
    color: "#000000",
    category: "Frontend",
  },
  {
    name: "shadcn/ui",
    icon: "shadcnui",
    color: "#FF0080",
    category: "Frontend",
  },
  {
    name: "Framer",
    icon: "framer",
    color: "#06B6D4",
    category: "Frontend",
  },
  {
    name: "Node.js",
    icon: "nodejs",
    color: "#339933",
    category: "Backend",
  },
  {
    name: "PHP",
    icon: "php",
    color: "#777BB4",
    category: "Backend",
  },
  {
    name: "Laravel",
    icon: "laravel",
    color: "#FF2D20",
    category: "Backend",
  },
  {
    name: "HTML",
    icon: "html5",
    color: "#E34F26",
    category: "Frontend",
  },
  {
    name: "CSS",
    icon: "css3",
    color: "#1572B6",
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    icon: "tailwindcss",
    color: "#06B6D4",
    category: "Frontend",
  },
  {
    name: "Python",
    icon: "python",
    color: "#3776AB",
    category: "Backend",
  },
  {
    name: "MySQL",
    icon: "mysql",
    color: "#4479A1",
    category: "Database",
  },
  {
    name: "Prisma",
    icon: "prisma",
    color: "#47A248",
    category: "Database",
  },
  {
    name: "Git",
    icon: "git",
    color: "#F05032",
    category: "Tools",
  },
];

const categories = ["Frontend", "Backend", "Database", "Tools"];

export default function TechStack() {
  const { ref, controls, initial } = useScrollAnimation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <section
      id="tech-stack"
      className="min-h-screen py-20 bg-gradient-to-b from-background to-muted/50"
    >
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              My Tech Stack
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold text-primary/80">
                {category}
              </h3>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {techStack
                  .filter((tech) => tech.category === category)
                  .map((tech, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <Card className="relative h-32 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border border-primary/10 bg-background/50 backdrop-blur-sm">
                        <div
                          className="w-12 h-12 mb-3 relative group-hover:animate-bounce"
                          style={{ color: tech.color }}
                        >
                          <StackIcon
                            name={tech.icon}
                            className="w-full h-full"
                          />
                        </div>
                        <p className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                          {tech.name}
                        </p>
                        <div className="absolute inset-0 border border-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
