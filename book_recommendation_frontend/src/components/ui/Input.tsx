import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`flex h-12 w-full rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl px-4 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-slate-900/5 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 hover:bg-white/50 hover:border-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
