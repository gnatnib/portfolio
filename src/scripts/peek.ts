/* Floating preview that trails the cursor over a list. Rows carry
   data-peek="<index>", the box holds one image per row in the same order. */
import { gsap } from "./motion";

export function mountPeek(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>("[data-peek-box]");
  if (!box || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const imgs = [...box.querySelectorAll<HTMLElement>("img")];
  const x = gsap.quickTo(box, "x", { duration: 0.55, ease: "power3.out" });
  const y = gsap.quickTo(box, "y", { duration: 0.55, ease: "power3.out" });
  const rot = gsap.quickTo(box, "rotation", { duration: 0.8, ease: "power3.out" });
  let lastX = 0;
  let current = -1;

  // Images are lazy; start loading them once the list is close.
  new IntersectionObserver(
    (entries, io) => {
      if (!entries[0].isIntersecting) return;
      imgs.forEach((img) => img.setAttribute("loading", "eager"));
      io.disconnect();
    },
    { rootMargin: "400px" },
  ).observe(root);

  root.addEventListener("pointermove", (e) => {
    const w = box.offsetWidth;
    const h = box.offsetHeight;
    x(e.clientX + 28);
    y(e.clientY - h / 2);
    rot(Math.max(-6, Math.min(6, (e.clientX - lastX) * 0.4)));
    lastX = e.clientX;
    if (e.clientX + 28 + w > window.innerWidth) x(e.clientX - w - 28);

    const row = (e.target as Element).closest<HTMLElement>("[data-peek]");
    const index = row && !row.hasAttribute("open") ? Number(row.dataset.peek) : -1;
    if (index === current) return;
    current = index;
    box.classList.toggle("on", index >= 0);
    imgs.forEach((img, i) => img.classList.toggle("on", i === index));
  });

  root.addEventListener("pointerleave", () => {
    current = -1;
    box.classList.remove("on");
  });
  root.addEventListener("toggle", () => {
    current = -1;
    box.classList.remove("on");
  }, true);
  // Scrolling moves rows under a still cursor; drop the preview until it moves.
  window.addEventListener("scroll", () => {
    if (current === -1) return;
    current = -1;
    box.classList.remove("on");
  }, { passive: true });
}
