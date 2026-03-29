"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "./Toast";
import AuthPrompt from "./AuthPrompt";

type SaveButtonProps = {
  bookId: number;
  initialSaved?: boolean;
  className?: string;
  onToggle?: (saved: boolean) => void;
};

export default function SaveButton({
  bookId,
  initialSaved = false,
  className = "",
  onToggle,
}: SaveButtonProps) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // We should do API calls here, but since standard `api.ts` doesn't have wishlist yet, 
  // I will write it generically using `fetch`.
  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (saved) {
        // Unsave
        const res = await fetch(`http://127.0.0.1:8000/api/interactions/wishlist/${bookId}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to unsave");
        setSaved(false);
        showToast("Removed from wishlist.", "success");
        onToggle?.(false);
      } else {
        // Save
        const res = await fetch(`http://127.0.0.1:8000/api/interactions/wishlist/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ book: bookId }),
        });
        if (!res.ok) throw new Error("Failed to save");
        setSaved(true);
        showToast("Added to wishlist 🔖", "success");
        onToggle?.(true);
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showAuthPrompt && <AuthPrompt onClose={() => setShowAuthPrompt(false)} />}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleSave}
        disabled={loading}
        className={`flex items-center justify-center transition-all ${className} ${
          saved ? "text-violet-400" : "text-slate-400 hover:text-white"
        }`}
        title={saved ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.svg
              key="saved"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="unsaved"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
