import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useInView } from './useInView';
import { LAND_POINTS, decodeLandMask } from '../../lib/landMask';

export type GlobeLocation = {
  name: string;
  lat: number;
  lon: number;
};

const latLonToVector3 = (lat: number, lon: number, radius = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

type Palette = { dot: string; glow: string; glowStrength: number; arc: string; marker: string };

// ---------------------------------------------------------------- Dots
const dotVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aLand;
  varying float vFacing;
  varying float vLand;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = dot(normalize(normalMatrix * position), vec3(0.0, 0.0, 1.0));
    vLand = aLand;
    gl_PointSize = uSize * uPixelRatio * (aLand > 0.5 ? 1.0 : 0.7) * (3.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  varying float vLand;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    float a = smoothstep(-0.35, 0.55, vFacing);
    // Land carries the picture; the sea is a faint dotted shell that keeps the sphere's outline
    float alpha = vLand > 0.5 ? 0.1 + a * 0.9 : 0.03 + a * 0.12;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

const DotSphere: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const geometry = useMemo(() => {
    // Same fibonacci sphere the land mask was baked against (lib/landMask.ts)
    const land = decodeLandMask();
    const count = LAND_POINTS;
    const positions: number[] = [];
    const flags: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const isLand = land[i] === 1;
      if (!isLand && i % 5 !== 0) continue; // keep one sea dot in five
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      positions.push(Math.cos(t) * r, y, Math.sin(t) * r);
      flags.push(isLand ? 1 : 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    g.setAttribute('aLand', new THREE.BufferAttribute(new Float32Array(flags), 1));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const gl = useThree((st) => st.gl);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uSize: { value: size }, uPixelRatio: { value: gl.getPixelRatio() } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uSize.value = size;
  }, [color, size, uniforms]);

  return (
    <points geometry={geometry}>
      <shaderMaterial uniforms={uniforms} vertexShader={dotVertex} fragmentShader={dotFragment} transparent depthWrite={false} />
    </points>
  );
};

// ---------------------------------------------------------------- Atmosphere
const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    // Rim-only halo: bright where the shell is edge-on, clear in the middle
    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float i = pow(edge, 4.0) * uStrength;
    gl_FragColor = vec4(uColor, i);
    #include <colorspace_fragment>
  }
`;

const Atmosphere: React.FC<{ color: string; strength: number }> = ({ color, strength }) => {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } }), []);
  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uStrength.value = strength;
  }, [color, strength, uniforms]);
  return (
    <mesh scale={1.12}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

// ---------------------------------------------------------------- Arcs
const arcFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOffset;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    float p = mod(uTime * 0.42 + uOffset, 2.2);
    float grow = clamp(p / 0.9, 0.0, 1.0);
    float fade = 1.0 - clamp((p - 1.5) / 0.5, 0.0, 1.0);
    float along = vUv.x;
    if (along > grow) discard;
    float head = smoothstep(grow - 0.18, grow, along);
    float a = (0.28 + head * 0.72) * fade * smoothstep(-0.45, 0.15, vFacing);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

const arcVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vFacing = dot(normalize(normalMatrix * position), vec3(0.0, 0.0, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const Arc: React.FC<{ from: THREE.Vector3; to: THREE.Vector3; color: string; offset: number }> = ({ from, to, color, offset }) => {
  const geometry = useMemo(() => {
    const dist = from.distanceTo(to);
    const lift = 1 + dist * 0.38;
    const mid1 = from.clone().lerp(to, 0.25).normalize().multiplyScalar(lift);
    const mid2 = from.clone().lerp(to, 0.75).normalize().multiplyScalar(lift);
    const curve = new THREE.CubicBezierCurve3(from, mid1, mid2, to);
    return new THREE.TubeGeometry(curve, 96, 0.0065, 8, false);
  }, [from, to]);

  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uOffset: { value: offset } }),
    []
  );
  useEffect(() => void uniforms.uColor.value.set(color), [color, uniforms]);
  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh geometry={geometry}>
      <shaderMaterial uniforms={uniforms} vertexShader={arcVertex} fragmentShader={arcFragment} transparent depthWrite={false} />
    </mesh>
  );
};

// ---------------------------------------------------------------- Markers
const Marker: React.FC<{ position: THREE.Vector3; color: string; active: boolean; home?: boolean }> = ({ position, color, active, home }) => {
  const ring = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const world = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position]
  );

  useFrame(({ clock, camera }) => {
    if (!ring.current || !group.current) return;
    // Hide markers on the far side of the planet
    group.current.getWorldPosition(world);
    group.current.visible = world.normalize().dot(camera.position.clone().normalize()) > 0.08;
    const t = (clock.getElapsedTime() * 0.9) % 1;
    const pulse = active || home ? t : 0;
    ring.current.scale.setScalar(1 + pulse * 2.2);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = active || home ? 0.9 * (1 - t) : 0;
  });

  return (
    <group ref={group} position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[home ? 0.028 : 0.02, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.028, 0.036, 32]} />
        <meshBasicMaterial color={color} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- Scene
const HOME = { lat: 6.5244, lon: 3.3792 }; // Lagos

const Globe: React.FC<{
  palette: Palette;
  locations: GlobeLocation[];
  activeIndex: number;
  pointer: React.RefObject<{ x: number; y: number }>;
}> = ({ palette, locations, activeIndex, pointer }) => {
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const home = useMemo(() => latLonToVector3(HOME.lat, HOME.lon, 1.005), []);
  const points = useMemo(() => locations.map((l) => latLonToVector3(l.lat, l.lon, 1.005)), [locations]);

  // Spin that brings a longitude to face the viewer
  const faceY = (lon: number) => -((lon + 90) * Math.PI) / 180;
  const startY = useMemo(() => faceY(HOME.lon), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const target = locations[activeIndex] ?? HOME;
    if (spin.current) {
      // Ease round the shorter way to the active place, with a slow drift once there
      const cur = spin.current.rotation.y;
      let goal = faceY(target.lon);
      goal += Math.round((cur - goal) / (Math.PI * 2)) * Math.PI * 2;
      spin.current.rotation.y = THREE.MathUtils.damp(cur, goal, 1.6, delta);
    }
    if (tilt.current) {
      const px = pointer.current?.x ?? 0;
      const py = pointer.current?.y ?? 0;
      // Tip the globe so the place sits near the middle; the pointer adds a few degrees
      const tx = THREE.MathUtils.clamp((target.lat * Math.PI) / 180, -0.6, 0.75) * 0.75 + py * 0.12;
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, tx, 1.6, delta);
      tilt.current.rotation.z = THREE.MathUtils.damp(tilt.current.rotation.z, -px * 0.08, 2, delta);
    }
  });

  return (
    <group ref={tilt} rotation={[0.28, 0, 0]}>
      <group ref={spin} rotation={[0, startY, 0]}>
        <DotSphere color={palette.dot} size={2.6} />
        {points.map((p, i) =>
          p.distanceTo(home) > 0.2 ? (
            <Arc key={locations[i].name} from={home} to={p} color={palette.arc} offset={i * 0.37} />
          ) : null
        )}
        {points.map((p, i) => (
          <Marker key={locations[i].name} position={p} color={palette.marker} active={i === activeIndex} />
        ))}
        <Marker position={home} color={palette.marker} active={false} home />
      </group>
      <Atmosphere color={palette.glow} strength={palette.glowStrength} />
    </group>
  );
};

const RotatingGlobe: React.FC<{
  isDarkMode: boolean;
  locations: GlobeLocation[];
  onActiveLocationChange?: (name: string) => void;
  /** Milliseconds spent on each place. */
  interval?: number;
}> = ({ isDarkMode, locations, onActiveLocationChange, interval = 3200 }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);
  const [activeIndex, setActiveIndex] = useState(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!locations.length || !inView) return;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % locations.length), interval);
    return () => clearInterval(timer);
  }, [locations.length, inView, interval]);

  useEffect(() => {
    if (locations[activeIndex]) onActiveLocationChange?.(locations[activeIndex].name);
  }, [activeIndex, locations, onActiveLocationChange]);

  const palette: Palette = isDarkMode
    ? { dot: '#86b0ea', glow: '#3f78c8', glowStrength: 0.9, arc: '#f0b93a', marker: '#f0b93a' }
    : { dot: '#1d4a8c', glow: '#7aa6de', glowStrength: 0.55, arc: '#d99a17', marker: '#d99a17' };

  return (
    <div
      ref={wrap}
      className="w-full h-full"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
      }}
      onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.6], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Globe palette={palette} locations={locations} activeIndex={activeIndex} pointer={pointer} />
      </Canvas>
    </div>
  );
};

export default RotatingGlobe;
