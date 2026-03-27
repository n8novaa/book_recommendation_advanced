"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { register as registerApi, setToken } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerApi(formData);
      const token = response.access || response.token || response.access_token;
      
      // Fallback depending on your DRF response containing token on Registration
      if (token) {
        setToken(token);
        router.push("/dashboard");
      } else {
        // If the backend doesn't auto-login on register, redirect to login
        router.push("/login?message=Account+created.+Please+sign+in.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 opacity-0 animate-[fade-in_0.5s_ease-out_forwards]">
      <div className="w-full max-w-md space-y-6 bg-white/50 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white ring-1 ring-slate-900/5">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Join BookReads today
          </p>
        </div>

        {error && (
          <div className="bg-rose-50/80 backdrop-blur-md rounded-xl p-4 text-sm text-rose-600 border border-rose-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full text-lg shadow-indigo-500/30 font-bold mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
