import type { LinkItem } from "@/lib/types";

export function LinksBlock({ items }: { items: LinkItem[] }) {
  if (!items?.length) return null;

  return (
    <nav className="flex flex-col gap-3">
      {items.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-3 text-center font-medium transition-opacity hover:opacity-80"
          style={{
            border: "1px solid var(--p-accent)",
            color: "var(--p-accent)",
            borderRadius: "var(--p-radius)",
          }}
        >
          {link.label || link.url}
        </a>
      ))}
    </nav>
  );
}
