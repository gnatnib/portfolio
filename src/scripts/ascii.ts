/* ASCII portrait. The photo sits under a canvas that paints the subject as
   characters. A lens follows the mouse and cuts through to the photo; a click
   "develops" the whole frame with a growing circle from the click point, and a
   second click winds it back. */

const RAMP = " .:-=+*o#%@";
const FONT = '"Geist Mono Variable", ui-monospace, monospace';

type Cell = { col: number; row: number; glyph: number; delay: number };

export function mountAsciiPortrait(root: HTMLElement) {
  const frame = root.querySelector<HTMLElement>("[data-ascii-frame]")!;
  const canvas = root.querySelector<HTMLCanvasElement>("[data-ascii-canvas]")!;
  const toggle = root.querySelector<HTMLButtonElement>("[data-ascii-toggle]")!;
  const ctx = canvas.getContext("2d")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  let cellW = 0;
  let cellH = 0;
  let cells: Cell[] = [];
  let atlasInk: HTMLCanvasElement | null = null;
  let atlasAccent: HTMLCanvasElement | null = null;
  let panel = "";
  let introStart = 0;
  let raf = 0;

  const pointer = { x: 0, y: 0, inside: false, moved: 0 };
  // Scrolling moves the frame out from under a still cursor without a pointerleave.
  window.addEventListener(
    "scroll",
    () => {
      if (!pointer.inside) return;
      pointer.inside = false;
      kick();
    },
    { passive: true },
  );
  let lens = 0;
  // develop: 0 = all ASCII, 1 = all photo. Animated toward `developTarget`.
  let develop = 0;
  let developTarget = 0;
  const origin = { x: 0, y: 0 };

  const mask = new Image();
  mask.decoding = "async";
  mask.src = root.dataset.mask!;

  function color(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function buildAtlas(fill: string) {
    const atlas = document.createElement("canvas");
    atlas.width = Math.ceil(cellW * dpr) * RAMP.length;
    atlas.height = Math.ceil(cellH * dpr);
    const a = atlas.getContext("2d")!;
    a.scale(dpr, dpr);
    a.fillStyle = fill;
    a.font = `500 ${cellH * 0.92}px ${FONT}`;
    a.textAlign = "center";
    a.textBaseline = "middle";
    const step = Math.ceil(cellW * dpr) / dpr;
    for (let i = 1; i < RAMP.length; i++) a.fillText(RAMP[i], step * i + cellW / 2, cellH / 2 + cellH * 0.04);
    return atlas;
  }

  function layout() {
    const rect = frame.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (!width || !height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = width < 420 ? 64 : width < 560 ? 80 : 96;
    cellW = width / cols;
    // Monospace glyphs are roughly 0.6 as wide as they are tall.
    cellH = cellW / 0.62;
    rows = Math.ceil(height / cellH);

    /* One geometry for both layers. The photo is cover-fitted into the frame,
       then zoomed so the cutout's region fills the frame; the mask is drawn
       into exactly that region, so characters and photo line up at any frame
       shape. Developing drops the zoom and the full photo shows. */
    const [cx, cy, cw, ch] = root.dataset.crop!.split(",").map(Number);
    const ratio = Number(root.dataset.photoRatio);
    const fit = Math.max(width / ratio, height);
    const pw = fit * ratio;
    const ph = fit;
    const rx = (width - pw) / 2 + cx * pw;
    const ry = (height - ph) / 2 + cy * ph;
    const rw = cw * pw;
    const rh = ch * ph;
    const zoom = Math.max(width / rw, height / rh);
    const tx = width / 2 - zoom * (rx + rw / 2);
    const ty = height / 2 - zoom * (ry + rh / 2);
    root.style.setProperty("--zoom-t", `translate(${tx}px, ${ty}px) scale(${zoom})`);

    const sample = document.createElement("canvas");
    sample.width = cols;
    sample.height = rows;
    const s = sample.getContext("2d", { willReadFrequently: true })!;
    s.drawImage(mask, (zoom * rx + tx) / cellW, (zoom * ry + ty) / cellH, (zoom * rw) / cellW, (zoom * rh) / cellH);
    const px = s.getImageData(0, 0, cols, rows).data;
    const lum = new Uint8ClampedArray(cols * rows);

    // Histogram-equalize over the subject only, so skin, hair and the batik
    // each get their own band of the ramp instead of collapsing into one.
    const hist = new Uint32Array(256);
    let n = 0;
    for (let i = 0; i < cols * rows; i++) {
      lum[i] = 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];
      if (px[i * 4 + 3] > 140) {
        hist[lum[i]]++;
        n++;
      }
    }
    const cdf = new Float32Array(256);
    for (let v = 0, acc = 0; v < 256; v++) cdf[v] = (acc += hist[v]) / Math.max(1, n);

    cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        if (px[i * 4 + 3] <= 140) continue;
        const t = cdf[lum[i]];
        const glyph = 1 + Math.min(RAMP.length - 2, Math.floor((1 - t) * (RAMP.length - 1)));
        cells.push({ col, row, glyph, delay: row * 9 + Math.random() * 380 });
      }
    }

    atlasInk = buildAtlas(color("--fg"));
    atlasAccent = buildAtlas(color("--accent"));
    // getComputedStyle forces a style pass; read it here, not every frame.
    panel = color("--panel");
    kick();
  }

  function frameTick(now: number) {
    raf = 0;
    if (!atlasInk || !atlasAccent) return;
    const step = Math.ceil(cellW * dpr);
    const glyphH = Math.ceil(cellH * dpr);
    let busy = false;

    lens += ((pointer.inside && develop < 0.98 ? Math.min(width, height) * 0.2 : 0) - lens) * 0.16;
    if (Math.abs(lens - (pointer.inside ? Math.min(width, height) * 0.2 : 0)) > 0.5) busy = true;
    develop += (developTarget - develop) * (reduced ? 1 : 0.075);
    if (Math.abs(developTarget - develop) > 0.001) busy = true;
    else develop = developTarget;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = panel;
    ctx.fillRect(0, 0, width, height);

    const elapsed = reduced ? Infinity : now - introStart;
    const R = lens;
    const ring = R * 1.5;

    if (develop < 1) {
      for (const c of cells) {
        if (elapsed < c.delay) {
          busy = true;
          continue;
        }
        let x = c.col * cellW;
        let y = c.row * cellH;
        let glyph = c.glyph;
        let atlas = atlasInk;

        if (elapsed < c.delay + 260) {
          glyph = 1 + ((Math.random() * (RAMP.length - 1)) | 0);
          busy = true;
        }

        if (R > 1) {
          const dx = x + cellW / 2 - pointer.x;
          const dy = y + cellH / 2 - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < ring) {
            const f = 1 - d / ring;
            x += (dx / (d || 1)) * f * f * cellW * 2.2;
            y += (dy / (d || 1)) * f * f * cellH * 1.4;
            if (d > R * 0.85 && Math.random() < 0.35) {
              atlas = atlasAccent;
              glyph = 1 + ((Math.random() * (RAMP.length - 1)) | 0);
            }
          }
        }

        ctx.drawImage(atlas, glyph * step, 0, step, glyphH, x, y, cellW, cellH);
      }
    }

    // Cut holes through to the photo underneath.
    ctx.globalCompositeOperation = "destination-out";
    if (R > 1) {
      const g = ctx.createRadialGradient(pointer.x, pointer.y, R * 0.55, pointer.x, pointer.y, R);
      g.addColorStop(0, "#000");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, R, 0, Math.PI * 2);
      ctx.fill();
    }
    if (develop > 0) {
      const reach = Math.hypot(Math.max(origin.x, width - origin.x), Math.max(origin.y, height - origin.y));
      const r = reach * develop * 1.15;
      const soft = Math.max(1, Math.min(r, 60));
      const g = ctx.createRadialGradient(origin.x, origin.y, Math.max(0, r - soft), origin.x, origin.y, r);
      g.addColorStop(0, "#000");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Keep drawing only while something moves: the intro, the lens easing, or
    // a pointer that moved in the last half second. A resting cursor or a page
    // being scrolled past costs nothing.
    if (busy || (pointer.inside && now - pointer.moved < 500)) kick();
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(frameTick);
  }

  let zoomTimer = 0;
  function setDevelop(on: boolean, x = width / 2, y = height / 2) {
    clearTimeout(zoomTimer);
    toggle.textContent = on ? "Show ASCII" : "Show photo";
    toggle.setAttribute("aria-pressed", String(on));
    if (on) {
      // Reveal first at the ASCII's framing, then pull back to the full photo.
      origin.x = x;
      origin.y = y;
      developTarget = 1;
      zoomTimer = window.setTimeout(() => root.classList.add("is-developed"), reduced ? 0 : 450);
    } else {
      // Zoom back in to where the characters sit, then let the ASCII close over it.
      root.classList.remove("is-developed");
      zoomTimer = window.setTimeout(() => {
        origin.x = x;
        origin.y = y;
        developTarget = 0;
        kick();
      }, reduced ? 0 : 900);
    }
    kick();
  }

  frame.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const rect = frame.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.inside = true;
    pointer.moved = performance.now();
    kick();
  });
  frame.addEventListener("pointerleave", () => {
    pointer.inside = false;
    kick();
  });
  frame.addEventListener("click", (e) => {
    const rect = frame.getBoundingClientRect();
    setDevelop(toggle.getAttribute("aria-pressed") !== "true", e.clientX - rect.left, e.clientY - rect.top);
  });
  toggle.addEventListener("click", () => setDevelop(toggle.getAttribute("aria-pressed") !== "true"));

  // Repaint glyphs in the new ink colour when the page tone flips.
  new MutationObserver(() => {
    if (!cells.length) return;
    atlasInk = buildAtlas(color("--fg"));
    atlasAccent = buildAtlas(color("--accent"));
    panel = color("--panel");
    kick();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tone"] });

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 120);
  }).observe(frame);

  Promise.all([mask.decode(), document.fonts.load(`16px ${FONT}`)]).then(() => {
    root.classList.add("is-live");
    layout();
    // Start the decode-in once the frame is actually on screen.
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      introStart = performance.now();
      kick();
    });
    io.observe(frame);
  });
}
