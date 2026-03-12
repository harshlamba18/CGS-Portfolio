import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import * as THREE from "three";
import EmptyRoom from "./3D/modelJsx/EmptyRoom";
import Loader from "./3D/Loader";

function CameraFocusController({
  transition,
  setTransition,
  controlsRef,
  isUserInteracting,
}) {
  const { camera } = useThree();
  const desiredPositionRef = useRef(new THREE.Vector3());
  const desiredTargetRef = useRef(new THREE.Vector3());
  const effectiveDesiredPositionRef = useRef(new THREE.Vector3());
  const desiredOffsetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!controlsRef.current || !transition) {
      return;
    }

    desiredPositionRef.current.set(...transition.position);
    desiredTargetRef.current.set(...transition.target);

    desiredOffsetRef.current
      .copy(desiredPositionRef.current)
      .sub(desiredTargetRef.current);

    const currentDistance = desiredOffsetRef.current.length();
    const minDistance = controlsRef.current.minDistance ?? 0;
    const maxDistance = controlsRef.current.maxDistance ?? Infinity;
    const clampedDistance = THREE.MathUtils.clamp(
      currentDistance,
      minDistance,
      maxDistance,
    );

    if (currentDistance > 0) {
      desiredOffsetRef.current.setLength(clampedDistance);
    }

    effectiveDesiredPositionRef.current
      .copy(desiredTargetRef.current)
      .add(desiredOffsetRef.current);

    camera.position.lerp(effectiveDesiredPositionRef.current, 0.12);
    controlsRef.current.target.lerp(desiredTargetRef.current, 0.14);
    controlsRef.current.update();

    const cameraClose =
      camera.position.distanceTo(effectiveDesiredPositionRef.current) < 0.08;
    const targetClose =
      controlsRef.current.target.distanceTo(desiredTargetRef.current) < 0.08;

    if (cameraClose && targetClose) {
      camera.position.copy(effectiveDesiredPositionRef.current);
      controlsRef.current.target.copy(desiredTargetRef.current);
      controlsRef.current.update();
      setTransition(null);
    }
  });

  return null;
}

const App = () => {
  const controlsRef = useRef(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [cameraTransition, setCameraTransition] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [showDefaultIntro, setShowDefaultIntro] = useState(false);
  const defaultCameraPosition = [0, 6, 15];
  const defaultCameraTarget = [0, 0, 0];

  const handleFocusSpot = (nextFocus) => {
    setIsUserInteracting(false);
    setCameraTransition({
      position: nextFocus.position,
      target: nextFocus.target,
    });
  };

  const handleResetCamera = () => {
    setIsUserInteracting(false);
    setCameraTransition({
      position: defaultCameraPosition,
      target: defaultCameraTarget,
    });
  };

  return (
    <section style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas
        fallback={<div>Sorry no WebGL supported!</div>}
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true }}
        camera={{ position: [0, 6, 15], fov: 55 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#05070f"]} />
          <fog attach="fog" args={["#05070f", 15, 40]} />
          <Stars
            radius={90}
            depth={40}
            count={6500}
            factor={4}
            saturation={0}
            fade
            speed={0.25}
          />

          <EmptyRoom
            rotation={[0,Math.PI/2,0]}
            position={[0, -3, 0]}
            scale={2}
            onFocusSpot={handleFocusSpot}
          />

          <CameraFocusController
            transition={cameraTransition}
            setTransition={setCameraTransition}
            controlsRef={controlsRef}
            isUserInteracting={isUserInteracting}
          />

          <OrbitControls
            ref={controlsRef}
            minDistance={3}
            maxDistance={9}
            maxPolarAngle={Math.PI / 2.05}
            onStart={() => {
              setIsUserInteracting(true);
            }}
            onEnd={() => {
              setIsUserInteracting(false);
            }}
          />
        </Suspense>
      </Canvas>

      {showLoader && <Loader onFinish={() => setShowLoader(false)} />}

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform:
            showDefaultIntro && !showLoader
              ? "translateX(-50%) perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)"
              : "translateX(-50%) perspective(1200px) rotateX(26deg) rotateY(-7deg) translateY(-14px)",
          opacity: showDefaultIntro && !showLoader ? 1 : 0,
          transition:
            "opacity 420ms ease, transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none",
          zIndex: 25,
          textAlign: "center",
          transformStyle: "preserve-3d",
        }}
      ></div>

      <button
        onClick={handleResetCamera}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 20,
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "10px",
          background: "rgba(16, 24, 40, 0.82)",
          color: "#e2e8f0",
          fontSize: "12px",
          fontWeight: 600,
          padding: "8px 12px",
          cursor: "pointer",
          backdropFilter: "blur(2px)",
          boxShadow: "0 0 14px rgba(56,189,248,0.35)",
        }}
      >
        Reset Camera
      </button>
    </section>
  );
};

export default App;
