"use client";

import Image from "next/image";
import { resumePages } from "@/lib/resume";

/* Renders the CV as page images. Deliberately not an <iframe> of the PDF:
   download managers and mobile browsers intercept PDFs and leave a blank
   frame, which meant visitors had to download the file just to read it. */
export default function ResumeDocument({
  priority = false,
  className = "",
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {resumePages.map((page, i) => (
        <figure key={page.src} className="relative">
          <Image
            src={page.src}
            alt={`Bintang Syafrian Rizal — CV, page ${i + 1} of ${resumePages.length}`}
            width={page.width}
            height={page.height}
            priority={priority && i === 0}
            sizes="(max-width: 900px) 100vw, 860px"
            className="w-full h-auto border border-border bg-white"
          />
          <figcaption className="absolute top-2 right-2 px-1.5 py-0.5 bg-background/80 border border-border font-mono-accent text-[9px] tracking-widest text-muted-foreground">
            {i + 1} / {resumePages.length}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
