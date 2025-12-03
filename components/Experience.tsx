"use client";

import { Timeline } from "@/components/ui/timeline";
import {
  SchoolIcon,
  GlobeLockIcon,
  BracesIcon,
  LayoutTemplateIcon,
} from "lucide-react";

export default function Experience() {
  const data = [
    {
      title: "2025",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutTemplateIcon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-bold">
              Software Engineer Intern at PT. UG Mandiri
            </p>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
            Jakarta, Indonesia
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
            Developing UG Booking and UG Procurement System using Laravel and PHP.
          </p>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BracesIcon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-bold">
              Data Structures Teaching Assistant
            </p>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
            Universitas Diponegoro, Indonesia
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
            Teaching Assistant for PAIK6301 Data Structures and Algorithms Laboratory.
          </p>

          <div className="flex items-center gap-2 mb-2">
            <GlobeLockIcon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-bold">
              Computer Network Teaching Assistant
            </p>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
            Universitas Diponegoro, Indonesia
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
            Teaching Assistant for PAIK6402 Computer Networking Laboratory.
          </p>
        </div>
      ),
    },
    {
      title: "2019",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SchoolIcon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-bold">
              Graduated Highschool
            </p>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
            SMA Negeri 4 Semarang, Indonesia
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
            I graduated highschool in 2019. I took science class and finished with 94+ average. I reached top 10 in my almamater.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id="experience" className="w-full bg-background dark:bg-black">
      <Timeline data={data} />
    </section>
  );
}
