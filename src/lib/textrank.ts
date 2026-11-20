/* TextRank (Mihalcea and Tarau, 2004) over a handful of sentences. Runs at
   build time on the bio so the "summarized" section shows real scores. */

const STOPWORDS = new Set(
  "a an and are as at be by for from has have i i'm in is it its me my of on or so that the this to was were which with what who from them they their than then there these those into out up down over under all any each most other some such no not only own same too very can will just do does did done also about after before".split(
    " ",
  ),
);

function similarity(a: string[], b: string[]) {
  if (a.length < 2 || b.length < 2) return 0;
  const setB = new Set(b);
  const overlap = new Set(a.filter((w) => setB.has(w))).size;
  return overlap / (Math.log(a.length) + Math.log(b.length));
}

export type Ranked = { text: string; score: number; rank: number; kept: boolean };

export function textrank(sentences: string[], keep: number, damping = 0.85): Ranked[] {
  const n = sentences.length;
  const toks = sentences.map((sentence) =>
    sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOPWORDS.has(w))
      // crude stem so "build" and "building" meet
      .map((w) => w.replace(/(ing|ed|es|s)$/, "")),
  );
  const w = toks.map((a, i) => toks.map((b, j) => (i === j ? 0 : similarity(a, b))));
  const outSum = w.map((row) => row.reduce((s, v) => s + v, 0));

  let score = new Array(n).fill(1 / n);
  for (let iter = 0; iter < 100; iter++) {
    const next = score.map((_, i) => {
      let sum = 0;
      for (let j = 0; j < n; j++) if (outSum[j] > 0) sum += (w[j][i] / outSum[j]) * score[j];
      return (1 - damping) / n + damping * sum;
    });
    const delta = next.reduce((d, v, i) => d + Math.abs(v - score[i]), 0);
    score = next;
    if (delta < 1e-9) break;
  }

  const max = Math.max(...score);
  const order = score.map((s, i) => ({ s, i })).sort((a, b) => b.s - a.s);
  const rankOf = new Map(order.map((o, r) => [o.i, r + 1]));
  return sentences.map((text, i) => ({
    text,
    score: score[i] / max,
    rank: rankOf.get(i)!,
    kept: rankOf.get(i)! <= keep,
  }));
}
