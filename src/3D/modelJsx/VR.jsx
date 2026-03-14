import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const VR_MODEL_PATH = "/models/VR/scene.gltf";

export default function VR({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const gltf = useGLTF(VR_MODEL_PATH);

  const object = useMemo(() => {
    if (!gltf?.scene) return null;
    const cloned = gltf.scene.clone(true);
    cloned.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((mat) => {
        if (!mat) return;
        // ensure correct colorSpace for textures in newer three versions
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
        mat.needsUpdate = true;
      });
    });
    return cloned;
  }, [gltf]);

  if (!object) return null;

  return <primitive object={object} position={position} rotation={rotation} scale={scale} />;
}

useGLTF.preload(VR_MODEL_PATH);
