"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";

type Props = { slug: string; heading?: string; preview?: boolean };

export function ContactBlock({ slug, heading, preview }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) return;
    setState("sending");
    try {
      await submitContact(slug, {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        message: form.message,
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  const fieldStyle = {
    border: "1px solid var(--p-muted)",
    borderRadius: "var(--p-radius)",
    background: "transparent",
    color: "var(--p-text)",
  } as const;

  if (state === "done") {
    return (
      <div
        className="px-5 py-6 text-center"
        style={{ border: "1px solid var(--p-accent)", borderRadius: "var(--p-radius)" }}
      >
        <p className="font-medium">Merci ! Ton message a bien été envoyé.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {heading ? <h2 className="text-lg font-semibold">{heading}</h2> : null}
      <input
        required
        placeholder="Ton nom"
        className="px-4 py-3 outline-none"
        style={fieldStyle}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Ton e-mail (optionnel)"
        className="px-4 py-3 outline-none"
        style={fieldStyle}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Ton téléphone (optionnel)"
        className="px-4 py-3 outline-none"
        style={fieldStyle}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <textarea
        required
        placeholder="Ton message"
        rows={4}
        className="px-4 py-3 outline-none"
        style={fieldStyle}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {state === "error" ? (
        <p className="text-sm text-red-600">Envoi impossible. Réessaie.</p>
      ) : null}
      <button
        type="submit"
        disabled={state === "sending" || preview}
        className="px-4 py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{
          background: "var(--p-accent)",
          color: "var(--p-bg)",
          borderRadius: "var(--p-radius)",
        }}
      >
        {state === "sending" ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
