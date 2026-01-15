"use client";

import { Sora } from "next/font/google";
import Head from "next/head";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect } from "react";

import Header from "../components/Header";
import Nav from "../components/Nav";
import TopLeftImg from "../components/TopLeftImg";

/* ---------- FONT SETUP ---------- */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const Layout = ({ children }) => {
  const { scrollYProgress } = useScroll();

  /* ---------------------------------------------
     Drive CSS variables from scroll (for scrollbar)
  ---------------------------------------------- */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    document.documentElement.style.setProperty(
      "--scroll-progress",
      v.toString()
    );
  });

  return (
    <>
      {/* ---------- METADATA ---------- */}
      <Head>
        <title>Sankha Subhra Das | Portfolio</title>
        <meta
          name="description"
          content="Sankha Subhra Das is a Full-stack web developer with 1.5+ years of hands-on experience."
        />
        <meta name="author" content="Sankha Subhra Das" />
        <meta name="theme-color" content="#000000" />
      </Head>

      {/* ---------- FIXED UI ---------- */}
      <TopLeftImg />
      <Header />
      <Nav />

      {/* ---------- MAIN PAGE FLOW ---------- */}
      <main
        className={`
          ${sora.variable} font-sora
          bg-black text-white
          min-h-screen overflow-x-hidden
          pt-[90px]      /* header space */
          pb-[110px]     /* bottom nav space */
          scrollbar-3d   /* custom class */
        `}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
