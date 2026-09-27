import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useInView } from './useInView';

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
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = dot(normalize(normalMatrix * position), vec3(0.0, 0.0, 1.0));
    gl_PointSize = uSize * (3.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    float a = smoothstep(-0.35, 0.55, vFacing);
    gl_FragColor = vec4(uColor, 0.12 + a * 0.78);
    #include <colorspace_fragment>
  }
`;

const DotSphere: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const geometry = useMemo(() => {
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      positions.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(color) }, uSize: { value: size } }), []);
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

  // Start with Lagos facing the viewer
  const startY = useMemo(() => -((HOME.lon + 90) * Math.PI) / 180, []);

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.12;
    if (tilt.current && pointer.current) {
      const tx = 0.28 + pointer.current.y * 0.25;
      const ty = pointer.current.x * 0.35;
      tilt.current.rotation.x += (tx - tilt.current.rotation.x) * 0.05;
      tilt.current.rotation.z += (-ty * 0.3 - tilt.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={tilt} rotation={[0.28, 0, 0]}>
      <group ref={spin} rotation={[0, startY, 0]}>
        <DotSphere color={palette.dot} size={3.4} />
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
}> = ({ isDarkMode, locations, onActiveLocationChange }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);
  const [activeIndex, setActiveIndex] = useState(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!locations.length || !inView) return;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % locations.length), 1600);
    return () => clearInterval(timer);
  }, [locations.length, inView]);

  useEffect(() => {
    if (locations[activeIndex]) onActiveLocationChange?.(locations[activeIndex].name);
  }, [activeIndex, locations, onActiveLocationChange]);

  const palette: Palette = isDarkMode
    ? { dot: '#8f9dff', glow: '#5566e0', glowStrength: 0.9, arc: '#f0b93a', marker: '#f0b93a' }
    : { dot: '#2e3d99', glow: '#7d8ef0', glowStrength: 0.55, arc: '#d99a17', marker: '#d99a17' };

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
