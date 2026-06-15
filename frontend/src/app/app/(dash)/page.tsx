"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listSubmissions } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Submission, SubmissionStatus } from "@/lib/types";

const TABS: { value: "" | SubmissionStatus; label: string }[] = [
  { value: "", label: "Tout" },
  { value: "nouveau", label: "Nouveau" },
  { value: "repondu", label: "Répondu" },
  { value: "archive", label: "Archivé" },
];

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  nouveau: "Nouveau",
  repondu: "Répondu",
  archive: "Archivé",
};

export default function SuiviPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"" | SubmissionStatus>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    listSubmissions(token, filter || undefined)
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Suivi des demandes</h1>

      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              filter === t.value
                ? "bg-foreground text-background"
                : "border border-border hover:bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="text-muted">Aucune demande pour l&apos;instant.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((s) => (
            <li key={s.id}>
              <Link
                href={`/app/r/${s.id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface"
              >
                <span className="min-w-0">
                  <span className="font-medium">{s.name ?? "Anonyme"}</span>
                  <span className="block truncate text-sm text-muted">
                    {s.message ?? ""}
                  </span>
                </span>
                <span className="ml-4 shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                  {STATUS_LABEL[s.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
