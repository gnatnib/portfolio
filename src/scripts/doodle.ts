/* Footer wordmark as a small ASCII playground.

   The word is rasterised into a grid of monospace cells. Dragging the pointer
   leaves a fading doodle of characters, a click sends a ripple through the
   letters, and a cat walks along the tops of the letters: it runs from the
   pointer, naps when left alone, and answers when clicked. Everything is drawn
   at a deliberately low frame rate so it reads as a hand-flipped doodle, and the
   loop sleeps whenever nothing is moving or the footer is off screen. */

const RAMP = " .:-=+*o#%@";
const SCRIBBLE = "~/\\|-_^*+";
const SPLASH = "!?<>{}[]/\\";
const FPS = 24;
const CAT_ROWS = 3;
const CAT_W = 8;

type Ripple = { x: number; y: number; r: number; life: number };
type CatMood = "walk" | "run" | "nap" | "talk";

const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

export function mountDoodle(root: HTMLElement, word: string, reduced: boolean) {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-doodle-canvas]")!;
  const g = canvas.getContext("2d")!;
  const say = root.querySelector<HTMLElement>("[data-doodle-say]");

  let cols = 0;
  let rows = 0;
  let cw = 10;
  let ch = 17;
  let dpr = 1;
  let cover = new Float32Array(0);
  let heat = new Float32Array(0);
  let ink = new Uint8Array(0);
  let surface = new Int16Array(0);
  let fg = "#eee";
  let accent = "#f40";
  let muted = "#999";
  let bg = "#111";
  let mono = "monospace";
  let sans = "sans-serif";

  const readColours = () => {
    const cs = getComputedStyle(root);
    fg = cs.color;
    accent = cs.getPropertyValue("--accent").trim();
    muted = cs.getPropertyValue("--muted").trim();
    bg = cs.getPropertyValue("--bg").trim();
    mono = cs.getPropertyValue("--mono").trim() || "monospace";
    sans = cs.getPropertyValue("--sans").trim() || "sans-serif";
  };

  /* Word coverage per cell, from a 4x supersampled render, so edges get the
     light end of the ramp and stems the dense end. Phones get finer cells so
     the word still has enough rows to read. */
  const cellWidth = (w: number) => Math.max(4.5, Math.min(12, w / 150));
  const layout = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    // The canvas is as tall as the word at full width plus a strip for the
    // cat; resizing it re-enters here through the ResizeObserver.
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = `600 100px ${sans}`;
    const pm = probe.measureText(word);
    const unit = cellWidth(r.width) * 1.7;
    const wordH = ((pm.actualBoundingBoxAscent + pm.actualBoundingBoxDescent) / pm.width) * r.width * 0.98;
    const want = Math.round(wordH + (CAT_ROWS + 2.5) * unit);
    if (Math.abs(want - r.height) > 2) {
      canvas.style.height = `${want}px`;
      return;
    }
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    cw = cellWidth(r.width);
    ch = cw * 1.7;
    cols = Math.floor(r.width / cw);
    rows = Math.floor(r.height / ch);
    cover = new Float32Array(cols * rows);
    heat = new Float32Array(cols * rows);
    ink = new Uint8Array(cols * rows);

    // Render the word at the grid's real pixel size, then average 4 x 4
    // sample points per cell, so letters keep their shape on tall cells.
    const S = 4;
    const off = document.createElement("canvas");
    off.width = Math.ceil(cols * cw);
    off.height = Math.ceil(rows * ch);
    const o = off.getContext("2d", { willReadFrequently: true })!;
    // Leave the top rows free for the cat to walk over the letters.
    const top = (CAT_ROWS + 1.5) * ch;
    const avail = off.height - top - ch * 0.5;
    o.font = `600 100px ${sans}`;
    const m = o.measureText(word);
    const size = Math.min((100 * off.width * 0.98) / m.width, (avail / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)) * 100);
    o.font = `600 ${size}px ${sans}`;
    const mm = o.measureText(word);
    o.fillStyle = "#fff";
    o.fillText(word, (off.width - mm.width) / 2, top + mm.actualBoundingBoxAscent);
    const data = o.getImageData(0, 0, off.width, off.height).data;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let sum = 0;
        for (let sy = 0; sy < S; sy++) {
          for (let sx = 0; sx < S; sx++) {
            const X = Math.floor((x + (sx + 0.5) / S) * cw);
            const Y = Math.floor((y + (sy + 0.5) / S) * ch);
            sum += data[(Y * off.width + X) * 4 + 3];
          }
        }
        cover[y * cols + x] = sum / (S * S * 255);
      }
    }
    // Where the cat stands in each column: just above the highest solid cell, or the floor.
    surface = new Int16Array(cols);
    for (let x = 0; x < cols; x++) {
      let y = 0;
      while (y < rows && cover[y * cols + x] < 0.5) y++;
      surface[x] = y;
    }
    cat.x = Math.min(cat.x, cols - CAT_W);
    cat.y = standY(cat.x);
    wake();
  };

  /* ------------------------------------------------------------- the cat */
  const cat = { x: 4, y: 0, dir: 1, mood: "walk" as CatMood, until: 0, step: 0, hop: 0, line: "" };
  const standY = (x: number) => {
    let s = rows;
    for (let i = Math.max(0, Math.floor(x)); i < Math.min(cols, Math.floor(x) + CAT_W - 1); i++) s = Math.min(s, surface[i]);
    return s - CAT_ROWS;
  };
  const LINES = ["meow", "mrrp?", "hi :)", "prrr", "feed me", "ok bye"];
  const sprite = (): string[] => {
    const tail = cat.dir > 0 ? "~" : "";
    const tailL = cat.dir < 0 ? "~" : "";
    const face = cat.mood === "nap" ? "( -.- )" : cat.mood === "run" ? "( O.O )" : cat.mood === "talk" ? "( ^o^ )" : "( o.o )";
    const legs = cat.mood === "nap" ? " (___) " : cat.step % 2 ? " /   \\ " : " |   | ";
    return [" /\\_/\\ ", tailL ? "~" + face : face + tail, legs];
  };

  /* --------------------------------------------------------------- input */
  let px = -99;
  let py = -99;
  let lastX = -99;
  let lastY = -99;
  let drawing = false;
  const ripples: Ripple[] = [];

  const toCell = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / cw, (e.clientY - r.top) / ch];
  };
  const deposit = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, (y1 - y0) * 1.7)));
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const cx = Math.round(x + dx);
          const cy = Math.round(y + dy);
          if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
          const k = cy * cols + cx;
          const w = 1 - Math.hypot(dx / 2.5, dy / 1.5);
          if (w <= 0) continue;
          if (heat[k] < w) {
            heat[k] = w;
            ink[k] = (Math.random() * 255) | 0;
          }
        }
      }
    }
  };
  const onCat = (x: number, y: number) => x >= cat.x - 1 && x <= cat.x + CAT_W && y >= cat.y - 1 && y <= cat.y + CAT_ROWS + 0.5;
  const talk = (text: string, seconds: number) => {
    cat.mood = "talk";
    cat.line = text;
    cat.until = clock + seconds;
    cat.hop = 1;
  };

  canvas.addEventListener("pointermove", (e) => {
    [px, py] = toCell(e);
    if (e.pointerType === "mouse" || drawing) {
      if (lastX > -50) deposit(lastX, lastY, px, py);
      lastX = px;
      lastY = py;
    }
    canvas.style.cursor = onCat(px, py) ? "pointer" : "crosshair";
    wake();
  });
  canvas.addEventListener("pointerdown", (e) => {
    [px, py] = toCell(e);
    drawing = true;
    lastX = px;
    lastY = py;
  });
  const lift = () => {
    drawing = false;
    lastX = lastY = -99;
  };
  canvas.addEventListener("pointerup", lift);
  canvas.addEventListener("pointercancel", lift);
  canvas.addEventListener("pointerleave", () => {
    lift();
    px = py = -99;
  });
  canvas.addEventListener("click", (e) => {
    const [x, y] = toCell(e);
    if (onCat(x, y)) {
      talk(LINES[(Math.random() * LINES.length) | 0], 1.6);
    } else {
      ripples.push({ x, y, r: 0, life: 1 });
      if (Math.abs(x - (cat.x + CAT_W / 2)) < 18 && cat.mood !== "talk") {
        cat.mood = "run";
        cat.line = "!";
        cat.dir = x < cat.x ? 1 : -1;
        cat.until = clock + 1.2;
      }
    }
    wake();
  });

  /* ---------------------------------------------------------------- loop */
  let clock = 0;
  let intro = reduced ? 1 : 0;
  let running = false;
  let inView = false;
  let raf = 0;
  let last = 0;
  let acc = 0;

  const tickCat = (dt: number) => {
    const near = px > -50 && Math.abs(px - (cat.x + CAT_W / 2)) < 10 && Math.abs(py - (cat.y + 1)) < 6;
    if (cat.mood === "nap" && near) {
      cat.mood = "run";
      cat.line = "!";
      cat.until = clock + 1;
    }
    if (near && cat.mood === "walk") {
      cat.mood = "run";
      cat.line = "!";
      cat.until = clock + 1;
    }
    if (cat.mood === "run") cat.dir = px < cat.x + CAT_W / 2 ? 1 : -1;
    if (clock > cat.until && cat.mood !== "walk") {
      cat.mood = "walk";
      cat.line = "";
      cat.until = clock + 6 + Math.random() * 8;
    } else if (cat.mood === "walk" && clock > cat.until) {
      cat.mood = "nap";
      cat.line = "z";
      cat.until = clock + 4 + Math.random() * 3;
    }
    const speed = cat.mood === "run" ? 22 : cat.mood === "walk" ? 5 : 0;
    if (speed) {
      const before = Math.floor(cat.x);
      cat.x += cat.dir * speed * dt;
      if (cat.x < 0) {
        cat.x = 0;
        cat.dir = 1;
      } else if (cat.x > cols - CAT_W) {
        cat.x = cols - CAT_W;
        cat.dir = -1;
      } else if (cat.mood === "walk" && Math.random() < dt * 0.08) cat.dir *= -1;
      if (Math.floor(cat.x) !== before) cat.step++;
    }
    // Snap down or hop up to the letter tops under it.
    const target = standY(cat.x);
    cat.y += (target - cat.y) * Math.min(1, dt * 14);
    cat.hop = Math.max(0, cat.hop - dt * 2.5);
  };

  const draw = () => {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.font = `500 ${ch * 0.78}px ${mono}`;
    g.textBaseline = "middle";
    g.textAlign = "center";
    const t = Math.floor(clock * 6);
    const aspect = ch / cw;

    let style = "";
    const fill = (c: string) => {
      if (c !== style) {
        g.fillStyle = c;
        style = c;
      }
    };

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x;
        const c = cover[k];
        const h = heat[k];
        const seed = hash(k);
        // Scroll-in: cells resolve left to right from noise into the word.
        const shown = intro >= 1 || seed * 0.4 + (x / cols) * 0.6 < intro;
        let wave = 0;
        for (const r of ripples) {
          const d = Math.hypot(x - r.x, (y - r.y) * aspect);
          const band = 1 - Math.abs(d - r.r) / 2.2;
          if (band > 0) wave = Math.max(wave, band * r.life);
        }
        const cx = x * cw + cw / 2;
        const cy = y * ch + ch / 2;
        if (h > 0.08) {
          fill(accent);
          g.globalAlpha = Math.min(1, h * 1.3);
          const set = c > 0.3 ? SPLASH : SCRIBBLE;
          g.fillText(set[(ink[k] + (h > 0.6 ? t : 0)) % set.length], cx, cy);
          continue;
        }
        if (c > 0.08) {
          if (!shown) {
            if (intro > 0 && seed < 0.5) {
              fill(muted);
              g.globalAlpha = 0.6;
              g.fillText(RAMP[1 + ((seed * 977 + t) % 10 | 0)], cx, cy);
            }
            continue;
          }
          let i = 1 + Math.min(9, Math.floor(c * 9.99));
          if (!reduced && hash(k + t * 31) < 0.012) i = Math.max(1, i - 2);
          if (wave > 0.1) {
            fill(accent);
            g.globalAlpha = 1;
            g.fillText(RAMP[Math.min(10, i + 1)], cx, cy - wave * ch * 0.45);
            continue;
          }
          fill(fg);
          g.globalAlpha = 1;
          g.fillText(RAMP[i], cx, cy);
        } else if (wave > 0.25) {
          fill(muted);
          g.globalAlpha = wave * 0.8;
          g.fillText(wave > 0.7 ? "o" : ".", cx, cy);
        }
      }
    }

    // The cat paints over a cleared patch so letters never show through it.
    if (intro >= 1 && rows > CAT_ROWS) {
      const lines = sprite();
      const ox = Math.round(cat.x);
      const oy = Math.round(cat.y - Math.sin(cat.hop * Math.PI) * 1.6);
      g.globalAlpha = 1;
      g.fillStyle = bg;
      g.fillRect(ox * cw, oy * ch, CAT_W * cw, CAT_ROWS * ch);
      style = "";
      fill(fg);
      lines.forEach((line, ly) => {
        [...line].forEach((chr, lx) => {
          if (chr !== " ") g.fillText(chr, (ox + lx) * cw + cw / 2, (oy + ly) * ch + ch / 2);
        });
      });
      if (cat.line) {
        fill(cat.mood === "nap" ? muted : accent);
        const bubble = cat.mood === "nap" ? "z".repeat(1 + (Math.floor(clock * 1.5) % 3)) : cat.line;
        g.textAlign = "left";
        g.fillText(bubble, (ox + CAT_W) * cw, (oy - 0.4) * ch + ch / 2);
        g.textAlign = "center";
      }
    }
    g.globalAlpha = 1;
  };

  const step = (dt: number) => {
    clock += dt;
    if (intro < 1) intro = Math.min(1, intro + dt / 1.4);
    for (let k = 0; k < heat.length; k++) if (heat[k] > 0) heat[k] = heat[k] < 0.02 ? 0 : heat[k] * Math.pow(0.35, dt);
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += dt * 38;
      r.life -= dt * 0.7;
      if (r.life <= 0) ripples.splice(i, 1);
    }
    tickCat(dt);
    if (say) say.textContent = cat.mood === "talk" ? `The cat says ${cat.line}.` : "";
  };

  const frame = (now: number) => {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
    last = now;
    acc += dt;
    // Flip-book rate: advance and redraw only every 1/FPS seconds.
    if (acc >= 1 / FPS) {
      step(acc);
      acc = 0;
      draw();
    }
    raf = running ? requestAnimationFrame(frame) : 0;
  };
  function wake() {
    if (reduced) {
      draw();
      return;
    }
    if (running || !inView || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  const sleep = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  readColours();
  document.fonts.ready.then(() => {
    readColours();
    layout();
    draw();
  });
  new ResizeObserver(() => {
    layout();
    draw();
  }).observe(canvas);
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) wake();
    else sleep();
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? sleep() : wake()));
}
