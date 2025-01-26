"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    icon: GithubIcon,
    url: "https://github.com/yourusername",
    color:
      "bg-[#f3e8ff] hover:bg-[#e9d5ff] dark:bg-[#2d1b69] dark:hover:bg-[#382180]",
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    url: "https://linkedin.com/in/yourusername",
    color:
      "bg-[#e0f2fe] hover:bg-[#bae6fd] dark:bg-[#172554] dark:hover:bg-[#1e3a8a]",
  },
  {
    name: "Twitter",
    icon: TwitterIcon,
    url: "https://facebook.com/yourusername",
    color:
      "bg-[#dbeafe] hover:bg-[#bfdbfe] dark:bg-[#1e3a8a] dark:hover:bg-[#1e40af]",
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    url: "https://instagram.com/yourusername",
    color:
      "bg-[#fce7f3] hover:bg-[#fbcfe8] dark:bg-[#831843] dark:hover:bg-[#9d174d]",
  },
];

const contactMethods = [
  {
    name: "Email",
    value: "your.email@example.com",
    icon: MailIcon,
    color:
      "bg-[#fce7f3] hover:bg-[#fbcfe8] dark:bg-[#831843] dark:hover:bg-[#9d174d]",
  },
  {
    name: "WhatsApp",
    value: "+1 234 567 8900",
    icon: PhoneIcon,
    color:
      "bg-[#dcfce7] hover:bg-[#bbf7d0] dark:bg-[#14532d] dark:hover:bg-[#166534]",
  },
];

export default function Connect() {
  const { ref, controls, initial } = useScrollAnimation();

  return (
    <section
      id="connect"
      className="min-h-screen flex items-center bg-muted/50"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={ref}
            initial={initial}
            animate={controls}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {/* Social Media Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">
                Connect with me
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block ${link.color} rounded-lg p-4 transition-colors duration-300 shadow-lg`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`${method.color} rounded-lg p-6 transition-colors duration-300 shadow-lg`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                          <method.icon className="w-5 h-5" />
                          <span>{method.name}</span>
                        </div>
                        <p className="text-sm opacity-90">{method.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
