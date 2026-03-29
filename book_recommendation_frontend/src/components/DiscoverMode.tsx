"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import StarRating from "./ui/StarRating";
import AuthPrompt from "./ui/AuthPrompt";
import { useToast } from "./ui/Toast";
import { addInteraction } from "@/lib/api";

type Book = {
  id: number;
  title: string;
  author: string;
  genre?: string;
  cover_image?: string;
  description?: string;
};

type DiscoverModeProps = {
  books: Book[];
  isAuthenticated: boolean;
};

type BookState = {
  liked: boolean;
  userRating: number | null;
  imageError: boolean;
};

export default function DiscoverMode({ books, isAuthenticated }: DiscoverModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [interacting, setInteracting] = useState(false);
  // Per-book interaction state so likes/ratings persist as you scroll
  const [bookStates, setBookStates] = useState<Record<number, BookState>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { showToast } = useToast();

  const getBookState = (id: number): BookState =>
    bookStates[id] ?? { liked: false, userRating: null, imageError: false };

  const setBookState = (id: number, patch: Partial<BookState>) =>
    setBookStates((prev) => ({
      ...prev,
      [id]: { ...getBookState(id), ...patch },
    }));

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(books.length - 1, index));
      setCurrentIndex(clamped);
      slideRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [books.length]
  );

  // Keyboard: ↑ / ↓ / ← / →
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, goTo]);

  // Track which slide is in view via IntersectionObserver (for scroll-snap)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrentIndex(i);
        },
        { root: containerRef.current, threshold: 0.6 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [books]);

  // ── Auth guard ───────────────────────────────────────────────────────────────

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return false;
    }
    return true;
  };

  // ── Interactions ─────────────────────────────────────────────────────────────

  const handleLike = async (book: Book) => {
    if (!requireAuth()) return;
    if (getBookState(book.id).liked) return;
    try {
      setInteracting(true);
      await addInteraction(book.id, "like");
      setBookState(book.id, { liked: true });
      showToast(`Added "${book.title}" to your favourites!`, "success");
    } catch {
      showToast("Couldn't record like. Please try again.", "error");
    } finally {
      setInteracting(false);
    }
  };

  const handleRate = async (book: Book, value: number) => {
    if (!requireAuth()) return;
    try {
      setInteracting(true);
      await addInteraction(book.id, "rate", value);
      setBookState(book.id, { userRating: value });
      showToast(`Rated "${book.title}" ${value} star${value > 1 ? "s" : ""}!`, "success");
    } catch {
      showToast("Couldn't submit rating. Please try again.", "error");
    } finally {
      setInteracting(false);
    }
  };

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400 text-lg font-medium">
        No books to discover.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Auth prompt (global within discover mode) */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <AuthPrompt onClose={() => setShowAuthPrompt(false)} />
          </div>
        </div>
      )}

      {/* ── Progress indicator ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <span className="text-sm font-semibold text-slate-400">
          <span className="text-violet-400">{currentIndex + 1}</span>
          <span className="text-slate-600"> / {books.length}</span>
        </span>
        <div className="flex-1 mx-6 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / books.length) * 100}%` }}
          />
        </div>
        <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-600 font-medium">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">↓</kbd>
          to navigate
        </span>
      </div>

      {/* ── Scroll-snap container ── */}
      <div
        ref={containerRef}
        className="overflow-y-auto snap-y snap-mandatory"
        style={{ height: "calc(100vh - 10rem)", scrollbarWidth: "none" }}
      >
        {books.map((book, i) => {
          const state = getBookState(book.id);
          const isActive = i === currentIndex;

          return (
            <div
              key={book.id}
              ref={(el) => { slideRefs.current[i] = el; }}
              className="snap-start flex items-center"
              style={{ height: "calc(100vh - 10rem)" }}
            >
              <div
                className={`w-full h-full flex flex-col md:flex-row overflow-hidden glass border border-white/10 rounded-3xl transition-all duration-500 ${
                  isActive ? "opacity-100 scale-100" : "opacity-30 scale-[0.97]"
                }`}
              >
                {/* ── Cover Panel ── */}
                <div className="relative w-full md:w-2/5 flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-white min-h-[240px] md:min-h-0">
                  {book.cover_image && !state.imageError ? (
                    <img src={book.cover_image} alt={book.title} onError={() => setBookState(book.id, { imageError: true })} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                      <div className="w-28 h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-5xl font-black gradient-text">{book.title.charAt(0).toUpperCase()}</span>
                      </div>
                      <p className="text-xs text-slate-500 text-center line-clamp-2 max-w-[200px]">{book.title}</p>
                    </div>
                  )}

                  {/* Genre ribbon */}
                  {book.genre && (
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-white/85 backdrop-blur-sm border border-indigo-100 rounded-full shadow-sm">
                        {book.genre}
                      </span>
                    </div>
                  )}

                  {/* Slide number badge */}
                  <div className="absolute bottom-5 right-5 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {i + 1} / {books.length}
                  </div>
                </div>

                {/* ── Info Panel ── */}
                <div className="flex-1 flex flex-col p-7 md:p-10 overflow-y-auto">

                  <div className="mb-5">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug mb-2">{book.title}</h2>
                    <p className="text-base text-slate-500">by <span className="font-semibold text-violet-400">{book.author}</span></p>
                  </div>
                  <div className="border-t border-white/5 mb-5" />

                  <div className="flex-1 mb-6">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-3">About</p>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base line-clamp-[8]">
                      {book.description || "No description available."}
                    </p>
                  </div>
                  <div className="border-t border-white/5 mb-5" />

                  {/* ── Actions ── */}
                  <div className="space-y-4">

                    {/* Star rating */}
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
                        Rate this book
                      </p>
                      {isAuthenticated ? (
                        <StarRating
                          onRate={(val) => handleRate(book, val)}
                          disabled={interacting}
                          currentRating={state.userRating}
                        />
                      ) : (
                        <button
                          onClick={() => setShowAuthPrompt(true)}
                          className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className="text-xl">★</span>
                          ))}
                          <span className="ml-2 text-xs text-slate-400">Login to rate</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button disabled={interacting || (isAuthenticated && state.liked)} onClick={() => handleLike(book)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none ${
                          state.liked && isAuthenticated
                            ? "bg-rose-500/20 border-rose-500/30 text-rose-300"
                            : "glass glass-hover text-slate-300 hover:text-rose-300 hover:border-rose-500/30"
                        }`}
                      >
                        <span>{state.liked && isAuthenticated ? "♥" : "♡"}</span>
                        {state.liked && isAuthenticated ? "Liked" : "Add to Favourites"}
                      </button>
                      <Link href={`/books/${book.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all active:scale-95 shadow-lg shadow-violet-500/20"
                      >
                        View Full Details →
                      </Link>
                      {!isAuthenticated && (
                        <span className="self-center text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                          🔒 Login to interact
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Fixed prev / next arrows ── */}
      <div className="fixed right-6 bottom-8 z-30 flex flex-col gap-2">
        <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
          className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:border-violet-500/40 text-slate-400 hover:text-violet-400 transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-95"
          title="Previous (↑)">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
        </button>
        <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === books.length - 1}
          className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:border-violet-500/40 text-slate-400 hover:text-violet-400 transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-95"
          title="Next (↓)">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    </div>
  );
}
