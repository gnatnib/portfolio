"use client";

import { motion } from "framer-motion";
import { GraduationCapIcon, BriefcaseIcon, AtomIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const experiences = [
  {
    title: "Graduated Bootcamp",
    location: "Miami, FL",
    date: "2019",
    description:
      "I graduated after 6 months of studying. I immediately found a job as a front-end developer.",
    icon: GraduationCapIcon,
  },
  {
    title: "Front-End Developer",
    location: "Orlando, FL",
    date: "2019 - 2021",
    description:
      "I worked as a front-end developer for 2 years in 1 job and 1 year in another job. I also upskilled to the full stack.",
    icon: BriefcaseIcon,
  },
  {
    title: "Full-Stack Developer",
    location: "Houston, TX",
    date: "2021 - present",
    description:
      "I'm now a full-stack developer working as a freelancer. My stack includes React, Next.js, TypeScript, Tailwind, Prisma and MongoDB. I'm open to full-time opportunities.",
    icon: AtomIcon,
  },
];

export default function Experience() {
  const { ref, controls, initial } = useScrollAnimation();

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center">My Experience</h2>
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-border" />

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`flex items-center mb-8 ${
                index % 2 === 0 ? "justify-end" : ""
              }`}
            >
              {/* Timeline content */}
              <motion.div
                className={`w-5/12 ${
                  index % 2 === 0 ? "text-right pr-8" : "pl-8"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <p className="text-muted-foreground">{exp.location}</p>
                <p className="text-sm text-muted-foreground mt-1">{exp.date}</p>
                <p className="mt-2">{exp.description}</p>
              </motion.div>

              {/* Timeline icon */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <exp.icon className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Empty div for layout on alternate sides */}
              <div className={`w-5/12 ${index % 2 === 0 ? "pl-8" : "pr-8"}`} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
