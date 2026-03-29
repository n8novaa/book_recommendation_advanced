"use client";

import { motion } from "framer-motion";

type ProfileStatsProps = {
  stats: {
    username: string;
    email: string;
    total_interactions: number;
    total_wishlist: number;
    favorite_genre: string;
  };
};

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const cards = [
    {
      title: "Saved Books",
      value: stats.total_wishlist,
      icon: "🔖",
      color: "from-rose-500 to-orange-500",
      shadow: "shadow-rose-500/20",
    },
    {
      title: "Interactions",
      value: stats.total_interactions,
      icon: "⚡",
      color: "from-violet-500 to-indigo-600",
      shadow: "shadow-violet-500/20",
    },
    {
      title: "Top Genre",
      value: stats.favorite_genre,
      icon: "📚",
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
    },
  ];

  return (
    <div className="mb-10 w-full animate-fade-in">
      <div className="glass rounded-3xl p-8 border border-white/10 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-4xl font-black text-white">
          {stats.username.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight">{stats.username}</h2>
          <p className="text-slate-400">{stats.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`} />
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow} text-xl`}>
                {card.icon}
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold mb-1">{card.title}</p>
                <p className="text-2xl font-black text-white">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
