"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

type InfiniteScrollListProps = {
  children: ReactNode;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
};

export default function InfiniteScrollList({
  children,
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="w-full">
      {children}
      
      {/* Intersection Target */}
      <div ref={observerTarget} className="h-10 mt-4 flex items-center justify-center">
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full"
          />
        )}
        {!hasMore && !isLoading && (
          <p className="text-xs text-slate-600 font-semibold tracking-widest uppercase">
            End of results
          </p>
        )}
      </div>
    </div>
  );
}
