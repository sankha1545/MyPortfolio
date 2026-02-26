// components/WorkSlider.jsx
"use client";

import React, { useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { BsArrowRight } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Pagination, Navigation, Keyboard } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function WorkSlider({
  projects = [],
  itemsPerSlide = 4,
  showNav = true,
  showTech = true,
}) {

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    console.log("WorkSlider projects:", projects);
  }, [projects]);

  const perSlide = Math.max(1, Math.floor(itemsPerSlide));

  const slides = useMemo(() => {

    const output = [];

    for (let i = 0; i < projects.length; i += perSlide) {
      output.push(projects.slice(i, i + perSlide));
    }

    return output.length ? output : [[]];

  }, [projects, perSlide]);



  if (!projects || projects.length === 0) {

    return (
      <div className="py-12 text-center text-white/70">
        No projects to show — add items to projects array.
      </div>
    );

  }



  const fallbackGithub = "https://github.com/sankha1545";



  const gridColsClass =
    perSlide >= 6
      ? "grid-cols-3"
      : perSlide === 3
      ? "grid-cols-3"
      : "grid-cols-2";



  return (

    <div className="relative max-w-6xl px-8 mx-auto">

      {/* LEFT ARROW */}
      {showNav && (

        <button
          ref={prevRef}
          aria-label="Previous"
          className="absolute z-50 text-white transition -translate-y-1/2 left-[-40px] top-1/2 hover:scale-110"
        >
          <FiChevronLeft size={36} />
        </button>

      )}



      {/* RIGHT ARROW */}
      {showNav && (

        <button
          ref={nextRef}
          aria-label="Next"
          className="absolute z-50 text-white transition -translate-y-1/2 right-[-40px] top-1/2 hover:scale-110"
        >
          <FiChevronRight size={36} />
        </button>

      )}



      <Swiper

        spaceBetween={14}

        pagination={{
          clickable: true,
        }}

        keyboard={{
          enabled: true,
        }}

        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}

        onInit={(swiper) => {

          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;

          swiper.navigation.init();
          swiper.navigation.update();

        }}

        modules={[Pagination, Navigation, Keyboard]}

        className="h-[320px] sm:h-[520px]"

        style={{
          "--swiper-navigation-color": "#ffffff",
          "--swiper-pagination-color": "#ffffff",
        }}

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
                    />
                  );

                }



                const codeHref =
                  proj.github && proj.github.trim() !== ""
                    ? proj.github
                    : fallbackGithub;



                return (

                  <article
                    key={projIndex}
                    className="relative flex flex-col h-full overflow-hidden rounded-lg group bg-black/10"
                  >



                    {/* IMAGE */}
                    <div className="relative flex-1 w-full min-h-[120px] sm:min-h-[150px]">

                      <Image
                        src={proj.path || "/placeholder.png"}
                        alt={proj.title}
                        fill
                        sizes="(max-width:640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                    </div>



                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 transition-all duration-700 opacity-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] group-hover:opacity-80" />



                    {/* TITLE */}
                    <div className="absolute z-10 flex-col hidden gap-1 left-4 top-4 sm:flex">

                      <h3 className="text-sm font-semibold text-white">

                        {proj.title}

                      </h3>



                      {proj.subtitle && (

                        <p className="text-xs text-white/70">

                          {proj.subtitle}

                        </p>

                      )}

                    </div>



                    {/* BUTTONS */}
                    <div className="absolute z-20 flex items-center gap-x-3 bottom-4 left-4">

                      <Link
                        href={proj.link || "#"}
                        target="_blank"
                        className="flex items-center text-white gap-x-2"
                      >
                        LIVE
                        <BsArrowRight />
                      </Link>



                      <Link
                        href={codeHref}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-2 py-1 ml-2 text-xs text-white rounded bg-white/10"
                      >
                        <FaGithub />
                        Code
                      </Link>

                    </div>



                    {/* STATUS BADGE */}
                    {proj.status && (

                      <div className="absolute z-20 right-3 top-3">

                        <span className="px-2 py-1 text-xs text-white rounded bg-emerald-600">

                          {proj.status}

                        </span>

                      </div>

                    )}



                    {/* TECH STACK */}
                    {showTech && proj.stack && proj.stack.length > 0 && (

                      <div className="absolute z-20 flex-wrap hidden gap-2 left-4 bottom-14 md:flex">

                        {proj.stack.slice(0, 6).map((tech, index) => (

                          <span
                            key={index}
                            className="px-2 py-1 text-xs text-white rounded bg-white/10"
                          >
                            {tech}
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