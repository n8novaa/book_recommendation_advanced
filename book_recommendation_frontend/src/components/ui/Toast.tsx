"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };
type ToastContextType = { showToast: (message: string, type?: ToastType) => void };

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

const icons = {
  success: <span className="text-emerald-400">✓</span>,
  error:   <span className="text-rose-400">✕</span>,
  info:    <span className="text-violet-400">i</span>,
};

const colors = {
  success: "border-emerald-500/30 bg-emerald-500/10",
  error:   "border-rose-500/30 bg-rose-500/10",
  info:    "border-violet-500/30 bg-violet-500/10",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border glass backdrop-blur-xl ${colors[toast.type]} max-w-sm shadow-xl shadow-black/40`}
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                {icons[toast.type]}
              </div>
              <p className="text-sm font-medium text-slate-200">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
