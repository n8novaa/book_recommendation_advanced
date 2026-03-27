import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/60 shadow-lg shadow-slate-200/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/80 backdrop-blur-sm border border-white/40 shadow-md shadow-indigo-500/20 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
                BR
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors">
                BookReads
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/explore"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
              >
                Explore
              </Link>
              <Link
                href="/recommendations"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
              >
                Recommendations
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-medium text-indigo-800 bg-white/50 backdrop-blur-md border border-white/80 rounded-xl shadow-sm hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 ring-1 ring-slate-900/5"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
