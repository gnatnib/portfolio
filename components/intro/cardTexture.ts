/* Draws the business card face on a 2D canvas.
 *
 * Procedural rather than a bitmap: the text stays crisp at any zoom, it costs
 * no network request, and the same artwork drives a bump map so the lettering
 * and the paper grain physically catch the light.
 */

export const CARD_ASPECT = 1.75; // 89 × 51mm, standard business card
/* 1536 rather than 2048: the card never covers more than ~1300px on screen, so
   the extra texels bought nothing visible while costing 44% more pixels
   through three per-pixel passes — enough to stutter the entry animation. */
const TEX_W = 1536;
const TEX_H = Math.round(TEX_W / CARD_ASPECT);

/* Bone / eggshell — warm off-white, never pure white */
export const PAPER = "#E8E4D9";
const PAPER_HI = "#F1EDE3";
const PAPER_LO = "#D8D3C6";
const INK = "#23231F";

export interface CardDetails {
  name: string;
  role: string;
  org: string;
  orgSub: string;
  corner: string;
  cornerAlt: string;
  footer: string;
}

export const CARD: CardDetails = {
  name: "Bintang Syafrian Rizal",
  role: "Software Developer",
  org: "gnatnib",
  orgSub: "Engineering & Machine Learning",
  corner: "+62 851 7215 2969",
  cornerAlt: "bintang.syafrian@gmail.com",
  footer: "Semarang, Indonesia · gnatnib.site",
};

/* ── Paper ────────────────────────────────────────────────────────
   Three layers, because real stock reads as all of them at once:
   broad cloudy mottling, directional fibres, and fine tooth. */

/* Two octaves of cloudy variation. Generated small and scaled up: cheaper than
   per-pixel noise at full size, and the smooth interpolation is what gives the
   soft falloff. The coarse octave matters most — fine noise is averaged away
   by mipmapping once the card is on screen, so the visible texture has to
   live in features large enough to survive minification. */
function drawMottling(ctx: CanvasRenderingContext2D) {
  const octaves: Array<[number, number]> = [
    [26, 0.5], // broad clouds
    [110, 0.3], // medium blotching
  ];

  for (const [res, alpha] of octaves) {
    const small = document.createElement("canvas");
    small.width = res;
    small.height = Math.max(2, Math.round(res / CARD_ASPECT));
    const sctx = small.getContext("2d")!;
    const img = sctx.createImageData(small.width, small.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 190;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    sctx.putImageData(img, 0, 0);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "overlay";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(small, 0, 0, TEX_W, TEX_H);
    ctx.restore();
  }
}

/* The fibre pass is the most expensive part, and all three maps want the same
   grain — so it's rendered once to a transparent layer and blitted. Drawing it
   per-map meant ~15k stroke calls instead of 5k. */
let fibreLayer: HTMLCanvasElement | null = null;

function getFibreLayer(): HTMLCanvasElement {
  if (fibreLayer) return fibreLayer;
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d")!;
  ctx.lineCap = "round";
  for (let i = 0; i < 5200; i++) {
    const x = Math.random() * TEX_W;
    const y = Math.random() * TEX_H;
    // Mostly horizontal, like a laid sheet
    const angle = (Math.random() - 0.5) * 0.85;
    const len = 11 + Math.random() * 60;
    const dark = Math.random() > 0.5;
    ctx.strokeStyle = dark
      ? `rgba(108,99,82,${0.06 + Math.random() * 0.14})`
      : `rgba(255,253,246,${0.08 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.7 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }
  fibreLayer = c;
  return c;
}

function drawFibres(ctx: CanvasRenderingContext2D) {
  ctx.drawImage(getFibreLayer(), 0, 0);
}

/* Fine per-pixel tooth. Mostly lost to minification on its own, but it keeps
   the surface from looking digitally smooth up close and in the bump map. */
function drawTooth(ctx: CanvasRenderingContext2D, amount = 34) {
  const img = ctx.getImageData(0, 0, TEX_W, TEX_H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/* Very slight darkening toward the edges — stock is never evenly lit */
function drawSheetVignette(ctx: CanvasRenderingContext2D) {
  const g = ctx.createRadialGradient(
    TEX_W / 2,
    TEX_H / 2,
    TEX_H * 0.18,
    TEX_W / 2,
    TEX_H / 2,
    TEX_W * 0.72
  );
  g.addColorStop(0, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(90,84,70,0.10)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
}

function paintPaper(ctx: CanvasRenderingContext2D) {
  // Base gradient so the sheet has a direction to it
  const base = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  base.addColorStop(0, PAPER_HI);
  base.addColorStop(0.5, PAPER);
  base.addColorStop(1, PAPER_LO);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  drawMottling(ctx);
  drawFibres(ctx);
  drawSheetVignette(ctx);
  drawTooth(ctx);
}

/* ── Type ─────────────────────────────────────────────────────────
   Small caps by hand: browsers won't synthesise them reliably on canvas,
   and the look depends on the capital/small-capital size contrast. */
function drawSmallCaps(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  capPx: number,
  tracking: number,
  align: "left" | "center" | "right" = "center"
) {
  const smallPx = capPx * 0.78;
  const parts = [...text];

  let total = 0;
  const widths = parts.map((ch) => {
    const isLower = ch !== ch.toUpperCase() && ch === ch.toLowerCase();
    ctx.font = `${isLower ? smallPx : capPx}px "Times New Roman", Times, serif`;
    const w = ctx.measureText(ch.toUpperCase()).width + tracking;
    total += w;
    return w;
  });

  let cursor = x;
  if (align === "center") cursor = x - total / 2;
  else if (align === "right") cursor = x - total;

  /* Block alignment is handled by the cursor above, so each glyph must be
     drawn from its own left edge. Inheriting the caller's textAlign made
     fillText centre every letter on the cursor, offsetting each one by half
     its own width and scattering the spacing. */
  const callerAlign = ctx.textAlign;
  ctx.textAlign = "left";

  parts.forEach((ch, i) => {
    const isLower = ch !== ch.toUpperCase() && ch === ch.toLowerCase();
    ctx.font = `${isLower ? smallPx : capPx}px "Times New Roman", Times, serif`;
    ctx.fillText(ch.toUpperCase(), cursor, y);
    cursor += widths[i];
  });

  ctx.textAlign = callerAlign;
}

function layoutType(ctx: CanvasRenderingContext2D, ink: string, rule: string) {
  ctx.fillStyle = ink;
  ctx.textBaseline = "alphabetic";
  const cx = TEX_W / 2;

  ctx.textAlign = "left";
  drawSmallCaps(ctx, CARD.corner, TEX_W * 0.075, TEX_H * 0.145, 44, 2.5, "left");
  drawSmallCaps(ctx, CARD.cornerAlt, TEX_W * 0.075, TEX_H * 0.205, 34, 2.2, "left");

  drawSmallCaps(ctx, CARD.org, TEX_W * 0.925, TEX_H * 0.14, 60, 3, "right");
  drawSmallCaps(ctx, CARD.orgSub, TEX_W * 0.925, TEX_H * 0.205, 32, 2.2, "right");

  ctx.textAlign = "center";
  drawSmallCaps(ctx, CARD.name, cx, TEX_H * 0.53, 94, 5, "center");
  drawSmallCaps(ctx, CARD.role, cx, TEX_H * 0.655, 64, 4, "center");

  ctx.strokeStyle = rule;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(TEX_W * 0.28, TEX_H * 0.775);
  ctx.lineTo(TEX_W * 0.72, TEX_H * 0.775);
  ctx.stroke();

  drawSmallCaps(ctx, CARD.footer, cx, TEX_H * 0.88, 34, 2, "center");
}

/* Built once per page load and reused — regenerating on a remount was pure
   main-thread cost during the animation. */
let cached: {
  face: HTMLCanvasElement;
  bump: HTMLCanvasElement;
  rough: HTMLCanvasElement;
} | null = null;

/** All three maps, generated once. Safe to call early to warm the cache. */
export function getCardTextures() {
  if (!cached) {
    cached = {
      face: drawCardFace(),
      bump: drawCardBump(),
      rough: drawCardRoughness(),
    };
  }
  return cached;
}

/** Colour map: textured stock with the type printed on it. */
export function drawCardFace(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;
  paintPaper(ctx);
  layoutType(ctx, INK, "rgba(35,35,31,0.32)");
  return canvas;
}

/**
 * Bump map: mid-grey ground so the surface can go both ways. Paper tooth is a
 * faint wobble around it; the type is much darker, so with a negative
 * bumpScale the ink presses *into* the stock — letterpress, not embossing.
 */
export function drawCardBump(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  /* The relief carries most of the texture: painted-on grain flattens under
     tone mapping, but real displacement keeps catching the raking light. */
  drawMottling(ctx);
  drawFibres(ctx);
  drawTooth(ctx, 58);

  layoutType(ctx, "#101010", "rgba(16,16,16,0.85)");
  return canvas;
}

/** Roughness map: ink sits slightly glossier than the surrounding stock. */
export function drawCardRoughness(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#D8D8D8"; // matte paper
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  /* Uneven sheen across the sheet, so highlights break up like real stock */
  drawMottling(ctx);
  drawFibres(ctx);
  layoutType(ctx, "#8A8A8A", "rgba(138,138,138,0.8)");
  return canvas;
}
