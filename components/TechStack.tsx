"use client";

import { motion } from "framer-motion";

const techCategories = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "PHP", "HTML", "CSS"],
  },
  {
    category: "Frameworks",
    items: ["React", "Next.js", "Laravel", "Node.js", "Tailwind CSS"],
  },
  {
    category: "Tools & Databases",
    items: ["MySQL", "Prisma", "Git", "Framer Motion", "shadcn/ui"],
  },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="bg-[#0a0a0a] editorial-section">
      {/* Top separator */}
      <div className="editorial-separator" />

      <div className="editorial-container pt-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
            Stack
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Technologies
          </h2>
        </motion.div>

        {/* Tech grid - text-first approach */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {techCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            >
              {/* Category label */}
              <p className="text-white/30 text-xs uppercase tracking-wider mb-6">
                {category.category}
              </p>

              {/* Items list */}
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: catIndex * 0.1 + itemIndex * 0.05 }}
                    className="text-white/60 text-lg hover:text-white transition-colors cursor-default"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
