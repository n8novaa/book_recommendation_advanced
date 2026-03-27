"use client";

import { useEffect, useState } from "react";

export default function LiquidBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        // Track Exact Coordinates for the fluid orb
        setMousePos({ x: e.clientX, y: e.clientY });

        // Calculate normalized position for the subtle background shift (-0.5 to 0.5)
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        setParallax({ x: -px * 40, y: -py * 40 });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none bg-slate-50">
      {/* 1. Underlying Abstract Image with subtle flowing parallax */}
      <div
        className="absolute inset-0 h-[110vh] w-[110vw] -m-[5vh] bg-cover bg-center transition-transform duration-700 ease-out"
        style={{
          backgroundImage: "url('/background.png')",
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
        }}
      />

      {/* 2. Intense interactive liquid light that follows the exact cursor point */}
      {isClient && (
        <div
          className="absolute w-[500px] h-[500px] bg-white/70 rounded-full blur-[80px] transition-transform duration-200 ease-out will-change-transform mix-blend-overlay"
          style={{
            transform: `translate3d(${mousePos.x - 250}px, ${mousePos.y - 250}px, 0)`,
          }}
        />
      )}

      {/* 3. Reduced Blur Glass Layer (much clearer than before) */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/10 to-teal-50/10 mix-blend-multiply" />
    </div>
  );
}
