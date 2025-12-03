import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";

const [mounted, setMounted] = useState(false);
const [isOpen, setIsOpen] = useState(false);
const { theme, setTheme } = useTheme();
const [hasScrolled, setHasScrolled] = useState(false);
interface MobileMenuProps {
  isOpen: boolean;
  navigationItems: { id: string; name: string }[];
  handleNavClick: (id: string) => void;
}

const MobileMenu = ({
  isOpen,
  navigationItems,
  handleNavClick,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 md:hidden"
          />

          {/* Menu Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut" }}
            className="fixed top-[64px] inset-y-0 right-0 w-full bg-background/98 border-t border-border shadow-xl z-50 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full pb-20">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full py-4 text-lg font-medium text-center hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
