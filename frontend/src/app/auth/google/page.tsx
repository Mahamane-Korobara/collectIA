"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";

function Handle() {
  const sp = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = sp.get("token");
    if (sp.get("error") || !token) {
      setError(true);
      return;
    }
    setToken(token);
    router.replace("/app");
  }, [sp, router]);

  return (
    <p className="text-muted">
      {error ? "La connexion Google a échoué." : "Connexion en cours…"}
    </p>
  );
}

export default function GooglePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-10">
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <Handle />
      </Suspense>
    </main>
  );
}
