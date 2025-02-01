"use client";

import { motion, LazyMotion, domAnimation } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from "react-type-animation";
import { Boxes } from "@/components/ui/background-boxes";
import { useEffect, useState, memo } from "react";

// Memoize the content component
const HeroContent = memo(() => (
  <div className="relative z-20 text-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <span className="text-sm md:text-base bg-primary/10 px-4 py-2 rounded-full">
        Welcome to my portfolio
      </span>
    </motion.div>

    <motion.h1
      className="text-4xl md:text-6xl font-bold mb-4 pb-2"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <span>Hi, I'm </span>
      <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
        Bintang
      </span>
    </motion.h1>

    <motion.div
      className="text-xl md:text-2xl mb-8 min-h-[60px]"
      initial={{ opacity: 0, y: 50 }}
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
        className="text-muted-foreground"
      />
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center items-center"
    >
      <Button
        asChild
        className="group relative overflow-hidden w-full sm:w-auto"
        size="lg"
      >
        <a href="#about" className="flex items-center justify-center">
          Explore My Work
          <motion.span
            className="absolute inset-0 bg-primary/20"
            initial={{ x: "100%" }}
            whileHover={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          />
          <ArrowDownIcon className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="group hover:border-primary/50 transition-colors w-full sm:w-auto"
        asChild
      >
        <a href="#connect" className="flex items-center justify-center">
          Get in Touch
          <motion.span className="ml-2 inline-block">👋</motion.span>
        </a>
      </Button>
    </motion.div>
  </div>
));

HeroContent.displayName = "HeroContent";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-20 bg-background dark:bg-black"
      >
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full z-20 pointer-events-none" />
          <Boxes className="absolute inset-0 opacity-[0.25]" />
        </div>
        <HeroContent />
      </section>
    </LazyMotion>
  );
}
