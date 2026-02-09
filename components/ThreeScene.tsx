
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const ParametricObject: React.FC<{ intensity: number, color: string }> = ({ intensity, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.08;
      
      const { x, y } = state.mouse;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 0.8, 0.03);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 0.8, 0.03);
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
      {/* @ts-ignore - Fix for intrinsic element 'mesh' type error */}
      <mesh ref={meshRef}>
        {/* @ts-ignore - Fix for intrinsic element 'torusKnotGeometry' type error */}
        <torusKnotGeometry args={[1.8, 0.4, 256, 64]} />
        {/* @ts-ignore - Fix for intrinsic element 'meshStandardMaterial' type error */}
        <meshStandardMaterial 
          wireframe 
          color={color} 
          transparent 
          opacity={0.07 * intensity} 
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  );
};

const NeuralPathways = ({ color }: { color: string }) => {
  const points = useRef<THREE.Points>(null);
  const count = 4000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <Points positions={positions} ref={points}>
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
      />
    </Points>
  );
};

const ThreeScene: React.FC<{ intensity: number, isDarkMode: boolean }> = ({ intensity, isDarkMode }) => {
  const color = isDarkMode ? "#ffffff" : "#000000";
  
  return (
    <div className="w-full h-full opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 70 }}>
        {/* @ts-ignore - Fix for intrinsic element 'ambientLight' type error */}
        <ambientLight intensity={isDarkMode ? 0.2 : 0.8} />
        {/* @ts-ignore - Fix for intrinsic element 'pointLight' type error */}
        <pointLight position={[10, 10, 10]} intensity={isDarkMode ? 0.5 : 1.2} />
        <ParametricObject intensity={intensity} color={color} />
        <NeuralPathways color={color} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
