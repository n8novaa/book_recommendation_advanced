"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* Hero content */}
      <div className="text-center max-w-4xl mx-auto space-y-8 z-10">
        {/* Badge */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-violet-300 border border-violet-500/30 bg-violet-500/10 rounded-full backdrop-blur-sm tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Recommendations
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]"
        >
          <span className="text-white">Discover your</span>
          <br />
          <span className="gradient-text">next obsession.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          Personalized book recommendations that learn your taste — powered by hybrid AI across 10,000+ titles.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/register"
            className="group relative px-8 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <span className="relative">Start for free →</span>
          </Link>
          <Link
            href="/explore"
            className="px-8 py-4 text-base font-semibold text-slate-300 rounded-2xl glass glass-hover hover:-translate-y-1 transition-all duration-300 hover:text-white"
          >
            Browse books
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 pt-4"
        >
          {[
            { value: "10K+", label: "Books" },
            { value: "AI", label: "Hybrid Engine" },
            { value: "Free", label: "Always" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative floating cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "15%", left: "5%", delay: 0, size: "w-36 h-48", opacity: "opacity-20" },
          { top: "60%", left: "3%", delay: 1, size: "w-28 h-36", opacity: "opacity-10" },
          { top: "10%", right: "5%", delay: 0.5, size: "w-32 h-44", opacity: "opacity-20" },
          { top: "55%", right: "4%", delay: 1.5, size: "w-40 h-52", opacity: "opacity-10" },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`absolute ${card.size} ${card.opacity} glass rounded-2xl`}
            style={{ top: card.top, left: (card as any).left, right: (card as any).right }}
            animate={{ y: [0, -12, 0], rotate: [0, i % 2 === 0 ? 2 : -2, 0] }}
            transition={{ duration: 5 + i, delay: card.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}