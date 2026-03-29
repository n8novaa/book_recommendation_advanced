"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getInteractions } from "@/lib/api";

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

export default function DashboardPage() {
  const [interactions, setInteractions] = useState<InteractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "like" | "rate" | "click">("all");

  useEffect(() => {
    getInteractions()
      .then((d) => setInteractions(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? interactions : interactions.filter((i) => i.action === filter);
  const likes = interactions.filter((i) => i.action === "like").length;
  const views = interactions.filter((i) => i.action === "click").length;
  const ratings = interactions.filter((i) => i.action === "rate");
  const avgRating = ratings.length > 0
    ? (ratings.reduce((s, r) => s + (r.value || 0), 0) / ratings.length).toFixed(1) : "—";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 border border-white/10 mb-8"
      >
        <div className="flex items-center gap-4 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-600 to-indigo-700 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Your <span className="gradient-text">Dashboard</span></h1>
            <p className="text-sm text-slate-500 mt-0.5">Track your reading activity.</p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Liked", value: likes, icon: "♥", color: "from-rose-900/30 to-rose-800/10 border-rose-500/20", text: "text-rose-400" },
          { label: "Viewed", value: views, icon: "👁", color: "from-violet-900/30 to-violet-800/10 border-violet-500/20", text: "text-violet-400" },
          { label: "Avg Rating", value: avgRating, icon: "★", color: "from-amber-900/30 to-amber-800/10 border-amber-500/20", text: "text-amber-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass bg-gradient-to-br ${stat.color} rounded-2xl p-6 border`}
          >
            <div className={`text-3xl font-black ${stat.text} mb-1`}>{stat.icon} {stat.value}</div>
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="glass rounded-3xl border border-white/10 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white">Activity History</h2>
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

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-rose-400 text-sm text-center py-8">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">📖</p>
            <p className="text-slate-500 text-sm">{filter === "all" ? "No activity yet — start exploring!" : `No "${filter}" interactions yet.`}</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-2">
            {filtered.map((item, i) => {
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
    </div>
  );
}
