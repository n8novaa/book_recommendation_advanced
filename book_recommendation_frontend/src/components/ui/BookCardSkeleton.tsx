export default function BookCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden glass animate-pulse">
      <div className="aspect-[3/4] bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-3.5 bg-white/5 rounded-lg w-3/4" />
        <div className="h-3 bg-white/5 rounded-lg w-1/2" />
      </div>
    </div>
  );
}
