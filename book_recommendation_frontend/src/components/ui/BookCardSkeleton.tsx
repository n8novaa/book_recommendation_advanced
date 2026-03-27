export default function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl shadow-md animate-pulse">
      {/* Cover placeholder */}
      <div className="aspect-[4/5] w-full bg-gradient-to-br from-slate-200/80 to-slate-300/60" />
      {/* Content placeholder */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <div className="h-5 bg-slate-200/70 rounded-xl w-4/5" />
        <div className="h-3.5 bg-slate-200/50 rounded-xl w-3/5" />
        <div className="mt-auto pt-4 flex gap-2">
          <div className="h-9 bg-indigo-100/60 rounded-xl flex-1" />
          <div className="h-9 w-11 bg-slate-100/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
