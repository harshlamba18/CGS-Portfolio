import { useState } from "react";
import * as THREE from "three";

export default function InteractiveMesh({
  position,
  rotation = [0, 0, 0],
  size = [0.05, 0.78, 0.18],
  scale = [1.04, 1.04, 1.04],
  showOutline = true,
  fillColor = "#22d3ee",
  fillOpacity = 0.28,
  unlit = false,
  glow = false,
  glowColor = "#60a5fa",
  glowOpacity = 0.18,
  hoverGlowOpacity = 0.55,
  glowScale = [1.2, 1.2, 1.2],
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerOver = (event) => {
    event.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = "default";
  };

  return (
    <mesh
      castShadow={!unlit}
      receiveShadow={!unlit}
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={size} />
      {unlit ? (
        <meshBasicMaterial color={fillColor} transparent opacity={fillOpacity} depthWrite={false} />
      ) : (
        <meshStandardMaterial
          color={fillColor}
          transparent
          opacity={fillOpacity}
          depthWrite={false}
          emissive="#1d4ed8"
          emissiveIntensity={0.08}
          roughness={0.35}
          metalness={0.2}
        />
      )}

      {showOutline ? (
        <mesh scale={scale} raycast={() => null}>
          <boxGeometry args={size} />
          {unlit ? (
            <meshBasicMaterial
              wireframe
              color={isHovered ? "#60a5fa" : "#475569"}
              transparent
              opacity={isHovered ? 1 : 0.22}
              depthWrite={false}
            />
          ) : (
            <meshStandardMaterial
              wireframe
              color={isHovered ? "#60a5fa" : "#475569"}
              emissive={isHovered ? "#60a5fa" : "#000000"}
              emissiveIntensity={isHovered ? 2.6 : 0}
              transparent
              opacity={isHovered ? 1 : 0.22}
            />
          )}
        </mesh>
      ) : null}

      {glow ? (
        <mesh scale={glowScale} raycast={() => null}>
          <boxGeometry args={size} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={isHovered ? hoverGlowOpacity : glowOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}
    </mesh>
  );
}
