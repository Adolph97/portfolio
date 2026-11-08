import { useEffect, useRef, useState } from 'react';
import type { ShapeId } from '../../lib/pointShapes';

/** What the hero says while each shape is on screen. */
export const SCENES: { shape: ShapeId; phrase: string; hold: number }[] = [
  { shape: 'logo', phrase: 'from Lagos, for the world.', hold: 4200 },
  { shape: 'ai', phrase: 'AI and automation that clears the busywork.', hold: 3600 },
  { shape: 'tools', phrase: 'internal tools your team actually uses.', hold: 3600 },
  { shape: 'product', phrase: 'web and mobile products built to scale.', hold: 3600 },
  { shape: 'chat', phrase: 'chatbots that answer customers at 2am.', hold: 3600 },
  { shape: 'globe', phrase: 'trusted by teams in 6 countries.', hold: 3800 },
];

// Dev only: ?scene=<shape> holds one scene, for checking a shape in isolation
const pinned = (() => {
  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV;
  if (!dev || typeof window === 'undefined') return -1;
  const id = new URLSearchParams(window.location.search).get('scene');
  return SCENES.findIndex((s) => s.shape === id);
})();

/**
 * Steps through the scenes while `active`. Pausing (hero off screen, tab hidden)
 * stops the clock, so the words and the shapes never drift apart.
 */
export const useShapeCycle = (active: boolean, enabled = true) => {
  const [index, setIndex] = useState(Math.max(0, pinned));
  const remaining = useRef(SCENES[Math.max(0, pinned)].hold);

  useEffect(() => {
    if (!active || !enabled || pinned >= 0) return;
    const started = performance.now();
    let fired = false;
    const t = window.setTimeout(() => {
      fired = true;
      const next = (index + 1) % SCENES.length;
      remaining.current = SCENES[next].hold;
      setIndex(next);
    }, remaining.current);
    return () => {
      window.clearTimeout(t);
      // Paused mid-scene: keep the time that was left
      if (!fired) remaining.current = Math.max(400, remaining.current - (performance.now() - started));
    };
  }, [active, enabled, index]);

  return SCENES[index];
};
