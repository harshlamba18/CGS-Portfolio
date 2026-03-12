import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Sparkles,
  Stars
} from "@react-three/drei";
import { useMemo, useRef } from "react";

function pseudoRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function NebulaCloud({ position, color }) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * 0.01;
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[40, 25]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

function ShootingStar() {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    ref.current.position.x = (t * 6) % 40 - 20;
    ref.current.position.y = 8 - (t * 2) % 12;
  });

  return (
    <mesh ref={ref} position={[-10, 6, -5]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

function DistantStars({ count = 1500 }) {
  const mesh = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const xSeed = pseudoRandom(i * 3 + 1);
      const ySeed = pseudoRandom(i * 3 + 2);
      const zSeed = pseudoRandom(i * 3 + 3);

      arr[i * 3] = (xSeed - 0.5) * 80;
      arr[i * 3 + 1] = (ySeed - 0.5) * 60;
      arr[i * 3 + 2] = -zSeed * 60;
    }

    return arr;
  }, [count]);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#cbd5f5"
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function FloatingBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <color attach="background" args={["#010206"]} />
        <fog attach="fog" args={["#010206", 15, 60]} />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#6366f1" />
        <pointLight position={[-10, -10, -5]} intensity={1.7} color="#22d3ee" />
        <pointLight position={[0, 5, -15]} intensity={1.2} color="#22d3ee" />

        <Stars
          radius={70}
          depth={34}
          count={4200}
          factor={3.8}
          saturation={0}
          fade
          speed={0.35}
        />

        <Sparkles
          count={100}
          size={2.6}
          speed={0.28}
          scale={[20, 12, 15]}
          color="#93c5fd"
        />

        <DistantStars />

        <NebulaCloud position={[0, 5, -20]} color="#312e81" />
        <NebulaCloud position={[-15, -5, -25]} color="#0f172a" />
        <NebulaCloud position={[15, 3, -30]} color="#1e1b4b" />

        <ShootingStar />
      </Canvas>

      <div className="absolute inset-0 bg-linear-to-b from-[#010206]/10 via-[#010206]/40 to-[#010206]/70" />
    </div>
  );
}