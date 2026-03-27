"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { addInteraction } from "@/lib/api";

type BookCardProps = {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
};

export default function BookCard({ id, title, author, coverImage, rating = 4.5 }: BookCardProps) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInteraction = async (type: string, val: number | null = null) => {
    try {
      setLoading(true);
      await addInteraction(id, type, val);
      if (type === "like") setLiked(true);
    } catch (error) {
      console.error(`Failed to record ${type} interaction`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl shadow-slate-200/20 ring-1 ring-slate-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/40 transition-all duration-300 group cursor-pointer"
      onClick={() => handleInteraction("click")}
    >
      {/* Dynamic Cover Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/50 backdrop-blur-sm border-b border-white/40">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={title} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 bg-gradient-to-br from-indigo-50/50 to-white/50 pattern-dots pattern-indigo-400 pattern-bg-white pattern-size-4 pattern-opacity-10">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm font-medium opacity-70">No Cover Available</span>
          </div>
        )}
        
        {/* Floating Rating Badge */}
        <div 
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm border border-white/60 flex items-center gap-1 cursor-pointer hover:bg-white transition-colors"
          onClick={(e) => { e.stopPropagation(); handleInteraction("rate", 5); }}
        >
          <span className="text-amber-500 hover:scale-125 transition-transform duration-300">★</span> {rating}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 line-clamp-1" title={title}>
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-1" title={author}>
          by <span className="text-indigo-600 font-medium">{author}</span>
        </p>

        <div className="mt-auto pt-5 flex gap-2">
          <Button variant="primary" className="flex-1 py-2 text-xs" onClick={(e) => { e.stopPropagation(); handleInteraction("click"); }}>
            View Details
          </Button>
          <Button 
            variant="secondary" 
            className={`px-3 py-2 text-lg transition-colors ${liked ? "text-rose-500 bg-rose-50 border-rose-200 shadow-inner" : "text-indigo-500 hover:text-rose-500"}`}
            disabled={loading || liked}
            onClick={(e) => { e.stopPropagation(); handleInteraction("like"); }}
          >
            {liked ? "♥" : "♡"}
          </Button>
        </div>
      </div>
    </div>
  );
}