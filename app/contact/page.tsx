"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const contactLinks = [
  { name: "LinkedIn", link: "https://linkedin.com/in/bintangsyafrian", marker: "01" },
  { name: "GitHub", link: "https://github.com/gnatnib", marker: "02" },
  { name: "Facebook", link: "https://facebook.com", marker: "03" },
  { name: "X (Twitter)", link: "https://x.com/carpacciao", marker: "04" },
  { name: "Instagram", link: "https://instagram.com/bintwang", marker: "05" },
  { name: "Email", link: "mailto:bintang.syafrian@gmail.com", marker: "06" },
];

export default function ContactPage() {
  return (
    <>
      <HeroSection
        title="Contact"
        sectionNumber="CT.01"
        description="A digital conduit facilitating seamless discourse, collaboration overtures, and exchanges of inventive ideations."
      />

      <Section sectionNumber="CT.02" label="Connect">
        <div className="py-12 sm:py-20 px-4 sm:px-6">
          {/* Large statement */}
          <ViewAnimation
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.2}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tighter leading-[0.95] mb-12 sm:mb-16 max-w-3xl">
              Let&apos;s build
              <br />
              <span className="text-muted-foreground/30">something</span>
              <br />
              great.
            </h2>
          </ViewAnimation>

          {/* Contact links */}
          <ViewAnimation
            initial={{ opacity: 0, translateY: -4 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.3}
            viewport={{ once: true }}
          >
            <div className="divide-y divide-border/30">
              {contactLinks.map((item, i) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    href={item.link}
                    target={item.link.startsWith("mailto") ? "_self" : "_blank"}
                    className="group flex items-center justify-between py-5 sm:py-6"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono-accent text-[10px] text-muted-foreground/30 w-5">
                        {item.marker}
                      </span>
                      <span className="text-base sm:text-lg font-medium group-hover:text-muted-foreground transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-muted-foreground/20 group-hover:text-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </ViewAnimation>

          {/* Bottom note */}
          <ViewAnimation
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            delay={0.5}
            viewport={{ once: true }}
          >
            <p className="font-mono-accent text-[11px] text-muted-foreground/30 tracking-wider mt-12">
              CURRENTLY ACCEPTING NEW PROJECTS AND COLLABORATIONS
            </p>
          </ViewAnimation>
        </div>
      </Section>
    </>
  );
}
