"use client";

import { useState } from "react";

type StarRatingProps = {
  /** Called with the chosen value (1–5) when user clicks a star */
  onRate: (value: number) => void;
  /** Disable all interaction (e.g. while submitting) */
  disabled?: boolean;
  /** Show as already rated at this value */
  currentRating?: number | null;
};

/**
 * StarRating — an interactive 1-to-5 star picker.
 * - Hover previews the score before committing
 * - Click sends the value via onRate()
 * - Once rated, shows the saved score in amber
 */
export default function StarRating({
  onRate,
  disabled = false,
  currentRating = null,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? currentRating ?? 0;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
      role="group"
      aria-label="Rate this book"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled || currentRating !== null}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => !currentRating && setHovered(star)}
          className={`
            text-2xl transition-all duration-150 leading-none
            focus:outline-none disabled:pointer-events-none
            ${
              star <= display
                ? currentRating !== null
                  ? "text-amber-400 scale-110"   // locked-in rated state
                  : "text-amber-400 scale-125"   // hover / selection state
                : "text-slate-300 hover:text-amber-300"
            }
          `}
        >
          ★
        </button>
      ))}

      {/* Label to the right */}
      <span className="ml-2 text-sm font-medium text-slate-500 min-w-[80px]">
        {currentRating !== null
          ? `Rated ${currentRating}/5`
          : hovered
          ? `${hovered} star${hovered > 1 ? "s" : ""}`
          : "Rate it"}
      </span>
    </div>
  );
}
