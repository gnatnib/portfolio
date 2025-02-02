"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollTo } from "@/hooks/useScrollTo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scrollTo = useScrollTo();

  const navigationItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const heartVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    if (id === "home") {
      scrollTo("top");
    } else {
      scrollTo(id);
    }
  };

  return (
    <motion.footer
      className="w-full bg-slate-100 dark:bg-slate-900 py-4 px-4 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <motion.nav className="flex gap-6" variants={containerVariants}>
          {navigationItems.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`#${item.id}`}
                className="text-sm hover:text-primary transition-colors"
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        <motion.p
          className="text-sm text-muted-foreground"
          variants={itemVariants}
        >
          © {currentYear} Made with{" "}
          <motion.span
            className="text-red-500 inline-block"
            aria-label="love"
            variants={heartVariants}
            initial="initial"
            animate="animate"
          >
            ❤
          </motion.span>{" "}
          by{" "}
          <motion.span
            className="text-primary"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            Bintang Syafrian Rizal
          </motion.span>
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;
