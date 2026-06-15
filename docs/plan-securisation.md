# Plan de sécurisation

Projet : **Projet_collaboratif / plateforme de ressources relationnelles**

Ce document analyse les risques de sécurité du projet selon le référentiel
**OWASP Top 10**, propose une matrice de criticité et des actions
préventives, décrit la procédure de gestion de crise, et précise les
dispositions prises au regard du RGPD.

## 1. Analyse des risques (OWASP Top 10)

| # | Risque OWASP | Application au projet | Probabilité | Impact | Criticité | Actions préventives |
| - | ------------- | ----------------------- | ----------- | ------ | --------- | --------------------- |
| 1 | **Broken Access Control** | Accès aux routes d'administration (gestion des utilisateurs, rôles) sans contrôle suffisant | Moyenne | Élevé | **Élevée** | Middleware `authenticateJWT` sur toutes les routes sensibles ; vérification du rôle (ADMIN) côté backend pour les actions d'administration (pas seulement côté front) |
| 2 | **Cryptographic Failures** | Mots de passe et secrets stockés ou transmis en clair | Faible | Élevé | **Moyenne** | Mots de passe hashés avec `bcrypt` (`BCRYPT_SALT_ROUNDS`) ; secrets (JWT, refresh token) stockés dans `.env.prod` (non commité) ; HTTPS à activer via Traefik/Let's Encrypt |
| 3 | **Injection (SQL, etc.)** | Requêtes vers PostgreSQL construites à partir d'entrées utilisateur | Faible | Élevé | **Moyenne** | Utilisation de **Prisma** (requêtes paramétrées par défaut, pas de SQL concaténé) ; validation des entrées côté backend |
| 4 | **Insecure Design** | Fonctionnalités sensibles (signalements, modération) mal pensées dès la conception | Faible | Moyen | **Faible** | Revue de code via pull requests ; séparation des rôles (USER / ADMIN) |
| 5 | **Security Misconfiguration** | Configuration par défaut exposée (CORS trop permissif, en-têtes HTTP manquants, mode debug en prod) | Moyenne | Moyen | **Moyenne** | `CORS_ORIGIN` restreint au domaine du front en production ; `NODE_ENV=production` ; ajout recommandé du middleware `helmet` pour les en-têtes de sécurité HTTP |
| 6 | **Vulnerable and Outdated Components** | Dépendances npm obsolètes contenant des failles connues | Moyenne | Moyen | **Moyenne** | CI exécutant `npm ci` à chaque build (versions figées par `package-lock.json`) ; audit automatique (`npm audit`) à chaque exécution de la CI (voir ci-dessous) ; mises à jour automatisées via Dependabot (voir [plan-maintenance.md](./plan-maintenance.md)) |
| 7 | **Identification and Authentication Failures** | Vol de session, absence de limitation des tentatives de connexion | Moyenne | Élevé | **Élevée** | JWT avec expiration courte (`JWT_EXPIRES_IN`) + refresh token (`REFRESH_TOKEN_EXPIRES_IN`) ; recommandé : limitation du nombre de tentatives de connexion (`express-rate-limit`) sur `/api/auth/login` |
| 8 | **Software and Data Integrity Failures** | Image Docker modifiée / dépendance compromise lors du build | Faible | Moyen | **Faible** | Images construites depuis le code source via CI (GitHub Actions), publiées sur `ghcr.io` (registre privé lié au dépôt) |
| 9 | **Security Logging and Monitoring Failures** | Absence de traçabilité des actions sensibles (connexions, modifications de rôle, signalements traités) | Moyenne | Moyen | **Moyenne** | Logs applicatifs sur les actions d'authentification et d'administration (voir [bonnes-pratiques.md](./bonnes-pratiques.md)) ; conservation des logs Docker (`docker compose logs`) |
| 10 | **Server-Side Request Forgery (SSRF)** | Peu de surface d'attaque (pas d'appel à des URL fournies par l'utilisateur côté backend) | Faible | Faible | **Faible** | Aucune fonctionnalité actuelle ne fait d'appel HTTP sortant à partir d'une donnée utilisateur ; à surveiller en cas d'ajout d'une telle fonctionnalité |

### Matrice de criticité (probabilité × impact)

```
              Impact
              Faible      Moyen       Élevé
Probabilité
Élevée        Moyenne     Élevée      Critique
Moyenne       Faible      Moyenne     Élevée
Faible        Faible      Faible      Moyenne
```

Les risques classés **Élevée** (#1 Broken Access Control, #7 Authentification)
sont traités en priorité.

### Audit des dépendances (CI)

Chaque exécution de la CI (`.github/workflows/ci.yml`) lance `npm audit`
pour le backend, le front-web et le mobile, et publie un résumé coloré par
niveau de gravité dans le résumé du job GitHub Actions :

| Niveau | Couleur | Sévérité npm audit |
| ------ | ------- | -------------------- |
| Faible | 🟢 vert | `info`, `low` |
| Moyenne | 🟠 orange | `moderate` |
| Élevée / critique | 🔴 rouge | `high`, `critical` |

Une vulnérabilité 🔴 déclenche un avertissement (`::warning::`) visible sur
le run, sans faire échouer la CI (l'audit est informatif : les correctifs
passent par les pull requests Dependabot, voir
[plan-maintenance.md](./plan-maintenance.md)).

## 2. Mesures préventives transverses

- **En-têtes HTTP de sécurité** : ajout recommandé du middleware `helmet`
  (Express) pour définir des en-têtes comme `X-Content-Type-Options`,
  `X-Frame-Options`, `Content-Security-Policy`.
- **Validation des entrées** : validation systématique des champs reçus côté
  backend (types, formats, longueurs) avant traitement ou écriture en base.
- **HTTPS** : Traefik est configuré pour activer HTTPS via Let's Encrypt dès
  qu'un nom de domaine est associé au serveur (voir
  `docker-compose.prod.yml`, sections commentées).
- **Mots de passe** : hashés avec `bcrypt`, jamais stockés ni journalisés en
  clair.
- **Secrets** : aucune valeur sensible (mots de passe, clés JWT, clés SSH)
  n'est commitée dans le dépôt. Elles sont stockées dans `.env.prod` (ignoré
  par git) ou dans les secrets GitHub Actions (`SSH_HOST`, `SSH_USER`,
  `SSH_KEY`).
- **CORS** : la variable `CORS_ORIGIN` restreint les origines autorisées à
  appeler l'API.
- **Principe du moindre privilège** : les routes d'administration
  (utilisateurs, rôles, modération) nécessitent un rôle `ADMIN`, vérifié côté
  backend.

## 3. Procédure de gestion de crise (sécurité)

En cas de suspicion d'incident de sécurité (compromission de compte,
exposition de données, faille exploitée), la procédure suit 3 niveaux
d'escalade :

### Niveau 1 — Détection et confinement immédiat

- Toute personne constatant un comportement anormal (accès non autorisé,
  données visibles par un utilisateur non habilité, activité suspecte dans
  les logs) crée une issue GitHub avec le label `critical` et prévient
  immédiatement l'équipe.
- Mesures de confinement immédiates si nécessaire :
  - révoquer les sessions actives (rotation du `JWT_SECRET` /
    `REFRESH_TOKEN_SECRET` dans `.env.prod`, ce qui invalide tous les tokens
    existants) ;
  - désactiver temporairement le compte concerné (changement de rôle ou
    blocage applicatif) ;
  - si nécessaire, arrêter temporairement le service exposé
    (`docker compose stop frontend` / `backend`) pour limiter l'exposition.

### Niveau 2 — Analyse et correction

- Analyse des logs applicatifs et des logs Docker pour identifier l'origine
  et l'étendue de l'incident (quelles données, quels comptes, quelle
  période).
- Correction du code à l'origine de la faille (branche `fix/...`), avec
  revue de code obligatoire avant fusion.
- Si des données personnelles ont pu être exposées, qualifier l'incident au
  regard du RGPD (voir section 4).

### Niveau 3 — Déploiement, communication et retour d'expérience

- Déploiement du correctif via le pipeline CD (`cd.yml`) sur `main`.
- Information des utilisateurs concernés si leurs données ont été affectées
  (obligation légale en cas de fuite de données personnelles, cf. RGPD).
- Rédaction d'un post-mortem (cause, correction, mesures pour éviter la
  récidive), conservé dans l'issue GitHub correspondante.

## 4. RGPD — Données personnelles

### Données collectées

Le modèle `User` (Prisma) collecte les données suivantes :

- Identité : prénom, nom, date de naissance, sexe
- Contact : adresse e-mail
- Adresse postale : numéro, type de voie, code postal, complément, ville, pays
- Authentification : mot de passe (hashé), jetons de rafraîchissement (hashés)
- Profil : avatar, biographie
- Données d'usage : ressources créées, commentaires, réactions, signalements,
  progression sur les ressources (favoris, complétion)

### Finalité et durée de conservation

- Ces données sont nécessaires au fonctionnement de la plateforme
  (authentification, personnalisation, modération des contenus).
- Conservation : les données sont conservées tant que le compte utilisateur
  est actif. En cas de suppression de compte, les données d'identité et de
  contact sont anonymisées (voir ci-dessous) plutôt que conservées
  indéfiniment.

### Droit à l'effacement / anonymisation

Le modèle `User` dispose d'un champ `is_anonymized`, utilisé pour répondre au
droit à l'effacement (article 17 du RGPD) :

- Lorsqu'un administrateur anonymise un compte (action disponible côté
  portail admin), les données d'identité et de contact (nom, prénom, e-mail,
  adresse) sont remplacées par des valeurs génériques, et `is_anonymized`
  passe à `true`.
- Le contenu produit par l'utilisateur (ressources, commentaires) peut être
  conservé pour préserver la cohérence de la plateforme, mais n'est plus
  associé à une identité réelle.

### Droits des utilisateurs

Les utilisateurs peuvent demander :

- l'accès à leurs données (export depuis leur profil) ;
- la rectification de leurs informations (page profil) ;
- la suppression / anonymisation de leur compte (via une demande traitée par
  un administrateur, qui utilise la fonctionnalité d'anonymisation décrite
  ci-dessus).

### Sécurité des données

- Mots de passe hashés (`bcrypt`), jamais transmis ni stockés en clair.
- Accès aux données limité par rôle (`USER` / `ADMIN`).
- Transport chiffré (HTTPS) prévu via Traefik dès l'association d'un nom de
  domaine.
