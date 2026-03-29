"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBook, addInteraction } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/components/ui/Toast";
import AuthPrompt from "@/components/ui/AuthPrompt";
import StarRating from "@/components/ui/StarRating";

type Book = {
  id: number; title: string; author: string;
  genre: string; description: string; cover_image?: string;
};

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [interacting, setInteracting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [imageError, setImageError] = useState(false);
  const clickRecorded = useRef(false);

  useEffect(() => {
    getBook(id).then(setBook).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id && !clickRecorded.current) {
      clickRecorded.current = true;
      addInteraction(id, "click").catch(() => {});
    }
  }, [isAuthenticated, id]);

  const requireAuth = () => { if (!isAuthenticated) { setShowAuthPrompt(true); return false; } return true; };

  const handleInteraction = async (type: string, val?: number) => {
    if (!requireAuth()) return;
    try {
      setInteracting(true);
      await addInteraction(id, type, val ?? null);
      if (type === "like") { setLiked(true); showToast(`Added "${book?.title}" to favourites!`, "success"); }
    } catch { showToast("Couldn't record interaction.", "error"); }
    finally { setInteracting(false); }
  };

  const handleRate = async (value: number) => {
    if (!requireAuth()) return;
    try {
      setInteracting(true);
      await addInteraction(id, "rate", value);
      setUserRating(value);
      showToast(`Rated "${book?.title}" ${value} stars!`, "success");
    } catch { showToast("Couldn't submit rating.", "error"); }
    finally { setInteracting(false); }
  };

  if (loading) return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 aspect-[3/4] bg-white/5 rounded-3xl flex-shrink-0" />
        <div className="flex-1 space-y-4 pt-4">
          <div className="h-8 bg-white/5 rounded-xl w-3/4" />
          <div className="h-5 bg-white/5 rounded-xl w-1/3" />
          <div className="space-y-2 mt-8">{[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded-xl" />)}</div>
        </div>
      </div>
    </div>
  );

  if (error || !book) return (
    <div className="mx-auto max-w-5xl px-4 py-20 text-center">
      <div className="glass rounded-3xl p-12 border border-rose-500/20">
        <p className="text-4xl mb-4">📕</p>
        <h2 className="text-xl font-bold text-rose-400 mb-2">Book not found</h2>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <Link href="/explore" className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all">
          ← Back to Explore
        </Link>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Back */}
      <button onClick={() => router.back()}
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-400 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="relative glass rounded-3xl border border-white/10 overflow-hidden">
        {showAuthPrompt && <AuthPrompt onClose={() => setShowAuthPrompt(false)} />}

        <div className="flex flex-col md:flex-row">
          {/* Cover */}
          <div className="relative w-full md:w-72 flex-shrink-0 min-h-[320px] bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-transparent">
            {book.cover_image && !imageError ? (
              <img src={book.cover_image} alt={book.title} onError={() => setImageError(true)} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
                <div className="w-28 h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                  <span className="text-5xl font-black gradient-text">{book.title.charAt(0)}</span>
                </div>
                <p className="text-xs text-slate-500 text-center line-clamp-2">{book.title}</p>
              </div>
            )}
            {book.genre && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 rounded-full backdrop-blur-sm">
                  {book.genre}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-8 flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2"
            >
              {book.title}
            </motion.h1>
            <p className="text-slate-400 mb-6">by <span className="text-violet-400 font-semibold">{book.author}</span></p>

            <div className="border-t border-white/5 mb-6" />

            <div className="flex-1 mb-6">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-3">About</p>
              <p className="text-slate-400 leading-relaxed text-sm">
                {book.description || "No description available for this book yet."}
              </p>
            </div>

            <div className="border-t border-white/5 mb-6" />

            {/* Rating */}
            <div className="mb-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-3">Rate this book</p>
              {isAuthenticated ? (
                <StarRating onRate={handleRate} disabled={interacting} currentRating={userRating} />
              ) : (
                <button onClick={() => setShowAuthPrompt(true)} className="flex items-center gap-1 text-slate-600 hover:text-amber-400 transition-colors">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-xl">★</span>)}
                  <span className="ml-2 text-xs text-slate-500">Login to rate</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={interacting || (isAuthenticated && liked)}
                onClick={() => handleInteraction("like")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  liked && isAuthenticated
                    ? "bg-rose-500/20 border-rose-500/30 text-rose-300"
                    : "glass glass-hover text-slate-300 hover:text-rose-300 hover:border-rose-500/30"
                }`}
              >
                <span>{liked && isAuthenticated ? "♥" : "♡"}</span>
                {liked && isAuthenticated ? "Liked" : "Add to Favourites"}
              </motion.button>

              {!isAuthenticated && (
                <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                  🔒 Login to interact
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
