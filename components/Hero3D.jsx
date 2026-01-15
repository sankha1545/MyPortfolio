"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import ParticlesContainer from "./ParticlesContainer";
import ProjectsBtn from "./ProjectsBtn";
import Avatar3D from "./Avatar3D";
import { fadeIn } from "../variants";

const TITLES = [
  { line1: "Building Scalable", highlight: "Web Experiences" },
  { line1: "Designing Reliable", highlight: "Frontend Systems" },
  { line1: "Transforming Ideas", highlight: "Into Production Apps" },
];

const SUBTITLES = [
  "B.Tech (2025) Full-Stack Developer with 1.5+ years building production-grade React & Node.js systems.",
  "Specialized in modern frontend engineering using React, Next.js, Tailwind, and Framer Motion.",
  "Strong real-world experience in Docker, CI/CD, AWS, secure auth, and observability systems.",
];

const Hero3D = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % TITLES.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* LEFT TEXT */}
      <div className="relative z-10 h-full bg-gradient-to-r from-black via-black/40 to-transparent">
        <div className="container flex flex-col justify-center h-full mx-auto text-center xl:text-left xl:pt-40">
          {/* TITLE */}
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

          {/* SUBTITLE */}
          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${index}`}
                variants={fadeIn("down", 0.3)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="max-w-xl mx-auto mb-10 xl:mx-0 xl:mb-16"
              >
                {SUBTITLES[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA */}
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
      <div className="absolute right-0 bottom-0 w-full xl:w-[55%] h-full">
        <ParticlesContainer />

        <motion.div
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          animate="show"
          className="absolute bottom-0 right-0 w-full h-[85%]"
        >
          <Avatar3D />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero3D;
