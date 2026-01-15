"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Html,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";

import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import { fadeIn } from "../variants";

/* -------------------------------------------------------------------------- */
/*                               HERO CONTENT                                 */
/* -------------------------------------------------------------------------- */

const TITLES = [
  { line1: "Building Scalable", highlight: "Web Experiences" },
  { line1: "Designing Reliable", highlight: "Frontend Systems" },
  { line1: "Transforming Ideas", highlight: "Into Production Apps" },
];

const SUBTITLES = [
  "B.Tech (2025) Full-Stack Developer with 1.5+ years of hands-on experience building production-grade React and Node.js applications, focused on performance, accessibility, and clean architecture.",
  "Experienced in modern frontend engineering with React, Next.js, Tailwind, and Framer Motion, delivering responsive, animated, and accessible user interfaces.",
  "Strong background in real-world systems — Dockerized deployments, CI/CD automation, AWS infrastructure, secure authentication, and observability using Prometheus and Grafana.",
];

/* -------------------------------------------------------------------------- */
/*                                3D AVATAR                                   */
/* -------------------------------------------------------------------------- */

function Avatar3D() {
  const group = useRef(null);
  const { scene, animations } = useGLTF("/3Dmodel.glb");
  const { actions } = useAnimations(animations, group);

  // Play embedded GLB animations ONLY (no artificial motion)
  useEffect(() => {
    if (!actions) return;

    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset();
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
    });

    return () => {
      Object.values(actions).forEach((action) => {
        if (action) action.stop();
      });
    };
  }, [actions]);

  return (
    <group ref={group} position={[0, -0.3, 0]} scale={1.6} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                PAGE                                        */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % TITLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* LEFT CONTENT */}
      <div className="relative z-20 h-screen bg-gradient-to-r from-black via-black/40 to-black/10">
        <div className="container flex flex-col justify-center h-screen px-6 mx-auto text-center xl:text-left">
          <div className="min-h-[140px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                variants={fadeIn("down", 0.2)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="h1"
              >
                {TITLES[index].line1}
                <br />
                <span className="text-accent">
                  {TITLES[index].highlight}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                variants={fadeIn("down", 0.3)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="max-w-sm mx-auto text-gray-300 xl:mx-0"
              >
                {SUBTITLES[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            variants={fadeIn("down", 0.4)}
            initial="hidden"
            animate="show"
            className="flex justify-center xl:justify-start"
          >
            <ProjectsBtn />
          </motion.div>
        </div>
      </div>

      {/* RIGHT 3D SCENE */}
      <div className="absolute inset-y-0 right-0 w-full xl:w-[55%]">
        {/* 1) Particles layer: underneath canvas, non-interactive */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 0, pointerEvents: "none" }}
          aria-hidden="true"
        >
          <ParticlesContainer />
        </div>

        {/* 2) Canvas wrapper: above particles, receives pointer events */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 10, pointerEvents: "auto" }}
        >
          <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0.6, 4.5], fov: 36 }}
            shadows
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              // ensure canvas accepts pointer gestures for OrbitControls
              try {
                gl.domElement.style.touchAction = "none"; // prevents page scroll on touch drag
                // DEBUG: uncomment to verify pointer events reach the canvas
                // gl.domElement.addEventListener("pointerdown", () => console.log("canvas pointerdown"));
              } catch (e) {}
            }}
            gl={{ antialias: true }}
          >
            {/* LIGHTING */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 8, 2]}
              intensity={1.3}
              castShadow
            />
            <spotLight position={[-6, 4, -2]} intensity={0.9} />

            <Environment preset="studio" />

            <Suspense
              fallback={
                <Html center>
                  <div className="text-white">Loading avatar…</div>
                </Html>
              }
            >
              <Avatar3D />
              <ContactShadows
                position={[0, -1.6, 0]}
                opacity={0.6}
                blur={2}
              />
            </Suspense>

            <OrbitControls
              enableRotate
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              rotateSpeed={0.9}
              minPolarAngle={Math.PI / 2.8}
              maxPolarAngle={Math.PI / 1.6}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
