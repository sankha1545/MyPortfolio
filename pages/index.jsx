"use client";

import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
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
import SEO from "../components/SEO";
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

function Avatar3D({
  modelPath = "/3Dmodel.glb",
  scale = 1.55,
  position = [0, -0.35, 0],
  rotationSpeed = 0.8,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      try {
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.timeScale = 1.2;
        action.play();
      } catch {}
    });
    return () => {
      Object.values(actions).forEach((action) => {
        try {
          action.stop();
        } catch {}
      });
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/3Dmodel.glb");

/* -------------------------------------------------------------------------- */
/*                                PAGE                                        */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [index, setIndex] = useState(0);
  const controlsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % TITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerOver = useCallback(() => {
    document.body.style.cursor = "grab";
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = "default";
  }, []);

  return (
    <>
      {/* ===================== SEO ===================== */}
      <SEO
        title="Sankha Subhra Das | Full-Stack Developer"
        description="Full-stack developer specializing in React, Next.js, Node.js, Docker, CI/CD, AWS, and production-grade systems."
        url="https://www.sankhasubhradasportfolio.in/"
      />

      {/* ===================== HERO ===================== */}
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

            {/* CTA BUTTONS */}
            <motion.div
              variants={fadeIn("down", 0.4)}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <ProjectsBtn />

              <motion.a
                href="/resume.pdf"
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-3 font-medium text-white transition-colors border rounded-full border-white/20 backdrop-blur-sm hover:bg-white/10"
                aria-label="Download Resume"
              >
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* RIGHT 3D SCENE */}
        <div className="absolute inset-y-0 right-0 w-full xl:w-[55%]">
          <div
            className="absolute inset-0"
            style={{ zIndex: 0, pointerEvents: "none" }}
          >
            <ParticlesContainer />
          </div>

          <div
            className="absolute inset-0"
            style={{ zIndex: 10 }}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <Canvas
              camera={{ position: [0, 0.8, 4.2], fov: 34 }}
              shadows
              dpr={[1, 2]}
              gl={{ antialias: true }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[6, 10, 3]} intensity={1.6} castShadow />
              <spotLight position={[-8, 6, -3]} intensity={0.9} />

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
                  far={3}
                />
              </Suspense>

              <OrbitControls
                ref={controlsRef}
                enableRotate
                enableZoom={false}
                enablePan={false}
                dampingFactor={0.08}
                enableDamping
                rotateSpeed={0.6}
              />
            </Canvas>
          </div>
        </div>
      </section>
    </>
  );
}
