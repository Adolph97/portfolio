import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { KonaMark } from '../Brand/KonaLogo';
import type { ShapeId } from '../../lib/pointShapes';

// three.js is heavy and not needed for first paint; load it once the intro has played
const MorphField = lazy(() => import('./MorphField'));

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/** Fewer points on small or low-powered devices. Decided once, at mount. */
const pointBudget = () => {
  const w = window.innerWidth;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
  if (w < 640 || weak) return 2600;
  if (w < 1024 || window.matchMedia('(pointer: coarse)').matches) return 4200;
  return 7000;
};

type BoundaryProps = { onError: () => void; children: React.ReactNode };

/** Falls back to the still mark if WebGL throws (context lost, driver issues). */
class GLBoundary extends React.Component<BoundaryProps, { failed: boolean }> {
  declare props: BoundaryProps;
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The hero centrepiece. Shows the mark as a still SVG first (and for reduced
 * motion or no WebGL), then crossfades to the live point field once it has
 * drawn its first frame.
 */
const HeroVisual: React.FC<{
  shape: ShapeId;
  active: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
  scatter: React.RefObject<number>;
}> = ({ shape, active, pointer, scatter }) => {
  const reduceMotion = useReducedMotion();
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [count] = useState(() => (typeof window === 'undefined' ? 4200 : pointBudget()));

  useEffect(() => {
    if (reduceMotion || !hasWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => setLoad(true);
    // Let the headline and LCP image land before pulling in three.js
    const t = window.setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 800 }) : start()), 500);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  const live = load && !failed;

  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual-fallback" style={{ opacity: live && ready ? 0 : 1 }}>
        <KonaMark variant="glyph" size={320} />
      </div>
      {live && (
        <div className="hero-visual-canvas" style={{ opacity: ready ? 1 : 0 }}>
          <GLBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <MorphField
                shape={shape}
                count={count}
                active={active}
                pointer={pointer}
                scatter={scatter}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </GLBoundary>
        </div>
      )}
    </div>
  );
};

export default HeroVisual;
