/* Hero background: a faint feed-forward network.

   Columns of nodes stand for layers; each node links to a couple of nodes in
   the next column. Signals enter on the left and travel edge by edge, lighting
   each node they reach and printing its activation beside it. The pointer acts
   as an input too: nodes near it light up and fire signals of their own.
   Everything sits at low contrast behind the type, runs at 30fps, and stops
   when the hero is off screen. */

type Node = { x: number; y: number; bx: number; by: number; layer: number; out: number[]; act: number; phase: number; label: string };
type Pulse = { from: number; to: number; t: number; len: number };

const FPS = 30;

/** Small deterministic PRNG so the network has the same shape on every load. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function mountNetwork(section: HTMLElement, canvas: HTMLCanvasElement, reduced: boolean) {
  const g = canvas.getContext("2d")!;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let nodes: Node[] = [];
  let pulses: Pulse[] = [];
  let pal = { fg: "#111", rule: "rgba(0,0,0,.2)", accent: "#f40", mono: "monospace" };

  const readPalette = () => {
    const cs = getComputedStyle(section);
    pal = {
      fg: cs.color,
      rule: cs.getPropertyValue("--rule-strong").trim(),
      accent: cs.getPropertyValue("--accent").trim(),
      mono: cs.getPropertyValue("--mono").trim() || "monospace",
    };
  };

  const build = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const rand = rng(7);
    const layers = w > 860 ? 9 : 5;
    const marginX = w * 0.04;
    const top = h * 0.16;
    const bottom = h * 0.86;
    nodes = [];
    const byLayer: number[][] = [];
    for (let l = 0; l < layers; l++) {
      const count = l === 0 || l === layers - 1 ? 4 : 5 + Math.floor(rand() * 4);
      const x = marginX + ((w - marginX * 2) * l) / (layers - 1);
      byLayer.push([]);
      for (let i = 0; i < count; i++) {
        const y = top + ((bottom - top) * (i + 0.5)) / count + (rand() - 0.5) * 28;
        byLayer[l].push(nodes.length);
        nodes.push({
          x,
          y,
          bx: x + (rand() - 0.5) * 30,
          by: y,
          layer: l,
          out: [],
          act: 0,
          phase: rand() * 6.28,
          label: "",
        });
      }
    }
    // Each node feeds the two or three nearest nodes in the next column.
    for (let l = 0; l < layers - 1; l++) {
      for (const a of byLayer[l]) {
        const next = byLayer[l + 1].slice().sort((p, q) => Math.abs(nodes[p].by - nodes[a].by) - Math.abs(nodes[q].by - nodes[a].by));
        nodes[a].out = next.slice(0, 2 + (rand() < 0.35 ? 1 : 0));
      }
    }
    pulses = [];
  };

  const fire = (from: number) => {
    const n = nodes[from];
    if (!n.out.length) return;
    const to = n.out[(Math.random() * n.out.length) | 0];
    const m = nodes[to];
    pulses.push({ from, to, t: 0, len: Math.hypot(m.x - n.x, m.y - n.y) });
  };
  const light = (i: number, amount: number) => {
    const n = nodes[i];
    n.act = Math.max(n.act, amount);
    n.label = (0.42 + Math.random() * 0.57).toFixed(2);
  };

  let px = -1e4;
  let py = -1e4;
  let lastPointerFire = 0;
  let clock = 0;
  let spawn = 0;

  const step = (dt: number) => {
    clock += dt;
    // A new signal enters on the left every so often.
    spawn -= dt;
    if (spawn <= 0) {
      const inputs = nodes.filter((n) => n.layer === 0);
      const i = nodes.indexOf(inputs[(Math.random() * inputs.length) | 0]);
      light(i, 0.8);
      fire(i);
      spawn = 0.45 + Math.random() * 0.5;
    }
    for (const n of nodes) {
      n.x = n.bx + Math.sin(clock * 0.4 + n.phase) * 5;
      n.y = n.by + Math.cos(clock * 0.33 + n.phase) * 6;
      const d = Math.hypot(n.x - px, n.y - py);
      if (d < 150) n.act = Math.max(n.act, 1 - d / 150);
      n.act = Math.max(0, n.act - dt * 0.9);
    }
    // The node under the pointer fires too, a few times a second at most.
    if (px > -1e3 && clock - lastPointerFire > 0.25) {
      let best = -1;
      let bestD = 150;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - px, n.y - py);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best >= 0) {
        light(best, 1);
        fire(best);
        lastPointerFire = clock;
      }
    }
    for (let k = pulses.length - 1; k >= 0; k--) {
      const p = pulses[k];
      p.t += (dt * 260) / Math.max(1, p.len);
      if (p.t >= 1) {
        pulses.splice(k, 1);
        light(p.to, 0.9);
        if (Math.random() < 0.8) fire(p.to);
      }
    }
    if (pulses.length > 60) pulses.splice(0, pulses.length - 60);
  };

  const draw = () => {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);

    g.lineWidth = 0.6;
    g.strokeStyle = pal.rule;
    g.globalAlpha = 0.45;
    g.beginPath();
    for (const n of nodes) {
      for (const o of n.out) {
        g.moveTo(n.x, n.y);
        g.lineTo(nodes[o].x, nodes[o].y);
      }
    }
    g.stroke();

    // Edges into lit nodes warm up.
    g.strokeStyle = pal.accent;
    for (const n of nodes) {
      for (const o of n.out) {
        const a = Math.min(n.act, nodes[o].act);
        if (a < 0.15) continue;
        g.globalAlpha = a * 0.45;
        g.beginPath();
        g.moveTo(n.x, n.y);
        g.lineTo(nodes[o].x, nodes[o].y);
        g.stroke();
      }
    }

    g.font = `500 9px ${pal.mono}`;
    g.textBaseline = "middle";
    for (const n of nodes) {
      const s = 2.5 + n.act * 2.5;
      g.globalAlpha = 0.22 + n.act * 0.6;
      g.fillStyle = n.act > 0.3 ? pal.accent : pal.fg;
      g.fillRect(n.x - s / 2, n.y - s / 2, s, s);
      if (n.act > 0.35) {
        g.globalAlpha = (n.act - 0.35) * 0.9;
        g.fillStyle = pal.fg;
        g.fillText(n.label, n.x + 7, n.y - 7);
      }
    }

    g.fillStyle = pal.accent;
    for (const p of pulses) {
      const a = nodes[p.from];
      const b = nodes[p.to];
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;
      g.globalAlpha = 0.85;
      g.fillRect(x - 1.5, y - 1.5, 3, 3);
    }
    g.globalAlpha = 1;
  };

  let running = false;
  let inView = false;
  let raf = 0;
  let last = 0;
  let acc = 0;
  const frame = (now: number) => {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
    last = now;
    acc += dt;
    if (acc >= 1 / FPS) {
      step(acc);
      acc = 0;
      draw();
    }
    raf = running ? requestAnimationFrame(frame) : 0;
  };
  const sync = () => {
    const on = inView && !document.hidden && !reduced;
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

  section.addEventListener(
    "pointermove",
    (e) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    },
    { passive: true },
  );
  section.addEventListener("pointerleave", () => (px = py = -1e4));

  readPalette();
  build();
  draw();
  new ResizeObserver(() => {
    build();
    draw();
  }).observe(canvas);
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    sync();
  }).observe(section);
  document.addEventListener("visibilitychange", sync);
}
