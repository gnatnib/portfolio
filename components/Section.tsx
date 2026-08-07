"use client";

import ViewAnimation from "@/components/ViewAnimation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionNumber?: string;
  label?: string;
  fullBleed?: boolean;
}

export const Section = ({
  children,
  className,
  sectionNumber,
  label,
  fullBleed,
  ...props
}: SectionProps) => (
  <section {...props}>
    <div
      className={cn(
        "relative",
        !fullBleed && "container mx-auto max-w-5xl border-x border-border/40"
      )}
    >
      {/* Section grid texture — subtle crosshatch */}
      {!fullBleed && (
        <div className="absolute inset-0 section-grid opacity-40 pointer-events-none" />
      )}

      {/* + Crosses at four corners */}
      {!fullBleed && (
        <>
          <div className="absolute -top-[11px] -left-[11px] hidden sm:block text-border/60 z-10">
            <Plus size={22} strokeWidth={1} />
          </div>
          <div className="absolute -top-[11px] -right-[11px] hidden sm:block text-border/60 z-10">
            <Plus size={22} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-[11px] -left-[11px] hidden sm:block text-border/60 z-10">
            <Plus size={22} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-[11px] -right-[11px] hidden sm:block text-border/60 z-10">
            <Plus size={22} strokeWidth={1} />
          </div>
        </>
      )}

      {/* Section number marker — lives in the left gutter, outside the content.
          Positioned with `right-full` rather than `left-0 -translate-x-full`:
          ViewAnimation is a motion.div, and framer writes an inline `transform`
          that silently overrode the Tailwind translate utility, leaving the
          marker inside the container and sitting on top of the content.

          Only shown once the gutter can actually hold it — the container caps
          at max-w-5xl (1024px), so below xl there is no gutter at all and the
          marker would overlap the first row. The label needs more room again,
          so it waits for 2xl. */}
      {sectionNumber && (
        <ViewAnimation
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          delay={0.1}
          viewport={{ once: true }}
          className="absolute right-full top-4 sm:top-6 mr-4 hidden xl:flex items-center gap-2 whitespace-nowrap pointer-events-none"
        >
          <span className="font-mono-accent text-[10px] text-muted-foreground/75 tracking-wider">
            [{sectionNumber}]
          </span>
          {label && (
            <span className="hidden 2xl:inline font-mono-accent text-[10px] text-muted-foreground/85 uppercase tracking-widest">
              {label}
            </span>
          )}
        </ViewAnimation>
      )}

      <div className={cn(className)}>{children}</div>
    </div>
  </section>
);

export default Section;
