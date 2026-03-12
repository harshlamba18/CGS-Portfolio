import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Box3, Vector3 } from 'three'

const TABLE_MODEL_PATH = '/models/meeting_table/scene.gltf'

export default function MeetingTable({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const gltf = useGLTF(TABLE_MODEL_PATH)

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

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(TABLE_MODEL_PATH)
