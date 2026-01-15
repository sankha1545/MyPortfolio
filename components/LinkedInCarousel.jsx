// components/LinkedInCarousel.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";



function Card({ post, position, rotationY }) {
  // small style for card content inside Html
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* a simple plane placeholder (no need for custom meshes here) */}
      <mesh>
        <planeGeometry args={[2.4, 1.4]} />
        <meshStandardMaterial color="#0b0b0b" transparent opacity={0.9} />
      </mesh>

      {/* Html overlays the DOM on top of the plane */}
      <Html
        position={[0, 0, 0.01]}
        style={{
          width: 480,
          maxWidth: "90vw",
          transform: "translate3d(-50%,-50%,0)",
        }}
      >
        <div className="rounded-lg p-4 bg-[#0b0b0b]/95 border border-white/8 shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white/90">
                {post.authorName || "You"}
              </div>
              <div className="text-xs text-white/60">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
            {post.link ? (
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline text-accent"
              >
                View
              </a>
            ) : null}
          </div>

          <div className="mt-3 text-sm leading-snug text-white/80">
            {post.text.length > 500 ? post.text.slice(0, 500) + "…" : post.text}
          </div>

          {post.media && post.media.length > 0 && (
            <div className="mt-3">
              {/* show first media as small thumbnail */}
              <img
                src={post.media[0]}
                alt="post media"
                className="object-cover w-full rounded-md max-h-36"
              />
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

function CarouselScene({ posts = [], rotationSpeed = 0.25 }) {
  const groupRef = useRef();

  // rotate the whole group slowly
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (rotationSpeed * delta) / 2;
    }
  });

  // place posts in a circle
  const radius = 4;
  const angleStep = (Math.PI * 2) / Math.max(1, posts.length);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <group ref={groupRef}>
        {posts.map((post, i) => {
          const angle = i * angleStep;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const rotationY = -angle + Math.PI / 2;
          return (
            <Card
              key={post.id || i}
              post={post}
              position={[x, 0, z]}
              rotationY={rotationY}
            />
          );
        })}
      </group>
    </>
  );
}

export default function LinkedInCarousel({ posts }) {
  // responsive: on small screens, we skip 3D scene and render simple list
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!posts || posts.length === 0) {
    return (
      <div className="p-6 border rounded-xl border-white/10 bg-white/5">
        <p className="text-sm text-white/60">No LinkedIn posts found.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="grid gap-4">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.link || "#"}
            target="_blank"
            rel="noreferrer"
            className="block p-4 border rounded-xl border-white/10 bg-white/5"
          >
            <div className="text-sm font-medium text-white/90">
              {p.authorName}
            </div>
            <div className="mt-2 text-sm text-white/80">
              {p.text.length > 280 ? p.text.slice(0, 280) + "…" : p.text}
            </div>
            <div className="mt-3 text-xs text-white/60">
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div style={{ height: 520 }}>
      <Canvas camera={{ position: [0, 1.2, 8], fov: 50 }}>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
        <CarouselScene posts={posts} rotationSpeed={0.3} />
      </Canvas>
    </div>
  );
}
