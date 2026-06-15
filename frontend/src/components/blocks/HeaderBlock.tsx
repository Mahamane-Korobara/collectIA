import type { ProfileConfig } from "@/lib/types";

export function HeaderBlock({ header }: { header?: ProfileConfig["header"] }) {
  const name = header?.name ?? "";
  const initials =
    name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "•";

  return (
    <header className="flex flex-col items-center gap-3 text-center">
      {header?.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={header.avatar}
          alt={name}
          className="h-24 w-24 object-cover"
          style={{ borderRadius: "var(--p-radius)" }}
        />
      ) : (
        <div
          className="flex h-24 w-24 items-center justify-center text-2xl font-semibold"
          style={{
            background: "var(--p-accent)",
            color: "var(--p-bg)",
            borderRadius: "var(--p-radius)",
          }}
        >
          {initials}
        </div>
      )}
      <h1 className="text-2xl font-bold">{name || "Sans nom"}</h1>
      {header?.tagline ? (
        <p style={{ color: "var(--p-muted)" }}>{header.tagline}</p>
      ) : null}
    </header>
  );
}
