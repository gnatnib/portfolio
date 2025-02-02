"use client";

import { motion, useAnimation } from "framer-motion";
import {
  SchoolIcon,
  GlobeLockIcon,
  BracesIcon,
  LayoutTemplateIcon,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const experiences = [
  {
    title: "Graduated Highschool",
    location: "SMA Negeri 4 Semarang, Indonesia",
    date: "2019",
    description:
      "I graduated highschool in 2019. I took science class and finished with 94+ average. I reached top 10 in my almamater.",
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <section
      id="experience"
      className="min-h-screen py-20 bg-background dark:bg-black"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center">My Experience</h2>
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Timeline line with animated glowing effect */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-gray-300 overflow-hidden">
            <motion.div
              className="w-full h-16 bg-gradient-to-b from-[#0077B5] to-transparent rounded-full"
              initial={{ y: -100 }}
              animate={{ y: isMobile ? "200vh" : "100vh" }}
              transition={{
                duration: 2, // Faster animation
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                boxShadow: "0 0 15px 5px rgba(0, 119, 181, 0.8)",
              }}
            />
          </div>

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
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
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
