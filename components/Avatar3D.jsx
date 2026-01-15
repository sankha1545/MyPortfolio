"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

const Head = () => {
  const mesh = useRef();

  useFrame(({ clock }) => {
    mesh.current.rotation.y = Math.sin(clock.elapsedTime) * 0.15;
    mesh.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });

  return (
    <mesh ref={mesh} castShadow>
      <sphereGeometry args={[1.1, 64, 64]} />
      <meshStandardMaterial
        color="#d1d5db"
        metalness={0.6}
        roughness={0.25}
        emissive="#0ff"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

const Avatar3D = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 4], fov: 40 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.4} />

      {/* Key Light */}
      <directionalLight
        position={[4, 4, 4]}
        intensity={1.5}
        castShadow
      />

      {/* Rim Light */}
      <pointLight position={[-4, 2, -2]} intensity={1.2} color="#00ffff" />

      <Environment preset="city" />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <Head />
      </Float>

      {/* Locked subtle orbit */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default Avatar3D;
