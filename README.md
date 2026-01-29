# Projet_collaboratif

## Démarrage du back (auth JWT)

Prérequis: Node.js, npm, PostgreSQL.

### Dépendances principales
- express
- dotenv
- bcrypt
- jsonwebtoken
- prisma
- @prisma/client
- pg

### Dépendances dev
- nodemon
- @types/node
- @types/pg

```bash
# Aller dans le back
cd Projet_collaboratif/Back

# Installer les dépendances
npm install

# (Optionnel) Lancer PostgreSQL si besoin via Docker
docker compose up -d

# Configurer l'environnement
# - Vérifie DATABASE_URL dans .env
# - Mets un vrai JWT_SECRET dans .env

# Appliquer les migrations Prisma (crée les tables)
npx prisma migrate dev

# Démarrer l'API
npm run dev
```

L'API démarre par défaut sur `http://localhost:3000`.
