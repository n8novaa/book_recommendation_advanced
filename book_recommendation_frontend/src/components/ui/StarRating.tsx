"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type StarRatingProps = {
  onRate: (value: number) => void;
  disabled?: boolean;
  currentRating?: number | null;
};

export default function StarRating({ onRate, disabled = false, currentRating = null }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? currentRating ?? 0;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={disabled || currentRating !== null}
          aria-label={`Rate ${star} stars`}
          onClick={() => onRate(star)}
          onMouseEnter={() => !currentRating && setHovered(star)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          className={`text-xl leading-none focus:outline-none disabled:pointer-events-none transition-colors ${
            star <= display
              ? "text-amber-400"
              : "text-slate-600 hover:text-amber-300"
          }`}
        >
          ★
        </motion.button>
      ))}
      <span className="ml-2 text-xs text-slate-500 min-w-[70px]">
        {currentRating !== null ? `Rated ${currentRating}/5` : hovered ? `${hovered} star${hovered > 1 ? "s" : ""}` : "Rate it"}
      </span>
    </div>
  );
}
