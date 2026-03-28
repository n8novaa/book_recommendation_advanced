"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type AuthPromptProps = {
  onClose: () => void;
};

/**
 * AuthPrompt — a small floating card shown when an unauthenticated user
 * tries to interact with a book (like, rate, etc.).
 * Closes when clicking outside or pressing Escape.
 */
export default function AuthPrompt({ onClose }: AuthPromptProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl"
      role="dialog"
      aria-modal="true"
      aria-label="Login required"
    >
      {/* Frosted backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl" />

      {/* Card */}
      <div className="relative z-10 text-center px-6 py-5 max-w-[220px]">
        {/* Lock icon */}
        <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shadow-sm">
          <svg
            className="w-6 h-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <p className="text-sm font-semibold text-slate-800 leading-snug mb-1">
          Login required
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Sign in to like, rate, and track books.
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="block w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Log in
          </Link>
          <button
            onClick={onClose}
            className="block w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
