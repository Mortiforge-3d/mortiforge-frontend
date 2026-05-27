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

          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} />

          <Edges color="#A855F7" linewidth={0.25} />
        </mesh>

        {/* Front Text */}
        <Text
          position={[0, 0, 0.91]}
          fontSize={0.22}
          font="/fonts/BebasNeue-Regular.ttf"
          color="#A855F7"
          material-toneMapped={false}
          anchorX="center"
          anchorY="middle"
        >
          3D
        </Text>

        {/* Back Text */}
        <Text
          position={[0, 0, -0.91]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.22}
          font="/fonts/BebasNeue-Regular.ttf"
          color="#A855F7"
          material-toneMapped={false}
          anchorX="center"
          anchorY="middle"
        >
          PRINT
        </Text>

        {/* Right Text */}
        <Text
          position={[0.91, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.22}
          font="/fonts/BebasNeue-Regular.ttf"
          color="#A855F7"
          material-toneMapped={false}
          anchorX="center"
          anchorY="middle"
        >
          FORGE
        </Text>

        {/* Left Text */}
        <Text
          position={[-0.91, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.22}
          font="/fonts/BebasNeue-Regular.ttf"
          color="#A855F7"
          material-toneMapped={false}
          anchorX="center"
          anchorY="middle"
        >
          FUTURE
        </Text>

        {/* Top Sharp */}
        <Text
          position={[0, 0.885, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          font="/fonts/BebasNeue-Regular.ttf"
          fontSize={0.22}
          color="#A855F7"
          anchorX="center"
          anchorY="middle"
        >
          CREATE
        </Text>
        <Text
          position={[0, -0.885, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          font="/fonts/BebasNeue-Regular.ttf"
          fontSize={0.22}
          color="#A855F7"
          anchorX="center"
          anchorY="middle"
        >
          CRAFT
        </Text>
      </group>
    </Float>
  );
}
