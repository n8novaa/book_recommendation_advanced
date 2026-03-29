"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import BookCardSkeleton from "@/components/ui/BookCardSkeleton";
import { getRecommendations } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Book = { id: number; title: string; author: string; cover_image?: string; rating?: number; genre?: string; };

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function RecommendationsPage() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecommendations()
      .then((d) => setBooks(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 mb-8 border border-white/10"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">For <span className="gradient-text">You</span></h1>
            <p className="text-sm text-slate-500 mt-0.5">Personalized picks powered by hybrid AI.</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-10 text-center border border-rose-500/20">
          <p className="text-rose-400 font-semibold">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/10">
          <p className="text-4xl mb-4">🤖</p>
          <h3 className="text-xl font-bold text-white mb-2">No recommendations yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Interact with more books — like, rate, and browse — to train your personal AI engine.
          </p>
          <a href="/explore" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
            Explore Books →
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-600 mb-5 pl-1">{books.length} book{books.length !== 1 ? "s" : ""} recommended for you</p>
          <motion.div variants={stagger} initial="initial" animate="animate"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {books.map((book) => (
              <motion.div key={book.id} variants={fadeUp}>
                <BookCard id={book.id} title={book.title} author={book.author}
                  rating={book.rating || 4.5} coverImage={book.cover_image}
                  genre={book.genre} isAuthenticated={isAuthenticated} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
