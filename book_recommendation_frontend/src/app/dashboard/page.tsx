"use client";

import { useEffect, useState } from "react";
import { getInteractions } from "@/lib/api";

type InteractionItem = {
  book: number;
  book_title: string;
  book_author: string;
  action: "click" | "like" | "rate";
  value: number | null;
  timestamp: string;
};

const ACTION_CONFIG = {
  like: { label: "Liked", icon: "♥", color: "text-rose-500 bg-rose-50 border-rose-200" },
  rate: { label: "Rated", icon: "★", color: "text-amber-500 bg-amber-50 border-amber-200" },
  click: { label: "Viewed", icon: "👁", color: "text-indigo-500 bg-indigo-50 border-indigo-200" },
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DashboardPage() {
  const [interactions, setInteractions] = useState<InteractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "like" | "rate" | "click">("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getInteractions();
        setInteractions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch your activity.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? interactions : interactions.filter((i) => i.action === filter);

  // Stats
  const likes = interactions.filter((i) => i.action === "like").length;
  const views = interactions.filter((i) => i.action === "click").length;
  const ratings = interactions.filter((i) => i.action === "rate");
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + (r.value || 0), 0) / ratings.length).toFixed(1)
    : "–";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 opacity-0 animate-[fade-in_0.6s_ease-out_forwards]">
      {/* Page Header */}
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-xl shadow-indigo-100/40 border border-white p-10 ring-1 ring-slate-900/5 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Dashboard</h1>
        </div>
        <p className="text-lg text-slate-600">Track your reading activity, likes, and ratings — all in one place.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Books Liked", value: likes, icon: "♥", color: "from-rose-100 to-pink-100 border-rose-200", text: "text-rose-600" },
          { label: "Books Viewed", value: views, icon: "👁", color: "from-indigo-100 to-blue-100 border-indigo-200", text: "text-indigo-600" },
          { label: "Avg. Rating Given", value: avgRating, icon: "★", color: "from-amber-100 to-yellow-100 border-amber-200", text: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl rounded-2xl p-6 border shadow-sm`}>
            <div className={`text-3xl font-black ${stat.text}`}>{stat.icon} {stat.value}</div>
            <div className="text-sm text-slate-600 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-xl shadow-indigo-100/40 border border-white p-8 ring-1 ring-slate-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">Activity History</h2>
          <div className="flex gap-2 flex-wrap">
            {(["all", "like", "rate", "click"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                  filter === f
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white/80 text-slate-600 border-slate-200 hover:border-indigo-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 rounded-xl p-5 text-center border border-rose-200">
            <p className="text-rose-600 text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">
              {filter === "all" ? "No activity yet. Start exploring books!" : `No "${filter}" interactions yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => {
              const config = ACTION_CONFIG[item.action];
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white hover:bg-white/80 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.book_title}</p>
                    <p className="text-xs text-slate-500 truncate">by {item.book_author}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${config.color}`}>
                      {config.label}{item.action === "rate" && item.value ? ` ${item.value}★` : ""}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{item.timestamp ? timeAgo(item.timestamp) : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
