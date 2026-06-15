export function BioBlock({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p
      className="whitespace-pre-line text-center leading-relaxed"
      style={{ color: "var(--p-text)" }}
    >
      {text}
    </p>
  );
}
