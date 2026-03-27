import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost";
}

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles = "bg-indigo-600/80 backdrop-blur-md text-white shadow-lg shadow-indigo-500/20 border border-white/20 hover:bg-indigo-600 hover:shadow-indigo-500/40";
      break;
    case "secondary":
      variantStyles = "bg-white/40 backdrop-blur-xl border border-white/60 text-slate-700 shadow-sm hover:border-white hover:bg-white/60 hover:text-indigo-700 ring-1 ring-slate-900/5";
      break;
    case "glass":
      variantStyles = "bg-white/20 backdrop-blur-2xl border border-white/40 text-slate-800 shadow-xl shadow-slate-200/20 hover:bg-white/40 context-menu";
      break;
    case "ghost":
      variantStyles = "bg-transparent hover:bg-white/20 text-slate-700 hover:backdrop-blur-md";
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} px-4 py-2.5 ${className}`}
      {...props}
    />
  );
}
