"use client";

import { useState } from "react";
import { googleRedirectUrl, sendMagicLink } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onMagic(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await sendMagicLink(email);
      setSent(true);
    } catch {
      setError("Envoi impossible. Réessaie.");
    }
  }

  async function onGoogle() {
    setError("");
    try {
      const { url } = await googleRedirectUrl();
      window.location.href = url;
    } catch {
      setError("Connexion Google indisponible.");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold">Connexion</h1>
        <p className="mb-6 text-sm text-muted">
          Sans mot de passe : reçois un lien par e-mail.
        </p>

        {sent ? (
          <div className="rounded-lg border border-border bg-surface p-4 text-sm">
            Un lien de connexion vient de t&apos;être envoyé à{" "}
            <strong>{email}</strong>. Vérifie ta boîte mail.
          </div>
        ) : (
          <form onSubmit={onMagic} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="ton@email.com"
              className="rounded-lg border border-border px-4 py-3 outline-none focus:border-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-foreground px-4 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Recevoir le lien
            </button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" /> ou{" "}
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={onGoogle}
          className="w-full rounded-lg border border-border px-4 py-3 font-medium transition-colors hover:bg-surface"
        >
          Continuer avec Google
        </button>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  );
}
