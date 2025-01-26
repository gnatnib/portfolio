"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  ExternalLinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "Financipal",
    description:
      "A personal finance tracker built with NextJS, ShadCn Ui, Clerk, and Prisma ORM.",
    image: "/project2.png",
    github: "https://github.com/gnatnib/financipal",
    live: "https://financipal.vercel.app",
  },
  {
    title: "UG Booking",
    description:
      "A booking web app for PT. Usaha Gedung Mandiri built with PHP, Laravel, and MySQL.",
    image: "/project3.png",
    github: "https://github.com/gnatnib/ugbooking",
  },
  {
    title: "UG Procurement",
    description:
      "A procurement web app for PT. Usaha Gedung Mandiri built with PHP, Laravel, and MySQL.",
    image: "/project4.png",
    github: "https://github.com/gnatnib/ugprocurement",
  },
  {
    title: "Bidlix",
    description:
      "A movie database app built with simple HTML, CSS, and JavaScript and MovieDB API.",
    image: "/project1.png",
    github: "https://github.com/gnatnib/bidlix",
    live: "https://bidlix.vercel.app/",
  },
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, controls, initial } = useScrollAnimation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToProject = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const projectWidth = isMobile
      ? container.offsetWidth * 0.8
      : container.offsetWidth * 0.5;
    const spacing = isMobile
      ? container.offsetWidth * 0.1
      : container.offsetWidth * 0.25;
    const scrollPosition = projectWidth * index + spacing;

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const projectWidth = isMobile
      ? container.offsetWidth * 0.8
      : container.offsetWidth * 0.5;
    const spacing = isMobile
      ? container.offsetWidth * 0.1
      : container.offsetWidth * 0.25;

    const scrollPosition = container.scrollLeft;
    const index = Math.round((scrollPosition - spacing) / projectWidth);

    if (index >= 0 && index < projects.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="projects"
      className="min-h-screen flex items-center bg-muted/50 relative overflow-hidden"
    >
      <div className="w-full py-20">
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-center mb-16">My Projects</h2>

          {/* Navigation Buttons */}
          <div className="container mx-auto px-4 flex justify-between items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-10 pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg pointer-events-auto"
              onClick={() => scrollToProject(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
            >
              <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg pointer-events-auto"
              onClick={() =>
                scrollToProject(Math.min(projects.length - 1, activeIndex + 1))
              }
              disabled={activeIndex === projects.length - 1}
            >
              <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>

          {/* Projects Container */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollSnapType: "x mandatory",
              scrollPaddingLeft: isMobile ? "10vw" : "25vw",
              scrollPaddingRight: isMobile ? "10vw" : "25vw",
            }}
            onScroll={handleScroll}
          >
            {/* Initial spacing */}
            <div className={`${isMobile ? "w-[10vw]" : "w-[25vw]"} shrink-0`} />

            {projects.map((project, index) => (
              <motion.div
                key={index}
                className={`${
                  isMobile ? "w-[80vw]" : "w-[50vw]"
                } shrink-0 snap-center px-2 md:px-4 scroll-snap-align-center`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: activeIndex === index ? 1 : 0.8,
                  opacity: activeIndex === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full overflow-hidden backdrop-blur-sm bg-card/80">
                  <CardHeader className="p-0">
                    <div className="relative h-[200px] md:h-[300px] w-full">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {project.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-4 md:p-6 flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    {project.live && (
                      <Button size="sm" asChild>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {/* Final spacing */}
            <div className={`${isMobile ? "w-[10vw]" : "w-[25vw]"} shrink-0`} />
          </div>

          {/* Project Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-primary w-6" : "bg-primary/30"
                }`}
                onClick={() => scrollToProject(index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
