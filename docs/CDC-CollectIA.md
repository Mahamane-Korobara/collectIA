# 🧠 CollectIA — Cahier des Charges (Fonctionnel & Technique)

> **Ta présence en ligne, tes contacts et leur suivi — réunis au même endroit.**

| | |
|---|---|
| **Version** | 3.0 — Stack & infra tranchées, incohérences résolues, BYOK ajouté |
| **Date** | Juin 2026 |
| **Auteur** | Mahamane Korobara |
| **Nature** | Projet de fin d'études (BTS) + produit destiné au marché |
| **Cœur du produit** | Page publique + collecte de contacts + suivi intelligent |
| **Architecture** | **Découplée** — Laravel 13 (API, VPS) · Next.js 16 (front, Vercel) — sans service Python |
| **Domaines** | `collectia.sahelstack.tech` (front) · `api.collectia.sahelstack.tech` (back) · `ws.collectia.sahelstack.tech` (temps réel) |
| **Notifications** | Web Push (hors-ligne) **+** Reverb (temps réel in-app) **+** e-mail (filet) |
| **IA** | Gemini Flash par défaut + cascade de repli + **BYOK** (clé perso Claude/GPT/Gemini) |
| **Modèle** | Gratuit jusqu'à validation ; paiement introduit en tout dernier palier |
| **Statut** | Vision cadrée, séquencée par paliers V1 → V6 |

---

## 📝 Note de version — v3.0

### Ce qui change depuis la v2.1

- **Architecture renommée et clarifiée** : on ne parle plus de « monolithe ». Laravel + Next.js = **architecture découplée** (API REST/JSON d'un côté, front SSR de l'autre). L'argument « pas de sur-ingénierie » est conservé via *un seul backend, un seul front, pas de microservices*.
- **Infrastructure tranchée** : back Laravel sur **VPS (KVM2)**, front Next.js sur **Vercel**. Le domaine principal `sahelstack.tech` étant déjà occupé, CollectIA vit **en sous-domaines**.
- **Temps réel + Push séparés et assumés** : Reverb (WebSocket, in-app) et Web Push (Service Worker, hors-ligne) jouent deux rôles distincts et complémentaires.
- **Cascade de repli IA** : Gemini reste le moteur par défaut, mais une chaîne de secours garantit que **le tri ne tombe jamais en panne** même quand le quota est atteint.
- **BYOK (Bring Your Own Key)** : nouvelle section — l'utilisateur peut brancher sa propre clé API (Claude, GPT, Gemini…) pour un tri plus puissant et sans quota partagé.
- **Anti-collision d'URL formalisé** : mots réservés, ordre de résolution, validation de slug.
- **RGPD / consentement IA** : section dédiée (données de tiers envoyées au moteur IA).

### Ce qui n'est PAS dans ce document

- Une feuille de route de monétisation détaillée : le paiement est un palier (V6), pas le sujet du CDC.
- Un engagement à tout livrer simultanément : la richesse vient de la **profondeur du noyau**, pas du nombre de fonctionnalités livrées d'un coup. Chaque palier est validé avant le suivant.

---

# PARTIE 1 • LE PROJET

## 1. Le problème & la vision

### 1.1 Des situations que tout le monde vit

**Scène 1 — Pas de vitrine, juste un lien bricolé.** Aïcha, coach indépendante à Dakar, n'a ni page, ni endroit propre où envoyer les gens, ni trace de qui l'a contactée. Elle envoie son Instagram, ses DM se perdent.

**Scène 2 — Les contacts qui se perdent.** Karim, prestataire à Alger, reçoit des demandes par Google Form, DM et appels. En fin de semaine, il ne sait plus qui attend une réponse. Des contrats perdus faute de rappel.

**Scène 3 — Trois outils qui ne se parlent pas.** Ibrahim jongle entre Linktree, Google Forms et un carnet. Rien n'est relié, il copie-colle d'un outil à l'autre.

### 1.2 La vision

> **CollectIA en une phrase :** tu crées en quelques minutes ta page publique partageable. Les gens te contactent directement dessus, chaque demande est résumée et priorisée automatiquement, et tu la suis jusqu'à la conclusion — sans site web, sans CRM, sans jongler entre cinq outils.

| Le problème aujourd'hui | Ce que CollectIA apporte |
|---|---|
| Pas de présence propre, juste un réseau social | Une page publique partageable, à ton nom, en quelques minutes |
| Les contacts arrivent éparpillés | Un point d'entrée unique pour toutes les demandes |
| Les demandes se lisent en vrac | Chaque demande résumée, scorée et priorisée automatiquement |
| On oublie de relancer | Un suivi clair : qui répondre, qui relancer, où ça en est |
| Trois outils qui ne se parlent pas | Présence + collecte + suivi dans un seul produit |
| Outils étrangers, en anglais | Léger, francophone, adapté aux usages locaux |

## 2. Le positionnement

> **Règle d'or :** CollectIA n'est pas « un générateur de formulaires de plus ». La force vient d'un **système à trois leviers** que les concurrents fragmentés ne réunissent pas.

| Levier | Rôle | Pourquoi c'est défendable |
|---|---|---|
| **Présence** (la porte d'entrée) | La page publique attire l'inscription même sans besoin immédiat de formulaire | Besoin universel, pas une commodité |
| **Suivi** (le verrou) | Le pipeline devient le carnet de bord de l'activité | Une fois l'activité dedans, partir = tout abandonner |
| **Boucle de croissance** | Chaque page partagée porte « créé avec CollectIA » | Chaque répondant public = acquisition gratuite |

> **L'insight clé :** la collecte n'a aucun verrou (Google Forms le prouve). Le verrou est dans **le suivi**. L'essentiel de l'effort produit doit donc porter sur le suivi.

### 2.1 Face à la concurrence

| Concurrent | Ce qu'il fait | Ce qui lui manque |
|---|---|---|
| Linktree / Bento | Page de liens | Ne collecte rien, ne suit rien |
| Google Forms | Collecte gratuite | Aucune présence, aucun suivi, données en vrac |
| Calendly | Page + RDV | Centré RDV, pas de collecte/suivi générique |
| Typeform / Tally | Formulaires + IA | Anglais-first, prix en devises, pas de suivi |
| « Juste mon Insta » | Présence informelle | Aucune organisation, contacts perdus |

> **Honnêteté concurrentielle :** la génération IA et les notifications sont copiables. Le seul fossé durable est la **consolidation présence + collecte + suivi** adaptée à un marché mal servi — et, à terme, **le paiement local**.

## 3. Les utilisateurs

> **Le piège du « pour tout le monde » :** la question n'est pas « qui peut l'utiliser » mais « **par qui on commence** ». Réponse dictée par l'accès réel aux testeurs.

| Profil | Exemple | Ce qu'il reçoit |
|---|---|---|
| Freelance / créateur | Dev, designer indépendant | Demandes de mission |
| Coach / formateur | Aïcha, Dakar | Inscriptions, demandes d'info |
| Artisan / prestataire | Plombier, électricien | Demandes de devis |
| Petite agence | Agence web, immo | Leads, briefs |
| Commerçant / service | Boutique, salon | Réservations, avis |

> **Premier marché :** l'auteur lui-même (présence *sahelstack*), puis son cercle direct — étudiants INSFP, jeunes devs, freelances locaux. **Le marché accessible cette semaine**, pas le marché idéal.

### 3.1 Les rôles du système (multi-tenant dès le départ)

| Rôle | Ce qu'il fait | Ce qu'il voit |
|---|---|---|
| **Propriétaire (Owner)** | Crée page/formulaires, configure, gère l'équipe et la facturation | Dashboard complet, analytics, pipeline |
| **Collaborateur (Member)** | Consulte, traite les contacts, ajoute des notes | Formulaires assignés, pipeline |
| **Répondant (public)** | Visite la page, remplit le formulaire | Uniquement la page publique |

> ⚠️ **Conséquence technique majeure :** le modèle de données est **multi-tenant dès la V1**. Toute donnée (profil, formulaire, contact, note) appartient à un **Workspace** (organisation), même pour un utilisateur solo (workspace personnel par défaut). On ne « bolt-on » pas le multi-tenant après coup. Voir §16.

## 4. Ce que fait le produit complet

> À lire comme une **destination**, pas un point de départ. La Partie 2 le découpe en paliers.

- **4.1 La présence — la page publique.** Page accessible à la racine : `collectia.sahelstack.tech/nom-profil`. Photo/logo, nom, bio, liens, bloc contact. Partageable par lien et QR code. Remplace Linktree.
- **4.2 La collecte — les formulaires.** D'abord un bloc « contacte-moi », puis un vrai constructeur : plusieurs formulaires typés (RDV, candidature, devis, avis, sondage), chacun avec lien public + QR. Chaque formulaire mélange des **types de champs** (texte court, zone de texte, e-mail, téléphone, nombre, liste déroulante, cases/boutons radio, date, **fichier**, note/étoiles), possède son **thème propre** (couleurs/police via les mêmes design tokens) et une **image de bannière**. **Création assistée par IA** : l'utilisateur décrit son besoin, l'IA **propose des champs avec une UX soignée** que l'utilisateur **accepte ou rejette un par un**, réordonne et ajuste avant publication.
- **4.3 L'intelligence — le tri automatique.** Pour chaque demande : résumé en une phrase, score de priorité + catégorisation, suggestion d'action/délai, détection de doublons (e-mail / téléphone normalisé). La donnée arrive **triée**, pas en vrac.
- **4.4 Le suivi — le pipeline.** `🆕 Nouveau → 📞 À contacter → 🔄 En cours → ✅ Conclu → ❌ Perdu`.
- **4.5 La notification — la donnée vient à toi.** Voir §15 pour la distinction Push / temps réel.
- **4.6 Le pilotage.** Dashboard KPIs, collaborateurs, export CSV.

## 5. Personnalisation du profil

> **Stratégique, pas décoratif :** personnaliser sa page crée de l'appartenance → de la rétention. Chaque page personnalisée est aussi une meilleure vitrine (boucle de croissance).

### 5.1 Le principe : aperçu live

Le profil est un **objet de configuration (JSON)** qui décrit tout (couleurs, police, disposition, blocs). La page publique et l'éditeur lisent le **même objet via le même moteur de rendu** (composant Next.js partagé SSR + client). Modifier une valeur redessine l'aperçu instantanément.

> **Règle non négociable :** un seul moteur de rendu. Deux codes de rendu = divergence garantie. La logique de rendu vit **uniquement côté Next.js** ; Laravel ne fait que stocker/servir le JSON.

> **Couleurs = variables CSS (design tokens) :** couleurs, polices et rayons passent par des variables CSS → changement instantané sans re-render lourd.

### 5.2 Le modèle en blocs

Liste ordonnée de blocs, ajoutables/réordonnables/configurables. Ajouter un type de bloc = ajouter une capacité sans toucher au reste.

| Bloc | Pour qui | Contenu |
|---|---|---|
| En-tête | Tous | Avatar/logo, nom, tagline, couverture |
| Bio / À propos | Tous | Texte riche |
| Liens | Tous | Link-in-bio |
| Contact | Tous | Le formulaire de collecte |
| Projets / Portfolio | Dev | Galerie GitHub (GitFolio) |
| Stack / Compétences | Dev | Badges techno |
| Galerie | Artisan, créatif | Photos |
| Services | Coach, prestataire | Offres détaillées |
| Témoignages | Coach, agence | Avis clients |
| CTA (devis, RDV) | Prestataire | Bouton d'action |
| Vidéo / Embed | Tous | Média externe |

### 5.3 Templates par métier

| Template | Blocs pré-configurés |
|---|---|
| Portfolio Dev | En-tête + Bio + Stack + Projets (GitHub) + Contact |
| Coach / Formateur | En-tête + Bio + Services + Témoignages + Contact |
| Prestataire / Artisan | En-tête + Bio + Galerie + CTA devis + Contact |
| Vierge | En-tête + Contact |

> **GitFolio réutilisé** comme bloc « Projets dev » (OAuth GitHub, templates, preview), absorbé plutôt que produit séparé.

### 5.4 Deux niveaux d'édition

| Niveau | Pour qui | Capacités | Palier |
|---|---|---|---|
| Visuel | Tous | Thèmes, accent, police, blocs, disposition | V1 / V2 |
| Avancé (dev) | Devs | CSS custom scopé, domaine personnalisé | Ultérieur (V5) |

### 5.5 Structure de l'objet de configuration

| Clé | Rôle |
|---|---|
| `theme.preset` | Thème de base |
| `theme.tokens` | Couleurs, police, rayon, mode clair/sombre (→ variables CSS) |
| `header` | Avatar, nom, tagline, couverture |
| `blocks[]` | Liste ordonnée `{ type, ordre, visible, data }` |
| `meta` | Slug, titre & description SEO |

### 5.6 Garde-fous

- **Presets propres** : 3-4 thèmes soignés au départ. Chaque page cassée = mauvaise pub.
- **Contraste** : vérification automatique du ratio (WCAG AA) à l'enregistrement du thème ; combinaisons illisibles refusées ou auto-corrigées.
- **CSS custom** : sandboxé et scopé au conteneur du profil. **Jamais de JS arbitraire** (XSS). Liste blanche de propriétés CSS.
- **Découpage** : l'éditeur live est la partie la plus coûteuse. V1 = thèmes + accent + police + blocs de base. La liberté totale (CSS, domaine) vient en V5.

## 6. Intelligence augmentée & BYOK (Bring Your Own Key)

> **Pourquoi :** certains utilisateurs (devs, power users, agences) veulent un tri plus puissant que le quota gratuit partagé, ou veulent garder la maîtrise de leurs données. CollectIA leur permet de **brancher leur propre clé API**.

### 6.1 Principe

| Mode | Moteur | Pour qui |
|---|---|---|
| **Par défaut (partagé)** | Gemini Flash, clé CollectIA, quota partagé | Tout le monde, sans config |
| **BYOK** | Clé perso de l'utilisateur : Claude, GPT, Gemini, ou compatible OpenAI | Power users, agences, devs |

### 6.2 Règles BYOK

- L'utilisateur saisit sa clé dans **Paramètres → Intelligence**. Elle est **chiffrée au repos** (chiffrement applicatif, jamais en clair en base ni dans les logs).
- Au moment du tri, si une clé BYOK valide existe pour le workspace → elle est utilisée **en priorité** ; sinon, repli sur le moteur partagé.
- Choix du fournisseur + modèle exposé (ex. `claude-haiku-4-5`, `gpt-…`, `gemini-2.5-flash`).
- **Bénéfice données** : avec sa propre clé (tier payant du fournisseur), l'utilisateur n'est plus soumis à l'entraînement sur ses données → argument RGPD fort (voir §17).
- Test de validité de la clé à la saisie (appel sonde) + indicateur d'état (clé valide / quota / invalide).

---

# PARTIE 2 • LA SÉQUENCE DE CONSTRUCTION

## 7. Le principe de séquençage

> **Règle de fer :** on ne passe au palier suivant que lorsque le précédent est entre des mains réelles (au minimum l'auteur, idéalement quelques INSFP). La V1 n'est pas la version pauvre : c'est **l'instrument de mesure** qui dit si ça vaut le coup de construire le reste.

> ℹ️ **Fondations transverses dès la V1** (non négociables car non « bolt-on-ables a posteriori) : modèle **multi-tenant**, **anti-collision d'URL**, **cascade de repli IA**, **chiffrement BYOK**. Voir Partie 3. Le séquençage porte sur les *fonctionnalités*, pas sur ces fondations d'architecture.

### V1 — Le noyau
**Objectif :** le minimum utilisable que l'auteur emploie lui-même.
- Page publique (`/nom-profil`) avec liens et QR code
- Bloc de contact sur la page
- Suivi minimal : liste avec statuts (nouveau / répondu / archivé) + notes
- **Web Push + temps réel** à chaque demande
- *(Fondations : workspace multi-tenant, anti-collision slug, auth)*

**Validation :** l'auteur utilise réellement sa page pour *sahelstack* et l'ouvre spontanément pour voir ses contacts.

### V2 — La profondeur du cœur (IA)
**Objectif :** rendre le traitement plus intelligent que la concurrence.
- Résumé automatique des demandes
- Score de priorité + catégorisation
- Suggestion « réponds à celui-là d'abord »
- Détection de doublons
- **Cascade de repli IA + BYOK** (§14)

**Validation :** les utilisateurs traitent leurs demandes plus vite et dans le bon ordre.

### V3 — Le builder de formulaires
**Objectif :** passer du simple contact à un vrai outil de collecte.
- Plusieurs formulaires par utilisateur (RDV, candidature, devis, avis, sondage)
- Lien public + QR code par formulaire
- Génération/assistance à la création

**Validation :** les utilisateurs publient des formulaires variés.

### V4 — Le pipeline complet
**Objectif :** transformer le suivi minimal en poste de pilotage.
- Pipeline Kanban complet
- Collaborateurs et assignation
- Dashboard KPIs temps réel
- Export CSV

**Validation :** une activité réelle se gère entièrement dans CollectIA.

### V5 — L'expansion
**Objectif :** élargir canaux, portée, personnalisation avancée.
- Canaux additionnels gratuits (Telegram, Discord ; WhatsApp si viable)
- Multilingue (FR/EN, puis AR)
- Profil enrichi : **CSS custom + domaine personnalisé**
- Analytics avancés

**Validation :** le produit couvre plus de canaux/langues sans canal payant.

### V6 — Le paiement (tout dernier)
**Objectif :** monétiser un produit déjà indispensable.
- Plans réels (gratuit / payants)
- **Paiement local** (Wave, Orange Money, Mobile Money…) : le vrai fossé commercial
- Limites et facturation
- Tableau de bord d'abonnement

**Validation :** des utilisateurs déjà actifs acceptent de payer ; la monétisation suit l'usage.

---

# PARTIE 3 • ORIENTATION TECHNIQUE

## 8. La stack — décision

> **Décision : Laravel 13 (API, VPS) + Next.js 16 (front, Vercel). Architecture découplée, un seul backend, un seul front, pas de microservices, pas de Python.**

| Couche | Choix | Pourquoi |
|---|---|---|
| Back-end | Laravel 13 (PHP 8.4) | Auth, files d'attente, Reverb, Eloquent, scheduler intégrés ; expertise existante |
| Front-end | Next.js 16 (App Router) | SSR/SEO indispensable pour les profils publics ; idéal pour l'éditeur live (état React) |
| Temps réel | Laravel Reverb (WebSocket) | Mise à jour live in-app, gratuit |
| Push hors-ligne | Web Push (VAPID + Service Worker) | Notification site fermé, gratuit, sans store |
| **Écartés** | Django / Flask / FastAPI | 2e langage/runtime pour zéro bénéfice ici |

## 9. Infrastructure & déploiement

> Le domaine principal `sahelstack.tech` étant déjà occupé, CollectIA vit en **sous-domaines**.

| Composant | Hébergement | Domaine |
|---|---|---|
| Front Next.js (SSR, profils publics, éditeur, app) | **Vercel** | `collectia.sahelstack.tech` |
| API Laravel (REST/JSON) | **VPS (KVM2, 2 vCPU / 8 Go)** | `api.collectia.sahelstack.tech` |
| Reverb (WebSocket temps réel) | **VPS** (process persistant — impossible sur serverless) | `ws.collectia.sahelstack.tech` |
| Files d'attente + scheduler (tri IA, e-mails, Push) | **VPS** (worker `queue:work` + cron) | — |
| Ollama (repli IA, optionnel) | **VPS**, CPU seul | local |
| Base de données | **VPS** (PostgreSQL) | local |

**Flux :**
1. Le front Vercel rend les profils publics en SSR en appelant `api.collectia.sahelstack.tech` (cache CDN agressif sur les pages publiques pour le marché faible bande passante).
2. L'app privée (dashboard) consomme la même API + se connecte au WebSocket `ws.` pour le live.
3. CORS et auth (Sanctum / tokens) configurés entre `collectia.` et `api.`.

> ⚠️ **Conséquence :** front et back sont **deux déploiements** sur deux infras. Variables d'env, CORS et certificats (sous-domaines + TLS) à gérer des deux côtés.

## 10. Principes d'architecture (transverses)

| Besoin produit | Contrainte technique |
|---|---|
| Page publique partageable et indexable | SSR / SEO Next.js + cache CDN ; pages légères |
| Notification immédiate | Web Push (hors-ligne) + Reverb (live) ; e-mail en repli |
| Suivi qui retient | Modèle contacts/pipeline robuste, historisé |
| Marché faible bande passante (3G) | Charges légères, cache agressif, peu de deps lourdes |
| Produit solo, budget contraint | Découplé mais simple : 1 API + 1 front, pas de microservices |
| Croissance virale | Mention « créé avec CollectIA » sur les pages publiques |
| Multi-tenant | Toute donnée rattachée à un `workspace_id` dès le départ |

## 11. URL & structure du profil public

> Le profil vit à la racine du sous-domaine : `collectia.sahelstack.tech/aicha`. Plus court, mémorisable, crédible comme adresse pro.

### 11.1 Solution anti-collision (formalisée)

Un slug à la racine entre en collision avec les routes système. Trois garde-fous :

1. **Liste de mots réservés** interdits à l'inscription : `app, api, login, register, dashboard, settings, admin, pricing, about, help, f, r, auth, oauth, webhooks, assets, _next, static, sitemap, robots`… (liste maintenue côté back ET front).
2. **Ordre de résolution** : les routes système sont des **chemins fixes préfixés** (`/app/*`, `/api` étant sur un autre sous-domaine) résolus **avant** le segment dynamique `/[slug]`. Next.js App Router : routes statiques > route dynamique `[slug]`.
3. **Validation du slug** : caractères `[a-z0-9-]`, longueur 3–30, unicité (insensible à la casse, normalisée en minuscules), pas de tiret en début/fin, refus si dans la liste réservée.

### 11.2 Carte des URL

| Élément | Forme d'URL |
|---|---|
| Profil public | `collectia.sahelstack.tech/nom-profil` |
| Formulaire public | `collectia.sahelstack.tech/nom-profil/nom-formulaire` |
| Fiche d'une réponse (privée) | `collectia.sahelstack.tech/app/r/identifiant` |
| Espace de travail (privé) | `collectia.sahelstack.tech/app/…` |
| API | `api.collectia.sahelstack.tech/v1/…` |
| WebSocket | `ws.collectia.sahelstack.tech` |

> **Décision tranchée :** le formulaire public est **imbriqué sous le profil** (`/nom-profil/nom-formulaire`), pas sous `/f/slug`. Cohérent avec l'« adresse pro ». Le préfixe `/app/*` isole tout le privé et évite la collision avec les slugs publics.

## 12. Notifications : Push **et** temps réel (rôles distincts)

> Deux mécanismes **complémentaires**, jamais interchangeables :

| Mécanisme | Techno | Quand ça agit | Rôle |
|---|---|---|---|
| **Temps réel** | Laravel Reverb (WebSocket) | Dashboard **ouvert** | La liste/Kanban se met à jour live, sans rafraîchir |
| **Web Push** | VAPID + Service Worker | Dashboard **fermé** | La notification arrive sur l'appareil → « la donnée vient à toi » |
| **E-mail** | File d'attente Laravel | Filet de sécurité | Si Push refusé/indisponible |

**Flux d'une nouvelle demande :** réception → enregistrement → événement Reverb (si onglet ouvert) **+** Web Push (toujours) **+** e-mail (repli). Le principe « la donnée vient à toi » repose sur **Web Push**, pas sur Reverb.

## 13. La couche IA — Gemini par défaut

> La tâche IA est du **tri** (résumé + score + priorité), pas de la génération longue : un petit modèle suffit. `gemini-2.5-flash` / `flash-lite` en niveau gratuit, via le client HTTP de Laravel — appelé depuis un **job en file d'attente** (asynchrone, pour ne pas bloquer la réponse au répondant).

> ⚠️ Noms de modèles et quotas Gemini **à recouper** (susceptibles d'évoluer).

## 14. Cascade de repli IA — « jamais en panne »

> **Exigence :** si le quota Gemini est atteint, l'app **ne perd pas en efficacité**. Le tri ne tombe jamais en panne grâce à une chaîne de repli déterministe et observable.

Ordre d'exécution pour chaque demande à trier :

1. **Clé BYOK du workspace** (si présente et valide) → fournisseur choisi (Claude/GPT/Gemini). *Pas de quota partagé, pas d'entraînement sur données.*
2. **Gemini Flash partagé** (clé CollectIA, niveau gratuit). Moteur par défaut.
3. **Ollama auto-hébergé** sur le VPS (Gemma 3 4B / Qwen2.5 3B quantifié, CPU ≈ 10 s) — activé **uniquement** quand on heurte réellement la limite Gemini.
4. **Heuristique déterministe (sans IA)** — filet ultime : score par règles (mots-clés d'urgence, longueur, présence d'un budget/date, canal), résumé = troncature intelligente, statut `nouveau`. La demande est **marquée « tri partiel »** et **re-traitée automatiquement** par l'IA dès que le quota se rétablit (retry en file).

> **Discipline :** ne construire les niveaux 3 et 4 que lorsqu'ils deviennent nécessaires — mais **le niveau 4 (heuristique) est requis dès la V2** pour tenir la promesse « jamais en panne ». Le niveau 3 (Ollama) reste optionnel jusqu'à atteindre la limite Gemini.

**Observabilité :** chaque tri logge le moteur utilisé (`byok` / `gemini` / `ollama` / `heuristic`) et la latence → permet de savoir quand passer au repli suivant.

## 15. Sécurité des clés (BYOK)

- Clés API stockées **chiffrées au repos** (chiffrement applicatif Laravel `Crypt`), jamais en clair, jamais dans les logs ni renvoyées au front.
- Au front, la clé n'est jamais réaffichée (masquée `••••`), seul un état est exposé.
- Validation par appel sonde à la saisie ; suppression possible à tout moment.

## 16. Modèle de données (multi-tenant dès la V1)

> Toute donnée appartient à un **Workspace**. Un utilisateur solo a un workspace personnel créé automatiquement.

| Table | Rôle | Clés / champs notables |
|---|---|---|
| `users` | Comptes | email, password, … |
| `workspaces` | Tenant / organisation | owner_id, name |
| `workspace_user` | Appartenance + rôle | workspace_id, user_id, role (`owner`/`member`) |
| `profiles` | Page publique | workspace_id, **slug (unique)**, config JSON (§5.5), seo_meta |
| `forms` | Formulaires | workspace_id, profile_id, slug, type, schema JSON (champs typés), theme JSON, banner_path |
| `submissions` | Réponses entrantes | form_id, payload JSON, **status**, **priority_score**, summary, category, dedupe_key |
| `submission_notes` | Notes de suivi | submission_id, user_id, body |
| `submission_events` | Historique (audit) | submission_id, type, meta, created_at |
| `ai_credentials` | BYOK | workspace_id, provider, **encrypted_key**, model, status |
| `push_subscriptions` | Web Push | user_id, endpoint, keys |
| `reserved_slugs` | Mots réservés | slug |

**Détection de doublons :** `dedupe_key` = hash de (e-mail normalisé ⊕ téléphone normalisé via `libphonenumber`, format E.164 multi-pays +221/+213…). Index unique souple pour signaler les doublons sans bloquer.

**Index clés :** `submissions(workspace_id, status, priority_score)`, `profiles(slug)` unique, `forms(profile_id, slug)`.

## 17. Confidentialité & RGPD (données de tiers chez l'IA)

> ⚠️ **Point juridique majeur :** les données envoyées au moteur IA ne sont **pas** celles de l'utilisateur, mais celles du **répondant public** (un tiers). Le niveau gratuit Gemini peut **entraîner sur les données**.

Mesures :
- **Mention claire** sur le formulaire public : les messages sont traités par une IA pour résumé/priorisation.
- **BYOK (tier payant)** → bascule en mode « no-training » côté fournisseur ; recommandé pour les usages sensibles.
- **Minimisation** : n'envoyer à l'IA que le strict nécessaire (message + métadonnées de tri), jamais plus que le besoin.
- **Avertissement bêta-testeurs** sur le moteur par défaut.
- Option future (V5+) : tri **100 % local via Ollama** pour les workspaces qui exigent qu'aucune donnée ne sorte du VPS.

## 18. Prochaine étape

Cadrer la **V1 en détail** : écrans (page publique, éditeur live, liste de suivi, paramètres), **schéma de base** (tables ci-dessus), **routes API** `v1/*` et **routes front** (`/[slug]`, `/[slug]/[form]`, `/app/*`), config **CORS + auth Sanctum** entre `collectia.` et `api.`, et **anti-collision slug** opérationnel. La V1 est l'instrument qui valide tout le reste.
