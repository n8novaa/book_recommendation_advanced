"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { register as registerApi, setToken } from "@/lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await registerApi(formData);
      const token = res.access || res.token || res.access_token;
      if (token) { setToken(token); router.push("/dashboard"); }
      else router.push("/login?message=Account+created.+Please+sign+in.");
    } catch (err: any) { setError(err.message || "Registration failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white text-xs font-black">BR</span>
            </div>
            <span className="text-xl font-bold text-white">Book<span className="gradient-text">Reads</span></span>
          </div>

          <h2 className="text-2xl font-black text-white text-center mb-1">Create account</h2>
          <p className="text-sm text-slate-500 text-center mb-8">Join BookReads today — free forever.</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Username</label>
              <Input name="username" type="text" autoComplete="username" required placeholder="Choose a username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Email <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
              <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
              <Input name="password" type="password" autoComplete="new-password" required placeholder="Create a password" value={formData.password} onChange={handleChange} />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating…
                </span>
              ) : "Create account →"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
