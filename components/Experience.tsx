"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const experiences = [
  {
    description: `At PT. UG Mandiri, I serve as a Software Engineer Intern, developing enterprise-level web applications. My role involves building the UG Booking (Rumeet) system and UG Procurement (SiPP) platform using Laravel and PHP, creating scalable solutions for corporate room booking and procurement management.
    
As a Full-Stack Developer, I implement complex database architectures, build RESTful APIs, and create responsive user interfaces. I collaborate closely with the team to deliver high-quality software solutions.`,
    company: "PT. UG Mandiri",
    role: "Software Engineer Intern",
    period: "2025 - Present",
    tags: ["Internship"],
    logo: null,
  },
  {
    description: `At Universitas Diponegoro, I serve as a Teaching Assistant for multiple courses. For Data Structures (PAIK6301), I guide students through complex algorithmic concepts, help them understand data organization, and assist with practical laboratory sessions.
    
As a Computer Network Teaching Assistant (PAIK6402), I help students grasp networking protocols, configure network devices, and understand the fundamentals of computer networking.`,
    company: "Universitas Diponegoro",
    role: "Teaching Assistant",
    period: "2024 - Present",
    tags: ["Onsite"],
    logo: "/undip.png",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 section-separator">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Experience
          </h2>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            An anthology of endeavors, technical articulations, and algorithmic craftsmanship
            manifesting my ventures into software orchestration, drone-centric robotics, and digital
            interface alchemy.
          </p>
        </motion.div>

        {/* Experience Entries */}
        <div className="space-y-16">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid md:grid-cols-2 gap-8 md:gap-16 section-separator pt-8"
            >
              {/* Left - Description */}
              <div>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {exp.description}
                </p>
              </div>

              {/* Right - Company Card */}
              <div className="flex flex-col items-start md:items-end">
                <div className="flex items-start gap-4 mb-4">
                  {exp.logo ? (
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={exp.logo}
                        alt={exp.company}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-sm font-bold">
                        {exp.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="text-left md:text-right">
                    <h3 className="text-gray-900 font-semibold">{exp.company}</h3>
                    <p className="text-gray-500 text-sm">{exp.role}</p>
                    <p className="text-gray-400 text-sm">{exp.period}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {exp.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`text-xs px-3 py-1 rounded-full ${tag === "Remote" ? "bg-blue-100 text-blue-700" :
                          tag === "Freelance" ? "bg-green-100 text-green-700" :
                            tag === "Hybrid" ? "bg-purple-100 text-purple-700" :
                              tag === "Onsite" ? "bg-orange-100 text-orange-700" :
                                tag === "Internship" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
