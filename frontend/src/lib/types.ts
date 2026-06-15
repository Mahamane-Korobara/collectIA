// Types partagés front/API (CollectIA)

export type Workspace = {
  id: number;
  name: string;
  personal: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  current_workspace: Workspace | null;
};

// --- Configuration de profil (objet de rendu unique, CDC §5.5) ---

export type ThemeTokens = {
  bg?: string;
  text?: string;
  accent?: string;
  muted?: string;
  radius?: string;
  font?: string;
};

export type LinkItem = { label: string; url: string };

export type BlockType = "header" | "bio" | "links" | "contact";

export type Block =
  | { type: "header"; visible?: boolean; data: { avatar?: string; tagline?: string } }
  | { type: "bio"; visible?: boolean; data: { text?: string } }
  | { type: "links"; visible?: boolean; data: { items: LinkItem[] } }
  | { type: "contact"; visible?: boolean; data: { heading?: string } };

export type ProfileConfig = {
  theme?: { preset?: string; tokens?: ThemeTokens };
  header?: { name?: string; tagline?: string; avatar?: string };
  blocks?: Block[];
};

export type SeoMeta = { title?: string; description?: string };

// Profil public (ce que renvoie GET /public/profiles/{slug})
export type PublicProfile = {
  slug: string;
  config: ProfileConfig | null;
  seo_meta: SeoMeta | null;
};

// Profil côté propriétaire
export type Profile = PublicProfile & {
  id: number;
  workspace_id: number;
  published: boolean;
};

// --- Suivi ---

export type SubmissionStatus = "nouveau" | "repondu" | "archive";

export type Submission = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: SubmissionStatus;
  created_at: string;
  profile?: { id: number; slug: string };
};

export type SubmissionNote = {
  id: number;
  body: string;
  created_at: string;
  author?: { id: number; name: string };
};

export type SubmissionEvent = {
  id: number;
  type: string;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export type SubmissionDetail = Submission & {
  notes: SubmissionNote[];
  events: SubmissionEvent[];
};
