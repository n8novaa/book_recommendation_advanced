"use client";

import { useEffect, useState } from "react";
import SwipeCard from "@/components/ui/SwipeCard";
import { useAuth } from "@/lib/useAuth";
import { getRecommendations, addInteraction } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

// Use the local book type for simplicity
type Book = {
  id: number; title: string; author: string; cover_image?: string; genre?: string; rating?: number;
};

export default function DiscoverPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch books to swipe through. We'll use recommendations if authed, or explore list.
    // For this example, assuming `getRecommendations` brings good candidates.
    getRecommendations(1, 40)
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSwipe = async (direction: "left" | "right", bookId: number) => {
    // If authed & swiped right, trigger "Like"
    if (direction === "right" && isAuthenticated) {
      try {
        await addInteraction(bookId, "like");
      } catch (err) {
        // silent fail on fast swiping
      }
    } else if (direction === "right" && !isAuthenticated) {
      showToast("Log in to save your likes!", "info");
    }
    
    // Move to next card
    setCurrentIndex((prev) => prev + 1);
  };

  const handleOpenDetails = (bookId: number) => {
    router.push(`/books/${bookId}`);
  };

  // Stack rendering logic (show next 3 cards underneath)
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative h-[80vh] min-h-[600px] overflow-hidden flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8 z-10 w-full max-w-sm mt-4">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
          Discover <span className="gradient-text">Mode</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Swipe <strong className="text-rose-400">Right</strong> to Like, Swipe <strong className="text-slate-400">Left</strong> to Pass.
        </p>
      </div>

      <div className="relative w-full max-w-sm flex-1 mt-4">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">
              Finding Matches...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-8 rounded-3xl text-center">
            {error}
          </div>
        )}

        {!loading && currentIndex >= books.length && books.length > 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">You're all caught up!</h2>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">
              We're analyzing your new likes to bring you more matches.
            </p>
            <button
              onClick={() => router.push("/explore")}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-violet-500/25 hover:from-violet-500 transition-all"
            >
              Back to Explore
            </button>
          </div>
        )}

        {/* Deck Rendering */}
        {!loading && books.map((book, index) => {
          // Only render active card and next 2 cards underneath for performance
          if (index < currentIndex || index > currentIndex + 2) return null;

          return (
            <SwipeCard
              key={book.id}
              book={book}
              active={index === currentIndex}
              onSwipeSubmit={(dir) => handleSwipe(dir, book.id)}
              onOpenDetails={() => handleOpenDetails(book.id)}
            />
          );
        }).reverse()}
      </div>
    </div>
  );
}
