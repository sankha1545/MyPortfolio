"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import SEO from "../../components/SEO";

/**
 * Contact.jsx
 * - Sends POST /api/contact (expects Next.js API route)
 * - Honeypot + cooldown to deter bots
 * - Accessible, production-grade contact form
 */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ ok: null, message: "" });
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const startCooldown = (seconds = 30) => {
    setCooldown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const sanitize = (str = "") =>
    String(str).replaceAll("<", "&lt;").replaceAll(">", "&gt;").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ ok: false, message: "Please complete name, email and message." });
      return;
    }

    if (form.website.trim()) {
      setStatus({ ok: false, message: "Unable to send message." });
      return;
    }

    setIsLoading(true);
    setStatus({ ok: null, message: "" });

    try {
      const payload = {
        name: sanitize(form.name),
        email: sanitize(form.email),
        subject: sanitize(form.subject || "New contact message"),
        message: sanitize(form.message),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ ok: true, message: data?.message || "Message sent — thank you!" });
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
        startCooldown(30);
      } else {
        setStatus({ ok: false, message: data?.error || "Failed to send message." });
      }
    } catch (err) {
      console.error("Contact error:", err);
      setStatus({ ok: false, message: "Network error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ===================== SEO ===================== */}
      <SEO
        title="Contact | Sankha Subhra Das"
        description="Get in touch with Sankha Subhra Das for full-stack development roles, freelance projects, or technical collaboration."
        url="https://www.sankhasubhradasportfolio.in/contact"
      />

      <section className="relative min-h-screen bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a] px-6 py-28">
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] -translate-x-1/2 rounded-full bg-accent/20 blur-[160px]" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid items-center max-w-6xl grid-cols-1 gap-20 mx-auto lg:grid-cols-2"
        >
          {/* LEFT TEXT */}
          <motion.div variants={item} className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Let’s build something <span className="text-accent">remarkable</span>
            </h2>
            <p className="max-w-xl mx-auto text-white/70 lg:mx-0">
              Have an idea, project, or opportunity? Drop a message — I usually reply within 24 hours.
            </p>
            <p className="text-sm text-white/60">
              Tip: be concise and include your preferred contact times.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.form
            variants={item}
            onSubmit={handleSubmit}
            className="relative p-8 space-y-6 border rounded-2xl bg-white/5 backdrop-blur-xl border-white/10 md:p-10"
            aria-label="Contact form"
          >
            {/* Honeypot */}
            <label className="sr-only">
              Website
              <input
                name="website"
                value={form.website}
                onChange={onChange}
                autoComplete="off"
                tabIndex={-1}
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <input
                name="name"
                className="input"
                placeholder="Name"
                required
                value={form.name}
                onChange={onChange}
              />
              <input
                name="email"
                type="email"
                className="input"
                placeholder="Email"
                required
                value={form.email}
                onChange={onChange}
              />
            </div>

            <input
              name="subject"
              className="input"
              placeholder="Subject"
              value={form.subject}
              onChange={onChange}
            />

            <textarea
              name="message"
              rows={6}
              className="resize-none textarea"
              placeholder="Your message..."
              required
              value={form.message}
              onChange={onChange}
            />

            {/* Status */}
            {status.ok === true && (
              <div className="p-3 text-sm text-green-300 rounded bg-green-700/20">
                {status.message}
              </div>
            )}
            {status.ok === false && (
              <div className="p-3 text-sm text-red-300 rounded bg-red-700/10">
                {status.message}
              </div>
            )}

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || cooldown > 0}
                type="submit"
                className="flex items-center gap-3 px-6 py-3 font-medium text-black rounded-full bg-accent disabled:opacity-60"
              >
                {isLoading ? "Sending..." : status.ok ? "Message Sent ✔" : "Let’s Talk"}
                <BsArrowRight />
              </motion.button>

              <span className="text-sm text-white/60">
                {cooldown > 0
                  ? `You can send another message in ${cooldown}s`
                  : "I'll usually reply within 24 hours."}
              </span>
            </div>
          </motion.form>
        </motion.div>
      </section>
    </>
  );
}
