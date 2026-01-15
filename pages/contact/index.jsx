"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";

/**
 * Contact.jsx
 * - Sends POST /api/contact (expects Next.js API route)
 * - Uses a hidden honeypot field to deter bots
 * - Basic client validation + accessible labels
 * - Shows success / error / cooldown UI
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
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
  const [status, setStatus] = useState({ ok: null, message: "" }); // ok: null | true | false
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  // Controlled fields (easier to validate/show previews)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot (should remain empty)
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
    String(str)
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ ok: false, message: "Please complete name, email and message." });
      return;
    }
    // honeypot check
    if (form.website && form.website.trim().length > 0) {
      // Looks like a bot — silently drop or show a generic error
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
        startCooldown(30); // 30s client cooldown to reduce accidental repeats
      } else {
        setStatus({
          ok: false,
          message: data?.error || "Failed to send message. Try again later.",
        });
      }
    } catch (err) {
      console.error("Contact error:", err);
      setStatus({ ok: false, message: "Network error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a] px-6 py-28">
      {/* ambient glow */}
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

          {/* small help text */}
          <p className="text-sm text-white/60">
            Tip: be concise and include your preferred contact times. Attachments can be requested after initial contact.
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          name="contact"
          className="
            relative rounded-2xl border border-white/10
            bg-white/5 backdrop-blur-xl
            shadow-[0_40px_120px_rgba(0,0,0,0.6)]
            p-8 md:p-10 space-y-6
          "
          aria-label="Contact form"
        >
          {/* HONEYPOT - keep hidden from humans but visible to bots */}
          <label style={{ display: "none" }}>
            If you are human, leave this field blank:
            <input
              name="website"
              value={form.website}
              onChange={onChange}
              autoComplete="off"
              tabIndex={-1}
              className="sr-only"
            />
          </label>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="w-full input"
                placeholder="Name"
                required
                value={form.name}
                onChange={onChange}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full input"
                placeholder="Email"
                required
                value={form.email}
                onChange={onChange}
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="sr-only">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              className="w-full input"
              placeholder="Subject"
              value={form.subject}
              onChange={onChange}
            />
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full resize-none textarea"
              rows={6}
              placeholder="Your message..."
              required
              value={form.message}
              onChange={onChange}
            />
          </div>

          {/* status messages */}
          {status.ok === true && (
            <div role="status" className="p-3 text-sm text-green-300 rounded bg-green-700/20">
              {status.message}
            </div>
          )}
          {status.ok === false && (
            <div role="alert" className="p-3 text-sm text-red-300 rounded bg-red-700/10">
              {status.message}
            </div>
          )}

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || cooldown > 0}
              type="submit"
              className="flex items-center justify-center gap-3 px-6 py-3 font-medium text-black rounded-full shadow-lg bg-accent disabled:opacity-60"
            >
              {isLoading ? "Sending..." : status.ok ? "Message Sent ✔" : "Let’s Talk"}
              <BsArrowRight className="transition-transform group-hover:translate-x-1" />
            </motion.button>

            {/* optional cooldown / retry info */}
            {cooldown > 0 ? (
              <span className="text-sm text-white/60">You can send another message in {cooldown}s</span>
            ) : (
              <span className="text-sm text-white/50">I'll usually reply within 24 hours.</span>
            )}
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
