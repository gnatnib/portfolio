/* Dot stage for the Work section.

   One pool of particles serves every project. A scene hands out target points;
   switching scenes reassigns the same particles, so the dots fly from one figure
   to the next. Points carry a stable id, so a scene can change part of its
   figure (empty a compartment, move a rider) without the rest reshuffling.
   Everything is drawn in a 400 x 300 logical space that the canvas fits. */

export const W = 400;
export const H = 300;

export type Ink = "fg" | "accent" | "muted" | "dim";
export type Pt = { x: number; y: number; tag: number; id: number; snap?: boolean };

export type Palette = { fg: string; muted: string; accent: string; bg: string; rule: string; mono: string };

export type SceneApi = {
  status(text: string): void;
  label(act: string, text: string): void;
  reduced: boolean;
};

export interface Scene {
  /** Target points for the current state. */
  points(): Pt[];
  ink(p: { tag: number; tx: number; ty: number }, t: number): Ink;
  /** Per frame. Return true when points() changed. */
  tick?(dt: number, t: number): boolean;
  overlay?(g: CanvasRenderingContext2D, pal: Palette, t: number): void;
  /** Pointer position in logical space, or null when it leaves. Return true when hovering something tappable. */
  hover?(x: number | null, y: number): boolean;
  tap?(x: number, y: number): boolean;
  act?(name: string): boolean;
  /** How hard the cursor pushes dots aside. 0 for scenes where taps need precision. */
  repel: number;
  start?(): void;
}

export type SceneFactory = (api: SceneApi) => Scene;

/* ---------------------------------------------------------------- sampling */

type Draw = (g: CanvasRenderingContext2D, tag: (n: number) => string) => void;

/** Rasterise a drawing and keep one point per grid cell that landed inside it.
    The tag rides in the red channel, rounded to steps of 20. */
function sample(w: number, h: number, step: number, draw: Draw): Pt[] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  draw(g, (n) => `rgb(${n},0,0)`);
  const data = g.getImageData(0, 0, w, h).data;
  const pts: Pt[] = [];
  let row = 0;
  for (let y = step / 2; y < h; y += step, row++) {
    let col = 0;
    for (let x = step / 2; x < w; x += step, col++) {
      const i = ((y | 0) * w + (x | 0)) * 4;
      if (data[i + 3] < 128) continue;
      pts.push({ x, y, tag: Math.round(data[i] / 20) * 20, id: row * 1000 + col });
    }
  }
  return pts;
}

const font = (pal: Palette, size: number, weight = 500) => `${weight} ${size}px ${pal.mono}`;

/** Small filled label chip, the way detection overlays tag a box. */
function chip(g: CanvasRenderingContext2D, pal: Palette, x: number, y: number, text: string, fill: string, ink: string) {
  g.font = font(pal, 7.5);
  const w = g.measureText(text).width + 8;
  g.fillStyle = fill;
  g.fillRect(x, y - 11, w, 11);
  g.fillStyle = ink;
  g.textBaseline = "middle";
  g.fillText(text, x + 4, y - 5.2);
}

/* ------------------------------------------------------------------ engine */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  tag: number;
  a: number;
  on: boolean;
  id: number;
  delay: number;
  phase: number;
};

/* Same ramp as the hero portrait. Each ink rests on its own band of it; a
   glyph in flight drops to the light end, so a figure assembles from dashes
   and dots into solid characters. */
const RAMP = " .:-=+*o#%@";
const BAND: Record<Ink, { from: number; to: number; alpha: number }> = {
  fg: { from: 7, to: 10, alpha: 1 },
  accent: { from: 8, to: 10, alpha: 1 },
  muted: { from: 4, to: 6, alpha: 0.8 },
  dim: { from: 1, to: 3, alpha: 0.4 },
};
const GLYPH_SIZE = 6.4;

export function mountStage(root: HTMLElement, factories: Record<string, SceneFactory>, reduced: boolean) {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-stage-canvas]")!;
  const g = canvas.getContext("2d")!;
  const statusEl = root.querySelector<HTMLElement>("[data-stage-status]")!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-act]")];

  const pool: Particle[] = [];
  const byId = new Map<number, Particle>();
  let scene: Scene | null = null;
  let slug = "";
  const cache = new Map<string, Scene>();

  const api = (forSlug: string): SceneApi => ({
    reduced,
    status: (text) => {
      if (forSlug === slug) statusEl.textContent = text;
    },
    label: (act, text) => {
      buttons.forEach((b) => {
        if (b.dataset.scene === forSlug && b.dataset.act === act) b.textContent = text;
      });
    },
  });

  let pal: Palette = { fg: "#eee", muted: "#999", accent: "#f40", bg: "#111", rule: "#333", mono: "monospace" };
  const readPalette = () => {
    const cs = getComputedStyle(root);
    pal = {
      fg: cs.color,
      muted: cs.getPropertyValue("--muted").trim(),
      accent: cs.getPropertyValue("--accent").trim(),
      bg: cs.getPropertyValue("--bg").trim(),
      rule: cs.getPropertyValue("--rule-strong").trim(),
      mono: cs.getPropertyValue("--mono").trim() || "monospace",
    };
  };

  let scale = 1;
  let ox = 0;
  let oy = 0;
  let dpr = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    scale = Math.min(r.width / W, r.height / H);
    ox = (r.width - W * scale) / 2;
    oy = (r.height - H * scale) / 2;
    if (!running) draw(0);
  };

  const fresh = (): Particle => {
    const p: Particle = { x: W / 2, y: H / 2, vx: 0, vy: 0, tx: 0, ty: 0, tag: 0, a: 0, on: false, id: -1, delay: 0, phase: Math.random() * 6.28 };
    pool.push(p);
    return p;
  };

  const place = (p: Particle, pt: Pt) => {
    p.tx = pt.x;
    p.ty = pt.y;
    p.tag = pt.tag;
    p.id = pt.id;
    p.on = true;
    if (pt.snap || reduced) {
      p.x = pt.x;
      p.y = pt.y;
      p.vx = p.vy = 0;
    }
    byId.set(pt.id, p);
  };

  const release = (p: Particle) => {
    p.on = false;
    p.id = -1;
    p.tx = p.x + (Math.random() - 0.5) * 30;
    p.ty = p.y + 12 + Math.random() * 24;
  };

  /** New scene: sweep-sort both sides so each dot travels a short way, left to right. */
  const morph = (pts: Pt[]) => {
    byId.clear();
    const live = pool.filter((p) => p.on && p.a > 0.2).sort((a, b) => a.x - b.x);
    const rest = pool.filter((p) => !(p.on && p.a > 0.2));
    pool.forEach((p) => (p.on = false));
    const ordered = pts.slice().sort((a, b) => a.x - b.x);
    const supply = live.concat(rest);
    ordered.forEach((pt, i) => {
      const p = supply[i] ?? fresh();
      if (p.a < 0.2 && !reduced) {
        p.x = pt.x + (Math.random() - 0.5) * 80;
        p.y = pt.y + (Math.random() - 0.5) * 80;
        p.vx = p.vy = 0;
      }
      place(p, pt);
      p.delay = reduced ? 0 : (pt.x / W) * 0.35 + Math.random() * 0.1;
    });
    supply.slice(ordered.length).forEach((p) => p.on || release(p));
  };

  /** Same scene, new state: ids keep their particle, new ids fade in near their spot. */
  const update = (pts: Pt[]) => {
    const keep = new Set<number>();
    const free = pool.filter((p) => !p.on);
    for (const pt of pts) {
      keep.add(pt.id);
      let p = byId.get(pt.id);
      if (!p) {
        p = free.pop() ?? fresh();
        p.x = pt.x + (Math.random() - 0.5) * 24;
        p.y = pt.y - 14 - Math.random() * 18;
        p.vx = p.vy = 0;
        p.a = 0;
        p.delay = 0;
      }
      place(p, pt);
    }
    byId.forEach((p, id) => {
      if (!keep.has(id)) {
        byId.delete(id);
        release(p);
      }
    });
  };

  let px = -1e4;
  let py = -1e4;
  let t = 0;

  const step = (dt: number) => {
    const f = dt * 60;
    const damp = Math.pow(0.8, f);
    const R = 30;
    const push = scene?.repel ?? 0;
    for (const p of pool) {
      if (p.delay > 0) {
        p.delay -= dt;
        continue;
      }
      p.vx = (p.vx + (p.tx - p.x) * 0.075 * f) * damp;
      p.vy = (p.vy + (p.ty - p.y) * 0.075 * f) * damp;
      if (push) {
        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const k = (1 - d / R) * push * f;
          p.vx += (dx / d) * k;
          p.vy += (dy / d) * k;
        }
      }
      p.x += p.vx * f;
      p.y += p.vy * f;
      p.a += ((p.on ? 1 : 0) - p.a) * Math.min(1, 0.09 * f);
    }
  };

  const draw = (time: number) => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr);
    if (!scene) return;

    g.font = `500 ${GLYPH_SIZE}px ${pal.mono}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    let style = "";
    // Glyphs at rest still turn over now and then, a slow shimmer rather than a still image.
    const tick = reduced ? 0 : Math.floor(time * 2.5);
    for (const p of pool) {
      if (p.a < 0.03) continue;
      const ink = scene.ink(p, time);
      const band = BAND[ink];
      const span = band.to - band.from + 1;
      const speed = Math.abs(p.vx) + Math.abs(p.vy);
      let i = band.from + ((((p.phase * 1000) | 0) + (((tick + p.phase * 7) | 0) % 9 === 0 ? 1 : 0)) % span);
      if (speed > 0.25) i = Math.max(1, Math.min(i, 5 - Math.min(4, Math.floor(speed / 1.2))));
      const colour = ink === "fg" ? pal.fg : ink === "accent" ? pal.accent : pal.muted;
      if (colour !== style) {
        g.fillStyle = colour;
        style = colour;
      }
      g.globalAlpha = Math.min(1, p.a) * band.alpha;
      g.fillText(RAMP[i], p.x, p.y);
    }
    g.globalAlpha = 1;
    g.textAlign = "left";
    scene.overlay?.(g, pal, time);
  };

  let running = false;
  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    // A rAF timestamp can predate the performance.now() taken when the loop
    // started, which would run time backwards for a frame.
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    t += dt;
    if (scene?.tick?.(dt, t)) update(scene.points());
    step(dt);
    draw(t);
    raf = running ? requestAnimationFrame(frame) : 0;
  };
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const show = (next: string) => {
    if (next === slug) return;
    slug = next;
    let s = cache.get(next);
    if (!s) {
      const make = factories[next];
      if (!make) return;
      s = make(api(next));
      cache.set(next, s);
    }
    scene = s;
    buttons.forEach((b) => (b.hidden = b.dataset.scene !== next));
    s.start?.();
    morph(s.points());
    if (!running) draw(t);
  };

  const toLogical = (e: PointerEvent | MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left - ox) / scale, (e.clientY - r.top - oy) / scale];
  };
  canvas.addEventListener("pointermove", (e) => {
    [px, py] = toLogical(e);
    const hot = scene?.hover?.(px, py) ?? false;
    canvas.style.cursor = hot ? "pointer" : "";
  });
  canvas.addEventListener("pointerleave", () => {
    px = py = -1e4;
    scene?.hover?.(null, 0);
    canvas.style.cursor = "";
  });
  canvas.addEventListener("click", (e) => {
    const [x, y] = toLogical(e);
    if (scene?.tap?.(x, y)) update(scene.points());
  });
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.scene === slug && scene?.act?.(b.dataset.act!)) update(scene.points());
    }),
  );

  readPalette();
  resize();
  new ResizeObserver(resize).observe(canvas);
  document.fonts?.ready.then(() => readPalette());

  let inView = false;
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    setRunning(inView && !document.hidden);
  }).observe(root);
  document.addEventListener("visibilitychange", () => setRunning(inView && !document.hidden));

  return { show };
}

/* ------------------------------------------------------------------ scenes */

/* Pangan.id: the archipelago in dots. Island groups light up with their real
   province count, which adds up to the 38 provinces the app covers. */
const ISLANDS = [
  { name: "Sumatra", provinces: 10 },
  { name: "Jawa", provinces: 6 },
  { name: "Kalimantan", provinces: 5 },
  { name: "Sulawesi", provinces: 6 },
  { name: "Bali and Nusa Tenggara", provinces: 3 },
  { name: "Maluku", provinces: 2 },
  { name: "Papua", provinces: 6 },
];

const geo = (lon: number, lat: number): [number, number] => [(lon - 94.5) * 8.3, 152 - (lat + 2.5) * 8.3];

function poly(g: CanvasRenderingContext2D, ll: number[][]) {
  g.beginPath();
  ll.forEach(([lon, lat], i) => {
    const [x, y] = geo(lon, lat);
    if (i) g.lineTo(x, y);
    else g.moveTo(x, y);
  });
  g.closePath();
  g.fill();
}
function line(g: CanvasRenderingContext2D, ll: number[][], width: number) {
  g.lineWidth = width;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  ll.forEach(([lon, lat], i) => {
    const [x, y] = geo(lon, lat);
    if (i) g.lineTo(x, y);
    else g.moveTo(x, y);
  });
  g.stroke();
}

export const pangan: SceneFactory = (api) => {
  const pts = sample(W, H, 4, (g, tag) => {
    g.fillStyle = g.strokeStyle = tag(20);
    poly(g, [[95.3,5.6],[97.5,5.2],[98.7,3.8],[100.3,2.2],[101.5,1.7],[103.5,0.5],[104.5,-1],[106,-3],[105.8,-5.9],[104.5,-5.8],[102.3,-4],[101,-2.5],[100,-1],[98.8,1.2],[97.5,2.5],[96,4],[95.2,5.2]]);
    g.fillStyle = g.strokeStyle = tag(40);
    poly(g, [[105.2,-6.8],[106,-5.9],[108,-6.2],[110.5,-6.4],[112.5,-6.8],[114.5,-7.7],[114.4,-8.6],[112,-8.4],[110,-8.1],[108,-7.8],[106.5,-7.4],[105.4,-6.9]]);
    g.fillStyle = g.strokeStyle = tag(60);
    poly(g, [[109,1.8],[110.5,1.8],[111.8,2.8],[113,3.2],[114.5,4.5],[115.5,5.3],[116.8,6.9],[117.7,6.1],[119.2,5.2],[118,4.3],[117.8,2],[119,1],[118,0.5],[117.5,-0.8],[116.5,-2.5],[116.2,-3.9],[114.6,-4.1],[113,-3.2],[111.5,-3],[110.2,-2.9],[110,-1.5],[109,-0.3],[108.9,0.8]]);
    g.fillStyle = g.strokeStyle = tag(80);
    line(g, [[125,1.5],[123.5,0.6],[120.2,0.7],[119.7,-1],[119.5,-3.5],[119.6,-5.5]], 8);
    line(g, [[120.4,-1.3],[121.5,-2.8],[122.6,-4.7]], 7);
    line(g, [[120.5,-1],[122.5,-0.9],[123.3,-0.9]], 6);
    g.fillStyle = g.strokeStyle = tag(100);
    line(g, [[114.5,-8.3],[115.6,-8.4]], 6);
    line(g, [[116.1,-8.6],[119,-8.5]], 7);
    line(g, [[119.9,-8.6],[123,-8.4]], 7);
    line(g, [[119.2,-9.6],[120.6,-9.9]], 7);
    line(g, [[123.6,-10.1],[125.2,-9.3],[127,-8.5]], 7);
    g.fillStyle = g.strokeStyle = tag(120);
    line(g, [[127.7,1.9],[128,0.8],[127.8,-0.5]], 6);
    line(g, [[128,0.8],[128.7,0.4]], 5);
    line(g, [[128,-3.1],[130.9,-3.1]], 6);
    line(g, [[126.1,-3.4],[127.2,-3.4]], 6);
    g.fillStyle = g.strokeStyle = tag(140);
    poly(g, [[131,-1.2],[132.5,-0.4],[134,-0.9],[135,-3.3],[137.5,-1.5],[139,-2.1],[141,-2.6],[141,-9.1],[139,-8.1],[138,-8.4],[137.6,-7],[136.5,-4.8],[134.5,-3.8],[133.5,-3.9],[132.8,-4],[132,-2.8],[133,-2.4],[131.3,-1.5]]);
  });

  const group = (tag: number) => tag / 20 - 1;
  const centre = ISLANDS.map((_, i) => {
    const mine = pts.filter((p) => group(p.tag) === i);
    const x = mine.reduce((s, p) => s + p.x, 0) / mine.length;
    const top = Math.min(...mine.map((p) => p.y));
    return { x, top };
  });

  let active = 0;
  let pinned = -1;
  let hovered = -1;

  const at = (x: number, y: number) => {
    let best = -1;
    let bestD = 14 * 14;
    for (const p of pts) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = group(p.tag);
      }
    }
    return best;
  };

  const say = (i: number) => {
    const isle = ISLANDS[i];
    api.status(`${isle.name}: ${isle.provinces} of 38 provinces.`);
  };

  return {
    repel: 1.4,
    points: () => pts,
    start: () => say(active),
    tick(_dt, t) {
      // With nobody pointing, the highlight tours the islands west to east.
      const next = hovered >= 0 ? hovered : pinned >= 0 ? pinned : Math.floor(t / 1.8) % ISLANDS.length;
      if (next !== active) {
        active = next;
        say(active);
      }
      return false;
    },
    ink: (p) => (group(p.tag) === active ? "accent" : "fg"),
    hover(x, y) {
      hovered = x === null ? -1 : at(x, y);
      return hovered >= 0;
    },
    tap(x, y) {
      pinned = at(x, y);
      return false;
    },
    overlay(g, pal) {
      const isle = ISLANDS[active];
      const c = centre[active];
      g.font = font(pal, 9);
      const label = `${isle.name}, ${isle.provinces} provinces`;
      const w = g.measureText(label).width;
      const x = Math.max(4, Math.min(W - w - 4, c.x - w / 2));
      const y = Math.max(14, c.top - 10);
      g.strokeStyle = pal.accent;
      g.lineWidth = 0.8;
      g.beginPath();
      g.moveTo(c.x, y + 3);
      g.lineTo(c.x, c.top - 2);
      g.stroke();
      chip(g, pal, x - 4, y + 2, label, pal.accent, pal.bg);
    },
  };
};

/* ScanMBG: a school-meal tray. Tap a compartment to empty it, then scan: the
   sweep labels each food group it finds and names the ones that are missing. */
const TRAY = { x: 70, y: 62, w: 260, h: 176 };
const COMPARTMENTS = [
  { name: "sayur", x: 84, y: 78, w: 72, h: 62 },
  { name: "buah", x: 164, y: 78, w: 72, h: 62 },
  { name: "lauk nabati", x: 244, y: 78, w: 72, h: 62 },
  { name: "nasi", x: 84, y: 148, w: 132, h: 76 },
  { name: "lauk hewani", x: 224, y: 148, w: 92, h: 76 },
];

export const scanmbg: SceneFactory = (api) => {
  const all = sample(W, H, 4, (g, tag) => {
    g.strokeStyle = tag(20);
    g.lineWidth = 6;
    g.beginPath();
    g.roundRect(TRAY.x, TRAY.y, TRAY.w, TRAY.h, 18);
    g.stroke();
    const circle = (x: number, y: number, r: number) => {
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    };
    g.fillStyle = tag(40);
    [[104, 100, 13], [126, 96, 12], [134, 118, 12], [108, 122, 12], [120, 110, 9]].forEach(([x, y, r]) => circle(x, y, r));
    g.fillStyle = tag(60);
    circle(186, 112, 15);
    g.strokeStyle = tag(60);
    g.lineWidth = 8;
    g.lineCap = "round";
    g.beginPath();
    g.arc(214, 92, 22, Math.PI * 0.55, Math.PI * 1.05);
    g.stroke();
    g.fillStyle = tag(80);
    g.beginPath();
    g.roundRect(254, 88, 46, 18, 3);
    g.roundRect(260, 114, 46, 18, 3);
    g.fill();
    g.fillStyle = tag(100);
    g.beginPath();
    g.roundRect(94, 158, 112, 56, 22);
    g.fill();
    g.fillStyle = tag(120);
    g.beginPath();
    g.ellipse(258, 182, 24, 17, -0.3, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = tag(120);
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(272, 192);
    g.lineTo(298, 206);
    g.stroke();
    circle(300, 204, 5);
    circle(296, 211, 5);
  });

  const comp = (tag: number) => tag / 20 - 2;
  const present = COMPARTMENTS.map(() => true);
  let scanY = -1;
  const found = new Set<number>();
  let done = false;
  let hot = -1;

  const hit = (x: number, y: number) =>
    COMPARTMENTS.findIndex((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);

  const idle = () => api.status("Tap a compartment to empty it, then scan the tray.");
  const report = () => {
    const missing = COMPARTMENTS.filter((_, i) => !present[i]).map((c) => c.name);
    const n = COMPARTMENTS.length - missing.length;
    api.status(
      missing.length
        ? `Found ${n} of 5 food groups. Missing: ${missing.join(", ")}.`
        : "Found all 5 food groups: a complete tray.",
    );
  };

  return {
    repel: 0.8,
    points: () => all.filter((p) => p.tag === 20 || present[comp(p.tag)]),
    start: () => (done ? report() : idle()),
    tick(dt) {
      if (scanY < 0) return false;
      scanY += dt * 130;
      COMPARTMENTS.forEach((c, i) => {
        if (present[i] && scanY > c.y + c.h / 2) found.add(i);
      });
      if (scanY > TRAY.y + TRAY.h + 8) {
        scanY = -1;
        done = true;
        report();
      }
      return false;
    },
    ink(p) {
      if (p.tag === 20) return "muted";
      if (scanY >= 0 && Math.abs(p.ty - scanY) < 9) return "accent";
      return "fg";
    },
    hover(x, y) {
      hot = x === null ? -1 : hit(x, y);
      return hot >= 0;
    },
    tap(x, y) {
      const i = hit(x, y);
      if (i < 0 || scanY >= 0) return false;
      present[i] = !present[i];
      found.clear();
      done = false;
      api.status(present[i] ? `Put the ${COMPARTMENTS[i].name} back.` : `Took out the ${COMPARTMENTS[i].name}. Scan to check the tray.`);
      return true;
    },
    act(name) {
      if (name === "scan" && scanY < 0) {
        found.clear();
        done = false;
        scanY = TRAY.y - 4;
        api.status("Scanning the tray.");
        return false;
      }
      if (name === "refill") {
        present.fill(true);
        found.clear();
        done = false;
        idle();
        return true;
      }
      return false;
    },
    overlay(g, pal) {
      g.lineWidth = 0.7;
      COMPARTMENTS.forEach((c, i) => {
        g.setLineDash([2, 3]);
        g.strokeStyle = i === hot ? pal.fg : pal.rule;
        g.strokeRect(c.x, c.y, c.w, c.h);
        g.setLineDash([]);
        if (found.has(i)) {
          g.strokeStyle = pal.accent;
          g.lineWidth = 1;
          g.strokeRect(c.x + 2, c.y + 2, c.w - 4, c.h - 4);
          g.lineWidth = 0.7;
          chip(g, pal, c.x + 2, c.y + 2, c.name, pal.accent, pal.bg);
        } else if (done && !present[i]) {
          g.font = font(pal, 7.5);
          g.fillStyle = pal.muted;
          g.textBaseline = "middle";
          g.textAlign = "center";
          g.fillText(`no ${c.name}`, c.x + c.w / 2, c.y + c.h / 2);
          g.textAlign = "left";
        }
      });
      if (scanY >= 0) {
        g.strokeStyle = pal.accent;
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(TRAY.x - 12, scanY);
        g.lineTo(TRAY.x + TRAY.w + 12, scanY);
        g.stroke();
      }
    },
  };
};

/* Rumeet: one room's week. Free slots are faint, taken slots solid. Tap a free
   slot to book it; tap a taken one and the calendar refuses, which is the whole
   point of the tool: no double bookings. */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = 9;
const GRID = { x: 66, y: 50, cw: 64, rh: 26 };
const TAKEN = ["0-1", "0-2", "0-6", "1-2", "1-3", "1-4", "2-0", "2-5", "2-6", "3-1", "3-7", "3-8", "4-2", "4-3", "4-6"];

export const rumeet: SceneFactory = (api) => {
  const state = new Map<string, number>();
  TAKEN.forEach((k) => state.set(k, 1));
  const shake = new Map<string, number>();
  let hot: [number, number] | null = null;
  const name = (d: number, h: number) => `${DAYS[d]} ${String(8 + h).padStart(2, "0")}:00`;

  const cell = (x: number, y: number): [number, number] | null => {
    const d = Math.floor((x - GRID.x) / GRID.cw);
    const h = Math.floor((y - GRID.y) / GRID.rh);
    return d >= 0 && d < DAYS.length && h >= 0 && h < HOURS ? [d, h] : null;
  };

  return {
    repel: 0,
    start: () => api.status("Meeting room, this week. Tap a free slot to book it."),
    points() {
      const pts: Pt[] = [];
      for (let d = 0; d < DAYS.length; d++) {
        for (let h = 0; h < HOURS; h++) {
          const key = `${d}-${h}`;
          const s = state.get(key) ?? 0;
          const left = shake.get(key) ?? 0;
          const wobble = Math.sin(left * 40) * left * 6;
          const x0 = GRID.x + d * GRID.cw + 5;
          const y0 = GRID.y + h * GRID.rh + 5;
          let k = 0;
          for (let y = y0 + 2; y < y0 + GRID.rh - 8; y += 5) {
            for (let x = x0 + 2; x < x0 + GRID.cw - 8; x += 5) {
              pts.push({ x: x + wobble, y, tag: (s + 1) * 20, id: (d * HOURS + h) * 100 + k++ });
            }
          }
        }
      }
      return pts;
    },
    tick(dt) {
      if (!shake.size) return false;
      shake.forEach((v, k) => (v - dt <= 0 ? shake.delete(k) : shake.set(k, v - dt)));
      return true;
    },
    ink: (p) => (p.tag === 20 ? "dim" : p.tag === 40 ? "fg" : "accent"),
    hover(x, y) {
      hot = x === null ? null : cell(x, y);
      return hot !== null;
    },
    tap(x, y) {
      const c = cell(x, y);
      if (!c) return false;
      const key = `${c[0]}-${c[1]}`;
      const s = state.get(key) ?? 0;
      if (s === 1) {
        shake.set(key, 0.5);
        api.status(`${name(...c)} is already taken. Pick a free slot.`);
      } else if (s === 2) {
        state.delete(key);
        api.status(`Cancelled ${name(...c)}.`);
      } else {
        state.set(key, 2);
        api.status(`Booked ${name(...c)} for one hour. No clash.`);
      }
      return true;
    },
    act(name) {
      if (name !== "clear") return false;
      state.forEach((v, k) => v === 2 && state.delete(k));
      api.status("Cleared your bookings.");
      return true;
    },
    overlay(g, pal) {
      g.font = font(pal, 8);
      g.fillStyle = pal.muted;
      g.textBaseline = "middle";
      g.textAlign = "center";
      DAYS.forEach((d, i) => g.fillText(d, GRID.x + i * GRID.cw + GRID.cw / 2 - 2, GRID.y - 10));
      g.textAlign = "right";
      for (let h = 0; h < HOURS; h += 2) g.fillText(String(8 + h).padStart(2, "0"), GRID.x - 6, GRID.y + h * GRID.rh + GRID.rh / 2 - 2);
      g.textAlign = "left";
      if (hot) {
        g.strokeStyle = pal.fg;
        g.lineWidth = 0.8;
        g.strokeRect(GRID.x + hot[0] * GRID.cw + 3, GRID.y + hot[1] * GRID.rh + 3, GRID.cw - 10, GRID.rh - 10);
      }
    },
  };
};

/* Helmet Detection: traffic rolls through the frame, every head gets a box,
   and riders are counted as they cross the line. Helmets are re-rolled each
   lap, so the tally keeps moving. */
const RIDER_W = 130;
const RIDER_H = 120;
const ROAD = 238;
const LAP = 3 * 190;

function rider(helmet: boolean) {
  return sample(RIDER_W, RIDER_H, 4, (g, tag) => {
    g.lineCap = "round";
    g.lineJoin = "round";
    g.strokeStyle = g.fillStyle = tag(20);
    g.lineWidth = 4;
    [26, 104].forEach((x) => {
      g.beginPath();
      g.arc(x, 101, 14, 0, Math.PI * 2);
      g.stroke();
    });
    g.beginPath();
    g.moveTo(30, 80);
    g.lineTo(50, 70);
    g.lineTo(86, 70);
    g.lineTo(104, 77);
    g.lineTo(96, 84);
    g.lineTo(40, 85);
    g.closePath();
    g.fill();
    const stroke = (w: number, ...xy: number[]) => {
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(xy[0], xy[1]);
      for (let i = 2; i < xy.length; i += 2) g.lineTo(xy[i], xy[i + 1]);
      g.stroke();
    };
    stroke(4, 98, 76, 104, 101);
    stroke(4, 94, 72, 98, 50);
    stroke(4, 92, 50, 104, 50);
    stroke(12, 58, 64, 68, 36);
    stroke(5, 68, 42, 96, 51);
    stroke(9, 58, 64, 82, 67);
    stroke(6, 82, 67, 84, 86);
    g.fillStyle = tag(40);
    g.beginPath();
    g.arc(72, 22, 10, 0, Math.PI * 2);
    g.fill();
    if (helmet) {
      g.fillStyle = tag(60);
      g.beginPath();
      g.arc(72, 21, 14, Math.PI, 0);
      g.lineTo(86, 27);
      g.lineTo(58, 27);
      g.closePath();
      g.fill();
    }
  });
}

export const helmet: SceneFactory = (api) => {
  const shapes = { on: rider(true), off: rider(false) };
  const road: Pt[] = [];
  for (let x = 2; x < W; x += 5) road.push({ x, y: ROAD + 4, tag: 80, id: 900000 + x });
  for (let x = 2; x < W; x += 5) if (Math.floor(x / 25) % 2 === 0) road.push({ x, y: ROAD + 30, tag: 80, id: 910000 + x });

  const riders = [0, 1, 2].map((i) => ({ offset: i * 190, helmet: i !== 1, x: 0, prev: 0, wrapped: false }));
  let clock = 0;
  let paused = api.reduced;
  let seen = 0;
  let flagged = 0;

  const position = () => {
    riders.forEach((r) => {
      const raw = (((r.offset + clock * 52) % LAP) + LAP) % LAP;
      r.wrapped = raw < r.prev;
      r.prev = raw;
      r.x = raw - 140;
    });
  };
  position();
  riders.forEach((r) => (r.wrapped = false));

  const say = () =>
    api.status(`${seen} riders counted, ${flagged} without a helmet.`);

  const toggle = () => {
    paused = !paused;
    api.label("pause", paused ? "Play" : "Pause");
    say();
  };
  if (paused) api.label("pause", "Play");

  return {
    repel: 1.2,
    start: say,
    points() {
      const pts: Pt[] = road.slice();
      riders.forEach((r, i) => {
        const shape = r.helmet ? shapes.on : shapes.off;
        for (const p of shape) {
          pts.push({ x: p.x + r.x, y: p.y + ROAD - RIDER_H, tag: p.tag, id: i * 100000 + p.id, snap: r.wrapped });
        }
      });
      return pts;
    },
    tick(dt) {
      if (paused) return false;
      clock += dt;
      position();
      riders.forEach((r) => {
        if (r.wrapped) r.helmet = Math.random() > 0.35;
        const head = r.x + 70;
        const before = head - dt * 52;
        if (before < W / 2 && head >= W / 2) {
          seen++;
          if (!r.helmet) flagged++;
          say();
        }
      });
      return true;
    },
    ink(p) {
      if (p.tag === 80) return "muted";
      if (p.tag === 40) {
        const r = riders.find((r) => p.tx >= r.x && p.tx <= r.x + RIDER_W);
        return r && !r.helmet ? "accent" : "fg";
      }
      return "fg";
    },
    tap() {
      toggle();
      return false;
    },
    hover: () => true,
    act(name) {
      if (name === "pause") toggle();
      return false;
    },
    overlay(g, pal) {
      g.strokeStyle = pal.rule;
      g.lineWidth = 0.7;
      g.setLineDash([3, 3]);
      g.beginPath();
      g.moveTo(W / 2, 30);
      g.lineTo(W / 2, ROAD + 36);
      g.stroke();
      g.setLineDash([]);
      g.font = font(pal, 7.5);
      g.fillStyle = pal.muted;
      g.textAlign = "center";
      g.fillText("count line", W / 2, 24);
      g.textAlign = "left";
      riders.forEach((r) => {
        const bx = r.x + 54;
        const by = ROAD - RIDER_H + 4;
        if (bx < -30 || bx > W) return;
        const colour = r.helmet ? pal.fg : pal.accent;
        g.strokeStyle = colour;
        g.lineWidth = 1;
        g.strokeRect(bx, by, 34, 34);
        chip(g, pal, bx, by, r.helmet ? "helmet" : "no helmet", colour, pal.bg);
      });
    },
  };
};

/** Any featured project without its own scene: its name, set in dots. */
export const fallback =
  (title: string): SceneFactory =>
  (api) => {
    const pts = sample(W, H, 4, (g, tag) => {
      g.fillStyle = tag(20);
      g.font = `600 64px ${getComputedStyle(document.body).fontFamily}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(title, W / 2, H / 2, W - 40);
    });
    return { repel: 1.4, points: () => pts, ink: () => "fg", start: () => api.status(title) };
  };
