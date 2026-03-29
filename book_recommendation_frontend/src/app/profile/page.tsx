"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import ProfileStats from "@/components/ui/ProfileStats";
import { getInteractions, removeToken } from "@/lib/api";
import { motion } from "framer-motion";

type ProfileData = {
  username: string;
  email: string;
  total_interactions: number;
  total_wishlist: number;
  favorite_genre: string;
};

type InteractionItem = {
  book: number; book_title: string; book_author: string;
  action: "click" | "like" | "rate"; value: number | null; timestamp: string;
};

const ACTION_CONFIG = {
  like:  { label: "Liked",  icon: "♥", color: "text-rose-400  bg-rose-500/10  border-rose-500/20"  },
  rate:  { label: "Rated",  icon: "★", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  click: { label: "Viewed", icon: "👁", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [interactions, setInteractions] = useState<InteractionItem[]>([]);
  const [filter, setFilter] = useState<"all" | "like" | "rate" | "click">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [profRes, intData] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/users/profile/", { headers: { Authorization: `Bearer ${token}` } }),
          getInteractions()
        ]);
        
        if (!profRes.ok) throw new Error("Could not load profile data.");
        
        const profData = await profRes.json();
        setProfile(profData);
        setInteractions(Array.isArray(intData) ? intData : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated && !loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-white mb-4">Profile Dashboard</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Please log in to view your dashboard.</p>
        <button onClick={() => router.push("/login")} className="px-6 py-3 rounded-xl bg-violet-600 font-bold text-white hover:bg-violet-500 transition-colors">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-10 text-center border border-rose-500/20">
          <p className="text-rose-400 font-semibold">{error}</p>
        </div>
      ) : profile ? (
        <>
          <ProfileStats stats={profile} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="glass rounded-3xl p-6 border border-white/10 hover:border-violet-500/30 transition-colors cursor-pointer" onClick={() => router.push("/wishlist")}>
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">🔖 View Wishlist</h3>
               <p className="text-sm text-slate-400">Access the books you've saved for later.</p>
            </div>
            <div className="glass rounded-3xl p-6 border border-white/10 hover:border-violet-500/30 transition-colors cursor-pointer" onClick={() => router.push("/discover")}>
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">✨ Discover Mode</h3>
               <p className="text-sm text-slate-400">Jump back into the swipe deck to find new books.</p>
            </div>
          </div>
          
          <div className="glass rounded-3xl border border-white/10 p-8 mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Activity History</h2>
              <div className="flex gap-2 flex-wrap">
                {(["all", "like", "rate", "click"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      filter === f
                        ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20"
                        : "glass text-slate-400 border-white/10 hover:text-white hover:border-violet-500/30"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {interactions.filter((i) => filter === "all" || i.action === filter).length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-3xl mb-3">📖</p>
                <p className="text-slate-500 text-sm">{filter === "all" ? "No activity yet — start exploring!" : `No "${filter}" interactions yet.`}</p>
              </div>
            ) : (
              <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {interactions.filter((i) => filter === "all" || i.action === filter).map((item, i) => {
                  const cfg = ACTION_CONFIG[item.action];
                  return (
                    <motion.div key={i} variants={fadeUp}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base flex-shrink-0 ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 text-sm truncate">{item.book_title}</p>
                        <p className="text-xs text-slate-600 truncate">by {item.book_author}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.color}`}>
                          {cfg.label}{item.action === "rate" && item.value ? ` ${item.value}★` : ""}
                        </span>
                        <p className="text-xs text-slate-600 mt-1">{item.timestamp ? timeAgo(item.timestamp) : ""}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <button onClick={() => { removeToken(); router.push("/explore"); }} className="px-6 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 font-semibold hover:bg-rose-500/10 transition-colors">
              Sign Out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
