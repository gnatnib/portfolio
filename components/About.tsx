"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function About() {
  const { ref, controls, initial } = useScrollAnimation();

  return (
    <section id="about" className="h-full flex items-center bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <div className="md:w-1/2">
            <Image
              src="/your-image.jpg"
              alt="Your Name"
              width={400}
              height={400}
              className="rounded-full shadow-lg mx-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <div className="space-y-4">
              <p>
                Hello! I'm a passionate full-stack web developer with a keen eye
                for creating elegant, efficient, and user-friendly web
                applications. With a strong foundation in both front-end and
                back-end technologies, I strive to build seamless digital
                experiences that solve real-world problems.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or enjoying a good cup of
                coffee while brainstorming my next big idea.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
