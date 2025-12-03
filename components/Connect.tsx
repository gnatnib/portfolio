"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  ArrowRight,
} from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    icon: GithubIcon,
    url: "https://github.com/gnatnib",
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    url: "https://linkedin.com/in/bintangsyafrian",
  },
  {
    name: "Twitter",
    icon: TwitterIcon,
    url: "https://x.com/carpacciao",
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    url: "https://instagram.com/bintwang",
  },
];

export default function Connect() {
  return (
    <section
      id="contact"
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-background dark:bg-black relative overflow-hidden pt-20 pb-0"
    >
      <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">
            Let's work <br />
            <span className="text-neutral-500">together.</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <Button
              size="lg"
              className="rounded-full h-14 px-8 text-lg gap-2 group"
              asChild
            >
              <a href="mailto:bintang.syafrian@gmail.com">
                <MailIcon className="w-5 h-5" />
                Send me an email
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <div className="flex items-center gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-foreground/80 hover:text-foreground"
                  aria-label={link.name}
                >
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
