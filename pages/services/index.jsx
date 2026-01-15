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

// --------------------
// SERVICES DATA (RESUME-ALIGNED)
// --------------------
const services = [
  {
    title: "Frontend Engineering",
    description:
      "Design and development of performant, accessible, and animated web interfaces using React, Next.js, Tailwind CSS, and Framer Motion.",
    icon: <FaReact />,
  },
  {
    title: "Full-Stack Development",
    description:
      "End-to-end application development using React, Node.js, Express, and PostgreSQL/MongoDB with clean architecture and scalable APIs.",
    icon: <FaServer />,
  },
  {
    title: "DevOps & Deployment",
    description:
      "Dockerized applications, CI/CD pipelines with GitHub Actions, AWS EC2 deployments, and production-ready Nginx configurations.",
    icon: <FaCloud />,
  },
  {
    title: "Secure Systems",
    description:
      "JWT & OAuth authentication, RBAC, secure cookies, rate-limiting, CSRF-safe APIs, and hardened HTTP security headers.",
    icon: <FaLock />,
  },
  {
    title: "Performance & Reliability",
    description:
      "Optimized bundle sizes, code-splitting, API resilience, caching strategies, and observability with Prometheus & Grafana.",
    icon: <FaRocket />,
  },
  {
    title: "Real-Time & Integrations",
    description:
      "WebSockets, Socket.IO, background workers, payment gateways, and third-party integrations like Twilio and Razorpay.",
    icon: <FaProjectDiagram />,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const Services = () => {
  return (
    <section className="relative w-full px-6 py-24 text-white bg-black xl:px-24">
      <Circles />
      <Bulb />

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-4xl font-bold xl:text-5xl"
        >
          My <span className="text-accent">services</span>
        </motion.h2>

        <p className="max-w-2xl text-white/70">
          I help build reliable, scalable, and production-ready web applications
          — from frontend experiences to backend systems and cloud deployments.
        </p>
      </div>

      {/* SERVICES GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid max-w-6xl gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{
              rotateX: -6,
              rotateY: 6,
              scale: 1.03,
            }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ perspective: 1200 }}
            className="relative p-8 shadow-xl bg-white/5 backdrop-blur-xl rounded-2xl"
          >
            <div className="mb-4 text-3xl text-accent">{service.icon}</div>
            <h3 className="mb-3 text-xl font-semibold">
              {service.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Services;
