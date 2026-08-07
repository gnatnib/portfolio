"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, Maximize2, X } from "lucide-react";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import ResumeDocument from "@/components/ResumeDocument";
import {
  resumeUrl,
  RESUME_PREVIEW,
  RESUME_DOWNLOAD_NAME,
  resumeFacts,
  resumeHighlights,
} from "@/lib/resume";

export default function ResumeSection() {
  const [isOpen, setIsOpen] = useState(false);

  /* Lock scroll + allow Esc to close while the viewer is up */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <Section sectionNumber="03" label="Resume">
      <div className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 items-start">
          {/* ── Left: heading, facts, actions ── */}
          <div>
            <ViewAnimation
              initial={{ opacity: 0, translateY: -6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.15}
              viewport={{ once: true }}
            >
              <span className="label-mono block mb-4">Curriculum Vitae</span>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight mb-5">
                Resume
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                The full record — education, work experience, projects and
                certifications. Readable right here, no download needed.
              </p>
            </ViewAnimation>

            {/* Fact table */}
            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.25}
              viewport={{ once: true }}
            >
              <dl className="mt-10 border-t border-border">
                {resumeFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-[92px_1fr] sm:grid-cols-[130px_1fr] gap-4 py-3 border-b border-border"
                  >
                    <dt className="label-mono pt-0.5">{fact.label}</dt>
                    <dd className="text-sm text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </ViewAnimation>

            {/* Highlights */}
            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.3}
              viewport={{ once: true }}
            >
              <ul className="mt-8 space-y-3.5">
                {resumeHighlights.map((item) => (
                  <li key={item.role} className="flex gap-4 items-baseline">
                    <span className="font-mono-accent text-[10px] text-muted-foreground w-9 flex-shrink-0">
                      {item.period}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-foreground">
                        {item.role}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {item.org}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </ViewAnimation>

            {/* Actions */}
            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.4}
              viewport={{ once: true }}
            >
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-foreground bg-foreground text-background text-[13px] font-medium hover:bg-transparent hover:text-foreground transition-colors duration-200"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Read CV
                </button>

                <a
                  href={resumeUrl}
                  download={RESUME_DOWNLOAD_NAME}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-border hover:border-foreground/50 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </a>

                <Link
                  href="/resume"
                  className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Full page
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ViewAnimation>
          </div>

          {/* ── Right: document preview ── */}
          <ViewAnimation
            initial={{ opacity: 0, translateY: 8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.3}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative block w-full max-w-[300px] sm:max-w-[340px] lg:max-w-none mx-auto text-left"
              aria-label="Open CV viewer"
            >
              {/* Frame header */}
              <div className="flex items-center justify-between px-3 py-2 border border-border border-b-0 bg-card">
                <span className="font-mono-accent text-[9px] uppercase tracking-widest text-muted-foreground">
                  CV · 2 pages
                </span>
                <Maximize2 className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>

              <div className="relative aspect-[1/1.3] overflow-hidden border border-border bg-white">
                <Image
                  src={RESUME_PREVIEW}
                  alt="First page of Bintang Syafrian Rizal's CV"
                  fill
                  className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 1024px) 340px, 380px"
                />
                {/* Fade the page out toward the bottom so it reads as a preview */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/70 to-transparent" />

                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-background/95 backdrop-blur-sm text-[12px] text-foreground group-hover:border-foreground/50 transition-colors">
                  Click to read
                </span>
              </div>

              {/* Corner ticks */}
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-muted-foreground/85" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-muted-foreground/85" />
            </button>
          </ViewAnimation>
        </div>
      </div>

      {/* ── Fullscreen viewer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-14 border-b border-border flex-shrink-0">
              <span className="text-[13px] text-foreground truncate">
                Bintang Syafrian Rizal — CV
              </span>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={resumeUrl}
                  download={RESUME_DOWNLOAD_NAME}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border hover:border-foreground/50 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-sm border border-border hover:border-foreground/50 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close CV viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
              <div className="mx-auto w-full max-w-[860px]">
                <ResumeDocument priority />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
