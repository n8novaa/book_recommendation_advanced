"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BookCard from "@/components/BookCard";
import BookCardSkeleton from "@/components/ui/BookCardSkeleton";
import { getBooks } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Book = {
  id: number;
  title: string;
  author: string;
  genre?: string;
  coverImage?: string;
  rating?: number;
};

const GENRES = ["All", "Fiction", "Non-Fiction", "Science", "History", "Fantasy", "Mystery", "Romance"];

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase());
      const matchesGenre =
        activeGenre === "All" || book.genre?.toLowerCase() === activeGenre.toLowerCase();
      return matchesQuery && matchesGenre;
    });
  }, [books, query, activeGenre]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 opacity-0 animate-[fade-in_0.6s_ease-out_forwards]">
      {/* Header + Search */}
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-xl shadow-indigo-100/40 border border-white p-10 ring-1 ring-slate-900/5 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Explore Books</h1>
          {!isAuthenticated && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview mode —{" "}
              <Link href="/login" className="underline underline-offset-2 hover:text-amber-900">
                log in
              </Link>
              {" "}to interact
            </div>
          )}
        </div>
        <p className="text-lg text-slate-600 mb-8">Browse the full catalog — search, filter, and interact.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <Input
            placeholder="Search by title or author…"
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="primary" onClick={() => {}}>Search</Button>
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                activeGenre === genre
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white/70 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && !error && (
        <p className="text-sm text-slate-500 mb-5 pl-1">
          {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
          {query ? ` for "${query}"` : ""}
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-rose-50/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm border border-rose-200">
          <h3 className="text-lg font-bold text-rose-700">Unable to load books</h3>
          <p className="text-rose-600 mt-2 text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700">
            {books.length === 0 ? "No books in catalog yet" : "No results found"}
          </h3>
          <p className="text-slate-500 mt-2">
            {books.length === 0
              ? "Check back later for new additions."
              : `Try a different search or filter.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              rating={book.rating || 4.5}
              coverImage={book.coverImage}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
