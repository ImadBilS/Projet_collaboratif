# Script de test mobile

## 1. Objet

Ce script de test décrit l'ordre recommandé pour exécuter la recette du prototype mobile `(RE)Sources Relationnelles`.

Il sert de guide opérationnel pour un testeur pendant une démonstration, une soutenance ou une recette manuelle.

## 2. Préparation

1. Ouvrir un terminal.
2. Lancer l'application mobile :

```bash
cd /Users/monniemathieu/Documents/Projet_collaboratif/Projet_collaboratif/mobile
npm start -- --clear
```

3. Ouvrir l'application dans Expo Go, simulateur iOS ou Android.
4. Vérifier que l'écran d'accueil s'affiche correctement.

## 3. Script de test principal

### Phase 1. Vérification de l'accueil et de la navigation

1. Vérifier la présence des boutons `Explorer les ressources`, `Créer un compte`, `Se connecter` et `Continuer sans compte`.
2. Ouvrir l'onglet `Ressources` depuis l'accueil.
3. Revenir à l'accueil si nécessaire.
4. Vérifier la présence des onglets principaux `Accueil`, `Ressources`, `Progression`, `Activités`, `Profil`.

Résultat attendu :

- l'application démarre sans blocage
- la navigation principale est accessible

### Phase 2. Vérification du mode invité

1. Depuis l'accueil, appuyer sur `Continuer sans compte`.
2. Ouvrir une ressource publique.
3. Vérifier que le contenu public est lisible.
4. Tenter d'ajouter la ressource en favori.
5. Tenter de la mettre de côté.
6. Tenter de la marquer comme exploitée.
7. Ouvrir une ressource restreinte.
8. Vérifier que le contenu complet est bloqué.
9. Ouvrir `Commentaires` sur une ressource publique.
10. Vérifier que les échanges sont en lecture seule.
11. Ouvrir l'onglet `Activités`.
12. Vérifier qu'un invité ne peut pas démarrer d'activité.
13. Ouvrir `Profil`.
14. Vérifier que l'écran indique clairement les limitations du mode invité.
15. Quitter le mode invité.

Résultat attendu :

- l'invité peut consulter
- l'invité ne peut pas interagir sur les fonctionnalités réservées

### Phase 3. Vérification de l'inscription

1. Ouvrir `Créer un compte`.
2. Saisir les données `JT-AUTH-03` du fichier `jeux-de-tests-mobile.md`.
3. Valider le formulaire.
4. Vérifier que l'utilisateur est connecté après l'inscription.
5. Ouvrir `Profil`.
6. Vérifier que les informations du compte apparaissent.

Résultat attendu :

- le compte est créé localement
- l'utilisateur passe en statut citoyen connecté

### Phase 4. Vérification de la connexion

1. Se déconnecter si nécessaire.
2. Ouvrir `Se connecter`.
3. Saisir le compte `JT-AUTH-01`.
4. Valider.
5. Vérifier l'accès au profil citoyen.

Résultat attendu :

- la connexion aboutit
- le profil et les fonctionnalités citoyennes deviennent accessibles

### Phase 5. Vérification des ressources et de la progression

1. Ouvrir l'onglet `Ressources`.
2. Tester la recherche.
3. Tester un filtre de relation.
4. Tester le tri.
5. Ouvrir une ressource publique.
6. Ajouter cette ressource en favori.
7. Mettre cette ressource de côté.
8. Marquer cette ressource comme exploitée.
9. Ouvrir `Progression`.
10. Vérifier la mise à jour des compteurs.
11. Ouvrir les écrans `Favoris`, `Mises de côté` et `Déjà exploitées`.

Résultat attendu :

- les actions sur ressource sont prises en compte
- les collections et compteurs sont cohérents

### Phase 6. Vérification des commentaires

1. Ouvrir une ressource publique.
2. Ouvrir l'écran `Commentaires`.
3. Publier le commentaire `JT-COM-01`.
4. Répondre avec `JT-COM-02`.
5. Vérifier l'affichage du commentaire et de la réponse.

Résultat attendu :

- le citoyen peut publier et répondre
- les échanges s'affichent immédiatement

### Phase 7. Vérification de la création et de l'édition de ressource

1. Ouvrir l'écran de création de ressource.
2. Saisir les données `JT-RES-CR-01`.
3. Publier.
4. Vérifier l'ouverture du détail de la ressource créée.
5. Ouvrir ensuite l'édition de cette ressource.
6. Modifier le titre ou le résumé.
7. Enregistrer.
8. Vérifier la mise à jour.

Résultat attendu :

- la ressource est créée
- l'utilisateur propriétaire peut la modifier

### Phase 8. Vérification des activités sociales

1. Ouvrir l'onglet `Activités`.
2. Démarrer une nouvelle activité.
3. Vérifier l'ouverture du détail activité.
4. Inviter le participant `JT-ACT-01`.
5. Vérifier sa présence dans la liste.
6. Ouvrir la messagerie de l'activité.
7. Envoyer le message `JT-ACT-02`.
8. Vérifier l'affichage du message.

Résultat attendu :

- le citoyen peut démarrer une activité
- il peut inviter et envoyer des messages

### Phase 9. Vérification du profil et de la déconnexion

1. Ouvrir `Profil`.
2. Modifier une donnée simple, par exemple la ville.
3. Enregistrer.
4. Vérifier le message de confirmation.
5. Se déconnecter.
6. Vérifier que l'application revient à un état non connecté.

Résultat attendu :

- la modification de profil fonctionne
- la déconnexion remet l'application en état public

## 4. Points de contrôle finaux

À la fin de la recette, vérifier :

- absence de blocage sur les parcours principaux
- cohérence entre statut utilisateur et droits disponibles
- cohérence entre actions sur ressource et tableau de progression
- lisibilité des écrans sur mobile

## 5. Résultat de recette

Le testeur peut conclure :

- `Recette conforme` si tous les scénarios critiques passent
- `Recette partiellement conforme` si seules des anomalies mineures subsistent
- `Recette non conforme` si un parcours critique est bloquant
