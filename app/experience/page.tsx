"use client";

import { useState } from "react";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion, AnimatePresence } from "framer-motion";

const experiences = [
  {
    title: "Fullstack Developer Intern",
    company: "PT. Sinergi Asta Nusantara - Jakarta",
    timeframe: "Feb 2026 – Apr 2026",
    description:
      "Built scalable Human Resource Management System with Vite.js for frontend and Laravel for backend, managing over 150+ employees with features like attendance tracking, payroll management, and employee self-service.",
    image: "/experience/san.png",
    tags: ["Hybrid", "Internship"],
    side: "right" as const,
  },
  {
    title: "Fullstack Developer Intern",
    company: "PT. Usaha Gedung Mandiri - Jakarta",
    timeframe: "Jan 2025 – Feb 2025",
    description:
      "Developed 2 scalable web applications using modern frameworks. Implemented RESTful APIs and integrated third-party services. Collaborated with cross-functional teams to deliver high-quality software solutions.",
    image: "/experience/Fullstack Developer Intern @PT.Usaha Gedung Mandiri.png",
    tags: ["Hybrid", "Internship"],
    side: "left" as const,
  },
  {
    title: "Laboratory Assistant — Data Structures",
    company: "Universitas Diponegoro - Semarang",
    timeframe: "Sep 2024 – Dec 2024",
    description:
      "Guided students through fundamental and advanced data structure concepts including linked lists, trees, graphs, and hash tables. Developed practical lab exercises and conducted weekly mentoring sessions.",
    image: "/experience/Laboratory_Assistant_Data Structure.png",
    tags: ["Onsite", "Part-Time"],
    side: "right" as const,
  },
  {
    title: "Liaison Officer — ICICoS 2024",
    company: "Universitas Diponegoro - Semarang",
    timeframe: "Jul 2024",
    description:
      "Served as a liaison officer for the International Conference on Information and Communications Security. Coordinated with international speakers, managed event logistics, and ensured smooth operations.",
    image: "/experience/Liaison Officer_ICICoS 2024.png",
    tags: ["Onsite"],
    side: "left" as const,
  },
  {
    title: "Laboratory Assistant — Computer Network",
    company: "Universitas Diponegoro - Semarang",
    timeframe: "Feb 2024 – May 2024",
    description:
      "Assisted in teaching computer networking fundamentals including TCP/IP, routing protocols, and network security. Maintained lab infrastructure and guided students through hands-on networking exercises.",
    image: "/experience/Laboratory_Assistant_Computer Network.png",
    tags: ["Onsite", "Part-Time"],
    side: "right" as const,
  },
  {
    title: "Graduated High School",
    company: "SMA Negeri 4 Semarang",
    timeframe: "Jul 2022",
    description:
      "Graduated from SMA Negeri 4 Semarang with a focus on science and mathematics, finishing with excellent academic performance and ranked in the top 10%.",
    image: "/experience/graduated_highschool.jpg",
    tags: [""],
    side: "left" as const,
  },  
];

export default function ExperiencePage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <HeroSection
        title="Experience"
        sectionNumber="EX.01"
        description="Visually documented journey of my professional and academic endeavors."
      />

      <Section sectionNumber="EX.02" label="Timeline">
        <div className="py-12 sm:py-20 px-4 sm:px-6">
          {/* Vertical timeline */}
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border/40 hidden sm:block" />
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 sm:hidden" />

            {experiences.map((exp, index) => (
              <ViewAnimation
                key={index}
                initial={{ opacity: 0, translateY: -6 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                delay={0.2}
                viewport={{ once: true }}
              >
                <div
                  className={`relative flex items-start gap-6 mb-12 sm:mb-16 ${
                    exp.side === "right" ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 top-2 w-2 h-2 rounded-full bg-muted-foreground/30 -translate-x-1/2 z-10" />

                  {/* Content card */}
                  <div className={`pl-10 sm:pl-0 sm:w-[calc(50%-2rem)] ${exp.side === "left" ? "" : "sm:text-right"}`}>
                    {/* Period marker */}
                    <span className="font-mono-accent text-[10px] text-muted-foreground/40 tracking-wider block mb-2">
                      {exp.timeframe}
                    </span>

                    <h3 className="text-base sm:text-lg font-medium mb-1">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{exp.company}</p>

                    {/* Image */}
                    <motion.div
                      className="relative aspect-[4/3] overflow-hidden bg-muted rounded-sm mb-4 cursor-pointer group"
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={exp.image}
                        alt={exp.company}
                        fill
                        className="object-cover bw-hover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Blueprint hatch overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Corner tick */}
                      <div className="absolute bottom-2 right-2 w-3 h-3">
                        <div className="absolute bottom-0 right-0 w-3 h-px bg-white/30" />
                        <div className="absolute bottom-0 right-0 w-px h-3 bg-white/30" />
                      </div>
                    </motion.div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {exp.description}
                    </p>

                    <div className={`flex flex-wrap gap-2 ${exp.side === "right" ? "sm:justify-end" : ""}`}>
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono-accent text-[10px] px-2 py-0.5 border border-border/40 rounded-sm text-muted-foreground/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ViewAnimation>
            ))}
          </div>
        </div>
      </Section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full aspect-[4/3] rounded-sm overflow-hidden"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.15 }}
            >
              <Image
                src={experiences[selectedImage].image}
                alt={experiences[selectedImage].title}
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.p
              className="absolute bottom-6 text-white text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {experiences[selectedImage].title} — {experiences[selectedImage].company}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
