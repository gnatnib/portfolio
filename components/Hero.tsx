"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from "react-type-animation";
import { Spotlight } from "@/components/ui/Spotlight";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-background dark:bg-black overflow-hidden"
    >
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/50 border border-secondary text-sm text-secondary-foreground backdrop-blur-sm">
            Welcome to my portfolio
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="block text-foreground">Hi, I'm</span>
          <span className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Bintang
          </span>
        </motion.h1>

        <motion.div
          className="text-xl md:text-2xl mb-10 min-h-[60px] text-muted-foreground font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TypeAnimation
            sequence={[
              "Full-Stack Developer",
              2000,
              "UI/UX Enthusiast",
              2000,
              "Problem Solver",
              2000,
              "Tech Explorer",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Number.POSITIVE_INFINITY}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            asChild
            className="group relative overflow-hidden rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-neutral-200 transition-all duration-300"
          >
            <a href="#about" className="flex items-center justify-center">
              Explore My Work
              <ArrowDownIcon className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </Button>
          <Button
            variant="outline"
            className="group rounded-full px-8 py-6 text-lg border-neutral-800 hover:bg-neutral-900 hover:text-white transition-all duration-300"
            asChild
          >
            <a href="#contact" className="flex items-center justify-center">
              Get in Touch
              <span className="ml-2 group-hover:rotate-12 transition-transform">👋</span>
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Subtle background gradient for depth */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
