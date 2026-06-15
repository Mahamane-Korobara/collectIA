"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  addNote,
  getSubmission,
  updateSubmissionStatus,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { SubmissionDetail, SubmissionStatus } from "@/lib/types";

const STATUSES: SubmissionStatus[] = ["nouveau", "repondu", "archive"];
const STATUS_LABEL: Record<SubmissionStatus, string> = {
  nouveau: "Nouveau",
  repondu: "Répondu",
  archive: "Archivé",
};

export default function SubmissionPage() {
  const { id } = useParams<{ id: string }>();
  const [sub, setSub] = useState<SubmissionDetail | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  function reload() {
    const token = getToken();
    if (!token) return;
    getSubmission(token, Number(id))
      .then((r) => setSub(r.data))
      .finally(() => setLoading(false));
  }

  useEffect(reload, [id]);

  async function changeStatus(status: SubmissionStatus) {
    const token = getToken();
    if (!token) return;
    await updateSubmissionStatus(token, Number(id), status);
    reload();
  }

  async function onAddNote(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token || !note.trim()) return;
    await addNote(token, Number(id), note.trim());
    setNote("");
    reload();
  }

  if (loading) return <p className="text-muted">Chargement…</p>;
  if (!sub) return <p className="text-muted">Demande introuvable.</p>;

  return (
    <div>
      <Link href="/app" className="text-sm text-muted hover:text-foreground">
        ← Retour au suivi
      </Link>

      <div className="mt-4 rounded-lg border border-border p-5">
        <h1 className="text-xl font-bold">{sub.name ?? "Anonyme"}</h1>
        <p className="mt-1 text-sm text-muted">
          {sub.email ?? "—"}
          {sub.phone ? ` · ${sub.phone}` : ""}
        </p>
        <p className="mt-4 whitespace-pre-line">{sub.message}</p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">Statut</p>
        <div className="flex gap-2">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => changeStatus(st)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                sub.status === st
                  ? "bg-foreground text-background"
                  : "border border-border hover:bg-surface"
              }`}
            >
              {STATUS_LABEL[st]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium">Notes</p>
        <form onSubmit={onAddNote} className="mb-3 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
            placeholder="Ajouter une note…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background">
            Ajouter
          </button>
        </form>
        <ul className="flex flex-col gap-2">
          {sub.notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-border px-3 py-2 text-sm">
              <p>{n.body}</p>
              <p className="mt-1 text-xs text-muted">
                {n.author?.name ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
