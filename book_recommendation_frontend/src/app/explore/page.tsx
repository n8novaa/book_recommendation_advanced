"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/api";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
};

export default function ExplorePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 opacity-0 animate-[fade-in_0.6s_ease-out_forwards]">
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-xl shadow-indigo-100/40 border border-white p-10 ring-1 ring-slate-900/5 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Explore Books</h1>
        <p className="mt-4 text-lg text-slate-600 mb-8">Browse the entire collection of books available in our database.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <Input placeholder="Search by title, author, or genre..." className="flex-1" />
          <Button variant="primary">Search</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-50/80 backdrop-blur-md rounded-xl p-6 text-center shadow-sm border border-rose-200">
          <h3 className="text-lg font-bold text-rose-700">Unable to load books</h3>
          <p className="text-rose-600 mt-2">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-xl p-10 text-center shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700">No books found</h3>
          <p className="text-slate-500 mt-2">Check back later for new additions to our catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id}
              id={book.id}
              title={book.title} 
              author={book.author} 
              rating={book.rating || 4.5} 
              coverImage={book.coverImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
