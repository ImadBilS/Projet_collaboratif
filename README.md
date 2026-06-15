# Projet_collaboratif

Projet composé de 3 parties :

- `Back` : API Node.js / Express / Prisma
- `front-web` : interface web React + Vite
- `mobile` : application mobile React Native / Expo

## Prérequis

- `Node.js` et `npm`
- `PostgreSQL`
- `Expo Go` sur téléphone si vous voulez tester le mobile sur appareil

## 1. Installation initiale

Depuis la racine du projet :

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif
```

### Back

```bash
cd Back
npm install
```

Si vous utilisez Docker pour PostgreSQL :

```bash
docker compose up -d
```

Vérifiez ensuite le fichier `Back/.env`.

Exemple attendu :

- `DATABASE_URL`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `CORS_ORIGIN=http://localhost:5173`

Synchronisez ensuite la base avec Prisma :

```bash
npx prisma db push
npx prisma generate
```

Créez les données minimales de développement :

```bash
npm run create:admin
npm run seed:resources
```

### Front web

```bash
cd ../front-web
npm install
```

### Mobile

```bash
cd ../mobile
npm install
```

## 2. Lancer le projet

Le bon ordre est :

1. `Back`
2. `front-web`
3. `mobile`

### Lancer le back

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/Back
npm start
```

API disponible sur :

```txt
http://localhost:3000
```

### Lancer le front web

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/front-web
npm run dev
```

Application web disponible sur :

```txt
http://localhost:5173
```

### Lancer le mobile

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/mobile
npm start -- --clear
```

Ensuite :

- `a` pour Android
- `i` pour iOS
- `w` pour la version web Expo
- ou scanner le QR code avec `Expo Go`

## 3. Comptes de développement

Administrateur local créé via le script :

- email : `admin@resources-relationnelles.local`
- mot de passe : `Admin123!`

## 4. Notes importantes

### Après une modification du schéma Prisma

Si vous modifiez `Back/prisma/schema.prisma`, il faut relancer :

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/Back
npx prisma db push
npx prisma generate
```

Puis redémarrer le back.

Sans ça, vous pouvez avoir :

- erreur serveur sur le dashboard
- erreur serveur lors de la création d’une ressource
- décalage entre le code et la base

### Lien entre web et mobile

Le web et le mobile consomment le même back.

Concrètement :

- une ressource publique créée sur le web doit être visible sur le mobile
- l’authentification mobile utilise aussi l’API du back

À ce jour :

- `auth` web : connecté à l’API
- `auth` mobile : connecté à l’API
- `ressources` web : connecté à l’API
- `ressources` mobile : connecté à l’API
- `commentaires` mobile : connecté à l’API
- `activités` mobile : encore locales
- `favoris / progression` mobile : encore locaux

## 5. Commandes utiles

### Back

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/Back
npm start
npm run dev
npm run create:admin
npm run seed:resources
npx prisma db push
npx prisma generate
```

### Front web

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/front-web
npm run dev
npm run build
npm test
```

### Mobile

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/mobile
npm start -- --clear
npm test
```
