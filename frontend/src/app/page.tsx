import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <span className="text-4xl">🧠</span>
        <h1 className="text-4xl font-bold tracking-tight">CollectIA</h1>
        <p className="text-lg text-muted">
          Ta présence en ligne, tes contacts et leur suivi — réunis au même endroit.
        </p>
        <div className="flex gap-3">
          <Link
            href="/app/login"
            className="rounded-lg bg-foreground px-5 py-3 font-medium text-background transition-opacity hover:opacity-90"
          >
            Commencer
          </Link>
          <Link
            href="/app/login"
            className="rounded-lg border border-border px-5 py-3 font-medium transition-colors hover:bg-surface"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
