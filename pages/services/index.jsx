"use client";

import { motion } from "framer-motion";
import {
  FaReact,
  FaServer,
  FaCloud,
  FaLock,
  FaRocket,
  FaProjectDiagram,
} from "react-icons/fa";

import Circles from "../../components/Circles";
import Bulb from "../../components/Bulb";
import SEO from "../../components/SEO";

/* -------------------- */
/* SERVICES DATA (RESUME-ALIGNED) */
/* -------------------- */
const services = [
  {
    title: "Frontend Engineering",
    description:
      "Design and development of performant, accessible, and animated web interfaces using React, Next.js, Tailwind CSS, and Framer Motion.",
    icon: <FaReact aria-hidden="true" />,
  },
  {
    title: "Full-Stack Development",
    description:
      "End-to-end application development using React, Node.js, Express, and PostgreSQL/MongoDB with clean architecture and scalable APIs.",
    icon: <FaServer aria-hidden="true" />,
  },
  {
    title: "DevOps & Deployment",
    description:
      "Dockerized applications, CI/CD pipelines with GitHub Actions, AWS EC2 deployments, and production-ready Nginx configurations.",
    icon: <FaCloud aria-hidden="true" />,
  },
  {
    title: "Secure Systems",
    description:
      "JWT & OAuth authentication, RBAC, secure cookies, rate-limiting, CSRF-safe APIs, and hardened HTTP security headers.",
    icon: <FaLock aria-hidden="true" />,
  },
  {
    title: "Performance & Reliability",
    description:
      "Optimized bundle sizes, code-splitting, API resilience, caching strategies, and observability with Prometheus & Grafana.",
    icon: <FaRocket aria-hidden="true" />,
  },
  {
    title: "Real-Time & Integrations",
    description:
      "WebSockets, Socket.IO, background workers, payment gateways, and third-party integrations like Twilio and Razorpay.",
    icon: <FaProjectDiagram aria-hidden="true" />,
  },
];

/* -------------------- */
/* ANIMATION VARIANTS */
/* -------------------- */

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/* -------------------- */
/* COMPONENT */
/* -------------------- */

export default function Services() {
  return (
    <>
      {/* SEO for this page */}
      <SEO
        title="Services | Sankha Subhra Das"
        description="Services offered — Frontend engineering, full-stack development, DevOps & deployment, secure systems, performance & reliability, and real-time integrations."
        url="https://www.sankhasubhradasportfolio.in/services"
      />

      <section className="relative w-full px-6 py-16 text-white bg-black xl:px-24">
        <Circles />
        <Bulb />

        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold sm:text-4xl xl:text-5xl"
          >
            My <span className="text-accent">services</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-sm text-white/70 sm:text-base"
          >
            I help build reliable, scalable, and production-ready web applications — from frontend experiences
            to backend systems and cloud deployments.
          </motion.p>
        </div>

        {/* SERVICES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid max-w-6xl gap-6 mx-auto sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              variants={cardVariants}
              whileHover={{ rotateX: -6, rotateY: 6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{ perspective: 1200 }}
              className="relative p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/8 shadow-lg min-h-[170px] flex flex-col"
              aria-labelledby={`service-title-${i}`}
              role="article"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-none p-3 text-2xl rounded-lg bg-white/3 text-accent"
                  aria-hidden="true"
                >
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id={`service-title-${i}`} className="text-lg font-semibold leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{service.description}</p>
                </div>
              </div>

              {/* footer area: sample small badge or status (keeps layout consistent) */}
              <div className="pt-4 mt-auto">
                <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide rounded-full text-white/75 bg-white/3">
                  Production-ready
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </>
  );
}
