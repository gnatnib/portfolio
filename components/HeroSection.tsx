"use client";

import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";

interface HeroSectionProps {
  title: string;
  description: string;
  sectionNumber?: string;
}

export default function HeroSection({ title, description, sectionNumber }: HeroSectionProps) {
  return (
    <Section sectionNumber={sectionNumber}>
      <div className="relative py-16 sm:py-24 px-4 sm:px-6">
        {/* Faint blueprint grid */}
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

        <div className="relative">
          <ViewAnimation
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.2}
            viewport={{ once: true }}
          >
            {sectionNumber && (
              <span className="font-mono-accent text-[11px] text-muted-foreground/40 tracking-widest block mb-4">
                &lt;{sectionNumber}&gt;
              </span>
            )}
            <h1 className="text-5xl sm:text-7xl font-medium tracking-tighter mb-6">
              {title}
            </h1>
          </ViewAnimation>

          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.4}
            viewport={{ once: true }}
          >
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              {description}
            </p>
          </ViewAnimation>
        </div>
      </div>
    </Section>
  );
}
