import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box3, Vector3 } from 'three'

const SCREEN_MODEL_PATH = '/models/screen_led/scene.gltf'

export default function ScreenLED({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, videoSrc, videoPosition = [0, 0, 0.05], videoRotation = [0, 0, 0], videoScale = [1, 1, 1] }) {
  const gltf = useGLTF(SCREEN_MODEL_PATH)
  const [isPlaying, setIsPlaying] = useState(false)

  const sceneData = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    let screenInfo = null

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
        node.material.needsUpdate = true
      }

      if (!screenInfo) {
        const name = (node.name || '').toLowerCase()
        const matName = (node.material && node.material.name) || ''
        const matNameLower = matName.toLowerCase()
        if (/screen|display|monitor|led|panel|object/i.test(name + matName)) {
          const b = new Box3().setFromObject(node)
          const c = new Vector3()
          b.getCenter(c)
          const s = new Vector3()
          b.getSize(s)
          screenInfo = { position: c.clone(), size: s.clone(), nodeName: node.name }
        }
      }
    })

    if (!screenInfo) {
      const bounds = new Box3().setFromObject(cloned)
      const s = new Vector3()
      bounds.getSize(s)
      const c = new Vector3()
      bounds.getCenter(c)
      screenInfo = { position: new Vector3(c.x, c.y, c.z + 0.1), size: new Vector3(Math.max(s.x, 0.5), Math.max(s.y, 0.5), 1) }
    }

    const bounds = new Box3().setFromObject(cloned)
    const center = new Vector3()
    bounds.getCenter(center)

    cloned.position.x -= center.x
    cloned.position.y -= bounds.min.y
    cloned.position.z -= center.z

    return { cloned, screenInfo }
  }, [gltf])

  let computedScale
  if (Array.isArray(scale)) computedScale = scale
  else if (typeof scale === 'number') computedScale = [scale, scale, scale]
  else if (scale && typeof scale === 'object')
    computedScale = [scale.x || 1, scale.y || 1, scale.z || 1]
  else computedScale = [1, 1, 1]

  // create video element & texture if videoSrc provided
  const videoRef = useRef(null)
  const textureRef = useRef(null)

  useEffect(() => {
    if (!videoSrc) return

    const video = document.createElement('video')
    video.src = videoSrc
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = false
    video.playsInline = true
    video.autoplay = false
    video.style.display = 'none'
    document.body.appendChild(video)

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    const tex = new THREE.VideoTexture(video)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.format = THREE.RGBFormat

    videoRef.current = video
    textureRef.current = tex

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      if (videoRef.current) {
        try {
          videoRef.current.pause()
        } catch (e) {}
        if (videoRef.current.parentNode) videoRef.current.parentNode.removeChild(videoRef.current)
        videoRef.current = null
      }
      if (textureRef.current) {
        textureRef.current.dispose()
        textureRef.current = null
      }
    }
  }, [videoSrc])

  const meshRef = useRef()
  const playIconTextureRef = useRef(null)

  useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'rgba(34, 211, 238, 0.9)'
    ctx.beginPath()
    ctx.moveTo(128 + 60, 128)
    ctx.lineTo(128 - 40, 128 - 60)
    ctx.lineTo(128 - 40, 128 + 60)
    ctx.closePath()
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    playIconTextureRef.current = texture
    return texture
  }, [])

  useFrame(() => {
    if (meshRef.current && textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  })

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {})
      }
    }
  }

  return (
    <group position={position} rotation={rotation} scale={computedScale}>
      <primitive object={sceneData.cloned} />
      {videoSrc && sceneData.screenInfo && textureRef.current && (
        <group>
          <mesh
            ref={meshRef}
            position={[
              sceneData.screenInfo.position.x + videoPosition[0],
              sceneData.screenInfo.position.y + videoPosition[1],
              sceneData.screenInfo.position.z + videoPosition[2]
            ]}
            rotation={videoRotation}
            scale={[
              sceneData.screenInfo.size.x * videoScale[0],
              sceneData.screenInfo.size.y * videoScale[1],
              1
            ]}
            onClick={togglePlayPause}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={textureRef.current}
              toneMapped={false}
              side={THREE.FrontSide}
              color={0xffffff}
            />
          </mesh>
          {!isPlaying && (
            <mesh
              position={[
                sceneData.screenInfo.position.x + videoPosition[0],
                sceneData.screenInfo.position.y + videoPosition[1],
                sceneData.screenInfo.position.z + videoPosition[2] + 0.01
              ]}
              rotation={videoRotation}
              scale={[
                sceneData.screenInfo.size.x * videoScale[0] * 0.3,
                sceneData.screenInfo.size.y * videoScale[1] * 0.3,
                1
              ]}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={playIconTextureRef.current}
                transparent
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  )
}

useGLTF.preload(SCREEN_MODEL_PATH)
