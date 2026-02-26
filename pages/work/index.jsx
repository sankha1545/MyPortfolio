"use client";

import { motion } from "framer-motion";
import Circles from "../../components/Circles";
import Bulb from "../../components/Bulb";
import WorkSlider from "../../components/WorkSlider";
import SEO from "../../components/SEO";

/* ---------------- PROJECT DATA ---------------- */

const featuredProjects = [
  {
    title: "Smart Bookmark",
    subtitle: "Secure Bookmark Management SaaS",
    description:
      "Full-stack bookmark manager with user accounts, tagging, sharing, and a master admin portal.",
    stack: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    status: "Live",
    path: "/work (4).png",
    link: "https://bookmarkclient.vercel.app/",
    github: " https://github.com/sankha1545/Bookmark-fullstack-app",
  },

  {
    title: "Bardhaman BhaktaSanmilani",
    subtitle: "Secure Donation & Temple Management",
    description:
      "Live donation platform with Razorpay payments, webhook verification and analytics.",
    stack: ["Next.js", "PostgreSQL", "JWT", "Razorpay"],
    status: "Live",
    path: "/work (3).png",
    link: "https://bardhaman.bhaktasanmilani.org/",
    github:"https://github.com/bardhamanbhaktasanmilani/Bhaktasanmilani",
  },
     {
  title: "Papery",
  subtitle: "Research Paper Tracking SaaS",
  description:
    "Full-stack SaaS platform for tracking, filtering, and analyzing research papers with authentication and analytics dashboard.",
  stack: ["React", "Node.js", "PostgreSQL", "Prisma"],
  status: "Live",
  path: "/work (8).webp", // replace with your actual image file name
  link: "https://papery-xi.vercel.app/",
  github: "https://github.com/sankha1545/Papery",
},



  {
    title: "MedicoX",
    subtitle: "Full-Stack Healthcare Platform",
    description:
      "Healthcare system with appointments, payments and monitoring.",
    stack: ["React", "Node.js", "MongoDB", "Docker"],
    status: "Live",
    path: "/work (7).png",
    link: "https://medicox123.netlify.app/",
    github : "https://github.com/sankha1545/MEDICO",
  },

  {
    title: "LogScope",
    subtitle: "Real-time Log Observability",
    description:
      "Log ingestion, query engine and analytics dashboard.",
    stack: ["Next.js", "Node", "PostgreSQL"],
    status: "Development",
    path: "/work (5).png",
    link: "http://localhost:5173/dashboard",
    github:  "",
  },
  {
    title: "My Portfolio",
    subtitle: "Personal Portfolio",
    description:
      "Modern animated portfolio built with Next.js and Tailwind.",
    stack: ["Next.js", "Tailwind"],
    status: "Live",
    path: "/work (1).png",
    link: "https://myportfolioxyx.netlify.app/",
    github: "https://github.com/sankha1545/full-stack_developerPortfolio",
  },
];

/* ---------------- ANIMATION ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

/* ---------------- COMPONENT ---------------- */

export default function Work() {
  return (
    <>
      <SEO
        title="Projects — Sankha Subhra Das"
        description="Full-stack projects including LogScope, Smart Bookmark, and MedicoX."
        url="https://www.sankhasubhradasportfolio.in/work"
        image="/og-image.png"
      />

      <section className="relative min-h-screen py-20 overflow-hidden bg-black">

        {/* Background effects */}
        <Circles />
        <Bulb />

        {/* Main Container */}
        <div className="container max-w-6xl px-6 mx-auto">

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-16"
          >

            <h2 className="text-3xl font-bold sm:text-4xl xl:text-5xl">
              My Work<span className="text-accent">.</span>
            </h2>

            <p className="max-w-xl mt-4 text-white/70">
              Production-ready full-stack applications with real-world architecture,
              scalability, and modern UI/UX.
            </p>

          </motion.div>


          {/* Projects Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >

            <h3 className="mb-8 text-2xl font-semibold text-accent">

              Featured Projects

            </h3>


            {/* Slider Wrapper */}
            <div className="relative">

              {/* Slider */}
              <WorkSlider
                projects={featuredProjects}
                showNav={true}
                showTech={true}
              />


              {/* Interaction Hint */}
              <p className="mt-4 text-sm text-center text-white/40">

                ← Swipe or use arrows to view more →

              </p>


            </div>

          </motion.div>

        </div>

      </section>
    </>
  );
}
