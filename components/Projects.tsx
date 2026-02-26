"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const projects = [
  {
    title: "Financipal",
    description: "Personal finance tracker with comprehensive analytics and insights.",
    image: "/project2.png",
    github: "https://github.com/gnatnib/financipal",
    live: "https://financipal.vercel.app",
    techStack: ["Next.js", "shadcn/ui", "Prisma"],
  },
  {
    title: "Rumeet",
    description: "Corporate room booking system for efficient scheduling.",
    image: "/project3.png",
    github: "https://github.com/gnatnib/ugbooking",
    live: "https://rumeet.ugmandiri.co.id/",
    techStack: ["Laravel", "MySQL", "PHP"],
  },
  {
    title: "SiPP",
    description: "Procurement management system for enterprise needs.",
    image: "/project4.png",
    github: "https://github.com/gnatnib/ugprocurement",
    live: "https://sipp.ugmandiri.co.id/",
    techStack: ["Laravel", "MySQL", "PHP"],
  },
  {
    title: "E-Tarteel",
    description: "Modern Quran recitation app with beautiful UI.",
    image: "/project5.png",
    github: "https://github.com/gnatnib/e-tarteel",
    live: "https://etarteel.vercel.app/",
    techStack: ["Next.js", "Radix UI", "Tailwind"],
  },
  {
    title: "Twentyfour",
    description: "Retro arcade multiplayer card game.",
    image: "/project8.png",
    github: "https://github.com/gnatnib/twentyfour",
    live: "https://twentyfourgame.vercel.app/",
    techStack: ["HTML5", "Firebase", "JavaScript"],
  },
  {
    title: "Sumanto",
    description: "Integrated academic management system.",
    image: "/project6.png",
    github: "https://github.com/gnatnib/Sumanto",
    techStack: ["Laravel", "jQuery", "MySQL"],
  },
  {
    title: "Happiness Report",
    description: "Data analysis of World Happiness Report using K-Means.",
    image: "/project7.png",
    github: "https://github.com/gnatnib/world_happiness_report",
    live: "https://kmeans-world-happiness-report.streamlit.app/",
    techStack: ["Python", "Streamlit", "Pandas"],
  },
  {
    title: "Helmet Detection",
    description: "Computer Vision for detecting helmet on motorcyclist using YOLOv11.",
    image: "/project9.png",
    github: "https://github.com/gnatnib/helmet_detection",
    live: "https://helmetdetectioncomvis.streamlit.app/",
    techStack: ["Python", "YOLO", "Streamlit"],
  },
  {
    title: "Bidlix",
    description: "Movie database explorer using TMDB API.",
    image: "/project1.png",
    github: "https://github.com/gnatnib/bidlix",
    live: "https://bidlix.vercel.app/",
    techStack: ["JavaScript", "HTML", "CSS"],
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  return (
    <section id="projects" className="bg-[#0a0a0a] py-24 md:py-32">
      {/* Top separator */}
      <div className="editorial-separator" />

      <div className="pt-24">
        {/* Section header */}
        <div className="editorial-container mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
              Work
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Selected Projects
              </h2>
              <p className="hidden md:block text-white/30 text-sm">
                Scroll horizontally →
              </p>
            </div>
          </motion.div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={containerRef}
          className="horizontal-scroll pl-6 md:pl-[calc((100vw-72rem)/2+2rem)] pb-8"
        >
          <div className="flex gap-6 pr-6 md:pr-24">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-item group w-[320px] md:w-[400px] flex-shrink-0"
              >
                {/* Project card */}
                <div className="relative">
                  {/* Image */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-white/5 mb-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-xs hover:bg-white/20 transition-colors"
                        >
                          Code
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white text-black text-xs hover:bg-white/90 transition-colors"
                        >
                          Live
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2 group-hover:text-white/80 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-3">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs text-white/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="editorial-container mt-8">
          <div className="h-px bg-white/[0.06] relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white/30"
              style={{ scaleX: scrollXProgress, transformOrigin: "left" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
