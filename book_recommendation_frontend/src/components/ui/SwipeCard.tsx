"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import SaveButton from "./SaveButton";

type SwipeCardProps = {
  book: {
    id: number;
    title: string;
    author: string;
    cover_image?: string;
    genre?: string;
    rating?: number;
    description?: string;
  };
  active: boolean;
  onSwipeSubmit: (direction: "left" | "right") => void;
  onOpenDetails: () => void;
};

export default function SwipeCard({ book, active, onSwipeSubmit, onOpenDetails }: SwipeCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [imageError, setImageError] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  // Rotate card dynamically based on drag X value
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Opacity masks for the "Like" / "Pass" overlays mapping directly to dragged X
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const passOpacity = useTransform(x, [-10, -100], [0, 1]);

  useEffect(() => {
    if (!active) {
      controls.start({ x: 0, scale: 0.95, opacity: 0 });
    } else {
      controls.start({ x: 0, scale: 1, opacity: 1 });
    }
  }, [active, controls]);

  const handleDragEnd = (event: any, info: any) => {
    // If swiped far to the right
    if (info.offset.x > 100) {
      controls.start({ x: 500, transition: { duration: 0.3 } }).then(() => onSwipeSubmit("right"));
    }
    // If swiped far to the left
    else if (info.offset.x < -100) {
      controls.start({ x: -500, transition: { duration: 0.3 } }).then(() => onSwipeSubmit("left"));
    }
    // Didn't swipe far enough, snap back to center
    else {
      controls.start({ x: 0, transition: { type: "spring", bounce: 0.5, duration: 0.4 } });
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // It's a double tap -> Force Right swipe Like
      controls.start({ scale: 1.1, x: 500, transition: { duration: 0.3 } }).then(() => onSwipeSubmit("right"));
    }
    setLastTap(now);
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-4 touch-none"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <motion.div
        drag={active ? "x" : false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, zIndex: active ? 10 : 0 }}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        onClick={handleDoubleTap}
        className="w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden glass shadow-2xl relative cursor-grab active:cursor-grabbing border border-white/10"
      >
        {/* Overlays mapping to Swipes */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 bg-green-500/20 z-20 flex items-center justify-center pointer-events-none">
          <div className="border-4 border-green-500 text-green-500 font-extrabold text-5xl rotate-[-15deg] px-6 py-2 rounded-xl backdrop-blur-sm bg-black/30">
            LIKE
          </div>
        </motion.div>
        
        <motion.div style={{ opacity: passOpacity }} className="absolute inset-0 bg-rose-500/20 z-20 flex items-center justify-center pointer-events-none">
          <div className="border-4 border-rose-500 text-rose-500 font-extrabold text-5xl rotate-[15deg] px-6 py-2 rounded-xl backdrop-blur-sm bg-black/30">
            PASS
          </div>
        </motion.div>

        {/* Cover Graphic */}
        {book.cover_image && !imageError ? (
          <img
            src={book.cover_image}
            alt={book.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-900 via-indigo-900 to-transparent p-6 text-center">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <span className="text-6xl font-black gradient-text">{book.title.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Gradient Fade up for Text */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

        {/* Info Block overlaying cover */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-30 pointer-events-none">
          {book.genre && (
            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-violet-300 bg-violet-500/30 border border-violet-500/40 rounded-full backdrop-blur-md">
              {book.genre}
            </span>
          )}

          <div className="flex justify-between items-start gap-2 mb-1">
            <h2 className="text-3xl font-black text-white leading-tight break-words">
              {book.title}
            </h2>
          </div>
          <p className="text-slate-300 font-medium mb-4 text-lg">by <span className="text-violet-300">{book.author}</span></p>

          <p className="text-slate-400 text-sm line-clamp-2 mb-6 pointer-events-auto cursor-auto">
            {book.description || "A highly recommended discover..."}
          </p>

          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={(e) => { e.stopPropagation(); onOpenDetails(); }}
              className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold backdrop-blur-md transition-all flex justify-center items-center"
            >
              Read Synopsis
            </button>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
              <SaveButton bookId={book.id} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
