export default async function FormPage({
  params,
}: {
  params: Promise<{ slug: string; form: string }>;
}) {
  const { form } = await params;

  return (
    <main className="flex flex-1 items-center justify-center p-10 text-center">
      <p className="text-muted">
        Le formulaire « {form} » arrivera avec le builder (V3).
      </p>
    </main>
  );
}
