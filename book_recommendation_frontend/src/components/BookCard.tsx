"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ui/Toast";
import AuthPrompt from "./ui/AuthPrompt";
import StarRating from "./ui/StarRating";
import { addInteraction } from "@/lib/api";
import RecommendationReason from "./ui/RecommendationReason";

type BookCardProps = {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
  genre?: string;
  reason?: string;
  isAuthenticated?: boolean;
};

export default function BookCard({
  id,
  title,
  author,
  coverImage,
  rating = 4.5,
  genre,
  reason,
  isAuthenticated = false,
}: BookCardProps) {
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const ratingRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ratingRef.current && !ratingRef.current.contains(e.target as Node)) {
        setShowRatingPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const requireAuth = (): boolean => {
    if (!isAuthenticated) { setShowAuthPrompt(true); return false; }
    return true;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!requireAuth()) return;
    try {
      setLoading(true);
      await addInteraction(id, "like");
      setLiked(true);
      showToast(`Added "${title}" to favourites!`, "success");
    } catch { showToast("Couldn't record like.", "error"); }
    finally { setLoading(false); }
  };

  const handleRate = async (value: number) => {
    if (!requireAuth()) return;
    try {
      setLoading(true);
      await addInteraction(id, "rate", value);
      setUserRating(value);
      setShowRatingPicker(false);
      showToast(`Rated "${title}" ${value} stars!`, "success");
    } catch { showToast("Couldn't submit rating.", "error"); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative group flex flex-col rounded-2xl overflow-hidden glass glass-hover cursor-pointer"
      style={{ aspectRatio: "unset" }}
    >
      {/* Auth prompt */}
      {showAuthPrompt && <AuthPrompt onClose={() => setShowAuthPrompt(false)} />}

      {/* Cover */}
      <Link href={`/books/${id}`} className="block relative aspect-[3/4] overflow-hidden bg-white/5">
        {coverImage && !imageError ? (
          <motion.img
            src={coverImage}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-transparent">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <span className="text-4xl font-black gradient-text">{title.charAt(0)}</span>
            </div>
            <p className="text-xs text-slate-500 text-center px-4 line-clamp-2">{title}</p>
          </div>
        )}

        {/* Genre badge */}
        {genre && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 rounded-full backdrop-blur-sm">
              {genre}
            </span>
          </div>
        )}

        {/* Rating badge / picker */}
        <div ref={ratingRef} className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!requireAuth()) return; if (userRating !== null) return; setShowRatingPicker(p => !p); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm border transition-all ${
              userRating !== null
                ? "bg-amber-500/30 border-amber-400/40 text-amber-300"
                : "bg-black/40 border-white/10 text-slate-300 hover:border-violet-400/40"
            }`}
          >
            <span className="text-amber-400">★</span>
            {userRating !== null ? `${userRating}/5` : rating}
          </button>
          <AnimatePresence>
            {showRatingPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 z-30 glass rounded-xl shadow-xl shadow-black/40 px-4 py-3 min-w-max"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rate</p>
                <StarRating onRate={handleRate} disabled={loading} currentRating={userRating} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover overlay with actions */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 w-full">
            <motion.div
              className="flex gap-2"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleLike}
                disabled={loading || (isAuthenticated && liked)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  liked && isAuthenticated
                    ? "bg-rose-500/20 border-rose-500/30 text-rose-300"
                    : "bg-white/10 border-white/20 text-white hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300"
                }`}
              >
                {liked && isAuthenticated ? "♥ Liked" : "♡ Like"}
              </button>
              <div
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-violet-600/80 border border-violet-500/40 text-white text-center hover:bg-violet-500/80 transition-all cursor-pointer"
              >
                Details →
              </div>

            </motion.div>
          </div>
        </motion.div>

        {/* Preview badge */}
        {!isAuthenticated && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-black/50 border border-white/10 rounded-full backdrop-blur-sm">
            Preview
          </div>
        )}
      </Link>

      {/* Card content */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-violet-200 transition-colors" title={title}>
          {title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-1">
          by <span className="text-slate-400">{author}</span>
        </p>
        {reason && <RecommendationReason reason={reason} />}
      </div>
    </motion.div>
  );
}