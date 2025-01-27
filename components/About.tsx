"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, FileDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function About() {
  const { ref, controls, initial } = useScrollAnimation();

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-20 bg-muted/50"
    >
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto"
        >
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80">
              <Image
                src="/profile.png"
                alt="profile"
                fill
                className="rounded-full object-cover shadow-lg"
                priority
              />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold">About Me</h2>
            <div className="space-y-4 text-lg">
              <p>
                Hello! My name is Bintang Syafrian Rizal,a Computer Science
                student at Universitas Diponegoro. I’m passionate about solving
                problems through code and continuously exploring new
                technologies to expand my knowledge.
              </p>
              <p>Sometimes I hike too, hehe.</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                className="gap-2 bg-[#0077B5] hover:bg-[#006497] text-white"
              >
                <a
                  href="https://linkedin.com/in/bintangsyafrian"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinIcon className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open("/cv.pdf", "_blank")}
              >
                <FileDown className="w-5 h-5" />
                Download CV
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
