"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getToken, removeToken } from "@/lib/api";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getToken());
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-110">
              <span className="text-white text-xs font-black">BR</span>
            </div>
            <span className="text-lg font-bold text-white/90 group-hover:text-white transition-colors tracking-tight">
              Book<span className="gradient-text">Reads</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {[
              { href: "/explore", label: "Explore" },
              { href: "/discover", label: "Discover" },
              ...(isAuthenticated ? [{ href: "/recommendations", label: "For You" }] : []),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/wishlist"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white glass rounded-xl hover:border-violet-500/40 transition-all duration-200"
                >
                  Wishlist
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white glass rounded-xl hover:border-violet-500/40 transition-all duration-200"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { href: "/explore", label: "Explore" },
                { href: "/discover", label: "Discover" },
                ...(isAuthenticated
                  ? [
                      { href: "/recommendations", label: "For You" },
                      { href: "/wishlist", label: "Wishlist" },
                      { href: "/profile", label: "Profile" },
                    ]
                  : [
                      { href: "/login", label: "Sign in" },
                      { href: "/register", label: "Get started" },
                    ]),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-xl hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
