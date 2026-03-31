# Recette mobile

## 1. Objectif

Valider que le prototype mobile de `(RE)Sources Relationnelles` répond aux attentes fonctionnelles du MVP mobile :

- consulter les ressources
- se connecter ou continuer en invité
- gérer ses favoris et sa progression
- créer et modifier une ressource en tant que citoyen
- commenter une ressource publique
- lancer une activité et échanger des messages
- gérer un profil simple

## 2. Périmètre de recette

Fonctionnalités incluses :

- page d'accueil mobile
- accès invité
- inscription et connexion
- consultation de la liste des ressources
- recherche, filtres et tri
- détail ressource
- distinction public / restreint
- favoris, mise de côté, marquage exploitée
- partage d'une ressource
- progression
- création et édition de ressource
- commentaires et réponses sur ressource publique
- activités sociales
- profil et déconnexion

Fonctionnalités hors périmètre :

- persistance serveur
- modération
- administration
- analytics
- back-office

## 3. Préconditions

- Node.js et npm installés
- dépendances du dossier `mobile` installées
- application lancée via Expo
- tests exécutés sur smartphone ou simulateur iOS / Android

Commande de lancement :

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/mobile
npm start -- --clear
```

## 4. Environnement de recette

- application : prototype mobile Expo / React Native
- source de données : mock locale
- type de recette : recette fonctionnelle manuelle
- appareil cible : smartphone
- orientation attendue : portrait

## 5. Profils de test

- visiteur non connecté
- invité connecté sans compte
- citoyen connecté

## 6. Critères d'acceptation globaux

- chaque écran principal est accessible depuis la navigation mobile
- les parcours critiques se terminent sans blocage
- les restrictions du mode invité sont respectées
- les contenus restreints ne sont pas consultables sans compte citoyen
- les écrans restent lisibles sur mobile
- les actions donnent un résultat visible et cohérent

## 7. Stratégie de validation

La recette doit couvrir :

- le nominal : ce qui doit fonctionner
- les restrictions : ce qui doit être refusé
- les transitions de statut : non connecté, invité, citoyen
- les parcours transverses : ressources, progression, activité, profil

Approche recommandée :

1. vérifier l'accueil et la navigation
2. vérifier les parcours visiteur et invité
3. vérifier le parcours citoyen connecté
4. vérifier les interactions sur ressources
5. vérifier les activités sociales
6. vérifier la cohérence du profil et de la déconnexion

## 8. Livrables de recette

Les résultats doivent être consignés pour chaque cas de test avec :

- identifiant du test
- statut : `OK`, `KO`, `Bloqué`, `Non testé`
- date
- appareil utilisé
- observations
- capture éventuelle si anomalie

## 9. Références

- jeux de tests : `jeux-de-tests-mobile.md`
- cahier de tests détaillé : `cahier-de-tests-mobile.md`
