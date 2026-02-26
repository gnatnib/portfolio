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

      {/* Section number marker */}
      {sectionNumber && (
        <ViewAnimation
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          delay={0.1}
          viewport={{ once: true }}
          className="absolute -left-2 sm:left-0 top-4 sm:top-6 hidden sm:flex items-center gap-2 -translate-x-full pr-4"
        >
          <span className="font-mono-accent text-[10px] text-muted-foreground/50 tracking-wider">
            [{sectionNumber}]
          </span>
          {label && (
            <span className="font-mono-accent text-[10px] text-muted-foreground/30 uppercase tracking-widest">
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
