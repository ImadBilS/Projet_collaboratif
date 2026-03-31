# Jeux de tests mobile

## 1. Comptes de test

### JT-AUTH-01

Compte citoyen préchargé :

- e-mail : `lea.martin@example.com`
- mot de passe : `Password123!`
- statut : `citoyen`

### JT-AUTH-02

Compte invité :

- accès via le bouton `Continuer sans compte`
- statut : `invité`
- restrictions :
  - pas de favoris
  - pas de mise de côté
  - pas de progression active
  - pas de commentaires
  - pas de création / édition
  - pas d'activités actives
  - pas d'accès au contenu restreint

### JT-AUTH-03

Jeu de données pour inscription :

- prénom : `Nina`
- nom : `Bernard`
- ville : `Paris`
- e-mail : `nina.bernard@example.com`
- mot de passe : `Password123!`

## 2. Ressources de test

Le prototype contient des ressources mockées mélangeant :

- ressources publiques
- ressources restreintes
- contenus de type article, guide, fiche pratique, activité / jeu
- relations : famille, couple, amitié, travail, voisinage

## 3. Données de création de ressource

### JT-RES-CR-01

- titre : `Rituel de discussion du dimanche`
- résumé : `Une ressource courte pour relancer le dialogue familial chaque semaine.`
- contenu :
  `Commencer par un tour de table.`
  `Laisser chacun parler sans interruption.`
  `Conclure par une action concrète pour la semaine.`
- tags : `famille, dialogue, rituel`
- catégorie : `Guide`
- format : `Lecture`
- relation : `Famille`
- accès : `Public`

### JT-RES-CR-02

- titre : `Jeu de cartes relationnelles`
- résumé : `Une activité simple à animer à plusieurs.`
- contenu :
  `Préparer des cartes avec des questions ouvertes.`
  `Faire tourner les cartes.`
  `Clore par un temps de retour.`
- tags : `activité, jeu, échange`
- catégorie : `Activité / Jeu`
- format : `Activité`
- relation : `Amitié`
- accès : `Restreint`

## 4. Données de commentaires

### JT-COM-01

Commentaire :

- message : `Cette ressource est claire et facile à mettre en place.`

### JT-COM-02

Réponse :

- message : `Merci, on pourrait aussi ajouter une variante pour les adolescents.`

## 5. Données d'activité

### JT-ACT-01

Participant à inviter :

- nom : `Camille`

### JT-ACT-02

Message de chat :

- message : `On commence par une question simple pour mettre tout le monde à l'aise ?`

## 6. Résultats attendus synthétiques

- le citoyen peut réaliser toutes les actions prévues par le MVP
- l'invité peut consulter et partager, mais ne peut pas interagir sur les fonctions réservées
- le visiteur non connecté voit les contenus publics et les écrans d'accès au compte
- les contenus restreints restent bloqués sans compte citoyen
