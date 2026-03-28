"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { getRecommendations } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Book = {
  id: number;
  title: string;
  author: string;
  cover_image?: string;
  rating?: number;
};

export default function RecommendationsPage() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRecommendations();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 opacity-0 animate-[fade-in_0.6s_ease-out_forwards]">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-xl shadow-indigo-100/40 border border-white p-10 ring-1 ring-slate-900/5 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Recommendations</h1>
        </div>
        <p className="text-lg text-slate-600">
          Personalized book suggestions powered by hybrid collaborative + content-based filtering based on your reading history.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm animate-pulse">Calculating your personal recommendations…</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm border border-rose-200">
          <div className="w-12 h-12 mx-auto bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-rose-700">Unable to load recommendations</h3>
          <p className="text-rose-600 mt-2 text-sm">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700">No recommendations yet</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Start exploring books and clicking ♡ to train your recommendation engine. The more you interact, the better your suggestions!
          </p>
          <a href="/explore" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-indigo-200">
            Browse Books →
          </a>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-6 pl-1">{books.length} book{books.length !== 1 ? "s" : ""} recommended for you</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                rating={book.rating || 4.5}
                coverImage={book.cover_image}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
