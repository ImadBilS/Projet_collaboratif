# Script de test web

## 1. Objet

Ce script de test décrit l'ordre conseillé pour exécuter la recette du front web.

Il est centré sur le portail d'administration actuellement disponible :

- connexion
- inscription
- dashboard
- navigation interne
- déconnexion

## 2. Préparation

1. Ouvrir un terminal dans le projet web.
2. Lancer le front :

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/front-web
npm run dev
```

3. Vérifier que le back local est disponible sur `http://localhost:3000` pour les tests d'authentification.
4. Ouvrir l'application dans un navigateur.

## 3. Script de test principal

### Phase 1. Vérification des routes publiques

1. Ouvrir `/login`.
2. Vérifier l'affichage du formulaire de connexion.
3. Ouvrir `/register`.
4. Vérifier l'affichage du formulaire d'inscription.

Résultat attendu :

- les routes publiques sont accessibles
- les formulaires s'affichent correctement

### Phase 2. Vérification de la protection des routes

1. Sans être connecté, ouvrir directement `/dashboard`.
2. Vérifier la redirection vers `/login`.

Résultat attendu :

- une route privée n'est pas accessible sans session

### Phase 3. Vérification de l'inscription

1. Ouvrir `/register`.
2. Remplir le formulaire avec `JT-WEB-REG-01`.
3. Soumettre.
4. Vérifier le message de succès.
5. Vérifier la redirection vers `/login`.

Résultat attendu :

- l'inscription valide aboutit
- l'utilisateur est redirigé vers la connexion

### Phase 4. Vérification des erreurs d'inscription

1. Revenir sur `/register`.
2. Saisir un mot de passe et une confirmation différente avec `JT-WEB-REG-02`.
3. Soumettre.

Résultat attendu :

- le message `Les mots de passe ne correspondent pas.` s'affiche
- l'inscription ne part pas

### Phase 5. Vérification de la connexion autorisée

1. Ouvrir `/login`.
2. Saisir `JT-WEB-AUTH-01` ou `JT-WEB-AUTH-02`.
3. Soumettre.
4. Vérifier la redirection vers `/dashboard`.
5. Vérifier que le token et l'utilisateur sont présents en localStorage.

Résultat attendu :

- la connexion autorisée réussit
- la session locale est créée

### Phase 6. Vérification du refus de connexion

1. Se déconnecter si besoin.
2. Revenir sur `/login`.
3. Saisir `JT-WEB-AUTH-04`.
4. Soumettre.
5. Vérifier qu'un message d'erreur s'affiche.
6. Refaire un test avec `JT-WEB-AUTH-03` si l'API le permet.

Résultat attendu :

- un mot de passe faux est refusé
- un rôle non autorisé est refusé

### Phase 7. Vérification du dashboard

1. Être connecté avec un rôle autorisé.
2. Ouvrir `/dashboard`.
3. Attendre la fin du chargement.
4. Vérifier les KPI :
   - `142` utilisateurs
   - `56` annonces
   - `3` signalements
5. Vérifier la présence du bloc `Activité récente`.

Résultat attendu :

- le dashboard charge correctement
- les données mockées attendues apparaissent

### Phase 8. Vérification de la navigation interne

1. Dans la sidebar, cliquer sur `Vue d'ensemble`.
2. Cliquer sur `Utilisateurs`.
3. Vérifier l'affichage du placeholder.
4. Cliquer sur `Annonces`.
5. Vérifier l'affichage du placeholder.
6. Vérifier que l'entrée active change visuellement dans le menu.

Résultat attendu :

- la navigation latérale fonctionne
- les routes internes s'affichent

### Phase 9. Vérification de la déconnexion

1. Cliquer sur `Déconnexion`.
2. Vérifier la redirection vers `/login`.
3. Vérifier que le localStorage ne contient plus la session.
4. Tenter de rouvrir `/dashboard`.

Résultat attendu :

- la session est supprimée
- la route privée redevient inaccessible

## 4. Points de contrôle finaux

À la fin de la recette, vérifier :

- cohérence des redirections
- cohérence des droits d'accès
- bon affichage du dashboard
- bon fonctionnement de la déconnexion

## 5. Résultat de recette

Le testeur peut conclure :

- `Recette conforme` si tous les parcours critiques passent
- `Recette partiellement conforme` si seules des anomalies mineures subsistent
- `Recette non conforme` si la connexion, la protection des routes ou la déconnexion échouent
