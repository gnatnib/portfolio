"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getCardTextures, CARD_ASPECT, PAPER } from "./cardTexture";

/* "wait" holds the card off-frame while the scene warms up — textures, shaders
   and the shadow map all get built during the opening cream hold, so the entry
   animation isn't competing with them for the main thread. */
export type Phase = "wait" | "in" | "idle" | "exit";

const CARD_W = 3.4;
const CARD_H = CARD_W / CARD_ASPECT;
const CARD_D = 0.024;

/* Held above frame and tipped back, as if about to be laid down */
const START = new THREE.Vector3(0.5, 3.6, 1.9);
const START_ROT = new THREE.Euler(-0.9, 0.38, 0.26);
const REST = new THREE.Vector3(0, 0, 0);

function Card({
  phase,
  onSettled,
  onSelect,
}: {
  phase: Phase;
  onSettled: () => void;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const elapsed = useRef(0);
  const exitT = useRef(0);
  const settled = useRef(false);
  const { pointer, viewport } = useThree();

  /* Fit the card to the viewport in world units. Without this the card is
     framed for desktop and runs off both edges of a phone. Capped at 1 so it
     never blows up past its intended size on very wide screens. */
  const fit = Math.min(1, (viewport.width * 0.84) / CARD_W);

  const maps = useMemo(() => {
    const src = getCardTextures();
    const face = new THREE.CanvasTexture(src.face);
    face.colorSpace = THREE.SRGBColorSpace;
    face.anisotropy = 8;
    const bump = new THREE.CanvasTexture(src.bump);
    bump.anisotropy = 8;
    const rough = new THREE.CanvasTexture(src.rough);
    rough.anisotropy = 8;
    return { face, bump, rough };
  }, []);

  const materials = useMemo(() => {
    /* Cut edges are brighter and rougher than the printed face — that
       contrast is most of what sells it as a physical piece of card. */
    const edge = new THREE.MeshStandardMaterial({
      color: "#F0ECE1",
      roughness: 0.97,
      metalness: 0,
    });
    const back = new THREE.MeshStandardMaterial({
      color: PAPER,
      roughness: 0.93,
      metalness: 0,
      bumpMap: maps.bump,
      bumpScale: 0.05,
    });
    const front = new THREE.MeshStandardMaterial({
      map: maps.face,
      bumpMap: maps.bump,
      /* Negative so ink presses *into* the stock. Deep enough that the paper
         tooth in the same map also catches the raking light — painted grain
         alone washed out under tone mapping. */
      bumpScale: -0.16,
      roughnessMap: maps.rough,
      roughness: 1,
      metalness: 0,
    });
    return [edge, edge, edge, edge, front, back];
  }, [maps]);

  useEffect(() => {
    return () => {
      Object.values(maps).forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    };
  }, [maps, materials]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    elapsed.current += d;
    const damp = THREE.MathUtils.damp;

    // Parked off-frame while the scene compiles; nothing to animate yet.
    if (phase === "wait") return;

    if (phase === "in") {
      g.position.x = damp(g.position.x, REST.x, 3.0, d);
      g.position.y = damp(g.position.y, REST.y, 3.4, d);
      g.position.z = damp(g.position.z, REST.z, 3.0, d);
      g.rotation.x = damp(g.rotation.x, 0, 2.4, d);
      g.rotation.y = damp(g.rotation.y, 0, 2.4, d);
      g.rotation.z = damp(g.rotation.z, 0, 2.4, d);

      if (!settled.current && g.position.distanceTo(REST) < 0.05) {
        settled.current = true;
        onSettled();
      }
      return;
    }

    if (phase === "exit") {
      /* The card sweeps up past the camera rather than dissolving — the site
         is revealed behind it, so the motion itself is the cut. */
      exitT.current += d;
      const t = exitT.current;
      const accel = t * t * 9; // slow off the mark, then away quickly

      g.position.z += accel * d * 22;
      g.position.y += accel * d * 7;
      g.rotation.x -= accel * d * 2.4;
      g.rotation.z += accel * d * 0.5;
      return;
    }

    // idle — follows the pointer with a slow drift so it never sits dead still
    const t = elapsed.current;
    const rx = -pointer.y * 0.3 + Math.sin(t * 0.55) * 0.022;
    const ry = pointer.x * 0.4 + Math.cos(t * 0.42) * 0.022;
    g.rotation.x = damp(g.rotation.x, rx, 4.5, d);
    g.rotation.y = damp(g.rotation.y, ry, 4.5, d);
    g.rotation.z = damp(g.rotation.z, pointer.x * 0.04, 4, d);
    g.position.y = damp(g.position.y, Math.sin(t * 0.7) * 0.035, 3.5, d);
    /* Lifts toward the viewer on hover — the only cue that it's clickable,
       now that the prompt text is gone. */
    g.position.z = damp(g.position.z, hovered ? 0.32 : 0, 4.5, d);
  });

  return (
    <group scale={fit}>
    <group
      ref={group}
      position={START.toArray()}
      rotation={START_ROT.toArray() as [number, number, number]}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "";
        onSelect();
      }}
    >
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
      </mesh>
    </group>
    </group>
  );
}

/* Catches the card's shadow so it reads as resting on a surface */
function Table() {
  return (
    <mesh receiveShadow position={[0, 0, -0.45]}>
      <planeGeometry args={[26, 16]} />
      <shadowMaterial opacity={0.5} />
    </mesh>
  );
}

export default function CardScene({
  phase,
  onSettled,
  onSelect,
  onContextLost,
}: {
  phase: Phase;
  onSettled: () => void;
  onSelect: () => void;
  onContextLost?: () => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
    >
      <ambientLight intensity={0.42} />
      {/* Key — angled low so the debossed type throws a visible shadow edge */}
      <directionalLight
        position={[3.4, 4.2, 3.6]}
        intensity={2.3}
        castShadow
        /* 1024 is ample for one flat card's shadow and halves the depth pass */
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
      />
      {/* Cool bounce, so the shadow side doesn't go muddy */}
      <directionalLight position={[-4.5, -1.2, 2.4]} intensity={0.55} color="#AEBFD4" />
      {/* Warm rake across the face — this is what lights up the paper tooth */}
      <pointLight position={[-2.4, 1.4, 1.3]} intensity={2.6} distance={10} decay={2} color="#FFE8C8" />
      {/* Rim from behind to separate the card from the dark */}
      <pointLight position={[0, -1.8, -1.6]} intensity={1.1} distance={8} decay={2} color="#9FB3CC" />

      <Table />
      <Card phase={phase} onSettled={onSettled} onSelect={onSelect} />
    </Canvas>
  );
}
