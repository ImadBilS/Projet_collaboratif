# Plan de déploiement

Projet : **Projet_collaboratif / plateforme de ressources relationnelles**

Ce document décrit les environnements du projet, l'architecture de déploiement,
les outils utilisés et les étapes pour déployer l'application.

## 1. Environnements

Le projet est organisé autour de trois environnements, associés chacun à une
branche Git (voir [bonnes-pratiques.md](./bonnes-pratiques.md) pour la
convention de branches complète) :

| Environnement | Branche      | Objectif                                              | Statut actuel |
| -------------- | ------------ | ------------------------------------------------------ | ------------- |
| Développement  | `feature/*`, `develop` | Travail au quotidien, exécution locale (npm run dev) | Local, sur chaque poste |
| Test / staging | `develop`    | Validation des fonctionnalités avant mise en production, via la CI | Automatisé via GitHub Actions (CI) |
| Production     | `main`       | Application accessible publiquement                    | Automatisé via GitHub Actions (CI/CD) sur un VPS Azure |

Conformément à la consigne de ne pas démultiplier les environnements pour ce
projet, **un seul environnement est entièrement déployé et automatisé : la
production**. Les environnements de développement et de test reposent sur les
mêmes outils (Docker, Docker Compose, GitHub Actions) et peuvent être
reproduits de la même façon sur un autre serveur si besoin (il suffit
d'adapter le fichier `.env.prod` et le nom de la branche déclenchant le
déploiement).

## 2. Architecture de déploiement (production)

```
                ┌──────────────────────────────────────────────────────┐
                │                  Serveur (VPS / VM)                   │
                │                                                        │
  Internet      │   ┌────────────┐                                      │
  (port 80/443)─▶│──▶│  Traefik   │  reverse proxy + HTTPS (Let's Encrypt)│
                │   │ (container)│                                       │
                │   └─────┬──────┘                                      │
                │         │ route /                                      │
                │         ▼                                              │
                │   ┌────────────────────┐     proxy /api, /stats...    │
                │   │  frontend (nginx)  │ ───────────────┐              │
                │   │  React + Vite      │                │              │
                │   └────────────────────┘                ▼              │
                │                                  ┌────────────────┐    │
                │                                  │    backend     │    │
                │                                  │ Express/Prisma │    │
                │                                  └────────┬───────┘    │
                │                                           │            │
                │                                           ▼            │
                │                                  ┌────────────────┐    │
                │                                  │   PostgreSQL    │    │
                │                                  └────────────────┘    │
                └──────────────────────────────────────────────────────┘

  GitHub (push sur main)
        │
        ▼
  GitHub Actions (CI puis CD)
        │  build images Docker (backend / frontend)
        ▼
  ghcr.io (registre d'images)
        │  docker compose pull (SSH)
        ▼
  Serveur de production (redémarrage des conteneurs)
```

Composants :

- **Traefik** : reverse proxy, point d'entrée unique sur les ports 80/443.
  Redirige automatiquement le trafic HTTP vers HTTPS et gère le certificat
  TLS via Let's Encrypt (résolveur ACME `le`, défi HTTP-01) pour le nom de
  domaine `DOMAIN` (DNS name label Azure, voir `.env.prod`). Route ensuite
  le trafic vers le conteneur `frontend`.
- **frontend** : application React (Vite) servie par nginx. nginx fait
  également proxy vers le `backend` pour les routes d'API
  (`/api`, `/stats`, `/ressources`, ...), afin de n'exposer qu'un seul port.
- **backend** : API Express + Prisma, connectée à PostgreSQL.
- **postgres** : base de données, avec volume Docker persistant.

## 3. Outils utilisés

| Outil | Rôle |
| ----- | ---- |
| Git / GitHub | Gestion de version, revue de code (pull requests), suivi des tâches (issues) |
| GitHub Actions | Intégration continue (`ci.yml`) et déploiement continu (`cd.yml`) |
| Docker / Docker Compose | Conteneurisation et orchestration des services (backend, frontend, base de données, reverse proxy) |
| ghcr.io (GitHub Container Registry) | Stockage des images Docker construites par la CD |
| Traefik | Reverse proxy / point d'entrée HTTP(S), certificats Let's Encrypt automatiques |
| PostgreSQL | Base de données relationnelle |

## 4. Étapes de déploiement

### 4.1 Développement local

```bash
# Base de données locale (Postgres + pgAdmin)
docker compose up -d

# Backend
cd Back
npm install
npm run dev

# Front web
cd front-web
npm install
npm run dev
```

### 4.2 Test / staging

La branche `develop` est validée automatiquement par le workflow CI
(`.github/workflows/ci.yml`) à chaque push / pull request : installation des
dépendances, lint, tests et build pour le backend, le front web et le mobile.

Pour rejouer ce même environnement sur un serveur de test, il suffit de
réutiliser `docker-compose.yml` + `docker-compose.prod.yml` avec un fichier
`.env.prod` dédié (autre base de données, autre URL).

### 4.3 Production

Le déploiement en production est entièrement automatisé via
`.github/workflows/cd.yml`, déclenché à chaque push sur `main` :

1. **Build & push des images** : construction des images Docker du backend
   (`Back/Dockerfile`) et du frontend (`front-web/Dockerfile`), publication
   sur `ghcr.io` avec les tags `latest` et le SHA du commit.
2. **Déploiement (SSH)** : connexion au serveur de production via SSH
   (secrets `SSH_HOST`, `SSH_USER`, `SSH_KEY`), puis :
   ```bash
   cd ~/Projet_collaboratif
   git pull origin main
   docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

#### Installation initiale du serveur (une seule fois)

```bash
# Sur le serveur
git clone https://github.com/ImadBilS/Projet_collaboratif.git ~/Projet_collaboratif
cd ~/Projet_collaboratif
cp .env.prod.example .env.prod
# Remplir .env.prod avec des valeurs réelles (mots de passe, secrets JWT, etc.)

# Docker Compose lit les variables ${...} de docker-compose.prod.yml depuis
# un fichier ".env" à la racine (et non depuis .env.prod directement) :
ln -sf .env.prod .env

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### Versioning des images

- `latest` : toujours la dernière version déployée sur `main`.
- `<sha>` : chaque commit produit une image identifiable par son hash.
- Pour une release versionnée (ex. fin de sprint, version livrée), créer un
  tag Git :
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```
  Le workflow CD publie alors également une image taguée avec ce numéro de
  version, permettant de revenir facilement à une version antérieure si
  besoin.

## 5. Ressources serveur

Environnement de production déployé sur une VM Azure :

| Ressource | Valeur estimée | Justification |
| --------- | --------------- | -------------- |
| CPU | 2 vCPU | Suffisant pour Traefik + Node.js (backend) + nginx (frontend) + PostgreSQL en charge modérée |
| RAM | 4 Go | PostgreSQL (~512 Mo - 1 Go), backend Node.js (~256-512 Mo), frontend nginx (faible), Traefik (faible), marge pour le système |
| Stockage | 20-30 Go SSD | Système, images Docker, volume PostgreSQL, logs |
| Réseau | Ports 80 et 443 ouverts | Traefik est le seul point d'entrée HTTP(S), le port 80 redirige vers le 443 et sert le défi Let's Encrypt |

Ce dimensionnement correspond à une instance type **Standard_B2s** (Azure) ou
équivalent (2 vCPU / 4 Go RAM), suffisante pour un usage de type projet
étudiant / démonstration avec un nombre d'utilisateurs limité. En cas de
montée en charge, les pistes d'évolution sont : augmenter la taille de la VM,
séparer la base de données sur un service managé (Azure Database for
PostgreSQL), ou répartir les services sur plusieurs instances derrière
Traefik.
