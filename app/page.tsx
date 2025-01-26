import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Connect from "@/components/Connect";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="overflow-hidden">
        <section className="min-h-screen">
          <Hero />
        </section>
        <section className="min-h-screen">
          <About />
        </section>
        <section className="min-h-screen">
          <Experience />
        </section>
        <section className="min-h-screen">
          <Projects />
        </section>
        <section className="min-h-screen">
          <TechStack />
        </section>
        <section className="min-h-screen">
          <Connect />
        </section>
      </div>
    </main>
  );
}
