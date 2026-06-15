"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyMagicLink } from "@/lib/api";
import { setToken } from "@/lib/auth";

function Verify() {
  const sp = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = sp.get("token");
    const email = sp.get("email");
    if (!token || !email) {
      setError(true);
      return;
    }
    verifyMagicLink(email, token)
      .then((r) => {
        setToken(r.token);
        router.replace("/app");
      })
      .catch(() => setError(true));
  }, [sp, router]);

  return (
    <p className="text-muted">
      {error ? "Ce lien est invalide ou a expiré." : "Connexion en cours…"}
    </p>
  );
}

export default function MagicPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-10">
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <Verify />
      </Suspense>
    </main>
  );
}
