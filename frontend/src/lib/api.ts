import type {
  Profile,
  PublicProfile,
  Submission,
  SubmissionDetail,
  SubmissionNote,
  SubmissionStatus,
  User,
} from "./types";

const BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

type FetchOpts = RequestInit & { token?: string | null };

export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { token, headers, ...rest } = opts;

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    throw new ApiError(
      res.status,
      (body as { message?: string }).message ?? "Une erreur est survenue.",
      (body as { errors?: Record<string, string[]> }).errors,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// --- Auth (passwordless) ---

export const sendMagicLink = (email: string) =>
  apiFetch<{ message: string }>("/auth/magic-link", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const verifyMagicLink = (email: string, token: string) =>
  apiFetch<{ token: string; user: User }>("/auth/magic-link/verify", {
    method: "POST",
    body: JSON.stringify({ email, token }),
  });

export const googleRedirectUrl = () =>
  apiFetch<{ url: string }>("/auth/google/redirect");

export const me = (token: string) =>
  apiFetch<{ user: User }>("/me", { token });

export const logout = (token: string) =>
  apiFetch<{ message: string }>("/logout", { method: "POST", token });

// --- Slugs ---

export const slugSuggest = (name: string) =>
  apiFetch<{ slug: string }>(`/slug-suggest?name=${encodeURIComponent(name)}`);

export const slugAvailable = (slug: string) =>
  apiFetch<{ available: boolean; reason?: string }>(
    `/slug-available?slug=${encodeURIComponent(slug)}`,
  );

// --- Profils (propriétaire) ---

export const listProfiles = (token: string) =>
  apiFetch<{ data: Profile[] }>("/profiles", { token });

export const createProfile = (token: string, payload: Partial<Profile>) =>
  apiFetch<{ data: Profile }>("/profiles", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const updateProfile = (
  token: string,
  id: number,
  payload: Partial<Profile>,
) =>
  apiFetch<{ data: Profile }>(`/profiles/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

// --- Profil public (SSR) ---

export const getPublicProfile = (slug: string) =>
  apiFetch<{ data: PublicProfile }>(`/public/profiles/${slug}`, {
    next: { revalidate: 60 },
  } as FetchOpts);

export const submitContact = (
  slug: string,
  payload: { name: string; email?: string; phone?: string; message: string },
) =>
  apiFetch<{ message: string; id: number }>(
    `/public/profiles/${slug}/submissions`,
    { method: "POST", body: JSON.stringify(payload) },
  );

// --- Suivi ---

export const listSubmissions = (token: string, status?: string) =>
  apiFetch<{ data: Submission[]; total: number; current_page: number }>(
    `/submissions${status ? `?status=${status}` : ""}`,
    { token },
  );

export const getSubmission = (token: string, id: number) =>
  apiFetch<{ data: SubmissionDetail }>(`/submissions/${id}`, { token });

export const updateSubmissionStatus = (
  token: string,
  id: number,
  status: SubmissionStatus,
) =>
  apiFetch<{ data: Submission }>(`/submissions/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });

export const addNote = (token: string, id: number, body: string) =>
  apiFetch<{ data: SubmissionNote }>(`/submissions/${id}/notes`, {
    method: "POST",
    token,
    body: JSON.stringify({ body }),
  });
