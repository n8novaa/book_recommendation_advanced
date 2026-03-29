import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500
        bg-white/5 border border-white/10
        backdrop-blur-md
        focus:outline-none focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20
        hover:border-white/20 hover:bg-white/8
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
}
