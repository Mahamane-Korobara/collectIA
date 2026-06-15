# 🛠️ CollectIA — Plan d'exécution technique

> Dérivé de `docs/CDC-CollectIA.md` (v3.0). Séquencé V1 → V6. Architecture découplée : **Laravel 13 (VPS)** + **Next.js 16 (Vercel)**.

---

## 0. Fondations transverses (à poser DÈS la V1 — non « bolt-on-ables »)

Ces quatre piliers doivent exister avant toute fonctionnalité, car les ajouter après coup casserait le modèle :

- [ ] **Multi-tenant** : `workspace_id` sur toutes les tables métier dès la première migration ; workspace personnel créé à l'inscription.
- [ ] **Anti-collision d'URL** : table `reserved_slugs` + validation du slug + ordre de résolution des routes.
- [ ] **Cascade IA — niveau heuristique** : le filet déterministe (sans IA) existe dès qu'on branche le tri, pour tenir « jamais en panne ».
- [ ] **Chiffrement BYOK** : colonne chiffrée (`Crypt`) prête, jamais de clé en clair ni en log.

### Structure du dépôt (recommandée)
Deux dossiers à la racine (déploiements distincts → pas de monorepo lourd) :
```
CollectIA/
├── docs/
├── backend/    # Laravel 13  → VPS
└── frontend/   # Next.js 16  → Vercel
```
- [ ] `git` déjà initialisé (branche `main`). Pas d'attribution IA dans les commits.
- [ ] `backend/.env.example` et `frontend/.env.example` versionnés ; secrets hors dépôt.

---

## V1 — Le noyau

**Objectif :** page publique + bloc contact + suivi minimal + notifications. L'auteur l'utilise pour *sahelstack*.

### V1.1 — Backend Laravel (squelette + auth)
- [ ] `composer create-project laravel/laravel backend` (PHP 8.4).
- [ ] MySQL configuré ; `php artisan install:api` (Sanctum).
- [ ] Migrations dans l'ordre : `users` → `workspaces` → `workspace_user` (role `owner`/`member`) → `profiles` → `submissions` → `submission_notes` → `submission_events` → `push_subscriptions` → `reserved_slugs`.
- [ ] Modèles Eloquent + relations ; trait/scope global `BelongsToWorkspace` pour isoler chaque tenant.
- [ ] Seeder `reserved_slugs` (`app, api, login, register, dashboard, settings, admin, pricing, about, help, f, r, auth, oauth, webhooks, assets, _next, static, sitemap, robots`).

### V1.2 — API v1 + CORS
- [ ] Routes `routes/api.php` préfixe `v1/` : `auth`, `workspaces`, `profiles` (CRUD + config JSON), `submissions` (list/show/status/notes), `push/subscriptions`.
- [ ] Endpoint **public** non authentifié : `GET v1/public/profiles/{slug}` (lecture page) + `POST v1/public/profiles/{slug}/submissions` (réception contact).
- [ ] `config/cors.php` : autoriser `https://collectia.sahelstack.tech` ; cookies Sanctum cross-subdomain (`SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN=.sahelstack.tech`).
- [ ] Validation du slug (FormRequest) : `[a-z0-9-]`, 3–30, unicité insensible à la casse, refus si réservé, pas de tiret en bord.

### V1.3 — Frontend Next.js
- [x] `create-next-app` (App Router, TS, Tailwind v4, `src/`, alias `@/*`).
- [x] Client API typé (`lib/api.ts`) + `NEXT_PUBLIC_API_URL`. Auth client (`lib/auth.ts`, token + `useAuth`).
- [x] **Moteur de rendu unique des blocs** : `components/blocks/*` + `BlockRenderer` (SSR page publique ET aperçu live éditeur). Tokens via **variables CSS** (`--p-*`). UI de l'app **neutre/monochrome**, design coloré réservé aux pages publiques.
- [x] Routes :
  - `app/[slug]/page.tsx` → page publique SSR + `generateMetadata` SEO. *(QR code à ajouter)*
  - `app/[slug]/[form]/page.tsx` → stub V3.
  - `app/app/login` (lien magique + Google), `app/app/(dash)/page.tsx` (suivi), `app/app/(dash)/r/[id]` (fiche), `app/app/(dash)/profil` (éditeur aperçu live), `auth/magic` + `auth/google` (callbacks).
- [x] **Ordre de résolution** : `/app/*` et `/auth/*` (statiques) priment sur `/[slug]` — vérifié au build.
- [x] Groupe `(dash)` protégé par `useAuth` ; `login` hors du groupe (pas de boucle de redirection).

### V1.4 — Notifications (Push + temps réel)
- [ ] Backend : `composer require laravel/reverb` + `php artisan reverb:install` ; événement `SubmissionReceived` broadcast sur canal privé `workspace.{id}`.
- [ ] Web Push : lib VAPID (ex. `minishlink/web-push`) ; job `SendWebPush` ; stockage des abonnements.
- [ ] Job `SendEmailFallback` (file d'attente) en repli.
- [ ] Frontend : `public/sw.js` (Service Worker) + abonnement Push ; client Echo/Reverb pour la mise à jour live de la liste quand l'onglet est ouvert.
- [ ] Démarrer un worker : `php artisan queue:work`.

**✅ Validation V1 :** l'auteur publie sa page, reçoit une notification Push à chaque contact, et ouvre spontanément sa liste de suivi.

---

## V2 — La profondeur du cœur (IA + cascade de repli)

**Objectif :** tri plus intelligent que la concurrence, sans jamais tomber en panne.

- [ ] Colonnes `submissions` : `summary`, `priority_score`, `category`, `dedupe_key`, `triage_engine`, `triaged_at`.
- [ ] Job **asynchrone** `TriageSubmission` (déclenché après réception ; ne bloque pas la réponse au répondant).
- [ ] **Cascade** (interface `TriageDriver` + sélection par priorité) :
  1. `ByokDriver` (clé du workspace si présente/valide) ;
  2. `GeminiDriver` (clé partagée, `gemini-2.5-flash`, client HTTP Laravel) ;
  3. `OllamaDriver` (VPS, Gemma 3 4B — **construit seulement si limite Gemini atteinte**) ;
  4. `HeuristicDriver` (règles : mots-clés d'urgence, budget/date détectés, canal, longueur → score ; résumé = troncature) — **requis dès V2**.
- [ ] Sur quota/erreur Gemini : repli + statut `tri partiel` + **retry en file** au rétablissement.
- [ ] Détection de doublons : `dedupe_key` = hash(e-mail normalisé ⊕ téléphone E.164 via `libphonenumber`).
- [ ] Observabilité : logguer `triage_engine` + latence par tri.
- [ ] Front : badge priorité, résumé, indicateur de doublon, suggestion « réponds à celui-là d'abord ».

**✅ Validation V2 :** les utilisateurs traitent plus vite et dans le bon ordre.

### BYOK (rattaché à V2)
- [ ] Table `ai_credentials` : `workspace_id, provider, encrypted_key, model, status`.
- [ ] Écran **Paramètres → Intelligence** : saisie clé (masquée `••••`), choix provider/modèle, **test sonde** de validité, suppression.
- [ ] Chiffrement au repos ; jamais renvoyée au front ni dans les logs.

---

## V3 — Builder de formulaires
- [ ] Table `forms` : `workspace_id, profile_id, slug, type, schema(JSON), theme(JSON), banner_path`.
- [ ] **Types de formulaire** : RDV, candidature, devis, avis, sondage ; chacun lien public + QR code.
- [ ] **Types de champs** : `input` (texte court), `textarea`, `email`, `tel`, `number`, `select`, `radio`, `checkbox`, `date`, `file` (upload), `rating`. Schéma de champ : `{ id, type, label, placeholder, required, options[], validation }`.
- [ ] **Assistance IA à la création** : l'utilisateur décrit son besoin en une phrase → l'IA **propose une liste de champs** (type + label + requis) avec une UX claire. Chaque champ proposé est **acceptable ou rejetable individuellement** (toggle accepter/rejeter), réordonnable et éditable avant publication. Réutilise la couche IA (cascade + BYOK).
- [ ] **Thème du formulaire** : couleurs/police/rayon propres au formulaire (mêmes design tokens que le profil) + **image de bannière** (upload, recadrage).
- [ ] Éditeur à aperçu live (même moteur de rendu que le profil) ; rendu public via `app/[slug]/[form]`.
- [ ] Validation côté serveur générée à partir du `schema` (champs requis, types, tailles de fichier).

**✅ Validation V3 :** publication de formulaires variés (champs mixtes, thème, bannière), création assistée par IA acceptée/ajustée par l'utilisateur.

---

## V4 — Pipeline complet
- [ ] Kanban : `🆕 Nouveau → 📞 À contacter → 🔄 En cours → ✅ Conclu → ❌ Perdu` (drag & drop, mise à jour live Reverb).
- [ ] Collaborateurs : invitations, rôle `member`, assignation de demandes (`assigned_to`).
- [ ] Dashboard KPIs (demandes du jour, priorités, à traiter) en temps réel.
- [ ] Export CSV.
- [ ] Historique complet via `submission_events`.

**✅ Validation V4 :** une activité réelle se gère entièrement dans CollectIA.

---

## V5 — Expansion
- [ ] Canaux additionnels gratuits : Telegram, Discord (webhooks) ; WhatsApp si viable.
- [ ] Multilingue : FR/EN puis AR (i18n Next.js + back).
- [ ] Personnalisation avancée : **CSS custom scopé/sandboxé** (liste blanche, jamais de JS) + **domaine personnalisé**.
- [ ] Analytics avancés ; option tri 100 % local (Ollama) pour workspaces sensibles.

**✅ Validation V5 :** plus de canaux/langues sans canal payant.

---

## V6 — Paiement (tout dernier)
- [ ] Plans (gratuit / payants), limites, facturation.
- [ ] **Paiement local** : Wave, Orange Money, Mobile Money (webhooks, réconciliation, KYC).
- [ ] Tableau de bord d'abonnement. Garder en feature-flag jusqu'à des utilisateurs réellement actifs.

**✅ Validation V6 :** des utilisateurs actifs acceptent de payer.

---

## Déploiement (transverse)

### VPS (KVM2 — `api.` + `ws.`)
- [ ] Laravel servi par Nginx + PHP-FPM 8.4 sur `api.collectia.sahelstack.tech`.
- [ ] MySQL local.
- [ ] Processus persistants (supervisor) : `queue:work`, `schedule:run` (cron), **Reverb** sur `ws.collectia.sahelstack.tech`.
- [ ] Ollama (optionnel, CPU) activé seulement au besoin.
- [ ] TLS Let's Encrypt pour `api.` et `ws.`.

### Vercel (`collectia.`)
- [ ] Front Next.js déployé ; domaine `collectia.sahelstack.tech`.
- [ ] Variables : `NEXT_PUBLIC_API_URL`, clés Push publiques (VAPID public), URL WebSocket.
- [ ] Cache CDN agressif sur les pages publiques (`/[slug]`) — marché faible bande passante.

### DNS (`sahelstack.tech`)
- [ ] `collectia` → Vercel · `api.collectia` → VPS · `ws.collectia` → VPS.

---

## Ordre de démarrage conseillé (cette semaine)
1. Fondations §0 (dépôt, multi-tenant, slugs réservés).
2. V1.1 → V1.2 → V1.3 → V1.4 (le noyau complet).
3. Mettre en prod minimal et l'utiliser pour *sahelstack* → valider V1 avant V2.
