import { useBox } from "@react-three/cannon";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "./store";
import { GAME_CONSTANTS, COLORS } from "./constants";

const Vehicle = ({ startPosition, speed }: { startPosition: [number, number, number], speed: number }) => {
  const [ref, api] = useBox(() => ({
    mass: 1000,
    position: startPosition,
    args: [2, 1.5, 4],
    type: "Kinematic",
  }));

  const gameSpeed = useGameStore((state) => state.speed);
  const isPlaying = useGameStore((state) => state.isPlaying);

  useFrame((state, delta) => {
    if (!isPlaying) return;
    // Move backward relative to the track speed for added challenge
    api.position.set(startPosition[0], startPosition[1], startPosition[2] - (delta * speed));
  });

  return (
    <mesh ref={ref as any}>
      <boxGeometry args={[2, 1.5, 4]} />
      <meshStandardMaterial color="#333" roughness={0.1} metalness={0.8} />
      {/* Headlights */}
      <mesh position={[0.6, 0, 2.1]}>
         <boxGeometry args={[0.4, 0.2, 0.1]} />
         <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={5} />
      </mesh>
      <mesh position={[-0.6, 0, 2.1]}>
         <boxGeometry args={[0.4, 0.2, 0.1]} />
         <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={5} />
      </mesh>
    </mesh>
  );
};

export const Traffic = () => {
  const distance = useGameStore((state) => state.distance);
  
  // Create static set of traffic for a long stretch
  const trafficData = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      pos: [(Math.random() - 0.5) * GAME_CONSTANTS.TRACK_WIDTH, 0.75, 100 + i * 80] as [number, number, number],
      speed: 10 + Math.random() * 40
    }));
  }, []);

  return (
    <group>
      {trafficData.map((t) => (
        <Vehicle key={t.id} startPosition={t.pos} speed={t.speed} />
      ))}
    </group>
  );
};
