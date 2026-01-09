import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, FileDown, Code, User, GraduationCap, MapPin, Heart } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Globe } from "@/components/ui/globe";
import { AsciiReveal } from "@/components/ui/AsciiReveal";

const PassionBubbles = () => {
  const passions = ["Data Science", "Machine Learning", "Web Dev", "UI/UX", "Hiking", "Photography"];

  const mouseX = useMotionValue(-Infinity);
  const mouseY = useMotionValue(-Infinity);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-Infinity);
    mouseY.set(-Infinity);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[150px] overflow-hidden bg-gradient-to-br from-neutral-900 to-black rounded-xl p-4"
    >
      {passions.map((passion, i) => (
        <Bubble
          key={passion}
          passion={passion}
          index={i}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
};

const Bubble = ({
  passion,
  index,
  mouseX,
  mouseY
}: {
  passion: string,
  index: number,
  mouseX: any,
  mouseY: any
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Initial absolute positioning
  const initialLeft = (index % 3) * 30 + 10;
  const initialTop = Math.floor(index / 3) * 40 + 20;

  // Measure center position relative to container
  useEffect(() => {
    const updatePosition = () => {
      if (ref.current && ref.current.parentElement) {
        const parentRect = ref.current.parentElement.getBoundingClientRect();
        // Calculate expected center based on percentage
        const centerX = parentRect.width * (initialLeft / 100) + ref.current.offsetWidth / 2;
        const centerY = parentRect.height * (initialTop / 100) + ref.current.offsetHeight / 2;
        setPosition({ x: centerX, y: centerY });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [initialLeft, initialTop]);

  const dx = useTransform(mouseX, (x: number) => {
    if (x === -Infinity) return 0;
    return x - position.x;
  });

  const dy = useTransform(mouseY, (y: number) => {
    if (y === -Infinity) return 0;
    return y - position.y;
  });

  const distance = useTransform([dx, dy], ([x, y]: number[]) => Math.sqrt(x * x + y * y));

  const xShift = useTransform(distance, (d) => {
    const maxDist = 150;
    if (d < maxDist && d > 0) {
      const force = (maxDist - d) / maxDist;
      const dirX = dx.get() / d;
      return -dirX * force * 80; // Repulsion strength
    }
    return 0;
  });

  const yShift = useTransform(distance, (d) => {
    const maxDist = 150;
    if (d < maxDist && d > 0) {
      const force = (maxDist - d) / maxDist;
      const dirY = dy.get() / d;
      return -dirY * force * 80;
    }
    return 0;
  });

  const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };
  const x = useSpring(xShift, springConfig);
  const y = useSpring(yShift, springConfig);

  return (
    <motion.div
      ref={ref}
      className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-white whitespace-nowrap z-10"
      initial={{ x: 0, y: 0 }}
      animate={{
        y: [0, -10, 0],
        x: [0, 5, 0]
      }}
      transition={{
        duration: 3 + index,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2
      }}
      style={{
        left: `${initialLeft}%`,
        top: `${initialTop}%`,
        translateX: x,
        translateY: y,
      }}
    >
      {passion}
    </motion.div>
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
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-24 h-24"
                >
                  <Image
                    src="/undip.png"
                    alt="Universitas Diponegoro Logo"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>
            }
            className="md:col-span-1"
            icon={<GraduationCap className="h-5 w-5 text-neutral-500" />}
          />

          {/* Passion Bubbles */}
          <BentoGridItem
            title={<span className="text-xl font-bold">Stuff I Mostly Do</span>}
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
            onClick={() => window.open("/CV_ATS_Bintang Syafrian Rizal.pdf", "_blank")}
          >
            <FileDown className="w-4 h-4" />
            Download CV
          </Button>
        </div>
      </div>
    </section>
  );
}
