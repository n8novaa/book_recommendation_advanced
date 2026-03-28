"use client";

import { useEffect, useState } from "react";
import { getToken } from "./api";

/**
 * useAuth — single source of truth for authentication state.
 * Reacts to localStorage changes across tabs and within the same tab
 * (via the custom "storage" event dispatched by setToken/removeToken).
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const check = () => setIsAuthenticated(!!getToken());
    check(); // run on mount

    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return { isAuthenticated };
}
