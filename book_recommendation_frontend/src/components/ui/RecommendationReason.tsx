"use client";

import { motion } from "framer-motion";

export default function RecommendationReason({ reason }: { reason: string }) {
  if (!reason) return null;

  // Render a different icon depending on the reason content for extra polish
  let icon = "✨";
  if (reason.toLowerCase().includes("popular among")) icon = "👥";
  else if (reason.toLowerCase().includes("trending")) icon = "🔥";
  else if (reason.toLowerCase().includes("based on")) icon = "🎯";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-2 pt-2 border-t border-white/5"
    >
      <div className="flex items-start gap-1.5">
        <span className="text-[10px] leading-relaxed mt-0.5">{icon}</span>
        <p className="text-[10px] text-violet-300 leading-tight font-medium" title={reason}>
          {reason}
        </p>
      </div>
    </motion.div>
  );
}
