"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import HighlightedWork from "@/components/HighlightedWork";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Github, Globe } from "lucide-react";

const allProjects = [
  {
    title: "Pangan.id",
    category: "Web App",
    client: "Personal",
    year: "2026",
    images: ["/panganmockup.png"],
    description: "Pangan.id is a fast, mobile-view compatible dashboard for tracking daily food prices across all 38 Indonesian provinces using official Bank Indonesia PIHPS data.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    github: "https://github.com/gnatnib/pangan.id",
    liveDemo: "https://pangan-id.vercel.app",
  },
  {
    title: "SANHRMS",
    category: "Web App",
    client: "PT. Sinergi Asta Nusantara",
    year: "2026",
    images: ["/sanhrms.png"],
    description: "SANHRMS is a comprehensive Human Resource Management System for PT. Sinergi Asta Nusantara.",
    tech: ["TypeScript", "Vite.js", "Laravel", "MySQL"],
    github: "https://github.com/gnatnib/HRMS_PT.SAN",
  },
  {
    title: "Sistem Informasi Zona KHAS Kelurahan Sendangmulyo",
    category: "Web App",
    client: "Community Service",
    year: "2025",
    images: ["/zonakhas.png"],
    description: "Website KKN IDBU 81 Sebagai Upaya Pembentukan dan Penguatan Zona KHAS.",
    tech: ["Next.js", "Tailwind CSS", "Typescript"],
    github: "https://github.com/gnatnib/idbu81",
    liveDemo: "https://khasklipang.vercel.app",
  },
  {
    title: "Rumeet",
    category: "Web App",
    client: "PT. Usaha Gedung Mandiri",
    year: "2025",
    images: ["/project3.png", "/project3.png"],
    description: "Corporate room booking system for efficient scheduling.",
    tech: ["Laravel", "MySQL", "Bootstrap", "PHP"],
    github: "https://github.com/gnatnib/ugbooking",
  },
  {
    title: "SiPP",
    category: "Web App",
    client: "PT. Usaha Gedung Mandiri",
    year: "2025",
    images: ["/project4.png"],
    description: "Procurement management system for enterprise needs.",
    tech: ["Laravel", "MySQL", "Bootstrap", "PHP"],
    github: "https://github.com/gnatnib/ugprocurement",
  },
  {
    title: "E-tarteel",
    category: "Web App",
    client: "Personal",
    year: "2025",
    images: ["/project5.png", "/project5.png"],
    description: "Modern Quran recitation app with beautiful UI.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/gnatnib/e-tarteel",
    liveDemo: "https://etarteel.vercel.app",
  },
  {
    title: "Twentyfour",
    category: "Web App",
    client: "Personal",
    year: "2025",
    images: ["/project8.png"],
    description: "Retro arcade multiplayer card game.",
    tech: ["HTML5", "Firebase", "JavaScript"],
    github: "https://github.com/gnatnib/twentyfour",
    liveDemo: "https://twentyfourgame.vercel.app",
  },
  {
    title: "Helmet Detection",
    category: "Computer Vision",
    client: "Academic",
    year: "2025",
    images: ["/project9.png"],
    description: "Computer Vision for detecting helmet on motorcyclist using YOLOv11.",
    tech: ["Python", "YOLO", "Streamlit"],
    github: "https://github.com/gnatnib/helmet_detection",
    liveDemo: "https://helmetdetectioncomvis.streamlit.app/",
  },
  {
    title: "Financipal",
    category: "Web App",
    client: "Personal",
    year: "2024",
    images: ["/project2.png", "/project2.png"],
    description: "Personal finance tracker with comprehensive analytics and insights.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/gnatnib/financipal",
    liveDemo: "https://financipal.vercel.app",
  },
  {
    title: "Sumanto",
    category: "Web App",
    client: "Academic",
    year: "2023",
    images: ["/project6.png"],
    description: "Integrated academic management system.",
    tech: ["Laravel", "MySQL", "Bootstrap", "PHP"],
    github: "https://github.com/gnatnib/Sumanto",
  },
];

export default function WorkPage() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const toggleItem = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    <>
      <HeroSection
        title="Work"
        sectionNumber="WK.01"
        description="A bunch of projects I’ve built, experiments I’ve tried, and ideas I’ve turned into something real while exploring tech."
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
                        {/* Project image with frame */}
                        <div className="px-4 sm:px-6 py-6 sm:py-8">
                          <motion.div 
                            className="relative max-w-2xl mx-auto mb-6"
                            onMouseEnter={() => setHoveredProject(project.title)}
                            onMouseLeave={() => setHoveredProject(null)}
                          >
                            {/* Browser frame with hover animation */}
                            <motion.div 
                              className="relative bg-muted rounded-lg overflow-hidden border border-border/20 cursor-pointer"
                              animate={{
                                y: hoveredProject === project.title ? -8 : 0,
                                boxShadow: hoveredProject === project.title 
                                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
                                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                              }}
                              transition={{
                                duration: 0.4,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                            >
                              {/* Browser header */}
                              <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 border-b border-border/20">
                                <div className="flex gap-1.5">
                                  <motion.div 
                                    className="w-3 h-3 rounded-full bg-red-400/80"
                                    animate={{
                                      scale: hoveredProject === project.title ? 1.2 : 1,
                                    }}
                                    transition={{ duration: 0.2, delay: 0 }}
                                  />
                                  <motion.div 
                                    className="w-3 h-3 rounded-full bg-yellow-400/80"
                                    animate={{
                                      scale: hoveredProject === project.title ? 1.2 : 1,
                                    }}
                                    transition={{ duration: 0.2, delay: 0.05 }}
                                  />
                                  <motion.div 
                                    className="w-3 h-3 rounded-full bg-green-400/80"
                                    animate={{
                                      scale: hoveredProject === project.title ? 1.2 : 1,
                                    }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                  />
                                </div>
                                <div className="flex-1 mx-4">
                                  <motion.div 
                                    className="rounded-md px-3 py-1 text-xs text-center font-mono"
                                    animate={{
                                      backgroundColor: hoveredProject === project.title ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.1)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {project.title.toLowerCase().replace(/\s+/g, '-')}
                                  </motion.div>
                                </div>
                              </div>
                              {/* Image container with zoom effect */}
                              <div className="relative aspect-[16/9] overflow-hidden bg-background">
                                <motion.div
                                  className="relative w-full h-full"
                                  animate={{
                                    scale: hoveredProject === project.title ? 1.05 : 1,
                                  }}
                                  transition={{
                                    duration: 0.6,
                                    ease: [0.25, 0.1, 0.25, 1],
                                  }}
                                >
                                  <Image
                                    src={project.images[0]}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                  />
                                </motion.div>
                                {/* Overlay gradient on hover */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                                  animate={{
                                    opacity: hoveredProject === project.title ? 1 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            </motion.div>
                          </motion.div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((t) => (
                              <span key={t} className="font-mono-accent text-[10px] px-2 py-0.5 border border-border/30 rounded-sm text-muted-foreground/60">
                                {t}
                              </span>
                            ))}
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6">
                            {project.description}
                          </p>
                          
                          {/* Action buttons */}
                          <div className="flex items-center gap-4">
                            {project.github && (
                              <Link
                                href={project.github}
                                target="_blank"
                                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors"
                              >
                                <Github size={16} />
                                Visit GitHub
                              </Link>
                            )}
                            {project.liveDemo && (
                              <Link
                                href={project.liveDemo}
                                target="_blank"
                                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors"
                              >
                                <Globe size={16} />
                                Live Demo
                              </Link>
                            )}
                          </div>
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