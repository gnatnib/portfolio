"use client";

import { motion } from "framer-motion";
import { Carousel } from "@/components/ui/carousel";

const projects = [
  {
    title: "Financipal",
    description: "Personal finance tracker with comprehensive analytics.",
    image: "/project2.png",
    github: "https://github.com/gnatnib/financipal",
    live: "https://financipal.vercel.app",
    techStack: ["NextJS", "ShadCn", "Prisma"],
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
    techStack: ["NextJS", "RadixUI", "Tailwind"],
  },
  {
    title: "Twentyfour",
    description: "Retro Arcade Multiplayer Card Game.",
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
    techStack: ["Laravel", "JQuery", "MySQL"],
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
    description: "Computer Vision Project for Detecting Helmet on Motorcyclist using YOLOv11.",
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
    techStack: ["JS", "HTML", "CSS"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen py-24 bg-background dark:bg-black relative overflow-hidden flex flex-col justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Selected Work</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of projects that showcase my passion for building digital experiences.
          </p>
        </motion.div>

        <Carousel items={projects} />
      </div>
    </section>
  );
}
