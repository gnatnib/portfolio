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
    techStack: ["NextJS", "ShadCn Ui", "Clerk", "Prisma ORM"],
  },
  {
    title: "UG Booking",
    description:
      "A booking web app for PT. Usaha Gedung Mandiri built with PHP, Laravel, and MySQL.",
    image: "/project3.png",
    github: "https://github.com/gnatnib/ugbooking",
    techStack: ["PHP", "Laravel", "MySQL"],
  },
  {
    title: "UG Procurement",
    description:
      "A procurement web app for PT. Usaha Gedung Mandiri built with PHP, Laravel, and MySQL.",
    image: "/project4.png",
    github: "https://github.com/gnatnib/ugprocurement",
    techStack: ["PHP", "Laravel", "MySQL"],
  },
  {
    title: "E-Tarteel",
    description:
      "A Quran recitation web app built with NextJS, ShadCn Ui, and RadixUI.",
    image: "/project5.png",
    github: "https://github.com/gnatnib/e-tarteel",
    techStack: ["NextJS", "ShadCn Ui", "RadixUI"],
  },
  {
    title: "Bidlix",
    description:
      "A movie database app built with simple HTML, CSS, and JavaScript and MovieDB API.",
    image: "/project1.png",
    github: "https://github.com/gnatnib/bidlix",
    live: "https://bidlix.vercel.app/",
    techStack: ["HTML", "CSS", "JavaScript", "MovieDB API"],
  },
];

const getTechColor = (tech) => {
  // Mapping hex colors to closest Tailwind color combinations
  const techColors = {
    // Frontend
    JavaScript: "bg-yellow-100 text-yellow-800", // #F7DF1E
    TypeScript: "bg-blue-100 text-blue-800", // #3178C6
    React: "bg-cyan-100 text-cyan-800", // #61DAFB
    "Next.js": "bg-neutral-100 text-neutral-800", // #000000
    NextJS: "bg-neutral-100 text-neutral-800", // #000000
    "shadcn/ui": "bg-pink-100 text-pink-800", // #FF0080
    "ShadCn Ui": "bg-pink-100 text-pink-800", // #FF0080
    Framer: "bg-cyan-100 text-cyan-800", // #06B6D4
    HTML: "bg-orange-100 text-orange-800", // #E34F26
    CSS: "bg-blue-100 text-blue-800", // #1572B6
    "Tailwind CSS": "bg-cyan-100 text-cyan-800", // #06B6D4

    // Backend
    "Node.js": "bg-green-100 text-green-800", // #339933
    PHP: "bg-indigo-100 text-indigo-800", // #777BB4
    Laravel: "bg-red-100 text-red-800", // #FF2D20
    Python: "bg-blue-100 text-blue-800", // #3776AB

    // Database
    MySQL: "bg-blue-100 text-blue-800", // #4479A1
    Prisma: "bg-green-100 text-green-800", // #47A248
    "Prisma ORM": "bg-green-100 text-green-800", // #47A248

    // Tools
    Git: "bg-orange-100 text-orange-800", // #F05032

    // Additional technologies from your projects
    Clerk: "bg-green-100 text-green-800",
    "MovieDB API": "bg-cyan-100 text-cyan-800",
  };

  return techColors[tech] || "bg-gray-100 text-gray-800"; // Default fallback
};

const TechStackLabel = ({ tech }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTechColor(
      tech
    )}`}
  >
    {tech}
  </span>
);

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
      ? container.offsetWidth * 0.6
      : container.offsetWidth * 0.35;
    const spacing = isMobile
      ? container.offsetWidth * 0.2
      : container.offsetWidth * 0.325;
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
      ? container.offsetWidth * 0.6
      : container.offsetWidth * 0.35;
    const spacing = isMobile
      ? container.offsetWidth * 0.2
      : container.offsetWidth * 0.325;

    const scrollPosition = container.scrollLeft;
    const index = Math.round(scrollPosition / (projectWidth + 16)); // Account for gap

    if (index >= 0 && index < projects.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="projects"
      className="min-h-screen flex items-center bg-muted/50 relative overflow-hidden pb-16"
    >
      <div className="w-full py-8">
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-center mb-8">My Projects</h2>

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
              scrollPaddingLeft: isMobile ? "20vw" : "32.5vw",
              scrollPaddingRight: isMobile ? "20vw" : "32.5vw",
            }}
            onScroll={handleScroll}
          >
            {/* Initial spacing */}
            <div
              className={`${isMobile ? "w-[20vw]" : "w-[32.5vw]"} shrink-0`}
            />

            {projects.map((project, index) => (
              <motion.div
                key={index}
                className={`${
                  isMobile ? "w-[60vw]" : "w-[35vw]"
                } shrink-0 snap-center px-2 md:px-4`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: activeIndex === index ? 1 : 0.8,
                  opacity: activeIndex === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full overflow-hidden backdrop-blur-sm bg-card/80">
                  <CardHeader className="p-0">
                    <div className="relative h-[150px] md:h-[200px] w-full">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 md:p-3">
                    <CardTitle className="text-lg md:text-xl mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mb-2">
                      {project.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <TechStackLabel key={idx} tech={tech} />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-2 md:p-3 flex flex-wrap gap-2 justify-center md:justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full sm:w-auto"
                    >
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
                      <Button size="sm" asChild className="w-full sm:w-auto">
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
            <div
              className={`${isMobile ? "w-[20vw]" : "w-[32.5vw]"} shrink-0`}
            />
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
