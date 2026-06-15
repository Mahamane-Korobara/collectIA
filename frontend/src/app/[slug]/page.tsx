import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError, getPublicProfile } from "@/lib/api";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { PublicProfile } from "@/lib/types";

async function load(slug: string): Promise<PublicProfile | null> {
  try {
    const { data } = await getPublicProfile(slug);
    return data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await load(slug);
  if (!profile) return { title: "Profil introuvable — CollectIA" };

  const name = profile.config?.header?.name ?? slug;
  return {
    title: profile.seo_meta?.title ?? `${name} — CollectIA`,
    description:
      profile.seo_meta?.description ??
      profile.config?.header?.tagline ??
      undefined,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await load(slug);
  if (!profile) notFound();

  return (
    <main className="flex-1">
      <BlockRenderer config={profile.config} slug={slug} />
    </main>
  );
}
