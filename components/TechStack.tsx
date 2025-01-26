"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card, CardContent } from "@/components/ui/card";
import StackIcon from "tech-stack-icons";

const techStack = [
  { name: "JavaScript", icon: "js" },
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "reactjs" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Node.js", icon: "nodejs" },
  { name: "PHP", icon: "php" },
  { name: "Laravel", icon: "laravel" },
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css3" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Python", icon: "python" },
  { name: "MySQL", icon: "mysql" },
  { name: "Git", icon: "git" },
];

export default function TechStack() {
  const { ref, controls, initial } = useScrollAnimation();

  return (
    <section id="tech-stack" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">My Tech Stack</h2>
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {techStack.map((tech, index) => (
            <Card
              key={index}
              className="flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CardContent className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <StackIcon name={tech.icon} className="w-12 h-12 mb-2" />
                </motion.div>
                <p className="text-sm font-medium">{tech.name}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
