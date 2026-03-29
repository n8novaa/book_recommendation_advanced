import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "danger";
}

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-40 disabled:pointer-events-none active:scale-95";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 hover:-translate-y-0.5",
    secondary:
      "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md",
    glass:
      "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-violet-500/40 shadow-lg shadow-black/20",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    danger:
      "bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 hover:text-rose-300",
  };

  return (
    <button
      className={`${base} ${variants[variant]} px-4 py-2.5 ${className}`}
      {...props}
    />
  );
}
