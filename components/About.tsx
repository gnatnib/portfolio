"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, FileDown, Code, User, GraduationCap, MapPin, Heart } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Globe } from "@/components/ui/globe";

const PassionBubbles = () => {
  const passions = ["Data Science", "Machine Learning", "Web Dev", "UI/UX", "Hiking", "Photography"];

  return (
    <div className="relative w-full h-full min-h-[150px] overflow-hidden bg-gradient-to-br from-neutral-900 to-black rounded-xl p-4">
      {passions.map((passion, i) => (
        <motion.div
          key={passion}
          className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-white whitespace-nowrap"
          initial={{ x: Math.random() * 200, y: Math.random() * 100 }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{
            left: `${(i % 3) * 30 + 10}%`,
            top: `${Math.floor(i / 3) * 40 + 20}%`,
          }}
        >
          {passion}
        </motion.div>
      ))}
    </div>
  );
};

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center bg-background dark:bg-black py-20 relative overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get to know me better through my journey and interests.
          </p>
        </motion.div>

        <BentoGrid className="max-w-6xl mx-auto">
          {/* Profile Photo - Vertical */}
          <BentoGridItem
            title={<span className="text-xl font-bold">Who I Am</span>}
            description={<span className="text-base text-neutral-300">I'm Bintang Syafrian Rizal, a passionate Computer Science student at Universitas Diponegoro.</span>}
            header={
              <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden group">
                <Image
                  src="/profile.png"
                  alt="profile"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            }
            className="md:col-span-1 md:row-span-2"
            icon={<User className="h-5 w-5 text-neutral-500" />}
          />

          {/* Location with Globe */}
          <BentoGridItem
            title={<span className="text-xl font-bold">Location</span>}
            description={<span className="text-base text-neutral-300">Based in Semarang, Indonesia.</span>}
            header={
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-neutral-900">
                <Globe className="absolute inset-0 w-full h-full" />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white font-medium">Remote Ready</span>
                </div>
              </div>
            }
            className="md:col-span-1"
            icon={<MapPin className="h-5 w-5 text-neutral-500" />}
          />

          {/* Education */}
          <BentoGridItem
            title={<span className="text-xl font-bold">Education</span>}
            description={<span className="text-base text-neutral-300">Computer Science at Universitas Diponegoro.</span>}
            header={
              <div className="flex flex-1 w-full h-full min-h-[150px] rounded-xl bg-neutral-900 items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.05]" />
                <GraduationCap className="w-16 h-16 text-neutral-200 group-hover:scale-110 transition-transform duration-300" />
              </div>
            }
            className="md:col-span-1"
            icon={<GraduationCap className="h-5 w-5 text-neutral-500" />}
          />

          {/* Passion Bubbles */}
          <BentoGridItem
            title={<span className="text-xl font-bold">My Passion</span>}
            description={<span className="text-base text-neutral-300">Things that keep me going.</span>}
            header={<PassionBubbles />}
            className="md:col-span-2"
            icon={<Heart className="h-5 w-5 text-neutral-500" />}
          />
        </BentoGrid>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            asChild
            className="gap-2 rounded-full"
            variant="default"
          >
            <a
              href="https://linkedin.com/in/bintangsyafrian"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            onClick={() => window.open("/cv.pdf", "_blank")}
          >
            <FileDown className="w-4 h-4" />
            Download CV
          </Button>
        </div>
      </div>
    </section>
  );
}
