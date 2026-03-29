"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type BasicBook = {
  id: number;
  title: string;
  author: string;
  cover_image?: string;
  genre: string;
};

export default function SimilarBooks({ books }: { books: BasicBook[] }) {
  if (!books || books.length === 0) return null;

  return (
    <div className="mt-8 border-t border-white/5 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-500">
          Similar Books
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <Link href={`/books/${book.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5 border border-white/10 glass-hover transition-all">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/30 to-indigo-900/20">
                  <span className="text-3xl font-black gradient-text">{book.title.charAt(0)}</span>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-xs font-bold text-white line-clamp-1">{book.title}</p>
                <p className="text-[10px] text-violet-300 line-clamp-1">{book.author}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
