"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Avatar from "../../components/Avatar";

import { FaHtml5, FaCss3, FaJs, FaReact, FaDocker, FaAws, FaNodeJs } from "react-icons/fa";
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

/* ---------------- SKILLS (objects with metadata) ---------------- */
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
  { id: "pg", name: "Postgres", Icon: SiPostgresql, percent: 77 },
  { id: "mysql", name: "MySQL", Icon: SiMysql, percent: 75 },
  { id: "docker", name: "Docker", Icon: FaDocker, percent: 82 },
  { id: "aws", name: "AWS", Icon: FaAws, percent: 80 },
  { id: "gha", name: "GitHub Actions", Icon: SiGithubactions, percent: 76 },
  { id: "nginx", name: "Nginx", Icon: SiNginx, percent: 70 },
  { id: "prom", name: "Prometheus", Icon: SiPrometheus, percent: 68 },
  { id: "graf", name: "Grafana", Icon: SiGrafana, percent: 69 },
];

/* ---------------- VARIANTS ---------------- */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const card3D = {
  hidden: { opacity: 0, rotateX: -12, y: 28 },
  show: { opacity: 1, rotateX: 0, y: 0 },
};

/* ---------------- COMPONENT ---------------- */

const About = () => {
  // refs & state for popover positioning (plain JS refs / state)
  const containerRef = useRef(null);
  const skillRefs = useRef({});
  const [openIndex, setOpenIndex] = useState(null);
  const [popoverPos, setPopoverPos] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // compute position of popover based on clicked skill
  const positionPopover = (index) => {
    const btn = skillRefs.current[index];
    const container = containerRef.current;
    if (!btn || !container) return setPopoverPos(null);
    const btnRect = btn.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();

    // Prefer placing above if there's space, else below.
    const spaceAbove = btnRect.top - contRect.top;
    const preferAbove = spaceAbove > 110;
    const left = Math.min(
      Math.max(btnRect.left - contRect.left + btnRect.width / 2 - 110, 8),
      contRect.width - 220
    );
    const top = preferAbove ? btnRect.top - contRect.top - 120 : btnRect.top - contRect.top + btnRect.height + 12;

    setPopoverPos({ left, top });
  };

  // toggle popover
  const onToggle = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
      setPopoverPos(null);
    } else {
      setOpenIndex(index);
      requestAnimationFrame(() => positionPopover(index));
    }
  };

  // close on outside click or Escape
  useEffect(() => {
    function handleDoc(e) {
      const target = e.target;
      if (!containerRef.current) return;
      if (!containerRef.current.contains(target)) {
        setOpenIndex(null);
        setPopoverPos(null);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpenIndex(null);
        setPopoverPos(null);
      }
    }
    document.addEventListener("mousedown", handleDoc);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDoc);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // reposition popover on resize/scroll
  useEffect(() => {
    function onLayout() {
      if (openIndex !== null) positionPopover(openIndex);
    }
    window.addEventListener("resize", onLayout);
    window.addEventListener("scroll", onLayout, true);
    return () => {
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("scroll", onLayout, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  return (
    <section className="relative flex items-center w-full min-h-screen px-6 overflow-visible text-white bg-black xl:px-20">
      {/* subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-8 w-[720px] h-[420px] blur-3xl opacity-20 bg-[radial-gradient(closest-side,rgba(56,189,248,0.18),transparent)]" />
      </div>

      <div ref={containerRef} className="relative w-full mx-auto max-w-7xl" style={{ perspective: 1200 }}>
        {/* header */}
        <motion.h2 variants={fadeUp} initial="hidden" animate="show" className="mb-3 text-3xl font-bold xl:text-4xl">
          Full-Stack Engineer focused on
          <span className="text-accent"> reliability & motion</span>
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl mb-10 text-sm text-white/70 xl:text-base">
          B.Tech (2025) full-stack developer with 1.5+ years of hands on experience building production-grade React & Node.js systems,
          Dockerized deployments, CI/CD pipelines, AWS infrastructure, and observability-first platforms.
        </motion.p>

        {/* main grid */}
        <div className="grid grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="flex flex-col justify-between col-span-12 xl:col-span-4">
            {/* Avatar */}
            <motion.div
              whileHover={{ rotateY: 10, rotateX: -6, scale: 1.04 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="flex justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Avatar />
            </motion.div>

            {/* stats */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: "Years", value: 1.5 },
                { label: "Projects", value: 10 },
                { label: "Tech", value: skills.length },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={card3D}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="p-4 text-center border rounded-xl bg-white/5 backdrop-blur border-white/10"
                >
                  <div className="text-2xl font-bold text-accent">
                    <CountUp end={item.value} decimals={item.value % 1 ? 1 : 0} />
                  </div>
                  <p className="text-xs tracking-wide uppercase text-white/60">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-between col-span-12 xl:col-span-8">
            {/* SKILLS */}
            <motion.div variants={container} initial="hidden" animate="show">
              <h4 className="mb-4 text-sm tracking-wide uppercase text-white/60">Core Skills</h4>

              <div className="grid grid-cols-6 gap-4 sm:grid-cols-9">
                {skills.map((skill, i) => {
                  const Icon = skill.Icon;
                  return (
                    <motion.button
                      key={skill.id}
                      ref={(el) => (skillRefs.current[i] = el)}
                      variants={fadeUp}
                      whileHover={{ rotateY: 12, rotateX: -10, scale: 1.12, boxShadow: "0 6px 28px rgba(56,189,248,0.16)" }}
                      onMouseEnter={() => setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex((prev) => (prev === i ? null : prev))}
                      onClick={() => onToggle(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onToggle(i);
                        }
                      }}
                      aria-expanded={openIndex === i}
                      aria-label={`${skill.name} skill — ${skill.percent}% proficiency`}
                      className="relative flex items-center justify-center p-4 border rounded-lg bg-white/5 backdrop-blur border-white/10 focus:outline-none"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Icon className="text-xl text-accent" />
                      {/* small hover tooltip (quick preview) */}
                      {hoverIndex === i && openIndex !== i && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="absolute px-2 py-1 text-xs transform -translate-x-1/2 border rounded-md pointer-events-none -top-10 left-1/2 whitespace-nowrap bg-black/80 text-white/90 border-white/5"
                        >
                          {skill.name} — {skill.percent}%
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* INFO CARDS */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-3">
              {[
                {
                  title: "Experience",
                  text: "Front-End Developer Intern — Alien Brains. Built modular React systems, motion-driven UI, accessibility-safe components, and resilient APIs.",
                },
                {
                  title: "Projects",
                  text: "MedicoX · SignalHub · BhaktaSanmilani. Production platforms with RBAC, payments, real-time systems, and observability.",
                },
                {
                  title: "Education",
                  text: "B.Tech Computer Science — UEM Kolkata (2021–2025)",
                },
              ].map((card, i) => (
                <motion.div key={i} variants={card3D} whileHover={{ y: -10, rotateX: 6 }} className="p-6 border rounded-2xl bg-white/5 backdrop-blur border-white/10">
                  <h5 className="mb-2 text-sm font-semibold text-accent">{card.title}</h5>
                  <p className="text-xs leading-relaxed text-white/70">{card.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* POPUP: persistent when clicking a skill */}
        {openIndex !== null && popoverPos && (
          <motion.div
            role="dialog"
            aria-modal="false"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              position: "absolute",
              left: popoverPos.left,
              top: popoverPos.top,
              width: 220,
              zIndex: 60,
            }}
            className="p-4 border shadow-2xl rounded-xl bg-gradient-to-br from-black/90 to-white/5 border-white/10"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {/* large icon */}
                {(() => {
                  const Icon = skills[openIndex].Icon;
                  return <Icon className="text-2xl text-accent" />;
                })()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{skills[openIndex].name}</div>
                  <div className="text-xs text-white/60">Proficiency</div>
                </div>

                {/* animated percentage */}
                <div className="mt-2 text-sm font-bold">
                  <CountUp end={skills[openIndex].percent} duration={1.2} suffix="%" />
                </div>

                {/* progress bar */}
                <div className="w-full h-2 mt-3 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skills[openIndex].percent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#38bdf8,#7c3aed)",
                      boxShadow: "0 6px 18px rgba(56,189,248,0.16)",
                    }}
                  />
                </div>

                {/* short description (optional) */}
                <div className="mt-2 text-xs text-white/60">
                  {skills[openIndex].name} — comfortable building production features, components, and integrations.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;
