"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const awards = [
  { title: "3rd Place - National Cyber Security Competition (LKS)", organization: "Ministry of Education and Culture RI", year: "2020" },
  { title: "1st Place - Provincial Cyber Security Competition (LKS Central Java)", organization: "Education & Culture Office of Central Java", year: "2020" },
  { title: "4th Place - Technoinfest Network Competition", organization: "Politeknik Negeri Semarang (Polines)", year: "2020" },
  { title: "Finalist - Dinasfest IT Competition", organization: "Dinasfest", year: "2020" },
  { title: "2nd Place - Ebination Networking Competition", organization: "Yogyakarta State University (UNY)", year: "2019" },
  { title: "2nd Place - City IT Network Support (LKS Semarang)", organization: "Education & Culture Office of Central Java", year: "2019" },
  { title: "1st Place - Technoinfest Network Competition", organization: "Politeknik Negeri Semarang (Polines)", year: "2019" },
  { title: "2nd Place - Dinasfest IT Competition (Quiz)", organization: "HMTI UDINUS", year: "2019" },
];

const certificates = [
  { image: "/Alibaba Cloud Certification.jpg", title: "Alibaba Cloud Professional Cloud Computing Certification" },
  { image: "/HackerRank Problem Solving (Intermediate).png", title: "HackerRank Problem Solving (Intermediate)" },
  { image: "/Hackerrank Software Engineer Intern.png", title: "HackerRank Software Engineer Intern" },
  { image: "/ORACLE Academy_Database Programming with SQL.png", title: "Oracle Academy Database Programming with SQL" },
];

export default function About() {
  return (
    <section id="about" className="py-20 section-separator">
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
            About Me
          </h2>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            A curated assemblage of reflections, annotations, and musings chronicling my odyssey
            through an existence richly embroidered with technological fascination, robotic pursuits,
            athletic diversions, and interface artistry.
          </p>
        </motion.div>

        {/* Awards & Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="section-separator pt-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Awards & Recognition</h3>
            <p className="text-gray-500 text-sm">
              Honors received for contributions in design, development, and open source.
            </p>
          </div>

          <div className="space-y-0">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <div className="col-span-12 md:col-span-6">
                  <span className="text-gray-900 text-sm font-medium">{award.title}</span>
                </div>
                <div className="col-span-8 md:col-span-4">
                  <span className="text-gray-500 text-sm">{award.organization}</span>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">
                  <span className="text-gray-400 text-sm">{award.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-separator pt-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Certificates</h3>
            <p className="text-gray-500 text-sm">
              An ambitious scholar and lifelong learner, dedicated to the pursuit of
              personal and academic achievement.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 mb-3 rounded-sm">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{cert.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
