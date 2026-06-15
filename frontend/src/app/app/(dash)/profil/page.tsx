"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ApiError,
  createProfile,
  listProfiles,
  slugAvailable,
  slugSuggest,
  updateProfile,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import { PRESETS } from "@/lib/theme";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { LinkItem, ProfileConfig } from "@/lib/types";

export default function ProfilEditorPage() {
  const [profileId, setProfileId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [slugState, setSlugState] = useState<"" | "ok" | "taken" | "invalid">("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [presetId, setPresetId] = useState("neutre");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    listProfiles(token)
      .then((r) => {
        const p = r.data[0];
        if (p) {
          setProfileId(p.id);
          setSlug(p.slug);
          setPublished(p.published);
          const c = p.config ?? {};
          setName(c.header?.name ?? "");
          setTagline(c.header?.tagline ?? "");
          setPresetId(c.theme?.preset ?? "neutre");
          const bioBlock = c.blocks?.find((b) => b.type === "bio");
          if (bioBlock && bioBlock.type === "bio") setBio(bioBlock.data.text ?? "");
          const linksBlock = c.blocks?.find((b) => b.type === "links");
          if (linksBlock && linksBlock.type === "links")
            setLinks(linksBlock.data.items ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const tokens = PRESETS.find((p) => p.id === presetId)?.tokens;

  const config: ProfileConfig = {
    theme: { preset: presetId, tokens },
    header: { name, tagline },
    blocks: [
      { type: "header", visible: true, data: {} },
      { type: "bio", visible: true, data: { text: bio } },
      { type: "links", visible: true, data: { items: links } },
      { type: "contact", visible: true, data: { heading: "Contacte-moi" } },
    ],
  };

  async function checkSlug() {
    if (!slug) return;
    try {
      const r = await slugAvailable(slug);
      setSlugState(r.available ? "ok" : r.reason === "taken" ? "taken" : "invalid");
    } catch {
      setSlugState("invalid");
    }
  }

  async function suggest() {
    if (!name) return;
    const r = await slugSuggest(name);
    setSlug(r.slug);
    setSlugState("ok");
  }

  async function onSave() {
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setMessage("");
    try {
      if (profileId) {
        await updateProfile(token, profileId, { config, published });
      } else {
        const r = await createProfile(token, { slug, config, published });
        setProfileId(r.data.id);
      }
      setMessage("Profil enregistré.");
    } catch (e) {
      setMessage(
        e instanceof ApiError
          ? e.errors?.slug?.[0] ?? e.message
          : "Enregistrement impossible.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Chargement…</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Édition */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Mon profil</h1>

        {!profileId && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Adresse publique
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">collectia.sahelstack.tech/</span>
              <input
                className="flex-1 rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase());
                  setSlugState("");
                }}
                onBlur={checkSlug}
                placeholder="ton-nom"
              />
              <button
                type="button"
                onClick={suggest}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
              >
                Suggérer
              </button>
            </div>
            {slugState === "ok" && (
              <p className="mt-1 text-xs text-green-600">Disponible ✓</p>
            )}
            {slugState === "taken" && (
              <p className="mt-1 text-xs text-red-600">Déjà pris.</p>
            )}
            {slugState === "invalid" && (
              <p className="mt-1 text-xs text-red-600">
                Nom invalide ou réservé.
              </p>
            )}
          </div>
        )}

        <Field label="Nom affiché">
          <input
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Accroche">
          <input
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </Field>

        <Field label="Bio">
          <textarea
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Field>

        <Field label="Liens">
          <div className="flex flex-col gap-2">
            {links.map((l, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="w-1/3 rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
                  placeholder="Libellé"
                  value={l.label}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...l, label: e.target.value };
                    setLinks(next);
                  }}
                />
                <input
                  className="flex-1 rounded-lg border border-border px-3 py-2 outline-none focus:border-foreground"
                  placeholder="https://…"
                  value={l.url}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...l, url: e.target.value };
                    setLinks(next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setLinks(links.filter((_, j) => j !== i))}
                  className="rounded-lg border border-border px-3 text-sm hover:bg-surface"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLinks([...links, { label: "", url: "" }])}
              className="self-start rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
            >
              + Ajouter un lien
            </button>
          </div>
        </Field>

        <Field label="Thème">
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPresetId(p.id)}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  presetId === p.id ? "border-foreground" : "border-border"
                }`}
                style={{ background: p.tokens.bg, color: p.tokens.text }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Page publiée
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-foreground px-5 py-3 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          {profileId && slug && published && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="text-sm text-muted hover:text-foreground"
            >
              Voir ma page ↗
            </Link>
          )}
        </div>
        {message && <p className="text-sm text-muted">{message}</p>}
      </div>

      {/* Aperçu live */}
      <div>
        <p className="mb-2 text-sm font-medium text-muted">Aperçu</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <BlockRenderer config={config} slug={slug || "apercu"} preview />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
