"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout as apiLogout } from "@/lib/api";
import { clearToken, getToken, useAuth } from "@/lib/auth";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(true);
  const router = useRouter();

  async function onLogout() {
    const token = getToken();
    if (token) {
      try {
        await apiLogout(token);
      } catch {
        // on déconnecte localement quoi qu'il arrive
      }
    }
    clearToken();
    router.replace("/app/login");
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        Chargement…
      </div>
    );
  }

  if (!user) return null; // redirection en cours

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/app" className="font-semibold">
            CollectIA
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/app" className="hover:text-foreground">
              Suivi
            </Link>
            <Link href="/app/profil" className="hover:text-foreground">
              Mon profil
            </Link>
            <button
              onClick={onLogout}
              className="text-muted hover:text-foreground"
            >
              Déconnexion
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
