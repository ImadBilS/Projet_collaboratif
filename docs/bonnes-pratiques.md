# Bonnes pratiques de développement

Projet : **Projet_collaboratif / plateforme de ressources relationnelles**

Ce document décrit l'organisation du code, la gestion de la configuration,
les logs applicatifs, les conventions de nommage et le workflow Git à
respecter sur le projet.

## 1. Organisation du code (architecture MVC)

Le backend (`Back/`) suit une architecture proche du **MVC** :

```
Back/src/
├── routes/        # définition des endpoints HTTP (Express Router)
├── controllers/   # logique métier appelée par les routes (équivalent "Controller")
├── services/      # accès aux données / logique réutilisable (Prisma)
├── middlewares/   # fonctions transverses (authentification JWT, etc.)
├── db/            # connexion et configuration de la base de données (Prisma)
├── utils/         # fonctions utilitaires
└── server.js      # point d'entrée de l'application Express
```

- Le **modèle** (Model) est porté par **Prisma** (`schema.prisma` +
  `services/`), qui définit la structure des données et les requêtes vers
  PostgreSQL.
- Les **routes** définissent uniquement le mapping URL ↔ contrôleur
  (+ middleware d'authentification si nécessaire).
- Les **contrôleurs** contiennent la logique métier : validation des entrées,
  appel aux services, construction de la réponse HTTP.

Le frontend (`front-web/`) est organisé par responsabilité :

```
front-web/src/
├── pages/      # écrans de l'application (un fichier par page)
├── components/ # composants réutilisables
├── services/   # appels à l'API backend (apiClient, authService, ...)
└── ...
```

## 2. Configuration via variables d'environnement

Toute information de configuration ou secret (URL de base de données, clés
JWT, identifiants, URL de l'API, etc.) est fourni via des **variables
d'environnement**, jamais codé en dur dans le code source :

- `Back/.env` (développement local) / `.env.prod` (production, voir
  `.env.prod.example` pour le modèle) : `DATABASE_URL`, `JWT_SECRET`,
  `REFRESH_TOKEN_SECRET`, `CORS_ORIGIN`, `PORT`, etc.
- `front-web` : `VITE_API_URL` (URL de l'API, injectée au build).

**Règle** : aucun secret (mot de passe, clé privée, token) ne doit être
commité dans le dépôt. Les fichiers `.env`, `.env.prod` sont ignorés par git
(voir `.gitignore`). Seuls des fichiers `.env.*.example` (avec des valeurs
factices `changeme`) sont versionnés, pour documenter les variables
attendues.

## 3. Logs applicatifs

- Le backend journalise (`console.log` / `console.error`) les événements
  significatifs : erreurs serveur, échecs d'authentification, actions
  d'administration sensibles (changement de rôle, anonymisation d'un
  compte).
- Les logs ne doivent **jamais** contenir de données sensibles en clair
  (mots de passe, tokens JWT complets).
- En production, les logs sont consultables via Docker :
  ```bash
  docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f backend
  ```

## 4. Conventions de nommage

- **Fichiers backend** : `<domaine>.controller.js`, `<domaine>.routes.js`,
  `<domaine>.service.js` (ex: `users.controller.js`, `users.routes.js`).
- **Variables et fonctions** : `camelCase` en JavaScript/TypeScript
  (`getAllUsers`, `createUserProfile`).
- **Champs de base de données** (Prisma) : `snake_case` (`user_id`,
  `created_at`, `ressource_id`), reflétant les colonnes PostgreSQL.
- **Composants React** : `PascalCase` (`Dashboard.tsx`, `ResourcesPage.tsx`).
- **Variables d'environnement** : `UPPER_SNAKE_CASE` (`DATABASE_URL`,
  `JWT_SECRET`, `VITE_API_URL`).

## 5. Workflow Git et convention de branches

| Branche | Rôle |
| ------- | ---- |
| `main` | Code en production. Toute fusion sur `main` déclenche le déploiement automatique (`cd.yml`). |
| `develop` | Branche d'intégration pour les fonctionnalités en cours de validation avant mise en production. |
| `feature/<nom>` | Une branche par fonctionnalité ou tâche (ex: `feature/ci-cd`, `feature/anonymisation-compte`), créée à partir de `develop`. |
| `fix/<nom>` | Correction de bug, créée à partir de `main` (correctif urgent) ou `develop`. |

### Cycle de vie d'une fonctionnalité

1. Créer une branche `feature/<nom>` à partir de `develop`.
2. Développer, committer avec des messages clairs (préfixes recommandés :
   `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
3. Ouvrir une pull request vers `develop`. La CI (`ci.yml`) vérifie
   automatiquement l'installation, le lint et les tests.
4. Après revue et fusion sur `develop`, une pull request `develop` → `main`
   est ouverte pour la mise en production. La fusion sur `main` déclenche le
   déploiement automatique (`cd.yml`).

### Versioning

- Chaque déploiement en production correspond à une image Docker taguée avec
  le SHA du commit (`<sha>`), en plus du tag `latest`.
- Pour marquer une version livrée (ex: fin de sprint), créer un tag Git
  sémantique :
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```
