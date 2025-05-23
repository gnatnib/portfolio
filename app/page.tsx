// page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Connect from "@/components/Connect";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scroll during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return (
    <main className="min-h-screen bg-background dark:bg-black relative overflow-x-hidden w-full">
      <div className="relative z-10">
        <Header />
        <div className="relative">
          <section className="min-h-screen w-full" id="home">
            <Hero />
          </section>
          <section className="min-h-screen w-full" id="about">
            <About />
          </section>
          <section className="min-h-screen w-full" id="projects">
            <Projects />
          </section>
          <section className="min-h-screen w-full" id="experience">
            <Experience />
          </section>
          <section className="min-h-screen w-full" id="tech-stack">
            <TechStack />
          </section>
          <section className="min-h-screen w-full" id="contact">
            <Connect />
          </section>
        </div>
      </div>
    </main>
  );
}
