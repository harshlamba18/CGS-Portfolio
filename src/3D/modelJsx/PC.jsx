import React, { useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box3, Vector3 } from 'three'

const PC_MODEL_PATH = '/models/PC1/scene.gltf'

export default function PC({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  overlayTexture,
  overlayPosition = [0, 1.32, -0.36],
  overlayRotation = [0, 0, 0],
  overlayScale = [1.1, 0.62, 1],
}) {
  const gltf = useGLTF(PC_MODEL_PATH)
  const texture = useTexture(overlayTexture || '/images/games.png')

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)

    cloned.traverse((node) => {
      if (!node.isMesh) return
      node.castShadow = true
      node.receiveShadow = true
      if (node.material) {
        try {
          if (node.material.map) node.material.map.colorSpace = THREE.SRGBColorSpace
        } catch (e) {
          if (node.material.map) node.material.map.encoding = THREE.sRGBEncoding
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

  const overlayMaterial = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.needsUpdate = true

    return new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      side: THREE.DoubleSide,
      transparent: true,
    })
  }, [texture])

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={scene} />
      <mesh position={overlayPosition} rotation={overlayRotation} scale={overlayScale}>
        <planeGeometry args={[1, 1]} />
        <primitive object={overlayMaterial} attach="material" />
      </mesh>
    </group>
  )
}

useGLTF.preload(PC_MODEL_PATH)
