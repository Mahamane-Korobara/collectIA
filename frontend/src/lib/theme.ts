import type { CSSProperties } from "react";
import type { ProfileConfig, ThemeTokens } from "./types";

/**
 * Convertit les design tokens d'un profil en variables CSS (--p-*).
 * Appliquées sur le conteneur `.collectia-profile`, elles surchargent
 * les valeurs neutres par défaut sans re-render lourd (CDC §5.1).
 */
export function themeVars(tokens?: ThemeTokens): CSSProperties {
  const t = tokens ?? {};
  const vars: Record<string, string> = {};

  if (t.bg) vars["--p-bg"] = t.bg;
  if (t.text) vars["--p-text"] = t.text;
  if (t.accent) vars["--p-accent"] = t.accent;
  if (t.muted) vars["--p-muted"] = t.muted;
  if (t.radius) vars["--p-radius"] = t.radius;
  if (t.font) vars["--p-font"] = t.font;

  return vars as CSSProperties;
}

/** Presets soignés et neutres-friendly proposés à la création (CDC §5.6). */
export const PRESETS: { id: string; label: string; tokens: ThemeTokens }[] = [
  { id: "neutre", label: "Neutre", tokens: { bg: "#ffffff", text: "#18181b", accent: "#18181b", muted: "#6b7280" } },
  { id: "nuit", label: "Nuit", tokens: { bg: "#0b0f19", text: "#e5e7eb", accent: "#60a5fa", muted: "#94a3b8" } },
  { id: "sable", label: "Sable", tokens: { bg: "#faf7f0", text: "#3f3a2f", accent: "#b45309", muted: "#8a7f66" } },
  { id: "menthe", label: "Menthe", tokens: { bg: "#f6fefb", text: "#0f3d33", accent: "#0d9488", muted: "#5b7d76" } },
];

/** Configuration de départ pour un nouveau profil. */
export function defaultConfig(name: string, tokens?: ThemeTokens): ProfileConfig {
  return {
    theme: { preset: "neutre", tokens: tokens ?? PRESETS[0].tokens },
    header: { name, tagline: "" },
    blocks: [
      { type: "header", visible: true, data: {} },
      { type: "bio", visible: true, data: { text: "" } },
      { type: "links", visible: true, data: { items: [] } },
      { type: "contact", visible: true, data: { heading: "Contacte-moi" } },
    ],
  };
}
