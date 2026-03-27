export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-8 opacity-0 animate-[slide-up_0.8s_ease-out_forwards]">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
          <span className="block mb-2">Discover your next</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
            favorite book
          </span>
        </h1>
        <p className="mx-auto text-lg text-slate-600 sm:text-xl leading-relaxed">
          Join our community of readers. Get personalized recommendations based on your reading history, preferences, and ratings.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-indigo-600/80 backdrop-blur-md px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 border border-white/20 hover:bg-indigo-600 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 md:text-lg"
          >
            Get started for free
          </a>
          <a
            href="/explore"
            className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-xl border border-white/60 px-8 py-4 text-base font-semibold text-slate-700 shadow-lg shadow-slate-200/50 hover:border-white hover:bg-white/60 hover:text-indigo-700 hover:-translate-y-1 transition-all duration-300 md:text-lg ring-1 ring-slate-900/5"
          >
            Explore books
          </a>
        </div>
      </div>
    </div>
  );
}