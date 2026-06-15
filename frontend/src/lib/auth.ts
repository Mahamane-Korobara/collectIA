"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { me as fetchMe } from "./api";
import type { User } from "./types";

const TOKEN_KEY = "collectia_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Récupère l'utilisateur courant côté client.
 * Si `require` est vrai, redirige vers la connexion en l'absence de session.
 */
export function useAuth(require = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      if (require) router.replace("/app/login");
      return;
    }

    fetchMe(token)
      .then((r) => setUser(r.user))
      .catch(() => {
        clearToken();
        if (require) router.replace("/app/login");
      })
      .finally(() => setLoading(false));
  }, [require, router]);

  return { user, loading };
}
