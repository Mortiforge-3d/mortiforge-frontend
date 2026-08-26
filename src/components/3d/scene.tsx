"use client";

import { Canvas } from "@react-three/fiber";
import { Lights } from "./lights";
import { FloatingObject } from "./floating-object";
import { OrbitalHUD } from "./orbital-hud";

export function Scene() {
  return (
    <div
      className="relative 
      mx-auto 
      aspect-square 
      w-[280px]
      sm:w-[340px]
      md:w-[420px]
      lg:w-[520px]
      xl:w-[620px]"
    >
      <div
        className="
absolute
left-1/2
top-1/2
-z-10

h-[35%]
w-[35%]

-translate-x-1/2
-translate-y-1/2

rounded-full

bg-primary/30

blur-[100px]
"
      />
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <Lights />
        <FloatingObject />
      </Canvas>

      <OrbitalHUD/>
      
      
    </div>
  );
}
