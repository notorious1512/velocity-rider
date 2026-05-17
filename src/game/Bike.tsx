import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { PerspectiveCamera, Trail, Float } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "./store";
import { GAME_CONSTANTS, COLORS } from "./constants";
import { audioManager } from "./AudioSystem";

export const Bike = () => {
  const [, getKeys] = useKeyboardControls();
  const setSpeed = useGameStore((state) => state.setSpeed);
  const addScore = useGameStore((state) => state.addScore);
  const setDamage = useGameStore((state) => state.setDamage);
  const setGameOver = useGameStore((state) => state.setGameOver);
  const updateDistance = useGameStore((state) => state.updateDistance);
  const { isPlaying, nitro, setNitro, speed, damage } = useGameStore();

  const [chassisBody, chassisApi] = useBox(() => ({
    mass: 500,
    position: [0, 2, 0],
    args: [0.8, 1, 2.5],
    onCollide: (e) => {
      const impact = Math.abs(e.contact.impactVelocity);
      if (impact > 2) {
        setDamage(Math.min(100, damage + impact * 2));
        if (damage + impact * 2 >= 100) setGameOver(true);
      }
    }
  }), useRef<THREE.Group>(null));

  const pos = useRef([0, 0, 0]);
  const vel = useRef([0, 0, 0]);

  useEffect(() => {
    chassisApi.position.subscribe((v) => (pos.current = v));
    chassisApi.velocity.subscribe((v) => (vel.current = v));
  }, [chassisApi]);

  useFrame((state, delta) => {
    if (!isPlaying) return;

    const { forward, backward, left, right, boost, brake } = getKeys() as any;
    
    // Physics Logic
    let force = 0;
    if (forward) force = GAME_CONSTANTS.ACCELERATION;
    if (backward) force = -GAME_CONSTANTS.ACCELERATION / 2;
    if (boost && nitro > 0) {
      force *= GAME_CONSTANTS.NITRO_BOOST;
      setNitro(Math.max(0, nitro - delta * 20));
    } else if (!boost) {
      setNitro(Math.min(100, nitro + delta * 5));
    }

    // Apply forward force
    const currentSpeed = Math.sqrt(vel.current[0] ** 2 + vel.current[2] ** 2);
    if (Math.abs(currentSpeed) < (GAME_CONSTANTS.MAX_SPEED / 3.6)) {
      chassisApi.applyLocalForce([0, 0, force * 500 * delta], [0, 0, 0]);
    }

    // Steering
    if (left) chassisApi.applyLocalForce([GAME_CONSTANTS.STEER_SPEED * 100000 * delta, 0, 0], [0, 0, 1]);
    if (right) chassisApi.applyLocalForce([-GAME_CONSTANTS.STEER_SPEED * 100000 * delta, 0, 0], [0, 0, 1]);
    
    // Braking
    if (brake) {
      chassisApi.velocity.set(vel.current[0] * 0.9, vel.current[1], vel.current[2] * 0.9);
    }

    // Update Store
    const speedKmH = currentSpeed * 3.6;
    setSpeed(speedKmH);
    updateDistance(delta * currentSpeed);
    addScore(delta * (speedKmH / 10));

    // Audio
    audioManager.playEngine(speedKmH);

    // Camera follow (Lerped)
    const cameraOffset = new THREE.Vector3(0, 2.5, -6);
    cameraOffset.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, state.camera.rotation.y, 0)));
    // state.camera.position.lerp(new THREE.Vector3(pos.current[0], pos.current[1] + 2.5, pos.current[2] - 6), 0.1);
    // state.camera.lookAt(pos.current[0], pos.current[1], pos.current[2] + 10);
  });

  return (
    <group ref={chassisBody}>
      {/* Bike Body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.8, 2]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Front Wheel */}
      <mesh position={[0, -0.3, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Rear Wheel */}
      <mesh position={[0, -0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Neon Accents */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.65, 0.1, 1.8]} />
        <meshStandardMaterial 
          color={COLORS.NEON_CYAN} 
          emissive={COLORS.NEON_CYAN} 
          emissiveIntensity={2} 
        />
      </mesh>

      {/* Tail Light */}
      <mesh position={[0, 0.3, -1.2]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial 
          color="#f00" 
          emissive="#f00" 
          emissiveIntensity={5} 
        />
      </mesh>

      {/* Speed Trails */}
      {speed > 50 && (
        <group position={[0, -0.2, -1]}>
           <Trail width={2} length={5} color={COLORS.NEON_CYAN} attenuation={(t) => t * t}>
              <mesh visible={false}><sphereGeometry args={[0.1]} /></mesh>
           </Trail>
        </group>
      )}

      <PerspectiveCamera 
        makeDefault 
        position={[0, 3, -6]} 
        fov={75} 
      />
    </group>
  );
};
