"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AuthPromptProps = { onClose: () => void };

export default function AuthPrompt({ onClose }: AuthPromptProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl" />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 text-center px-6 py-5 max-w-[220px]"
      >
        <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-white mb-1">Login required</p>
        <p className="text-xs text-slate-400 mb-4">Sign in to like, rate and track books.</p>
        <div className="flex flex-col gap-2">
          <Link href="/login" className="py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all">
            Log in
          </Link>
          <button onClick={onClose} className="py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Maybe later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
