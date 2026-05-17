import { usePlane } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { GAME_CONSTANTS, COLORS } from "./constants";
import { useGameStore } from "./store";

const TrackSegment = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Road Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[GAME_CONSTANTS.TRACK_WIDTH, GAME_CONSTANTS.SEGMENT_LENGTH]} />
        <meshStandardMaterial color={COLORS.ROAD_GRAY} roughness={0.8} />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, GAME_CONSTANTS.SEGMENT_LENGTH]} />
        <meshStandardMaterial 
          color={COLORS.NEON_CYAN} 
          emissive={COLORS.NEON_CYAN} 
          emissiveIntensity={1.5} 
        />
      </mesh>

      {/* Side Neon Edges */}
      <mesh position={[GAME_CONSTANTS.TRACK_WIDTH / 2, 0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, GAME_CONSTANTS.SEGMENT_LENGTH]} />
        <meshStandardMaterial 
          color={COLORS.NEON_MAGENTA} 
          emissive={COLORS.NEON_MAGENTA} 
          emissiveIntensity={4} 
        />
      </mesh>
      <mesh position={[-GAME_CONSTANTS.TRACK_WIDTH / 2, 0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, GAME_CONSTANTS.SEGMENT_LENGTH]} />
        <meshStandardMaterial 
          color={COLORS.NEON_MAGENTA} 
          emissive={COLORS.NEON_MAGENTA} 
          emissiveIntensity={4} 
        />
      </mesh>
    </group>
  );
};

export const Track = () => {
  // Ground Physics
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  const distance = useGameStore((state) => state.distance);
  
  // Logic to render segments around the player
  const currentSegmentIndex = Math.floor(distance / GAME_CONSTANTS.SEGMENT_LENGTH);
  const segmentsToRender = [
    currentSegmentIndex - 1,
    currentSegmentIndex,
    currentSegmentIndex + 1,
    currentSegmentIndex + 2,
    currentSegmentIndex + 3,
    currentSegmentIndex + 4,
    currentSegmentIndex + 5,
  ];

  return (
    <>
      <mesh ref={ref as any} visible={false}>
        <planeGeometry args={[1000, 1000]} />
      </mesh>
      
      {segmentsToRender.map((i) => {
        const zOffset = i * GAME_CONSTANTS.SEGMENT_LENGTH;
        return <TrackSegment key={i} position={[0, 0, zOffset]} />;
      })}
      
      {/* Grid helper for scale */}
      <gridHelper args={[1000, 100, 0x444444, 0x222222]} rotation={[0, 0, 0]} />
    </>
  );
};
