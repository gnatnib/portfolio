"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion, useMotionValue } from "framer-motion";

const experiences = [
  {
    title: "Fullstack Developer Intern",
    company: "PT. Sinergi Asta Nusantara",
    period: "Feb 2026 - Present",
    image: "/experience/san.jpeg",
    type: "Internship",
  },
  {
    title: "Fullstack Developer Intern",
    company: "PT. Usaha Gedung Mandiri",
    period: "Jun – Aug 2024",
    image: "/experience/Fullstack Developer Intern @PT.Usaha Gedung Mandiri.png",
    type: "Internship",
  },
  {
    title: "Laboratory Assistant — Data Structures",
    company: "Universitas Diponegoro",
    period: "Sep – Dec 2024",
    image: "/experience/Laboratory_Assistant_Data Structure.png",
    type: "Part-Time",
  },
  {
    title: "Laboratory Assistant — Computer Network",
    company: "Universitas Diponegoro",
    period: "Feb – May 2024",
    image: "/experience/Laboratory_Assistant_Computer Network.png",
    type: "Part-Time",
  },
  {
    title: "Liaison Officer — ICICoS 2024",
    company: "Universitas Diponegoro",
    period: "Jul 2024",
    image: "/experience/Liaison Officer_ICICoS 2024.png",
    type: "Event",
  },
  {
    title: "Graduated High School",
    company: "SMA Negeri 4 Semarang",
    period: "Jul 2022",
    image: "/experience/graduated_highschool.jpg",
    type: "Education",
  },
];

export default function ExperienceCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const cardWidth = 280;
  const gap = 16;
  const totalWidth = experiences.length * (cardWidth + gap) - gap;

  return (
    <Section sectionNumber="02" label="Journey">
      <div className="py-12 sm:py-20 px-4 sm:px-6 overflow-hidden">
        {/* Header */}
        <ViewAnimation
          initial={{ opacity: 0, translateY: -4 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.2}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10 sm:mb-14"
        >
          <div>
            <span className="font-mono-accent text-[11px] text-muted-foreground/40 tracking-widest block mb-3">
              EXPERIENCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight">
              My Journey
            </h2>
          </div>
          <Link
            href="/experience"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono-accent"
          >
            View all →
          </Link>
        </ViewAnimation>

        {/* Timeline line */}
        <ViewAnimation
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          delay={0.3}
          viewport={{ once: true }}
        >
          {/* Step indicators */}
          <div className="flex items-center gap-0 mb-6">
            {experiences.map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-border" />
                {i < experiences.length - 1 && (
                  <div className="w-16 sm:w-24 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </ViewAnimation>

        {/* Draggable cards */}
        <ViewAnimation
          initial={{ opacity: 0, translateY: -4 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.4}
          viewport={{ once: true }}
        >
          <div ref={containerRef} className="cursor-grab active:cursor-grabbing">
            <motion.div
              className="flex"
              style={{ x, gap: `${gap}px` }}
              drag="x"
              dragConstraints={{
                left: -(totalWidth - (containerRef.current?.clientWidth || 600)),
                right: 0,
              }}
              dragElastic={0.08}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 35 }}
            >
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 group"
                  style={{ width: cardWidth }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Card with image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-sm mb-3">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Type badge */}
                    <span className="absolute top-3 right-3 font-mono-accent text-[10px] text-white/0 group-hover:text-white/70 bg-black/0 group-hover:bg-black/30 px-2 py-0.5 rounded-sm backdrop-blur-sm transition-all duration-300">
                      {exp.type}
                    </span>
                  </div>

                  {/* Text content */}
                  <div>
                    <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                      {exp.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{exp.company}</p>
                    <p className="font-mono-accent text-[10px] text-muted-foreground/50 mt-1">
                      {exp.period}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <p className="font-mono-accent text-[10px] text-muted-foreground/30 mt-4 select-none tracking-wider">
            ← DRAG TO EXPLORE →
          </p>
        </ViewAnimation>
      </div>
    </Section>
  );
}
