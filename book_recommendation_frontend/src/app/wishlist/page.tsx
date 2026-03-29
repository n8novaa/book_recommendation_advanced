"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BookCard from "@/components/BookCard";
import BookCardSkeleton from "@/components/ui/BookCardSkeleton";
import { useAuth } from "@/lib/useAuth";

// Local types to avoid redefining globally
type Book = {
  id: number; title: string; author: string; cover_image?: string; rating?: number; genre?: string;
};
type WishlistItem = {
  id: number;
  book_details: Book;
  created_at: string;
};

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/interactions/wishlist/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        return res.json();
      })
      .then(data => setWishlist(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated && !loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-white mb-4">Your Wishlist</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Please log in to view or manage your saved books.</p>
        <a href="/login" className="px-6 py-3 rounded-xl bg-violet-600 font-bold text-white hover:bg-violet-500 transition-colors">
          Log In
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 mb-8 border border-white/10"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Your <span className="gradient-text">Wishlist</span></h1>
            <p className="text-sm text-slate-500 mt-0.5">Books you've saved for later.</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-10 text-center border border-rose-500/20">
          <p className="text-rose-400 font-semibold">{error}</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/10">
          <p className="text-4xl mb-4">🔖</p>
          <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Tap the bookmark icon on any book to save it here for later.
          </p>
          <a href="/explore" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
            Explore Books →
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-600 mb-5 pl-1">{wishlist.length} book{wishlist.length !== 1 ? "s" : ""} saved</p>
          <motion.div variants={stagger} initial="initial" animate="animate"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {wishlist.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <BookCard id={item.book_details.id} title={item.book_details.title} author={item.book_details.author}
                  rating={item.book_details.rating || 4.5} coverImage={item.book_details.cover_image}
                  genre={item.book_details.genre} isAuthenticated={isAuthenticated} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
