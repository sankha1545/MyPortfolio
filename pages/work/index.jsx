"use client";

import { motion } from "framer-motion";
import Circles from "../../components/Circles";
import Bulb from "../../components/Bulb";
import WorkSlider from "../../components/WorkSlider";

/* ---------------- PROJECT DATA ---------------- */

// Resume-aligned (featured)
const featuredProjects = [
  {
    title: "MedicoX",
    subtitle: "Full-Stack Healthcare Platform",
    description:
      "Production-grade healthcare system with appointments, EHR uploads, payments, RBAC security, real-time booking, and full observability using Prometheus & Grafana.",
    stack: ["React", "Node.js", "MongoDB", "Docker", "AWS", "Socket.IO"],
    status: "Live",
    priority: "featured",
  },
  {
    title: "SignalHub",
    subtitle: "Unified Multi-Channel Outreach",
    description:
      "Unified inbox aggregating SMS, WhatsApp, Email, and Web chat into per-contact threads with scheduling, team collaboration, and analytics.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Twilio"],
    status: "In Progress",
    priority: "featured",
  },
  {
    title: "Bardhaman BhaktaSanmilani",
    subtitle: "Secure Donation & Temple Management",
    description:
      "Live donation platform with Razorpay payments, webhook verification, automated receipts, admin analytics, and hardened security.",
    stack: ["Next.js", "PostgreSQL", "JWT", "Razorpay"],
    status: "Live",
    priority: "featured",
  },
];

// Static / supporting projects
const staticProjects = [
  {
    title: "3D Portfolio Website",
    subtitle: "Creative Frontend",
    description:
      "Interactive 3D portfolio with Framer Motion animations, Three.js elements, and responsive design.",
    stack: ["React", "Three.js", "Framer Motion"],
    priority: "static",
  },
  {
    title: "Real-Time Chat App",
    subtitle: "Socket-based Messaging",
    description:
      "WebSocket-powered real-time chat application with authentication and message persistence.",
    stack: ["React", "Node.js", "Socket.IO"],
    priority: "static",
  },
  {
    title: "CI/CD Pipeline Demo",
    subtitle: "DevOps Project",
    description:
      "Dockerized app with GitHub Actions CI pipeline and AWS EC2 deployment.",
    stack: ["Docker", "GitHub Actions", "AWS"],
    priority: "static",
  },
];

/* ---------------- ANIMATION VARIANTS ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ---------------- COMPONENT ---------------- */

export default function Work() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black py-28">
      <Circles />
      <Bulb />

      <div className="container px-6 mx-auto">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-xl mb-20"
        >
          <h2 className="text-4xl font-bold xl:text-5xl">
            My Work<span className="text-accent">.</span>
          </h2>
          <p className="mt-6 text-white/70">
            A selection of production-ready projects aligned with my professional
            experience, along with exploratory and creative builds.
          </p>
        </motion.div>

        {/* FEATURED PROJECTS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-28"
        >
          <h3 className="mb-8 text-2xl font-semibold text-accent">
            Featured Projects
          </h3>

          <WorkSlider projects={featuredProjects} />
        </motion.div>

        {/* STATIC PROJECTS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h3 className="mb-10 text-2xl font-semibold">
            Other Projects
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staticProjects.map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="p-6 border rounded-xl border-white/10 bg-white/5 backdrop-blur"
              >
                <h4 className="mb-2 text-lg font-semibold">
                  {project.title}
                </h4>
                <p className="mb-4 text-sm text-white/60">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-accent">
                  {project.stack.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
