import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type GlobeLocation = {
  name: string;
  lat: number;
  lon: number;
};

const DEFAULT_LOCATIONS: GlobeLocation[] = [
  { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { name: 'London', lat: 51.5072, lon: -0.1276 },
  { name: 'Atlanta', lat: 40.7128, lon: -74.006 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Perth', lat: -31.9535, lon: 115.8570 },
];

const latLonToVector3 = (lat: number, lon: number, radius = 1.02) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const GlobeMesh: React.FC<{
  color: string;
  highlightColor: string;
  locations: GlobeLocation[];
  isDarkMode: boolean;
  onActiveLocationChange?: (name: string) => void;
}> = ({ color, highlightColor, locations, isDarkMode, onActiveLocationChange }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const markers = useMemo(
    () => locations.map((location) => latLonToVector3(location.lat, location.lon)),
    [locations]
  );

  useEffect(() => {
    if (locations.length === 0) return undefined;
    onActiveLocationChange?.(locations[0].name);
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % locations.length;
        onActiveLocationChange?.(locations[next].name);
        return next;
      });
    }, 1300);
    return () => clearInterval(timer);
  }, [locations, onActiveLocationChange]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00025) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* @ts-ignore */}
      <mesh>
        {/* @ts-ignore */}
        <sphereGeometry args={[1, 32, 32]} />
        {/* @ts-ignore */}
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={isDarkMode ? 0.28 : 0.52}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {markers.map((position, index) => {
        const isActive = index === activeIndex;
        return (
          <group key={locations[index].name} position={position}>
            {/* @ts-ignore */}
            <mesh scale={isActive ? 1.35 : 1}>
              {/* @ts-ignore */}
              <sphereGeometry args={[0.03, 12, 12]} />
              {/* @ts-ignore */}
              <meshBasicMaterial color={highlightColor} />
            </mesh>
            {isActive && (
              // @ts-ignore
              <mesh scale={1.8}>
                {/* @ts-ignore */}
                <ringGeometry args={[0.04, 0.055, 24]} />
                {/* @ts-ignore */}
                <meshBasicMaterial color={highlightColor} transparent opacity={0.85} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* @ts-ignore */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* @ts-ignore */}
        <ringGeometry args={[1.16, 1.2, 64]} />
        {/* @ts-ignore */}
        <meshBasicMaterial color={highlightColor} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const RotatingGlobe: React.FC<{
  isDarkMode: boolean;
  locations?: GlobeLocation[];
  onActiveLocationChange?: (name: string) => void;
}> = ({ isDarkMode, locations = DEFAULT_LOCATIONS, onActiveLocationChange }) => {
  const color = isDarkMode ? '#ffffff' : '#000000';
  const highlightColor = '#00FF00';

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* @ts-ignore */}
        <ambientLight intensity={0.6} />
        {/* @ts-ignore */}
        <directionalLight position={[3, 2, 4]} intensity={0.5} />
        <GlobeMesh
          color={color}
          highlightColor={highlightColor}
          locations={locations}
          isDarkMode={isDarkMode}
          onActiveLocationChange={onActiveLocationChange}
        />
      </Canvas>
    </div>
  );
};

export default RotatingGlobe;
