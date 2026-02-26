"use client";

import Link from "next/link";
import { Section } from "@/components/Section";
import ViewAnimation from "@/components/ViewAnimation";

const Footer = () => {
  return (
    <footer>
      <Section>
        <div className="py-6 sm:py-8 px-4 sm:px-6 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <ViewAnimation
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              delay={0.2}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 text-xs text-muted-foreground/40">
                <Link
                  href="https://github.com/gnatnib"
                  target="_blank"
                  className="hover:text-muted-foreground transition-colors font-mono-accent text-[10px] tracking-wider"
                >
                  GITHUB
                </Link>
                <Link
                  href="https://linkedin.com/in/bintangsyafrian"
                  target="_blank"
                  className="hover:text-muted-foreground transition-colors font-mono-accent text-[10px] tracking-wider"
                >
                  LINKEDIN
                </Link>
                <Link
                  href="mailto:bintang.syafrian@gmail.com"
                  className="hover:text-muted-foreground transition-colors font-mono-accent text-[10px] tracking-wider"
                >
                  EMAIL
                </Link>
              </div>
            </ViewAnimation>

            <ViewAnimation
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              delay={0.3}
              viewport={{ once: true }}
            >
              <p className="font-mono-accent text-[10px] text-muted-foreground/30 tracking-wider">
                © {new Date().getFullYear()} BINTANG SYAFRIAN RIZAL
              </p>
            </ViewAnimation>
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
