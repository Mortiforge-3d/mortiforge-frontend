"use client";

import { Canvas } from "@react-three/fiber";
import { Lights } from "./lights";
import { FloatingObject } from "./floating-object";

export function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <Lights />
      <FloatingObject />
    </Canvas>
  );
}
