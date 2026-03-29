"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import BookCardSkeleton from "@/components/ui/BookCardSkeleton";
import DiscoverMode from "@/components/DiscoverMode";
import { getBooks } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { Input } from "@/components/ui/Input";
import InfiniteScrollList from "@/components/ui/InfiniteScrollList";

type Book = {
  id: number; title: string; author: string;
  genre?: string; cover_image?: string; rating?: number;
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "discover">("grid");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadBooks = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsLoadingMore(true);

      const data = await getBooks(pageNum, 15);
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      
      if (pageNum === 1) setBooks(data);
      else setBooks((prev) => [...prev, ...data]);
      
      if (data.length < 15) setHasMore(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      if (pageNum === 1) setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadBooks(1);
  }, []);

  const loadNextPage = async () => {
    if (isLoadingMore || !hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    await loadBooks(next);
  };

  const genres = useMemo(() => {
    const unique = Array.from(new Set(books.map((b) => b.genre?.trim()).filter(Boolean) as string[])).sort();
    return ["All", ...unique];
  }, [books]);

  const genreCount = useMemo(() => {
    const c: Record<string, number> = { All: books.length };
    books.forEach((b) => { const g = b.genre?.trim(); if (g) c[g] = (c[g] || 0) + 1; });
    return c;
  }, [books]);

  const filtered = useMemo(() => books.filter((book) => {
    const q = !query || book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase());
    const g = activeGenre === "All" || book.genre?.toLowerCase() === activeGenre.toLowerCase();
    return q && g;
  }), [books, query, activeGenre]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 mb-8 border border-white/10"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Explore<span className="gradient-text"> Books</span></h1>
            <p className="text-sm text-slate-500 mt-1">Browse the full catalog — search, filter, and interact.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Grid/Discover toggle */}
            <div className="flex p-1 gap-1 bg-white/5 border border-white/10 rounded-xl">
              {(["grid", "discover"] as const).map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === mode ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {mode === "grid"
                    ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  }
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            {!isAuthenticated && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                👁 Preview — <Link href="/login" className="underline hover:text-amber-300">log in</Link> to interact
              </span>
            )}
          </div>
        </div>

        {/* Search + genres — only in grid mode */}
        {viewMode === "grid" && (
          <div className="space-y-4">
            <Input placeholder="Search by title or author…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-md" />
            <div className="flex flex-wrap gap-2">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 rounded-xl bg-white/5 animate-pulse" style={{ width: `${60 + i * 14}px` }} />)
                : genres.map((g) => (
                    <motion.button whileTap={{ scale: 0.95 }} key={g} onClick={() => setActiveGenre(g)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        activeGenre === g
                          ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20"
                          : "text-slate-400 border-white/10 bg-white/5 hover:border-violet-500/40 hover:text-violet-300"
                      }`}
                    >
                      {g}
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${activeGenre === g ? "bg-white/20" : "bg-white/5 text-slate-500"}`}>
                        {genreCount[g] ?? 0}
                      </span>
                    </motion.button>
                  ))
              }
            </div>
          </div>
        )}
      </motion.div>

      {/* Discover mode */}
      {viewMode === "discover" && !loading && !error && (
        <DiscoverMode books={filtered} isAuthenticated={isAuthenticated} />
      )}

      {/* Grid mode */}
      {viewMode === "grid" && (
        <>
          {!loading && !error && (
            <p className="text-xs text-slate-600 mb-5 pl-1">
              {filtered.length} book{filtered.length !== 1 ? "s" : ""} found{query ? ` for "${query}"` : ""}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="glass rounded-2xl p-10 text-center border border-rose-500/20">
              <p className="text-rose-400 font-semibold">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center border border-white/10">
              <p className="text-3xl mb-3">📚</p>
              <h3 className="text-lg font-bold text-white mb-1">{books.length === 0 ? "No books yet" : "No results"}</h3>
              <p className="text-slate-500 text-sm">{books.length === 0 ? "Check back soon." : "Try a different search or filter."}</p>
            </div>
          ) : (
            <InfiniteScrollList hasMore={hasMore} isLoading={isLoadingMore} onLoadMore={loadNextPage}>
              <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {filtered.map((book) => (
                  <motion.div key={book.id} variants={fadeUp}>
                    <BookCard id={book.id} title={book.title} author={book.author}
                      rating={book.rating || 4.5} coverImage={book.cover_image}
                      genre={book.genre} isAuthenticated={isAuthenticated} />
                  </motion.div>
                ))}
              </motion.div>
            </InfiniteScrollList>
          )}
        </>
      )}
    </div>
  );
}
