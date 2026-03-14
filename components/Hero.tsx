"use client";

import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion } from "framer-motion";
import CompactGitHubCard from "@/components/CompactGitHubCard";

export default function Hero() {
  return (
    <Section sectionNumber="00" label="Home">
      <div className="relative flex flex-col justify-center pt-10 sm:pt-16 pb-6 sm:pb-8">
        {/* Faint blueprint grid behind hero */}
        <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />

        <div className="relative w-full grid sm:grid-cols-[1.2fr_1fr] gap-0 items-center">
          {/* Left — Text */}
          <div className="p-6 sm:p-10 sm:py-10 relative z-10">
            {/* Coordinate marker */}
            <ViewAnimation
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              delay={0.1}
              viewport={{ once: true }}
            >
              <span className="font-mono-accent text-[11px] text-muted-foreground/40 tracking-widest mb-6 block">
                &lt;00.01&gt; PROFILE
              </span>
            </ViewAnimation>

            <ViewAnimation
              initial={{ opacity: 0, translateY: -12 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.2}
              viewport={{ once: true }}
            >
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] mb-8">
                Bintang
                <br />
                <span className="text-muted-foreground/30">Syafrian</span>
                <br />
                Rizal
              </h1>
            </ViewAnimation>

            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.5}
              viewport={{ once: true }}
            >
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-sm">
                Software developer crafting digital experiences
                with precision and creative ambition.
              </p>
            </ViewAnimation>

            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.7}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group"
                >
                  <span className="font-mono-accent text-[10px] text-muted-foreground/40">→</span>
                  Explore my work
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↗
                  </motion.span>
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Get in touch
                </Link>
              </div>
            </ViewAnimation>
          </div>

          {/* Right — Profile Image with offset frame */}
          <ViewAnimation
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            delay={0.3}
            viewport={{ once: true }}
            className="flex items-center justify-center p-6 sm:p-10 relative"
          >
            <div className="relative w-full max-w-[300px]">
              {/* Offset border frame — primary */}
              <div
                className="absolute -top-3 -right-3 w-full h-full border-2 border-foreground/15 rounded-sm pointer-events-none"
                style={{ transform: "rotate(1.5deg)" }}
              />
              {/* Second decorative frame for depth */}
              <div
                className="absolute -top-1.5 -right-1.5 w-full h-full border border-border/25 rounded-sm pointer-events-none"
                style={{ transform: "rotate(0.5deg)" }}
              />

              {/* Main image */}
              <div className="relative overflow-hidden rounded-sm group border border-border/30">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src="/profile.png"
                    alt="Bintang Syafrian Rizal"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="400px"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                </div>

                {/* Bottom annotation */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="font-mono-accent text-[10px] text-white/60 drop-shadow-lg">
                    Semarang, ID
                  </span>
                  <span className="font-mono-accent text-[10px] text-white/60 drop-shadow-lg">
                    
                  </span>
                </div>
              </div>

              {/* Corner tick marks — bottom-left */}
              <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4">
                <div className="absolute bottom-0 left-0 w-4 h-px bg-muted-foreground/40" />
                <div className="absolute bottom-0 left-0 w-px h-4 bg-muted-foreground/40" />
              </div>
              {/* Corner tick marks — top-right */}
              <div className="absolute -top-2.5 -right-2.5 w-4 h-4">
                <div className="absolute top-0 right-0 w-4 h-px bg-muted-foreground/40" />
                <div className="absolute top-0 right-0 w-px h-4 bg-muted-foreground/40" />
              </div>
            </div>
          </ViewAnimation>
        </div>

        {/* Compact GitHub Contribution Graph spanning bottom */}
        <div className="w-full px-6 sm:px-10 mt-4 sm:mt-6 relative z-10">
          <ViewAnimation
            initial={{ opacity: 0, translateY: 4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.9}
            viewport={{ once: true }}
          >
            <CompactGitHubCard />
          </ViewAnimation>
        </div>
      </div>
    </Section>
  );
}
