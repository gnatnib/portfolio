"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import HighlightedWork from "@/components/HighlightedWork";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";

const allProjects = [
  {
    title: "E-Tarteel",
    category: "Web App",
    client: "Personal",
    year: "2024",
    images: ["/project1.png"],
    description: "A Quran learning platform built with modern web technologies, featuring recitation tracking and progress monitoring.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "Movie Recommendation System",
    category: "ML / Data Science",
    client: "Academic",
    year: "2024",
    images: ["/project2.png", "/project3.png"],
    description: "Machine learning-based movie recommendation system using collaborative filtering and content-based approaches.",
    tech: ["Python", "Scikit-learn", "Pandas", "Flask"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "Portfolio Website",
    category: "Web App",
    client: "Personal",
    year: "2024",
    images: ["/project3.png"],
    description: "Personal portfolio website showcasing projects and experience with a modern design aesthetic.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "E-Commerce Platform",
    category: "Web App",
    client: "Academic",
    year: "2024",
    images: ["/project4.png", "/project5.png"],
    description: "Full-featured e-commerce platform with product management, cart system, and payment integration.",
    tech: ["Laravel", "MySQL", "Bootstrap", "PHP"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "IoT Monitoring Dashboard",
    category: "IoT / Web",
    client: "Academic",
    year: "2023",
    images: ["/project5.png"],
    description: "Dashboard for monitoring IoT sensor data with real-time visual analytics and alerts.",
    tech: ["React", "MQTT", "InfluxDB", "Grafana"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "Student Information System",
    category: "Web App",
    client: "Academic",
    year: "2023",
    images: ["/project6.png"],
    description: "Comprehensive student information management with academic tracking and reporting features.",
    tech: ["Java", "Spring Boot", "MySQL", "React"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "Chat Application",
    category: "Web App",
    client: "Personal",
    year: "2024",
    images: ["/project7.png", "/project8.png"],
    description: "Real-time chat application with WebSocket support, file sharing, and group messaging.",
    tech: ["Node.js", "Socket.io", "React", "MongoDB"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "Drone Control System",
    category: "Embedded",
    client: "URDC",
    year: "2023",
    images: ["/project8.png"],
    description: "Autonomous drone control system with computer vision capabilities for aerial surveillance.",
    tech: ["Python", "ROS", "OpenCV", "Arduino"],
    github: "https://github.com/gnatnib",
  },
  {
    title: "Task Management App",
    category: "Web App",
    client: "Personal",
    year: "2023",
    images: ["/project9.png"],
    description: "Kanban-style task management application with drag-and-drop, labels, and team collaboration.",
    tech: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    github: "https://github.com/gnatnib",
  },
];

export default function WorkPage() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    <>
      <HeroSection
        title="Work"
        sectionNumber="WK.01"
        description="A compendium of inventive experiments, coded odysseys, and meticulously sculpted digital constructs reflecting my explorative forays into technological innovation."
      />

      <HighlightedWork showLink={false} />

      <Section sectionNumber="WK.02" label="All Projects">
        <ViewAnimation
          initial={{ opacity: 0, translateY: -4 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.4}
          viewport={{ once: true }}
        >
          <div className="divide-y divide-border/40">
            {allProjects.map((project) => (
              <div key={project.title}>
                <motion.button
                  onClick={() => toggleItem(project.title)}
                  className="w-full px-4 sm:px-6 py-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                    <span className="flex-1 text-sm sm:text-base font-medium">{project.title}</span>
                    <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                      <span className="hidden sm:inline">{project.client}</span>
                      <span>{project.category}</span>
                      <span className="font-mono-accent text-[11px] text-muted-foreground/50">{project.year}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedItem === project.title ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="ml-4 flex-shrink-0"
                  >
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {expandedItem === project.title && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                        opacity: { duration: 0.25, delay: 0.1 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/20 bg-muted/5">
                        {/* Project image */}
                        <div className="px-4 sm:px-6 py-6 sm:py-8">
                          <div className="relative aspect-[16/9] max-w-2xl mx-auto overflow-hidden rounded-sm bg-muted mb-6">
                            <Image
                              src={project.images[0]}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((t) => (
                              <span key={t} className="font-mono-accent text-[10px] px-2 py-0.5 border border-border/30 rounded-sm text-muted-foreground/60">
                                {t}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
                            {project.description}
                          </p>
                          {project.github && (
                            <Link
                              href={project.github}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-muted-foreground transition-colors"
                            >
                              Visit Project <ExternalLink size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ViewAnimation>
      </Section>
    </>
  );
}
