/* Shared Web Audio engine for the lens-focus hover SFX.
 *
 * Sound is opt-in (footer toggle, default off) and persisted per browser.
 * Background music was scoped out, so this only handles the hover effect.
 */

const STORAGE_KEY = "sound-enabled";
/* Rapid pointer travel across a grid would otherwise fire a burst of blips */
const SFX_MIN_INTERVAL_MS = 140;

/* Three recorded lens-focus takes, played at random so repeated hovers don't
   sound looped. All three are 431 ms — the `lens-rack` animation in
   globals.css is set to match, so the picture and the motor move together. */
const LENS_SFX_SRCS = [
  "/audio/focus_0.ogg",
  "/audio/focus_1.ogg",
  "/audio/focus_2.ogg",
];

/* The source files are mastered very quietly and at uneven levels (peaks
   0.007 / 0.013 / 0.010). Each is normalised to this peak on load so the
   random variation reads as a different take, not a volume glitch. */
const SFX_TARGET_PEAK = 0.5;
const SFX_VOLUME = 0.34;

type Listener = (state: SoundState) => void;

export interface SoundState {
  enabled: boolean;
}

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastSfxAt = 0;
let lastSfxIndex = -1;
let sfxBuffers: AudioBuffer[] = [];
let sfxLoading: Promise<void> | null = null;

const listeners = new Set<Listener>();
const state: SoundState = {
  enabled: false,
};

function emit() {
  listeners.forEach((l) => l({ ...state }));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => listeners.delete(listener);
}

export function getSoundState(): SoundState {
  return { ...state };
}

/* Browsers only allow an AudioContext to start from a user gesture, so this is
   always called off the back of a click or a pointer move. */
function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();
  masterGain = ctx.createGain();
  masterGain.gain.value = 1;
  masterGain.connect(ctx.destination);

  return ctx;
}

/* Load and normalise the three recorded lens takes. */
async function loadLensSfx(context: AudioContext): Promise<void> {
  if (sfxBuffers.length) return;
  if (sfxLoading) return sfxLoading;

  sfxLoading = (async () => {
    const decoded = await Promise.all(
      LENS_SFX_SRCS.map(async (src) => {
        try {
          const res = await fetch(src, { cache: "force-cache" });
          if (!res.ok) return null;
          const raw = await res.arrayBuffer();
          const buffer = await context.decodeAudioData(raw);

          // Normalise: the takes arrive at uneven peaks, so scale each one's
          // samples up to a common target. Done once, at load.
          let peak = 0;
          for (let c = 0; c < buffer.numberOfChannels; c++) {
            const data = buffer.getChannelData(c);
            for (let i = 0; i < data.length; i++) {
              const v = Math.abs(data[i]);
              if (v > peak) peak = v;
            }
          }
          if (peak > 0) {
            const scale = SFX_TARGET_PEAK / peak;
            for (let c = 0; c < buffer.numberOfChannels; c++) {
              const data = buffer.getChannelData(c);
              for (let i = 0; i < data.length; i++) data[i] *= scale;
            }
          }
          return buffer;
        } catch {
          return null;
        }
      })
    );

    sfxBuffers = decoded.filter((b): b is AudioBuffer => b !== null);
  })();

  return sfxLoading;
}

/* ── Lens autofocus ───────────────────────────────────────────────
   Plays one of three recorded takes at random, never the same one twice in a
   row. The `lens-rack` animation is timed to the clip length so the picture
   and the motor move together. */
export function playLensFocus() {
  if (!state.enabled) return;
  const now = Date.now();
  if (now - lastSfxAt < SFX_MIN_INTERVAL_MS) return;

  const context = ensureContext();
  if (!context || !masterGain) return;
  if (context.state === "suspended") void context.resume();

  if (!sfxBuffers.length) {
    // First hover warms the cache; the blip lands from the next one on.
    void loadLensSfx(context);
    return;
  }

  lastSfxAt = now;

  // Avoid repeating the previous take so the variation stays audible
  let index = Math.floor(Math.random() * sfxBuffers.length);
  if (sfxBuffers.length > 1 && index === lastSfxIndex) {
    index = (index + 1) % sfxBuffers.length;
  }
  lastSfxIndex = index;

  const source = context.createBufferSource();
  source.buffer = sfxBuffers[index];

  const gain = context.createGain();
  gain.gain.value = SFX_VOLUME;

  source.connect(gain).connect(masterGain);
  source.start(context.currentTime);
}

/* Decode the takes ahead of the first hover so it isn't silent. */
export function preloadLensSfx() {
  const context = ensureContext();
  if (context) void loadLensSfx(context);
}

export function setSoundEnabled(enabled: boolean) {
  state.enabled = enabled;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* private mode — fall back to in-memory only */
  }
  emit();

  if (enabled) preloadLensSfx();
}

/* An AudioContext constructed outside a user gesture starts suspended, and
   resume() is ignored until the page has been interacted with. That bit after
   a reload with sound already enabled: hovering created the context but it
   stayed suspended, so nothing played until something was clicked. Resume once
   on the first real gesture. */
export function installGestureUnlock(): () => void {
  if (typeof window === "undefined") return () => {};

  const unlock = () => {
    const context = ensureContext();
    if (!context) return;
    if (context.state === "suspended") void context.resume();
    // Decode the takes now so the first hover isn't silent
    if (state.enabled) void loadLensSfx(context);
  };

  const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart"];
  events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
  return () => events.forEach((e) => window.removeEventListener(e, unlock));
}

export function restoreSoundPreference() {
  try {
    state.enabled = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    state.enabled = false;
  }
  emit();
  /* Nothing auto-plays: the hover SFX still needs a gesture before the
     AudioContext will start, which installGestureUnlock handles. */
}
