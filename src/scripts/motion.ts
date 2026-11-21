/* One motion runtime for the whole page. Component scripts import from here,
   so Lenis and the ScrollTrigger wiring exist exactly once. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

export const lenis = reduced ? null : new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });

if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener("lenis:stop", () => lenis.stop());
  window.addEventListener("lenis:start", () => lenis.start());
}

/* In-page navigation. A section starts with a tall padding band, so jumping to
   its top left the title mid-screen with the previous section showing above.
   Jumps land on the section's heading instead, just under the header, and the
   header is told to stay put while the page glides there. */
const HEADER_GAP = 72;
function jumpTo(id: string, smooth: boolean) {
  const section = document.getElementById(id);
  if (!section) return false;
  const landing = section.querySelector<HTMLElement>(":scope > .sec-head") ?? section;
  const offset = landing === section ? 0 : -HEADER_GAP;
  window.dispatchEvent(new CustomEvent("nav:jump", { detail: { duration: smooth ? 1400 : 0 } }));
  if (lenis) lenis.scrollTo(landing, { offset, duration: smooth ? 1.4 : 0, immediate: !smooth });
  else window.scrollTo({ top: landing.getBoundingClientRect().top + scrollY + offset });
  section.focus({ preventScroll: true });
  return true;
}

document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
  if (!a || (a.pathname !== location.pathname && a.getAttribute("href")!.startsWith("/"))) return;
  const id = a.hash.slice(1);
  if (!id || !jumpTo(id, !reduced)) return;
  e.preventDefault();
  history.pushState(null, "", `#${id}`);
});

// Arriving with a hash (old /about style links redirect to /#about): the
// browser jumps before fonts and pinned sections settle, so redo it after.
if (location.hash.length > 1) {
  history.scrollRestoration = "manual";
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    requestAnimationFrame(() => jumpTo(location.hash.slice(1), false));
  });
}

// The header takes the tone of the section passing underneath it. Only the
// header recolours; sections paint themselves.
const header = document.querySelector<HTMLElement>("[data-header]");
if (header) {
  document.querySelectorAll<HTMLElement>("section[data-tone]").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      // Measured at the header's bottom edge (64px) so a section that starts
      // right under the header already owns its colour.
      start: "top top+=66",
      end: "bottom top+=66",
      onToggle: (self) => {
        if (self.isActive) header.dataset.tone = section.dataset.tone;
      },
    });
  });
}

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
