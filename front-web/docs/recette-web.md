# Recette web

## 1. Objectif

Valider que la partie web fonctionne comme un portail d'administration cohérent :

- accès à la connexion
- création d'un compte depuis l'écran d'inscription
- redirection correcte après authentification
- protection des routes privées
- affichage du tableau de bord
- navigation dans le layout administrateur
- déconnexion

## 2. Périmètre de recette

Fonctionnalités incluses :

- route `/login`
- route `/register`
- authentification web via `authService`
- stockage local du token et de l'utilisateur
- route protégée `/dashboard`
- layout admin avec navigation latérale
- dashboard et statistiques mockées
- placeholders `users` et `services`
- déconnexion

Fonctionnalités hors périmètre :

- gestion réelle des utilisateurs
- gestion réelle des annonces
- CRUD back-office complet
- modération détaillée
- permissions fines multi-profils
- tests de charge

## 3. Préconditions

- le front web doit être installé
- le serveur Vite doit être démarré
- pour les tests de connexion / inscription, le back local doit être disponible sur `http://localhost:3000`

Commande de lancement du front :

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/front-web
npm run dev
```

## 4. Environnement de recette

- type d'application : React + Vite
- routage : React Router
- authentification : service front branché sur API locale
- dashboard : données mockées via `statsService`

## 5. Profils de test

- utilisateur non authentifié
- utilisateur authentifié avec rôle autorisé : `Administrateur` ou `Modérateur`
- utilisateur authentifié avec rôle non autorisé

## 6. Critères d'acceptation globaux

- un utilisateur non connecté ne peut pas accéder au dashboard
- un utilisateur autorisé peut se connecter et atteindre le layout admin
- les statistiques du dashboard s'affichent
- la navigation latérale fonctionne
- la déconnexion supprime la session locale et renvoie vers `/login`

## 7. Stratégie de validation

La recette doit couvrir :

1. l'accès aux écrans publics
2. la connexion réussie et refusée
3. la protection des routes
4. le rendu du dashboard
5. la navigation interne
6. la déconnexion

## 8. Livrables de recette

Pour chaque cas de test, relever :

- identifiant
- statut : `OK`, `KO`, `Bloqué`, `Non testé`
- date
- navigateur
- commentaire
- capture en cas d'anomalie

## 9. Références

- jeux de tests : `jeux-de-tests-web.md`
- cahier de tests : `cahier-de-tests-web.md`
