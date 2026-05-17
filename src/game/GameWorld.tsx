import { Canvas } from "@react-three/fiber";
import { Physics, Debug } from "@react-three/cannon";
import { Sky, Environment, OrbitControls, KeyboardControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { Bike } from "./Bike";
import { Track } from "./Track";
import { Traffic } from "./Traffic";
import { useGameStore } from "./store";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

export const GameWorld = () => {
  const { isPlaying } = useGameStore();

  const map = useMemo(() => [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "boost", keys: ["ShiftLeft", "ShiftRight"] },
    { name: "brake", keys: ["Space"] },
  ], []);

  return (
    <KeyboardControls map={map}>
      <div className="w-full h-full bg-black relative touch-none">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Sky sunPosition={[100, 20, 100]} />
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
            
            <Physics gravity={[0, -9.81, 0]}>
              <Bike />
              <Track />
              <Traffic />
            </Physics>

            <EffectComposer>
              <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
              <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            </EffectComposer>

          </Suspense>
        </Canvas>
      </div>
    </KeyboardControls>
  );
};
