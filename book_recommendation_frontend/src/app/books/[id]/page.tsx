"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBook, addInteraction } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/components/ui/Toast";
import AuthPrompt from "@/components/ui/AuthPrompt";
import StarRating from "@/components/ui/StarRating";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  cover_image?: string;
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

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBook(id);
        setBook(data);
      } catch (err: any) {
        setError(err.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return false;
    }
    return true;
  };

  const handleInteraction = async (type: string, val: number | null = null) => {
    if (!requireAuth()) return;
    try {
      setInteracting(true);
      await addInteraction(id, type, val);
      if (type === "like") {
        setLiked(true);
        showToast(`Added "${book?.title}" to your favourites!`, "success");
      }
    } catch {
      showToast("Couldn't record interaction. Please try again.", "error");
    } finally {
      setInteracting(false);
    }
  };

  const handleRate = async (value: number) => {
    if (!requireAuth()) return;
    try {
      setInteracting(true);
      await addInteraction(id, "rate", value);
      setUserRating(value);
      showToast(`Rated "${book?.title}" ${value} star${value > 1 ? "s" : ""}!`, "success");
    } catch {
      showToast("Couldn't submit rating. Please try again.", "error");
    } finally {
      setInteracting(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-64 flex-shrink-0 aspect-[2/3] bg-slate-200/60 rounded-3xl" />
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-8 bg-slate-200/60 rounded-xl w-3/4" />
            <div className="h-5 bg-slate-200/60 rounded-xl w-1/3" />
            <div className="h-4 bg-slate-200/40 rounded-xl w-1/4 mt-2" />
            <div className="space-y-2 mt-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200/40 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !book) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-rose-50/80 backdrop-blur-md rounded-3xl p-12 border border-rose-200 shadow-sm">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-rose-700 mb-2">Book not found</h2>
          <p className="text-rose-600 text-sm mb-6">{error}</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  /* ── Detail view ── */
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 opacity-0 animate-[fade-in_0.5s_ease-out_forwards]">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Main card */}
      <div className="relative bg-white/50 backdrop-blur-2xl rounded-3xl border border-white shadow-xl shadow-indigo-100/30 ring-1 ring-slate-900/5 overflow-hidden">

        {/* Auth prompt overlay */}
        {showAuthPrompt && (
          <AuthPrompt onClose={() => setShowAuthPrompt(false)} />
        )}

        <div className="flex flex-col md:flex-row gap-0">

          {/* ── Cover Column ── */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="relative aspect-[2/3] md:aspect-auto md:h-full min-h-[280px] bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
              {book.cover_image && !imageError ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  onError={() => setImageError(true)}
                  className="object-cover w-full h-full"
                />
              ) : (
                /* Stylised placeholder with first letters */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                  <div className="w-24 h-24 rounded-2xl bg-indigo-200/60 border border-indigo-300/40 flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-black text-indigo-600 leading-none select-none">
                      {book.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-400 text-center leading-snug line-clamp-3">
                    {book.title}
                  </p>
                </div>
              )}

              {/* Genre ribbon */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full shadow-sm">
                  {book.genre}
                </span>
              </div>
            </div>
          </div>

          {/* ── Info Column ── */}
          <div className="flex-1 p-8 flex flex-col">

            {/* Title + author */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug mb-2">
                {book.title}
              </h1>
              <p className="text-base text-slate-500">
                by{" "}
                <span className="font-semibold text-indigo-600">{book.author}</span>
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 mb-6" />

            {/* Description */}
            <div className="flex-1">
              <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                About this book
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {book.description || "No description available for this book yet."}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 mt-8 mb-6" />

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">

              {/* ── Rating row ── */}
              <div className="w-full">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Rate this book
                </p>
                {isAuthenticated ? (
                  <StarRating
                    onRate={handleRate}
                    disabled={interacting}
                    currentRating={userRating}
                  />
                ) : (
                  <button
                    onClick={() => setShowAuthPrompt(true)}
                    className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
                    title="Login to rate this book"
                  >
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className="text-2xl">★</span>
                    ))}
                    <span className="ml-2 text-xs text-slate-400 font-medium">Login to rate</span>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="w-full border-t border-slate-100" />

              {/* Like button */}
              <button
                disabled={interacting || (isAuthenticated && liked)}
                onClick={() => handleInteraction("like")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none ${
                  liked && isAuthenticated
                    ? "bg-rose-50 border-rose-200 text-rose-600 shadow-inner"
                    : "bg-white/60 border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/50"
                }`}
                title={!isAuthenticated ? "Login to like this book" : liked ? "Liked!" : "Add to favourites"}
              >
                <span className="text-base">{liked && isAuthenticated ? "♥" : "♡"}</span>
                {liked && isAuthenticated ? "Liked" : "Add to Favourites"}
              </button>

              {/* Preview note for unauth users */}
              {!isAuthenticated && (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl font-medium">
                  🔒 Log in to interact with this book
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
