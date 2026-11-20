/* One motion runtime for the whole page. Component scripts import from here,
   so Lenis and the ScrollTrigger wiring exist exactly once. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

export const lenis = reduced ? null : new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });

if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener("lenis:stop", () => lenis.stop());
  window.addEventListener("lenis:start", () => lenis.start());
}

// In-page anchors go through Lenis so they glide instead of jumping.
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
  if (!a || (a.pathname !== location.pathname && a.getAttribute("href")!.startsWith("/"))) return;
  const id = a.hash.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  e.preventDefault();
  history.pushState(null, "", `#${id}`);
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  else target.scrollIntoView();
  target.focus({ preventScroll: true });
});

// Page tone follows whichever section owns the middle of the viewport.
document.querySelectorAll<HTMLElement>("[data-tone]").forEach((section) => {
  if (section === root) return;
  ScrollTrigger.create({
    trigger: section,
    start: "top 55%",
    end: "bottom 55%",
    onToggle: (self) => {
      if (self.isActive) root.dataset.tone = section.dataset.tone;
    },
  });
});

// Header shows the current section name.
const label = document.querySelector<HTMLElement>("[data-section-label]");
if (label) {
  document.querySelectorAll<HTMLElement>("[data-label]").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) label.textContent = section.dataset.label!;
      },
    });
  });
}

function reveal() {
  document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        el.classList.add("is-ready");
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    el.classList.add("is-ready");
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal="rule"]').forEach((el) => {
    el.classList.add("is-ready");
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: "0 50%",
      duration: 1.4,
      ease: "expo.inOut",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });

  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax);
    gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

if (reduced) {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-ready"));
} else {
  // Split lines only after the webfont lands, or they break at the wrong width.
  document.fonts.ready.then(reveal);
}

export { gsap, ScrollTrigger, SplitText, reduced };
