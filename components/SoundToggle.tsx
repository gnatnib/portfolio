"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  subscribe,
  setSoundEnabled,
  restoreSoundPreference,
  installGestureUnlock,
  type SoundState,
} from "@/lib/audio";

/* Sound is opt-in and off by default. Browsers block autoplaying audio without
   a gesture anyway, and unannounced music on a portfolio is a good way to get
   a tab closed. */
export default function SoundToggle({ className = "" }: { className?: string }) {
  const [sound, setSound] = useState<SoundState>({ enabled: false });

  useEffect(() => {
    const unsubscribe = subscribe(setSound);
    const removeUnlock = installGestureUnlock();
    restoreSoundPreference();
    return () => {
      unsubscribe();
      removeUnlock();
    };
  }, []);

  const label = sound.enabled ? "Turn sound off" : "Turn sound on";

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!sound.enabled)}
      className={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 ${className}`}
      aria-pressed={sound.enabled}
      aria-label={label}
      title={label}
    >
      {sound.enabled ? (
        <Volume2 className="w-3.5 h-3.5" />
      ) : (
        <VolumeX className="w-3.5 h-3.5" />
      )}
      <span className="font-mono-accent text-[10px] uppercase tracking-widest">
        {sound.enabled ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
