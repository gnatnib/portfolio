"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import type { Phase } from "./CardScene";

/* three + r3f are ~170KB gz. Client-only and split into its own chunk so it
   never lands in the bundle every other route pays for. */
const CardScene = dynamic(() => import("./CardScene"), { ssr: false });

const SESSION_KEY = "intro-seen";
/* Long enough for the paper white to register as a surface, not a flash */
const LIGHT_HOLD_MS = 520;
/* Card sweep + site settle run together; overlay leaves when both are done */
const EXIT_MS = 900;
/* If the card never reports settling — throttled tab, driver hiccup — let it
   become interactive anyway rather than stranding the visitor. */
const SETTLE_WATCHDOG_MS = 6000;

type Stage = "light" | "card-in" | "ready" | "leaving" | "done";

const EASE = [0.4, 0, 0.2, 1] as const;

export default function IntroSequence() {
  const [active, setActive] = useState(false);
  const [stage, setStage] = useState<Stage>("light");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shouldRun = useRef<boolean | null>(null);

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode — it just replays next visit */
    }
    const root = document.documentElement;
    root.removeAttribute("data-intro");
    root.removeAttribute("data-intro-exit");
    document.body.style.cursor = "";
    setStage("done");
    setActive(false);
  }, []);

  const dismiss = useCallback(() => {
    setStage((s) => {
      if (s === "leaving" || s === "done" || s === "light") return s;
      /* Drives the site's settle animation underneath the overlay */
      document.documentElement.setAttribute("data-intro-exit", "1");
      timers.current.push(setTimeout(finish, EXIT_MS));
      return "leaving";
    });
  }, [finish]);

  useEffect(() => {
    /* The inline script in <head> already decided this before first paint —
       trusting its flag keeps the CSS cover and React in agreement.
       Latched into a ref because the attribute is mutable: StrictMode's
       double-invoke in dev (or any remount) would otherwise re-read a flag
       that teardown had already cleared, and silently skip the intro. */
    if (shouldRun.current === null) {
      shouldRun.current =
        document.documentElement.getAttribute("data-intro") === "1";
    }
    if (!shouldRun.current) {
      setActive(false);
      return;
    }

    setActive(true);

    /* Hand the cover over from CSS to React only once React has actually
       painted, so there's no frame where neither is covering. */
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (document.documentElement.getAttribute("data-intro") === "1") {
          document.documentElement.setAttribute("data-intro", "live");
        }
      })
    );

    timers.current.push(setTimeout(() => setStage("card-in"), LIGHT_HOLD_MS));
    timers.current.push(
      setTimeout(
        () => setStage((s) => (s === "card-in" ? "ready" : s)),
        LIGHT_HOLD_MS + SETTLE_WATCHDOG_MS
      )
    );

    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(e.key)) dismiss();
    };
    window.addEventListener("keydown", onKey);

    const captured = timers.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      captured.forEach(clearTimeout);
      /* Deliberately does not clear the data-intro flags here — only finish()
         owns them. Clearing on teardown removed the cover mid-sequence. */
    };
  }, [dismiss]);

  if (!active) return null;

  const dark = stage !== "light";
  const leaving = stage === "leaving";
  const scenePhase: Phase =
    stage === "light"
      ? "wait"
      : stage === "card-in"
        ? "in"
        : leaving
          ? "exit"
          : "idle";

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          /* The inner layers have already cleared by the time this unmounts,
             so the wrapper leaves instantly — no second cross-fade. */
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          onClick={() => stage === "ready" && dismiss()}
          style={{ cursor: stage === "ready" ? "pointer" : "default" }}
        >
          {/* Backdrop: opens on paper white, the lights go down, and on exit
              it clears from the centre outward — the room lighting coming
              back up rather than a layer being cross-faded away. */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: "#F2EFE7", opacity: 1 }}
            animate={{
              backgroundColor: dark ? "#08090B" : "#F2EFE7",
              opacity: leaving ? 0 : 1,
              scale: leaving ? 1.12 : 1,
            }}
            transition={{
              backgroundColor: { duration: 1.15, ease: EASE },
              opacity: { duration: 0.68, ease: EASE, delay: leaving ? 0.14 : 0 },
              scale: { duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] },
            }}
          />

          {/* Vignette pools light around the card, then irises open on exit */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 46%, transparent 22%, rgba(0,0,0,0.82) 76%)",
            }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: leaving ? 0 : dark ? 1 : 0,
              scale: leaving ? 2.8 : 1,
            }}
            transition={{
              opacity: { duration: leaving ? 0.6 : 1.2, ease: EASE },
              scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            }}
          />

          {/* Mounted from the very start so texture generation, shader compile
              and the first shadow pass all happen during the cream hold —
              doing that work as the card entered is what made it stutter. */}
          <div className="absolute inset-0">
            <CardScene
              phase={scenePhase}
              onSettled={() => setStage((s) => (s === "card-in" ? "ready" : s))}
              onSelect={dismiss}
              onContextLost={finish}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
