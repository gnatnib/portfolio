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
  XIcon,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
}

const ImageModal = ({ isOpen, onClose, image, title }: ImageModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative w-[90vw] h-[90vh] max-w-7xl rounded-lg bg-background/5 backdrop-blur-sm p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={onClose}
          >
            <XIcon className="h-6 w-6" />
          </Button>
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain rounded-lg"
              sizes="90vw"
              priority
              quality={100}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

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
    title: "Rumeet",
    description:
      "A booking web app for PT. Usaha Gedung Mandiri built with PHP, Laravel, and MySQL.",
    image: "/project3.png",
    github: "https://github.com/gnatnib/ugbooking",
    live: "https://rumeet.ugmandiri.co.id/",
    techStack: ["PHP", "Laravel", "MySQL"],
  },
  {
    title: "Sipp",
    description:
      "A procurement web app for PT. Usaha Gedung Mandiri built with PHP, Laravel, and MySQL.",
    image: "/project4.png",
    github: "https://github.com/gnatnib/ugprocurement",
    live: "https://sipp.ugmandiri.co.id/",
    techStack: ["PHP", "Laravel", "MySQL"],
  },
  {
    title: "E-Tarteel",
    description:
      "A Quran recitation web app built with NextJS, ShadCn Ui, and RadixUI.",
    image: "/project5.png",
    github: "https://github.com/gnatnib/e-tarteel",
    live: "https://etarteel.vercel.app/",
    techStack: ["NextJS", "ShadCn Ui", "RadixUI"],
  },
  {
    title: "Sumanto",
    description:
      "Sistem Unggulan Manajemen Akademik dan Terintegrasi Online Sumanto - Academic management app designed to streamline the administrative processes of education.",
    image: "/project6.png",
    github: "https://github.com/gnatnib/Sumanto",
    techStack: ["PHP", "Laravel", "Tailwind CSS", "JQuery", "MySQL"],
  },
  {
    title: "K-Means World Happiness Report",
    description:
      "K-Means clustering analysis of the World Happiness Report dataset built on Streamlit.",
    image: "/project7.png",
    github: "https://github.com/gnatnib/world_happiness_report",
    live: "https://kmeans-world-happiness-report.streamlit.app/",
    techStack: ["Streamlit", "Pandas", "Numpy", "Python"],
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

const getTechColor = (tech: string): string => {
  // Mapping hex colors to closest Tailwind color combinations
  const techColors: { [key: string]: string } = {
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

  return techColors[tech] ?? "bg-gray-100 text-gray-800"; // Default fallback
};

const TechStackLabel = ({ tech }: { tech: string }) => (
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
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState("");
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleScroll();
      }, 50);
    };

    container.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      container.removeEventListener("scroll", debouncedHandleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex]);

  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToProject = (index: number) => {
    if (!containerRef.current || isScrolling) return;

    setIsScrolling(true);
    const container = containerRef.current;
    const projectWidth = isMobile
      ? container.offsetWidth * 0.6
      : container.offsetWidth * 0.35;
    const gap = 16; // gap between items

    const scrollPosition = (projectWidth + gap) * index;

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    setActiveIndex(index);

    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const handleScroll = () => {
    if (!containerRef.current || isScrolling) return;

    const container = containerRef.current;
    const projectWidth = isMobile
      ? container.offsetWidth * 0.6
      : container.offsetWidth * 0.35;
    const gap = 16;

    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (projectWidth + gap));

    if (
      newIndex >= 0 &&
      newIndex < projects.length &&
      newIndex !== activeIndex
    ) {
      setActiveIndex(newIndex);
    }
  };

  const openModal = (image: string, title: string) => {
    document.body.style.overflow = "hidden";
    setModalImage(image);
    setModalTitle(title);
  };

  const closeModal = () => {
    document.body.style.overflow = "unset";
    setModalImage(null);
    setModalTitle("");
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToProject(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(projects.length - 1, activeIndex + 1);
    scrollToProject(newIndex);
  };

  return (
    <section
      id="projects"
      className="min-h-screen flex items-center bg-muted/30 relative overflow-hidden pb-16"
    >
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        image={modalImage || ""}
        title={modalTitle}
      />

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
              onClick={handlePrevious}
              disabled={activeIndex === 0 || isScrolling}
            >
              <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg pointer-events-auto"
              onClick={handleNext}
              disabled={activeIndex === projects.length - 1 || isScrolling}
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
                } shrink-0 snap-center px-2 md:px-4 relative`} // Added relative
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: activeIndex === index ? 1 : 0.8,
                  opacity: activeIndex === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {activeIndex !== index && (
                  <div className="absolute inset-0 bg-transparent z-50" />
                )}
                <Card className="h-full overflow-hidden backdrop-blur-sm bg-card/80">
                  <CardHeader className="p-0">
                    <div
                      className="relative h-[150px] md:h-[200px] w-full cursor-pointer overflow-hidden group"
                      onClick={() => openModal(project.image, project.title)}
                    >
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 60vw, 35vw"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                          Click to enlarge
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 md:p-3">
                    <CardTitle className="text-lg md:text-xl mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mb-2 line-clamp-3">
                      {project.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <TechStackLabel key={idx} tech={tech} />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-2 md:p-3 flex flex-col sm:flex-row gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center relative z-10 transition-colors"
                      >
                        <GithubIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                          GitHub
                        </span>
                        <div className="absolute inset-0 bg-primary/10 transform transition-transform duration-300 group-hover:scale-105" />
                      </a>
                    </Button>
                    {project.live && (
                      <Button
                        size="sm"
                        asChild
                        className="w-full group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center relative z-10"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                            Live Demo
                          </span>
                          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transform transition-all duration-300 group-hover:scale-105" />
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
