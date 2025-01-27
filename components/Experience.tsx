"use client";

import { motion } from "framer-motion";
import {
  GraduationCapIcon,
  SchoolIcon,
  LayoutTemplateIcon,
  BracesIcon,
  GlobeLockIcon,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const experiences = [
  {
    title: "Graduated Highschool",
    location: "Semarang, Indonesia",
    date: "2020",
    description:
      "I graduated highschool in 2020. I was a student at SMAN 4 Semarang. I reached top 10 in my almamater.",
    icon: SchoolIcon,
  },
  {
    title: "Computer Network Teaching Assistant",
    location: "Universitas Diponegoro, Indonesia",
    date: "2024",
    description:
      "Teaching Assistant for PAIK6402 Computer Networking Laboratory.",
    icon: GlobeLockIcon,
  },
  {
    title: "Data Structures Teaching Assistant",
    location: "Universitas Diponegoro, Indonesia",
    date: "2024",
    description:
      "Teaching Assistant for PAIK6301 Data Structures and Algorithms Laboratory.",
    icon: BracesIcon,
  },

  {
    title: "Software Engineer Intern at PT. UG Mandiri",
    location: "Jakarta, Indonesia",
    date: "2025",
    description:
      "Developing UG Booking and UG Procurement System using Laravel and PHP.",
    icon: LayoutTemplateIcon,
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
            <div key={index} className="relative flex justify-center mb-8">
              {/* Left content */}
              <div className="w-5/12">
                {index % 2 === 0 && (
                  <motion.div
                    className="text-right pr-8"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.location}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.date}
                    </p>
                    <p className="mt-2">{exp.description}</p>
                  </motion.div>
                )}
              </div>

              {/* Timeline icon */}
              <div className="relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-full bg-background border-2 border-[#0077B5] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <exp.icon className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Right content */}
              <div className="w-5/12">
                {index % 2 === 1 && (
                  <motion.div
                    className="text-left pl-8"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.location}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.date}
                    </p>
                    <p className="mt-2">{exp.description}</p>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
