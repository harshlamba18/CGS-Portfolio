import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Box3, Vector3 } from "three";
import { Text } from "@react-three/drei";
import PC from "./PC.jsx";
import OfficeChair from "./OfficeChair.jsx";
import FloorOverlay from "./FloorOverlay.jsx";
import Wall from "./Wall.jsx";
import MeetingTable from "./MeetingTable.jsx";
import ScreenLED from "./ScreenLED.jsx";
import GlassWall from "./GlassWall.jsx";
import Headphones from "./Headphones.jsx";
import Macbook from "./Macbook.jsx";
import Sofa1 from "./Sofa1.jsx";
import InteractiveMesh from "./InteractiveMesh.jsx";
const ROOM_MODEL_PATH = "/models/empty_room/scene1.gltf";

export default function EmptyRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onFocusSpot,
  ...props
}) {
  const gltf = useGLTF(ROOM_MODEL_PATH);
  const pcGroupRef1 = useRef();
  const pcGroupRef2 = useRef();

  const focusFromPcGroup = (
    groupRef,
    cameraOffset = [0, 1.2, 2.8],
    targetOffset = [0, 0.8, 0],
  ) => {
    if (!onFocusSpot || !groupRef?.current) return;

    const target = groupRef.current.localToWorld(
      new THREE.Vector3(...targetOffset),
    );
    const cameraPos = groupRef.current.localToWorld(
      new THREE.Vector3(...cameraOffset),
    );

    onFocusSpot({
      position: cameraPos.toArray(),
      target: target.toArray(),
    });
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const roomScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    cloned.traverse((node) => {
      if (!node.isMesh) return;

      node.castShadow = true;
      node.receiveShadow = true;

      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];

      materials.forEach((mat) => {
        if (!mat) return;

        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
        mat.needsUpdate = true;
      });
    });

    const bounds = new Box3().setFromObject(cloned);
    const center = new Vector3();
    bounds.getCenter(center);

    cloned.position.x -= center.x;
    cloned.position.y -= bounds.min.y;
    cloned.position.z -= center.z;

    return cloned;
  }, [gltf]);

  return (
    <group position={position} rotation={rotation} scale={scale} {...props}>
      <primitive object={roomScene} />
      <group
        ref={pcGroupRef1}
        name="pcGroup"
        position={[3.5, 0.2, -3]}
        onPointerDown={(e) => {
          e.stopPropagation();
          focusFromPcGroup(pcGroupRef1, [-0.4, 1.3, 0], [0, 1, 0]);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <PC
          position={[0, 0, 0]}
          rotation={[0, (3 * Math.PI) / 2, 0]}
          scale={1.1}
          overlayTexture="/images/games.png"
          overlayPosition={[0.0683, 1.26, 0.019]}
          overlayRotation={[-Math.PI / 26.5, Math.PI, Math.PI]}
          overlayScale={[0.82, 0.46, 1]}
        />
        <InteractiveMesh
          position={[-0.0345, 1.275, 0.08]}
          rotation={[-Math.PI, Math.PI, -Math.PI / 26.5]}
          size={[0.001, 0.05, 0.25]}
          scale={[1.04, 1.04, 1.04]}
          fillOpacity={0}
          showOutline={false}
          glow
          glowOpacity={0}
          hoverGlowOpacity={0.75}
          glowScale={[1.6, 1.6, 1.6]}
          glowColor="#22d3ee"
          onClick={() => {
            openInNewTab("https://achi-wali-website.vercel.app/games");
          }}
        />
        <Text
          position={[0, 1.8, 0]}
          rotation={[0, (3 * Math.PI) / 2, 0]}
          fontSize={0.2}
          maxWidth={2}
          anchorX="center"
          anchorY="middle"
        >
          Games
          <meshStandardMaterial
            attach="material"
            emissive={"#7BFFEE"}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Text>

        <pointLight
          intensity={30}
          distance={8}
          decay={2}
          color={0xffffff}
          position={[0, 2.2, 0]}
        />
        <ambientLight intensity={5} />
      </group>
      <ScreenLED
        position={[0, 1.7, -4.7]}
        rotation={[0, 2 * Math.PI, 0]}
        scale={0.28}
        videoSrc={"/videos/video.mp4"}
        videoPosition={[-0.05, 2.75, 0.05]}
        videoRotation={[0, 0, 0]}
        videoScale={[0.957, 0.9, 0.9]}
      />{" "}
      <group name="chairGroup" position={[2.5, 0.2, -3]}>
        <OfficeChair
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.35}
        />
      </group>
      <group
        ref={pcGroupRef2}
        name="pcGroup"
        position={[3.5, 0.2, 3]}
        onPointerDown={(e) => {
          e.stopPropagation();
          focusFromPcGroup(pcGroupRef2, [-0.4, 1.3, 0], [0, 1, 0]);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <PC
          position={[0, 0, 0]}
          rotation={[0, (3 * Math.PI) / 2, 0]}
          scale={1.1}
          overlayTexture="/images/projects.png"
          overlayPosition={[0.0683, 1.26, 0.019]}
          overlayRotation={[-Math.PI / 26.5, Math.PI, Math.PI]}
          overlayScale={[0.82, 0.46, 1]}
        />
        <InteractiveMesh
          position={[-0.0345, 1.355, 0.085]}
          rotation={[-Math.PI, Math.PI, -Math.PI / 26.5]}
          size={[0.001, 0.05, 0.25]}
          scale={[1.04, 1.04, 1.04]}
          fillOpacity={0}
          showOutline={false}
          glow
          glowOpacity={0}
          hoverGlowOpacity={0.75}
          glowScale={[1.6, 1.6, 1.6]}
          glowColor="#f97316"
          onClick={() => {
            openInNewTab("https://achi-wali-website.vercel.app/projects");
          }}
        />
        <Text
          position={[0, 1.8, 0]}
          rotation={[0, (3 * Math.PI) / 2, 0]}
          fontSize={0.2}
          maxWidth={2}
          anchorX="center"
          anchorY="middle"
        >
          Projects
          <meshStandardMaterial
            attach="material"
            emissive={"#FF6BCB"}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Text>

        <pointLight
          intensity={30}
          distance={8}
          decay={2}
          color={0xffffff}
          position={[0, 2.2, 0]}
        />
        <ambientLight intensity={5} />
      </group>
      <group name="chairGroup" position={[2.5, 0.2, 3]}>
        <OfficeChair
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.35}
        />
      </group>
      <group name="wallGroup" position={[-0.47, 0, 5]}>
        <Wall
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[0.6, 0.41, 0.001]}
        />
      </group>
      <group name="glassWallGroup" position={[1.2, 0.8, 0]}>
        <GlassWall
          position={[0, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[0.005, 0.004, 0.03]}
        />
        <Headphones
          position={[-1, 0.2, 1.5]}
          rotation={[0, Math.PI, 0]}
          scale={2}
        />
        <Macbook
          position={[-1.5, 0.15, -0.5]}
          rotation={[0, (3 * Math.PI) / 2, 0]}
          scale={2}
        />
      </group>
      <group name="wallGroup" position={[-0.3, 0, -4.8]}>
        <Wall
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[0.56, 0.4, 0.1]}
        />
      </group>
      <group name="meetingTableGroup" position={[0, 0, 0]}>
        <MeetingTable
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.1}
        />
      </group>
      <group name="sofaGroup" position={[-1.6, 0, 1.2]}>
        <Sofa1
          position={[-3, 0, 0.8]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.5}
          removeSideTables
          removeFrontTopItems
        />
      </group>
      <group name="sofaGroup" position={[-1.6, 0, 1.2]}>
        <Sofa1
          position={[-3, 0, -3.7]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.5}
          removeSideTables
          removeFrontTopItems
        />
      </group>
      <group name="floorOverlay" position={[-0.3, 0.1, 0]}>
        <FloorOverlay position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.9} />
      </group>
    </group>
  );
}

useGLTF.preload(ROOM_MODEL_PATH);
