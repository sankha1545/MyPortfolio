"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Avatar from "../../components/Avatar";

import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaDocker,
  FaAws,
  FaNodeJs,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedux,
  SiNginx,
  SiPrometheus,
  SiGrafana,
  SiGithubactions,
} from "react-icons/si";

/* ---------------- SKILLS DATA ---------------- */

const skills = [
  { id: "html", name: "HTML5", Icon: FaHtml5, percent: 92 },
  { id: "css", name: "CSS3", Icon: FaCss3, percent: 88 },
  { id: "js", name: "JavaScript", Icon: FaJs, percent: 90 },
  { id: "ts", name: "TypeScript", Icon: SiTypescript, percent: 86 },
  { id: "react", name: "React", Icon: FaReact, percent: 90 },
  { id: "next", name: "Next.js", Icon: SiNextdotjs, percent: 84 },
  { id: "redux", name: "Redux", Icon: SiRedux, percent: 80 },
  { id: "tailwind", name: "Tailwind", Icon: SiTailwindcss, percent: 87 },
  { id: "node", name: "Node.js", Icon: FaNodeJs, percent: 85 },
  { id: "mongo", name: "MongoDB", Icon: SiMongodb, percent: 78 },
  { id: "pg", name: "PostgreSQL", Icon: SiPostgresql, percent: 77 },
  { id: "mysql", name: "MySQL", Icon: SiMysql, percent: 75 },
  { id: "docker", name: "Docker", Icon: FaDocker, percent: 82 },
  { id: "aws", name: "AWS", Icon: FaAws, percent: 80 },
  { id: "gha", name: "GitHub Actions", Icon: SiGithubactions, percent: 76 },
  { id: "nginx", name: "Nginx", Icon: SiNginx, percent: 70 },
  { id: "prom", name: "Prometheus", Icon: SiPrometheus, percent: 68 },
  { id: "graf", name: "Grafana", Icon: SiGrafana, percent: 69 },
];

/* ---------------- ANIMATION VARIANTS ---------------- */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const card3D = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

/* ---------------- COMPONENT ---------------- */

const About = () => {
  const containerRef = useRef(null);
  const skillRefs = useRef({});
  const [openIndex, setOpenIndex] = useState(null);
  const [popoverPos, setPopoverPos] = useState(null);

  /* ---------- Popover positioning (responsive) ---------- */
  const positionPopover = (index) => {
    const btn = skillRefs.current[index];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const viewportW = window.innerWidth;

    // Mobile: center popover
    if (viewportW < 640) {
      setPopoverPos({
        left: contRect.width / 2 - 120,
        top: btnRect.bottom - contRect.top + 12,
      });
      return;
    }

    const left = Math.min(
      Math.max(btnRect.left - contRect.left + btnRect.width / 2 - 110, 8),
      contRect.width - 220
    );
    const top = btnRect.top - contRect.top - 120;

    setPopoverPos({ left, top });
  };

  const togglePopover = (i) => {
    if (openIndex === i) {
      setOpenIndex(null);
      setPopoverPos(null);
    } else {
      setOpenIndex(i);
      requestAnimationFrame(() => positionPopover(i));
    }
  };

  /* ---------- Close popover ---------- */
  useEffect(() => {
    const close = () => {
      setOpenIndex(null);
      setPopoverPos(null);
    };
    window.addEventListener("resize", close);
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
    return () => {
      window.removeEventListener("resize", close);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen px-4 py-16 text-white bg-black sm:px-8 xl:px-20">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-7xl"
      >
        {/* HEADER */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-2xl font-bold sm:text-3xl xl:text-4xl"
        >
          Full-Stack Engineer focused on
          <span className="text-accent"> reliability & motion</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-3xl mt-4 text-sm leading-relaxed text-white/70 sm:text-base"
        >
          B.Tech (2025) full-stack developer with hands-on experience building
          production-grade systems using React, Node.js, Docker, CI/CD, AWS,
          and observability tooling.
        </motion.p>

        {/* MAIN GRID */}
        <div className="grid gap-12 mt-16 xl:grid-cols-12">
          {/* LEFT */}
          <div className="flex flex-col items-center gap-10 xl:col-span-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="w-full max-w-xs"
            >
              <Avatar />
            </motion.div>

            {/* STATS */}
            <div className="grid w-full grid-cols-3 gap-4">
              {[
                { label: "Years", value: 1.5 },
                { label: "Projects", value: 10 },
                { label: "Tech", value: skills.length },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={card3D}
                  initial="hidden"
                  animate="show"
                  className="p-4 text-center border rounded-xl bg-white/5 border-white/10"
                >
                  <div className="text-2xl font-bold text-accent">
                    <CountUp end={item.value} decimals={item.value % 1 ? 1 : 0} />
                  </div>
                  <p className="mt-1 text-xs uppercase text-white/60">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-8">
            {/* SKILLS GRID */}
            <motion.div variants={container} initial="hidden" animate="show">
              <h4 className="mb-4 text-sm tracking-wide uppercase text-white/60">
                Core Skills
              </h4>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9">
                {skills.map((skill, i) => {
                  const Icon = skill.Icon;
                  return (
                    <motion.button
                      key={skill.id}
                      ref={(el) => (skillRefs.current[i] = el)}
                      variants={fadeUp}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => togglePopover(i)}
                      className="flex items-center justify-center p-3 border rounded-lg bg-white/5 border-white/10"
                    >
                      <Icon className="text-lg text-accent" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* INFO CARDS */}
            <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Experience",
                  text: "Frontend Developer Intern — Alien Brains. Built modular React systems and motion-driven UI.",
                },
                {
                  title: "Projects",
                  text: "MedicoX · SignalHub · BhaktaSanmilani — production platforms with payments, RBAC & real-time systems.",
                },
                {
                  title: "Education",
                  text: "B.Tech Computer Science — UEM Kolkata (2021–2025)",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={card3D}
                  initial="hidden"
                  animate="show"
                  className="p-6 border rounded-2xl bg-white/5 border-white/10"
                >
                  <h5 className="mb-2 text-sm font-semibold text-accent">
                    {card.title}
                  </h5>
                  <p className="text-xs leading-relaxed text-white/70">
                    {card.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SKILL POPOVER */}
        {openIndex !== null && popoverPos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "absolute",
              left: popoverPos.left,
              top: popoverPos.top,
              width: 220,
              zIndex: 50,
            }}
            className="p-4 border rounded-xl bg-black/90 border-white/10"
          >
            <div className="text-sm font-semibold">
              {skills[openIndex].name}
            </div>
            <div className="mt-2 text-sm font-bold text-accent">
              <CountUp end={skills[openIndex].percent} suffix="%" />
            </div>
            <div className="w-full h-2 mt-3 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${skills[openIndex].percent}%`,
                  background:
                    "linear-gradient(90deg,#38bdf8,#7c3aed)",
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;
