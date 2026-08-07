import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import ResumeDocument from "@/components/ResumeDocument";
import {
  resumeUrl,
  RESUME_DOWNLOAD_NAME,
  resumeFacts,
  resumeHighlights,
} from "@/lib/resume";

export const metadata: Metadata = {
  title: "Resume | Bintang Syafrian Rizal",
  description:
    "Curriculum vitae of Bintang Syafrian Rizal — Informatics student at Universitas Diponegoro, software developer and machine learning enthusiast.",
};

export default function ResumePage() {
  return (
    <>
      <Section sectionNumber="RS.01" label="Resume">
        <div className="relative py-16 sm:py-24 px-4 sm:px-6">
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

          <div className="relative">
            <ViewAnimation
              initial={{ opacity: 0, translateY: -8 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.15}
              viewport={{ once: true }}
            >
              <span className="label-mono block mb-4">&lt;RS.01&gt; Curriculum Vitae</span>
              <h1 className="text-5xl sm:text-7xl font-medium tracking-tighter mb-6">
                Resume
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                Education, work experience, projects and certifications. Read it
                below or take the PDF with you.
              </p>
            </ViewAnimation>

            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.3}
              viewport={{ once: true }}
            >
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={resumeUrl}
                  download={RESUME_DOWNLOAD_NAME}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-foreground/80 bg-foreground text-background font-mono-accent text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-foreground transition-colors duration-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border hover:border-muted-foreground/75 font-mono-accent text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in new tab
                </a>
              </div>
            </ViewAnimation>
          </div>
        </div>
      </Section>

      {/* Summary rail */}
      <Section sectionNumber="RS.02" label="Summary">
        <div className="grid sm:grid-cols-2 gap-10 sm:gap-16 py-12 sm:py-16 px-4 sm:px-6">
          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.2}
            viewport={{ once: true }}
          >
            <h2 className="label-mono mb-6">At a glance</h2>
            <dl className="border-t border-border">
              {resumeFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 py-3 border-b border-border"
                >
                  <dt className="label-mono pt-0.5">{fact.label}</dt>
                  <dd className="text-sm text-foreground/90">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </ViewAnimation>

          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.3}
            viewport={{ once: true }}
          >
            <h2 className="label-mono mb-6">Highlights</h2>
            <ul className="space-y-5">
              {resumeHighlights.map((item) => (
                <li key={item.role} className="flex gap-4 items-baseline">
                  <span className="font-mono-accent text-[10px] text-muted-foreground/75 w-9 flex-shrink-0">
                    {item.period}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-foreground/90">
                      {item.role}
                    </span>
                    <span className="block text-xs text-muted-foreground/70">
                      {item.org}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </ViewAnimation>
        </div>
      </Section>

      {/* Embedded document */}
      <Section sectionNumber="RS.03" label="Document">
        <div className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="mx-auto w-full max-w-[860px]">
            <div className="flex items-center justify-between px-3 py-2 border border-border border-b-0 bg-card">
              <span className="font-mono-accent text-[9px] uppercase tracking-widest text-muted-foreground">
                CV_Bintang_Syafrian_Rizal.pdf
              </span>
              <span className="font-mono-accent text-[9px] uppercase tracking-widest text-muted-foreground">
                2 pages
              </span>
            </div>

            <ResumeDocument priority />
          </div>
        </div>
      </Section>
    </>
  );
}
