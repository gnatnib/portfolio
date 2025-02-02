// hooks/useScrollTo.ts
import { useCallback } from "react";

export const useScrollTo = () => {
  const scrollTo = useCallback((elementId: string) => {
    if (elementId === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return scrollTo;
};
