"use client";

import { useState } from "react";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import HeroSection from "@/components/HeroSection";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion, AnimatePresence } from "framer-motion";

const quickFacts = [
  { label: "Location", value: "Semarang, ID" },
  { label: "University", value: "Universitas Diponegoro" },
  { label: "Focus", value: "Web Development, Machine Learning" },
  { label: "Interests", value: "ML, Web Development, AI" },
];

const awards = [
  { title: "First Winner of Men Tennis Court POPDA Sub District Level Competition", org: "POPDA", year: "2015" },
  { title: "First Winner of Men Tennis Court POPDA Sub District Level Competition", org: "POPDA", year: "2016" },
  { title: "Third Winner of Men Tennis Court POPDA City Level Competition Held in Semarang", org: "POPDA", year: "2016" },
];

const certificates = [
  { image: "/dicoding_Memulai Pemrograman dengan Java.png", title: "Dicoding - Memulai Pemrograman dengan Java" },
  { image: "/dicoding_Memulai Pemrograman dengan C.png", title: "Dicoding - Memulai Pemrograman dengan C" },
  { image: "/HackerRank Problem Solving (Intermediate).png", title: "HackerRank Problem Solving (Intermediate)" },
  { image: "/HackerRank Problem Solving (Basic).png", title: "HackerRank Problem Solving (Basic)" },
  { image: "/Hackerrank Software Engineer Intern.png", title: "HackerRank SWE Intern" },
  { image: "/Hackerrank_SQL Basic.png", title: "HackerRank SQL (Basic)" },
  { image: "/HackerRank Python (Basic).png", title: "HackerRank Python (Basic)" },
  { image: "/ORACLE Academy_Database Programming with SQL.png", title: "Database Programming with SQL" },
  { image: "/ORACLE Academy_Database Design.png", title: "Database Design" },
  { image: "/Alibaba Cloud Certification.jpg", title: "Alibaba Cloud Certification" },
  { image: "/img_0ef21bdf766d04c0c4b38c06c741255e.png", title: "The History of Cloud Computing" },
  { image: "/img_1be594f24d811463f46eaaea34f78a65.png", title: "ECS Fundamentals" },
  { image: "/img_4a43149da98595ff9b7dcbf973188246.png", title: "Cloud Computing and Application in Sports" },
  { image: "/img_5c720758bbeeae29df36e836d217b7cf.png", title: "ApsaraDB RPS Fundamentals" },
  { image: "/img_2969f056d87f8c2b0a6029a2a6220b4d.png", title: "Alibaba Cloud Academy Online Conference" },
  { image: "/img_577d6d43dbcb6c8672935bed4e2f39d6.png", title: "VPC Fundamentals" },
  { image: "/img_6808b8bffb62813a3702c4f6322faaa5.png", title: "Fundamentals of Cloud Computing" },
  { image: "/img_717f4daee32bcb6c4d2fe3b9da132ec2.png", title: "Key Technologies in Cloud Computing" },
  { image: "/img_7faaefce0782713b8b8f6a7eb7514f24.png", title: "OSS Fundamentals" },
  { image: "/img_839353e88a7be7fbe195d8fcde2d2cac.png", title: "Uncovering your Stable, Secured and Reliable Cloud" },
  { image: "/img_88e7f9df7afe84bc763f4c18c1f19fd3.png", title: "Certificate of Achievement" },
  { image: "/img_b6f0dedb8475a34c7194c5182c54eba1.png", title: "SLB Fundamentals" },
  { image: "/img_cf1618e0ec491d79485edd0afd993b97.png", title: "The Benefits of Cloud Computing" },
  { image: "/img_cf4ea38957ed87b659045f5b6d797be7.png", title: "Deploying MySQL on ECS" },
  { image: "/img_eda48a8dfa150907867499e3a514feb7.png", title: "Auto Scaling Fundamentals" },
  { image: "/Certification Panitia POINTS 2023.jpg", title: "Panitia POINTS 2023" },
  { image: "/ICP Web3 Workshop.png", title: "ICP Web3 Workshop" },
];

export default function AboutPage() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  return (
    <>
      {/* Hero with image beside it */}
      <Section sectionNumber="AB.01">
        <div className="relative py-16 sm:py-24 px-4 sm:px-6">
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

          <div className="relative grid sm:grid-cols-[1.2fr_1fr] gap-8 sm:gap-12 items-center">
            {/* Left â€” Title + description */}
            <div>
              <ViewAnimation
                initial={{ opacity: 0, translateY: -8 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                delay={0.2}
                viewport={{ once: true }}
              >
                <span className="font-mono-accent text-[11px] text-muted-foreground/40 tracking-widest block mb-4">
                  &lt;AB.01&gt;
                </span>
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-5xl sm:text-7xl font-medium tracking-tighter">
                    About
                  </h1>
                  <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300">
                    <DotLottieReact
                      src="https://lottie.host/354f1c98-708f-449f-b608-65973de24d58/JStXRSWgtL.lottie"
                      loop
                      autoplay
                    />
                  </div>
                </div>
              </ViewAnimation>

              <ViewAnimation
                initial={{ opacity: 0, translateY: -4 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                delay={0.4}
                viewport={{ once: true }}
              >
                <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                  An inquisitive software artisan and digital conjurer, passionately immersed in the
                  intricate symphony of codecraft, perpetually driven by a relentless quest for
                  computational elegance and interactive ingenuity.
                </p>
              </ViewAnimation>
            </div>

            {/* Right â€” run_about.JPG with frame */}
            <ViewAnimation
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              delay={0.3}
              viewport={{ once: true }}
              className="flex items-center justify-center sm:justify-end"
            >
              <div className="relative w-full max-w-[300px] group">
                {/* Offset border frame */}
                <div
                  className="absolute -top-2 -right-2 w-full h-full border border-border/40 rounded-sm pointer-events-none"
                  style={{ transform: "rotate(1deg)" }}
                />

                {/* Main image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src="/run_about.JPG"
                    alt="Bintang Syafrian Rizal"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                </div>

                {/* Corner tick marks */}
                <div className="absolute -bottom-2 -left-2 w-3 h-3">
                  <div className="absolute bottom-0 left-0 w-3 h-px bg-muted-foreground/30" />
                  <div className="absolute bottom-0 left-0 w-px h-3 bg-muted-foreground/30" />
                </div>
              </div>
            </ViewAnimation>
          </div>
        </div>
      </Section>

      {/* Bio + Quick Facts (Split Layout) */}
      <Section sectionNumber="AB.02" label="Bio">
        <div className="grid sm:grid-cols-[1.5fr_1fr] py-12 sm:py-16 px-4 sm:px-6 gap-10 sm:gap-16">
          {/* Bio text */}
          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.2}
            viewport={{ once: true }}
          >
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              I&apos;m a Computer Science student at Universitas Diponegoro with a passion for building
              meaningful software. My journey spans fullstack web development, machine learning, and AI.
              I thrive at the intersection of creative design and technical depth turning ideas into
              experiences that feel both polished and purposeful.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
              I am always eager to take on new challenges and
              expand my skill set especially in utilizing AI. I am passionate about using technology to solve real-world problems
              and create meaningful impact.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
              Outside of coding, I enjoy playing tennis, run 5K, and hike mountains.
            </p>
          </ViewAnimation>

          {/* Quick facts sidebar */}
          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.3}
            viewport={{ once: true }}
            className="sm:border-l sm:pl-8 border-border/40"
          >
            <h3 className="font-mono-accent text-[11px] text-muted-foreground/50 tracking-widest uppercase mb-6">
              Quick Facts
            </h3>
            <div className="space-y-4">
              {quickFacts.map((fact) => (
                <div key={fact.label}>
                  <p className="font-mono-accent text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                    {fact.label}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{fact.value}</p>
                </div>
              ))}
            </div>
          </ViewAnimation>
        </div>
      </Section>

      {/* Awards & Recognition */}
      <Section sectionNumber="AB.03" label="Awards">
        <div className="py-12 sm:py-16 px-4 sm:px-6">
          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.2}
            viewport={{ once: true }}
          >
            <span className="font-mono-accent text-[11px] text-muted-foreground/40 tracking-widest block mb-3">
              RECOGNITION
            </span>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight mb-10">
              Awards
            </h2>
          </ViewAnimation>

          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.3}
            viewport={{ once: true }}
          >
            <div className="divide-y divide-border/40">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between py-4 sm:py-5 group cursor-default"
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="font-mono-accent text-[10px] text-muted-foreground/30 w-6 flex-shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium truncate group-hover:text-muted-foreground transition-colors">
                        {award.title}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{award.org}</p>
                    </div>
                  </div>
                  <span className="font-mono-accent text-xs text-muted-foreground/40 flex-shrink-0 ml-4">
                    {award.year}
                  </span>
                </motion.div>
              ))}
            </div>
          </ViewAnimation>
        </div>
      </Section>

      <Section sectionNumber="AB.04" label="Certs">
        <div className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="sticky top-[64px] sm:top-[76px] z-20 bg-background/90 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border/20">
            <span className="font-mono-accent text-[11px] text-muted-foreground/40 tracking-widest block mb-2">
              CERTIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight">
              Certificates
            </h2>
          </div>

          <div className="mt-8">
            <ViewAnimation
              initial={{ opacity: 0, translateY: -4 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={0.3}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {certificates.map((cert, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedCert(selectedCert === index ? null : index)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-muted rounded-sm">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover bw-hover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-medium">{cert.title}</span>
                    </div>
                    {/* Corner tick */}
                    <div className="absolute top-2 right-2 w-2.5 h-2.5">
                      <div className="absolute top-0 right-0 w-2.5 h-px bg-white/30" />
                      <div className="absolute top-0 right-0 w-px h-2.5 bg-white/30" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                    {cert.title}
                  </p>
                </motion.div>
              ))}
            </ViewAnimation>
          </div>
        </div>
      </Section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedCert !== null && certificates[selectedCert] && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full aspect-[3/2] rounded-sm overflow-hidden"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.15 }}
            >
              <Image
                src={certificates[selectedCert].image}
                alt={certificates[selectedCert].title}
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.p
              className="absolute bottom-6 text-white text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {certificates[selectedCert].title}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

