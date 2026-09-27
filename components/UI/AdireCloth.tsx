import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useInView } from './useInView';

export type PointerState = { x: number; y: number; active: number };

/** Draws one adire tile set (rings, dots, stripes, zigzags) into a canvas texture. */
const makeAdireTexture = () => {
  const size = 512;
  const cell = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;

  // Cell borders
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, size, size);
  ctx.beginPath();
  ctx.moveTo(cell, 0); ctx.lineTo(cell, size);
  ctx.moveTo(0, cell); ctx.lineTo(size, cell);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 5;

  // Rings
  const c = cell / 2;
  [0.36, 0.24].forEach((r) => {
    ctx.beginPath();
    ctx.arc(c, c, cell * r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.arc(c, c, cell * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Dots
  for (let r = 0; r < 4; r++) {
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.arc(cell + cell * (0.2 + k * 0.2), cell * (0.2 + r * 0.2), 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Stripes
  [0.15, 0.35, 0.55, 0.75].forEach((t) => {
    ctx.beginPath();
    ctx.moveTo(cell * t, size - cell * 0.1);
    ctx.lineTo(cell * (t + 0.2), cell + cell * 0.1);
    ctx.stroke();
  });

  // Zigzags
  [0.3, 0.5, 0.7].forEach((t) => {
    const y = cell + cell * t;
    const x0 = cell + cell * 0.12;
    const step = (cell * 0.76) / 6;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    for (let i = 1; i <= 6; i++) ctx.lineTo(x0 + step * i, y + (i % 2 ? -18 : 18));
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform vec3 uPointer; // xy in plane space, z = strength
  varying vec2 vUv;
  varying vec3 vViewPos;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 p = position;
    float t = uTime;

    // Layered swells, like cloth drying on a line
    float w = sin(p.x * 2.3 + p.y * 0.6 + t * 0.9) * 0.085
            + sin(p.y * 3.1 - p.x * 0.8 - t * 1.1) * 0.055
            + sin((p.x + p.y) * 4.6 + t * 1.6) * 0.022
            + sin(p.x * 7.0 - p.y * 5.0 + t * 2.2) * 0.007;

    // Settle from a big billow into a gentle ripple on load
    w *= mix(2.6, 1.0, uIntro);

    // Push the cloth where the pointer is
    float d = distance(p.xy, uPointer.xy);
    w += exp(-d * d * 2.2) * 0.28 * uPointer.z;
    w += sin(d * 7.0 - t * 5.0) * exp(-d * 1.6) * 0.025 * uPointer.z;

    p.z += w;
    p.x += sin(p.y * 1.3 + t * 0.7) * 0.03;
    vWave = w;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uRepeat;
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uDeep;
  uniform vec3 uThread;
  varying vec2 vUv;
  varying vec3 vViewPos;
  varying float vWave;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
    vec3 l = normalize(vec3(-0.65, 0.55, 0.5));
    float diff = clamp(dot(n, l) * 1.25 + 0.05, 0.0, 1.0);

    // Mottled resist-dye depth
    float dye = noise(vUv * 6.0) * 0.6 + noise(vUv * 22.0) * 0.4;
    vec3 col = mix(uDeep, uBase, diff * (0.75 + dye * 0.35));

    // Motifs: slightly bled, as if painted with starch
    vec2 tuv = vUv * uRepeat;
    float m = texture2D(uTex, tuv).r;
    float bleed = texture2D(uTex, tuv + vec2(0.004, -0.003)).r;
    float motif = max(m, bleed * 0.45) * (0.72 + dye * 0.28);
    col = mix(col, uThread, motif * (0.35 + diff * 0.5));

    // Soft sheen on the crests
    vec3 v = normalize(-vViewPos);
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 18.0);
    col += spec * 0.22;

    // Vignette
    float vig = smoothstep(1.15, 0.35, length(vUv - 0.5) * 1.6);
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const Cloth: React.FC<{ pointer: React.RefObject<PointerState>; onReady?: () => void }> = ({ pointer, onReady }) => {
  const { viewport } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const smoothed = useRef(new THREE.Vector3(0, 0, 0));
  const texture = useMemo(makeAdireTexture, []);

  // Oversize the plane so waving edges never show
  const w = viewport.width * 1.3;
  const h = viewport.height * 1.3;
  const tileWorld = 0.55;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uPointer: { value: new THREE.Vector3() },
      uTex: { value: texture },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uBase: { value: new THREE.Color('#22538f') },
      uDeep: { value: new THREE.Color('#0b2140') },
      uThread: { value: new THREE.Color('#e2ecf8') },
    }),
    [texture]
  );

  useEffect(() => {
    uniforms.uRepeat.value.set(w / tileWorld, h / tileWorld);
  }, [w, h, uniforms]);

  useEffect(() => {
    onReady?.();
    return () => texture.dispose();
  }, [onReady, texture]);

  useFrame((_, delta) => {
    const u = uniforms;
    u.uTime.value += delta;
    u.uIntro.value = Math.min(1, u.uIntro.value + delta * 0.45);
    const target = pointer.current;
    const s = smoothed.current;
    s.x += ((target.x * viewport.width) / 2 - s.x) * 0.08;
    s.y += ((target.y * viewport.height) / 2 - s.y) * 0.08;
    s.z += (target.active - s.z) * 0.05;
    u.uPointer.value.copy(s);
  });

  return (
    <mesh rotation={[-0.12, 0.06, 0]}>
      <planeGeometry args={[w, h, 160, 160]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
};

const AdireCloth: React.FC<{ pointer: React.RefObject<PointerState>; onReady?: () => void }> = ({ pointer, onReady }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3], fov: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Cloth pointer={pointer} onReady={onReady} />
      </Canvas>
    </div>
  );
};

export default AdireCloth;
