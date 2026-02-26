"use client";

import { motion } from "framer-motion";

const socialLinks = [
  { name: "LinkedIn", url: "https://linkedin.com/in/bintangsyafrian" },
  { name: "GitHub", url: "https://github.com/gnatnib" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "X", url: "https://x.com/carpacciao" },
  { name: "Instagram", url: "https://instagram.com/bintwang" },
  { name: "Email", url: "mailto:bintang.syafrian@gmail.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 section-separator">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact
          </h2>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            A digital conduit facilitating seamless discourse, collaboration overtures, and exchanges of
            inventive ideations—bridging connections beyond mere keystrokes.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-separator pt-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group py-4 border-b border-gray-100 hover:border-gray-300 transition-colors"
              >
                <span className="text-gray-900 font-medium group-hover:text-gray-600 transition-colors">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
