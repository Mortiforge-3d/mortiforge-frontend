"use client";

import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Edges } from "@react-three/drei";

import * as THREE from "three";

export function FloatingObject() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.15;

    groupRef.current.rotation.y += 0.003;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[1.8, 1.8, 1.8]} />

          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} />

          <Edges color="#A855F7" linewidth={1.2} />
        </mesh>

         
      </group>
    </Float>
  );
}
