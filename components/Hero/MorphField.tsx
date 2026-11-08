import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildShapes, mulberry32, type ShapeId } from '../../lib/pointShapes';
import { BRAND } from '../../lib/brand';
import { morphFragment, morphVertex } from './morphShaders';

export type MorphFieldProps = {
  shape: ShapeId;
  count: number;
  /** Render loop runs only while true (hero on screen, tab visible). */
  active: boolean;
  /** Pointer in -1..1, set by the hero; drives a few degrees of tilt only. */
  pointer: React.RefObject<{ x: number; y: number }>;
  /** 0..1 as the hero scrolls away; disperses the field. */
  scatter: React.RefObject<number>;
  onReady?: () => void;
};

const MORPH_SECONDS = 1.7;
const ASSEMBLE_SECONDS = 2.2;
const SPREAD = 0.42;

// Dev only: with ?scene=<shape> the field starts fully formed, for checking shapes
const settled = (() => {
  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV;
  return !!dev && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('scene');
})();

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const MorphPoints: React.FC<Omit<MorphFieldProps, 'active'>> = ({ shape, count, pointer, scatter, onReady }) => {
  const accent = Math.round(count * 0.03);
  const shapes = useMemo(() => buildShapes(count, accent), [count, accent]);
  const gl = useThree((s) => s.gl);
  const group = useRef<THREE.Group>(null);
  const progress = useRef(settled ? 1 : 0);
  const duration = useRef(ASSEMBLE_SECONDS);
  const time = useRef(0);
  const readySent = useRef(false);
  const current = useRef<ShapeId>(shape);

  const geometry = useMemo(() => {
    const rng = mulberry32(42);
    const from = new Float32Array(count * 3);
    const rand = new Float32Array(count * 4);
    const acc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Start scattered in a wide shell, so the mark assembles on load
      const u = rng() * 2 - 1;
      const th = rng() * Math.PI * 2;
      const r = 2.4 + rng() * 2.2;
      const s = Math.sqrt(1 - u * u);
      from.set([Math.cos(th) * s * r, u * r * 0.7, Math.sin(th) * s * r - 1], i * 3);
      // Rank along the arrow: points were sorted that way in every shape
      const rank = i < accent ? i / accent : (i - accent) / (count - accent);
      rand.set([rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1, 0.7 * rank + 0.3 * rng()], i * 4);
      acc[i] = i < accent ? 1 : 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(shapes[shape].slice(), 3));
    g.setAttribute('aFrom', new THREE.BufferAttribute(settled ? shapes[shape].slice() : from, 3));
    g.setAttribute('aTo', new THREE.BufferAttribute(shapes[shape].slice(), 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));
    g.setAttribute('aAccent', new THREE.BufferAttribute(acc, 1));
    return g;
    // Built once per point budget; shape changes swap buffers below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, accent, shapes]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: gl.getPixelRatio() },
      uSpread: { value: SPREAD },
      uScatter: { value: 0 },
      uIntensity: { value: 0.72 },
      uPaper: { value: new THREE.Color(BRAND.paper) },
      uOchre: { value: new THREE.Color(BRAND.ochreOnDark) },
    }),
    [gl]
  );

  // New target: freeze where every point is now into aFrom, then aim at the new shape
  useEffect(() => {
    if (shape === current.current) return;
    current.current = shape;
    const fromAttr = geometry.getAttribute('aFrom') as THREE.BufferAttribute;
    const toAttr = geometry.getAttribute('aTo') as THREE.BufferAttribute;
    const randAttr = geometry.getAttribute('aRand') as THREE.BufferAttribute;
    const from = fromAttr.array as Float32Array;
    const to = toAttr.array as Float32Array;
    const rand = randAttr.array as Float32Array;
    const p = progress.current;
    for (let i = 0; i < count; i++) {
      const t = easeInOutCubic(Math.min(1, Math.max(0, (p - rand[i * 4 + 3] * SPREAD) / (1 - SPREAD))));
      for (let k = 0; k < 3; k++) from[i * 3 + k] += (to[i * 3 + k] - from[i * 3 + k]) * t;
    }
    to.set(shapes[shape]);
    fromAttr.needsUpdate = true;
    toAttr.needsUpdate = true;
    progress.current = 0;
    duration.current = MORPH_SECONDS;
  }, [shape, shapes, geometry, count]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    time.current += delta;
    progress.current = Math.min(1, progress.current + delta / duration.current);
    uniforms.uProgress.value = progress.current;
    uniforms.uTime.value = time.current;
    uniforms.uScatter.value = Math.min(1, Math.max(0, scatter.current ?? 0));

    const g = group.current;
    if (g) {
      const px = pointer.current?.x ?? 0;
      const py = pointer.current?.y ?? 0;
      // A slow sway shows the depth; the pointer adds a few degrees of tilt, nothing more
      const swayY = Math.sin(time.current * 0.22) * 0.32;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, swayY + px * 0.14, 3, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.1, 3, delta);
    }

    if (!readySent.current) {
      readySent.current = true;
      onReady?.();
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={morphVertex}
          fragmentShader={morphFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const MorphField: React.FC<MorphFieldProps> = ({ active, ...rest }) => {
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  return (
    <Canvas
      className="morph-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={coarse ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 38 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <MorphPoints {...rest} />
    </Canvas>
  );
};

export default MorphField;
