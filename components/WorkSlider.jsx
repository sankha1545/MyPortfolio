// components/WorkSlider.jsx
"use client";

import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * WorkSlider
 *
 * Props:
 *  - projects: Array of project objects:
 *      { title, subtitle?, path, link?, github?, stack?: string[], status?: string }
 *  - itemsPerSlide: number (default 4)
 *  - showNav: boolean (default true)
 *  - showTech: boolean (default true)
 *
 * NOTE: Images must be placed in /public and path should be e.g. "/work (1).png".
 *
 * This version always renders a visible "Code" (GitHub) button — falls back to
 * the main GitHub profile (https://github.com/sankha1545) when the repo URL is not provided.
 */

export default function WorkSlider({
  projects = [],
  itemsPerSlide = 4,
  showNav = true,
  showTech = true,
}) {
  useEffect(() => {
    // debug log for development
    // eslint-disable-next-line no-console
    console.log("WorkSlider projects:", projects);
  }, [projects]);

  const perSlide = Math.max(1, Math.floor(itemsPerSlide));

  const slides = useMemo(() => {
    const out = [];
    for (let i = 0; i < projects.length; i += perSlide) {
      out.push(projects.slice(i, i + perSlide));
    }
    return out.length ? out : [[]];
  }, [projects, perSlide]);

  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 text-center text-white/70">
        No projects to show — add items to the `projects` array.
      </div>
    );
  }

  // fallback GitHub profile (adjust if you want a different fallback)
  const fallbackGithub = "https://github.com/sankha1545";

  // Decide grid columns class from itemsPerSlide (2x2 default, 3x2 for 6)
  const gridColsClass =
    perSlide >= 6 ? "grid-cols-3" : perSlide === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="relative">
      <Swiper
        spaceBetween={14}
        pagination={{ clickable: true }}
        navigation={showNav}
        keyboard={{ enabled: true }}
        modules={[Pagination, Navigation]}
        className="h-[320px] sm:h-[520px]"
      >
        {slides.map((slide, slideIndex) => (
          <SwiperSlide key={slideIndex}>
            <div
              className={`h-full grid gap-4 ${gridColsClass}`}
              style={{ gridAutoRows: "1fr" }}
            >
              {slide.map((proj, projIndex) => {
                if (!proj) {
                  return (
                    <div
                      key={projIndex}
                      className="rounded-lg bg-white/3"
                      aria-hidden
                    />
                  );
                }

                // choose code link (project repo or fallback)
                const codeHref = proj.github && proj.github.trim() !== "" ? proj.github : fallbackGithub;
                const codeTitle = proj.github
                  ? `View repository for ${proj.title}`
                  : `View GitHub profile`;

                return (
                  <article
                    key={projIndex}
                    className="relative flex flex-col h-full overflow-hidden rounded-lg group bg-black/10"
                    aria-labelledby={`proj-title-${slideIndex}-${projIndex}`}
                  >
                    {/* Image */}
                    <div className="relative w-full flex-1 min-h-[120px] sm:min-h-[150px]">
                      <Image
                        src={proj.path || "/placeholder.png"}
                        alt={proj.title || "Project screenshot"}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* gradient overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700 pointer-events-none"
                      aria-hidden
                    />

                    {/* top-left title (desktop only) */}
                    <div className="absolute z-10 flex-col hidden gap-1 left-4 top-4 sm:flex">
                      <h3
                        id={`proj-title-${slideIndex}-${projIndex}`}
                        className="text-sm font-semibold text-white/90"
                      >
                        {proj.title}
                      </h3>
                      {proj.subtitle && (
                        <p className="text-xs text-white/60 max-w-[220px]">{proj.subtitle}</p>
                      )}
                    </div>

                    {/* bottom CTA: Live + Code (always present) */}
                    <div className="absolute z-20 transition-all duration-300 translate-y-full bottom-3 left-4 group-hover:-translate-y-2 group-hover:xl:-translate-y-4">
                      <div className="flex items-center gap-x-3">
                        {/* LIVE button */}
                        <Link
                          href={proj.link || "#"}
                          target={proj.link ? "_blank" : undefined}
                          rel={proj.link ? "noreferrer noopener" : undefined}
                          className="flex items-center gap-x-2 text-[13px] tracking-[0.2em] text-white z-30"
                          title={proj.link ? `Open live site: ${proj.title}` : `No live link provided`}
                        >
                          <span className="text-[11px] opacity-90">LIVE</span>
                          <span className="translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                            PROJECT
                          </span>
                          <span className="text-xl translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                            <BsArrowRight aria-hidden />
                          </span>
                        </Link>

                        {/* CODE button - ALWAYS visible. falls back to profile if proj.github missing */}
                        <Link
                          href={codeHref}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 px-2 py-1 ml-2 text-xs rounded bg-white/6"
                          title={codeTitle}
                          aria-label={codeTitle}
                        >
                          <FaGithub />
                          <span className="hidden sm:inline">Code</span>
                        </Link>
                      </div>
                    </div>

                    {/* status badge */}
                    {proj.status && (
                      <div className="absolute z-20 right-3 top-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-md font-medium ${
                            proj.status === "Live" ? "bg-emerald-600/90 text-white" : "bg-yellow-600/80 text-black"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                    )}

                    {/* tech badges (hover) */}
                    {showTech && proj.stack && proj.stack.length > 0 && (
                      <div className="absolute left-4 bottom-14 z-20 hidden md:flex flex-wrap gap-2 max-w-[70%]">
                        {proj.stack.slice(0, 6).map((t, ti) => (
                          <span key={ti} className="text-[10px] px-2 py-1 rounded bg-white/6 text-white/90">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
