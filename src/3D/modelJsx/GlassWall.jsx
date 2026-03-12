import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Box3, Vector3 } from 'three'

const GLASS_MODEL_PATH = '/models/glass_wall/scene.gltf'

export default function GlassWall({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const gltf = useGLTF(GLASS_MODEL_PATH)

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)

    cloned.traverse((node) => {
      if (!node.isMesh) return
      node.castShadow = true
      node.receiveShadow = true
      if (node.material) {
        try {
          if (node.material.map) node.material.map.colorSpace = THREE.SRGBColorSpace
          if (node.material.emissiveMap) node.material.emissiveMap.colorSpace = THREE.SRGBColorSpace
        } catch (e) {
          if (node.material.map) node.material.map.encoding = THREE.sRGBEncoding
          if (node.material.emissiveMap) node.material.emissiveMap.encoding = THREE.sRGBEncoding
        }

        try {
          if ('transparent' in node.material) node.material.transparent = true
          if ('opacity' in node.material && node.material.opacity === undefined) node.material.opacity = 0.9
          if ('roughness' in node.material) node.material.roughness = Math.min(1, node.material.roughness ?? 0.1)
          if ('metalness' in node.material) node.material.metalness = Math.min(1, node.material.metalness ?? 0.1)
        } catch (e) {
         
        }

        node.material.needsUpdate = true
      }
    })

    const bounds = new Box3().setFromObject(cloned)
    const center = new Vector3()
    bounds.getCenter(center)

    cloned.position.x -= center.x
    cloned.position.y -= bounds.min.y
    cloned.position.z -= center.z

    return cloned
  }, [gltf])

  let computedScale
  if (Array.isArray(scale)) computedScale = scale
  else if (typeof scale === 'number') computedScale = [scale, scale, scale]
  else if (scale && typeof scale === 'object')
    computedScale = [scale.x || 1, scale.y || 1, scale.z || 1]
  else computedScale = [1, 1, 1]

  return (
    <group position={position} rotation={rotation} scale={computedScale}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(GLASS_MODEL_PATH)
