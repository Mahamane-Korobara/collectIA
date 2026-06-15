import type { ProfileConfig } from "@/lib/types";
import { themeVars } from "@/lib/theme";
import { HeaderBlock } from "./HeaderBlock";
import { BioBlock } from "./BioBlock";
import { LinksBlock } from "./LinksBlock";
import { ContactBlock } from "./ContactBlock";

type Props = {
  config: ProfileConfig | null;
  slug: string;
  preview?: boolean;
};

/**
 * Moteur de rendu UNIQUE des blocs (CDC §5.1) : utilisé en SSR pour la page
 * publique ET dans l'éditeur pour l'aperçu live. Aucune divergence possible.
 */
export function BlockRenderer({ config, slug, preview }: Props) {
  const blocks = config?.blocks ?? [];

  return (
    <div
      className="collectia-profile min-h-full w-full"
      style={themeVars(config?.theme?.tokens)}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-12">
        {blocks
          .filter((b) => b.visible !== false)
          .map((block, i) => {
            switch (block.type) {
              case "header":
                return <HeaderBlock key={i} header={config?.header} />;
              case "bio":
                return <BioBlock key={i} text={block.data.text ?? ""} />;
              case "links":
                return <LinksBlock key={i} items={block.data.items ?? []} />;
              case "contact":
                return (
                  <ContactBlock
                    key={i}
                    slug={slug}
                    heading={block.data.heading}
                    preview={preview}
                  />
                );
              default:
                return null;
            }
          })}

        <p className="pt-4 text-center text-xs" style={{ color: "var(--p-muted)" }}>
          créé avec CollectIA
        </p>
      </div>
    </div>
  );
}
