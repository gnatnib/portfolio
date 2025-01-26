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
    <main className="min-h-screen bg-background relative overflow-x-hidden w-full">
      {/* Animated gradient background that spans all sections */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/20 bg-grid animate-grid-movement" />
          <div className="absolute inset-0 animate-gradient" />
        </div>
      </div>

      <div className="relative z-10">
        <Header />
        <div className="relative">
          <section className="min-h-screen w-full">
            <Hero />
          </section>
          <section className="min-h-screen w-full">
            <About />
          </section>
          <section className="min-h-screen w-full">
            <Experience />
          </section>
          <section className="min-h-screen w-full">
            <Projects />
          </section>
          <section className="min-h-screen w-full">
            <TechStack />
          </section>
          <section className="min-h-screen w-full">
            <Connect />
          </section>
        </div>
      </div>
    </main>
  );
}
