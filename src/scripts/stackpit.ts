/* Tech stack as physical objects. Each pill is a DOM element driven by a
   Matter.js body; the DOM keeps text crisp and the tiles accessible. */
import Matter from "matter-js";

const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

export function mountStackPit(pit: HTMLElement) {
  const tiles = [...pit.querySelectorAll<HTMLElement>("[data-tile]")];
  // Measure in flow layout first; absolute positioning would collapse widths.
  const sizes = tiles.map((t) => ({ w: t.offsetWidth, h: t.offsetHeight }));
  pit.classList.add("is-physics");

  const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
  const runner = Runner.create();
  let width = pit.clientWidth;
  let height = pit.clientHeight;
  const T = 200;

  const walls = [
    Bodies.rectangle(width / 2, height + T / 2, width * 3, T, { isStatic: true }),
    Bodies.rectangle(-T / 2, height / 2, T, height * 4, { isStatic: true }),
    Bodies.rectangle(width + T / 2, height / 2, T, height * 4, { isStatic: true }),
  ];

  const bodies = tiles.map((_, i) => {
    const { w, h } = sizes[i];
    const x = w / 2 + Math.random() * Math.max(1, width - w);
    const y = -h - i * (h * 0.9) - Math.random() * 120;
    return Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: h / 2 - 1 },
      restitution: 0.35,
      friction: 0.25,
      frictionAir: 0.012,
      angle: (Math.random() - 0.5) * 0.8,
    });
  });

  Composite.add(engine.world, [...walls, ...bodies]);

  Events.on(engine, "afterUpdate", () => {
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      const { w, h } = sizes[i];
      tiles[i].style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`;
    }
  });

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const mouse = Mouse.create(pit);
    // Matter grabs the wheel by default, which would freeze page scroll here.
    const m = mouse as unknown as { mousewheel: EventListener };
    pit.removeEventListener("wheel", m.mousewheel);
    pit.removeEventListener("mousewheel", m.mousewheel);
    pit.removeEventListener("DOMMouseScroll", m.mousewheel);
    const drag = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, render: { visible: false } } });
    Composite.add(engine.world, drag);
    Events.on(drag, "startdrag", () => pit.classList.add("is-grabbing"));
    Events.on(drag, "enddrag", () => pit.classList.remove("is-grabbing"));
  } else {
    // Touch: Matter's mouse would block scrolling, so a tap flicks the tile up.
    tiles.forEach((tile, i) =>
      tile.addEventListener("click", () => {
        const b = bodies[i];
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 14, y: -18 });
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4);
      }),
    );
  }

  // Keep the floor and walls on the pit's edges when it resizes.
  new ResizeObserver(() => {
    const w = pit.clientWidth;
    const h = pit.clientHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;
    Body.setPosition(walls[0], { x: width / 2, y: height + T / 2 });
    Body.setPosition(walls[2], { x: width + T / 2, y: height / 2 });
    for (const b of bodies) {
      if (b.position.x > width) Body.setPosition(b, { x: width - 60, y: -60 });
    }
  }).observe(pit);

  // Only simulate while the pit is on screen.
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) Runner.run(runner, engine);
    else Runner.stop(runner);
  }).observe(pit);
}
