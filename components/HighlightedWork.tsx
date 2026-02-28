"use client";

import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";

const highlightedProjects = [
  {
    title: "Pangan.id",
    year: "2026",
    image: "/panganmockup.png",
    href: "/work",
  },
  {
    title: "Sistem Informasi Zona KHAS Kelurahan Sendangmulyo",
    year: "2025",
    image: "/zonakhas.png",
    href: "/work",
  },
  {
    title: "SiPP",
    year: "2025",
    image: "/project4.png",
    href: "/work",
  },
];

interface HighlightedWorkProps {
  showLink?: boolean;
}

export default function HighlightedWork({ showLink = true }: HighlightedWorkProps) {
  return (
    <Section sectionNumber="01" label="Projects">
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        {/* Header */}
        <ViewAnimation
          initial={{ opacity: 0, translateY: -4 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.2}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 sm:mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-2">
              Highlighted Work
            </h2>
            <p className="text-sm text-muted-foreground">
              Selected projects showcasing my expertise in building digital experiences.
            </p>
          </div>
          {showLink && (
            <Link
              href="/work"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              View all works →
            </Link>
          )}
        </ViewAnimation>

        {/* 3 equal columns — symmetrical like reference */}
        <ViewAnimation
          initial={{ opacity: 0, translateY: -4 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.3}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {highlightedProjects.map((project) => (
            <Link key={project.title} href={project.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-sm mb-3">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover bw-hover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-medium group-hover:text-muted-foreground transition-colors">
                  {project.title}
                </h3>
                <span className="text-sm text-muted-foreground">{project.year}</span>
              </div>
            </Link>
          ))}
        </ViewAnimation>
      </div>
    </Section>
  );
}
