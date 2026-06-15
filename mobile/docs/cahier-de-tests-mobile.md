# Cahier de tests mobile

## Statuts possibles

- `OK`
- `KO`
- `Bloqué`
- `Non testé`

## 1. Navigation et accueil

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| NAV-01 | Affichage accueil | App lancée | Ouvrir l'application | L'écran d'accueil mobile s'affiche sans erreur avec les CTA principaux |
| NAV-02 | Accès ressources | Depuis l'accueil | Appuyer sur `Explorer les ressources` | L'utilisateur arrive sur la liste des ressources |
| NAV-03 | Accès inscription | Depuis l'accueil | Appuyer sur `Créer un compte` | L'écran d'inscription s'ouvre |
| NAV-04 | Accès connexion | Depuis l'accueil | Appuyer sur `Se connecter` | L'écran de connexion s'ouvre |
| NAV-05 | Accès invité | Depuis l'accueil | Appuyer sur `Continuer sans compte` | L'utilisateur entre en mode invité et arrive sur les ressources |
| NAV-06 | Navigation tabs | App ouverte | Passer par `Accueil`, `Ressources`, `Progression`, `Activités`, `Profil` | Les tabs sont accessibles et l'écran actif correspond à l'onglet sélectionné |

## 2. Authentification

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| AUTH-01 | Connexion citoyen valide | Compte JT-AUTH-01 | Saisir e-mail et mot de passe valides puis valider | La connexion aboutit, le profil citoyen devient accessible |
| AUTH-02 | Connexion invalide | Aucun | Saisir un mot de passe erroné | Un message d'erreur s'affiche |
| AUTH-03 | Inscription valide | Aucun | Saisir JT-AUTH-03 puis valider | Le compte est créé localement et l'utilisateur est connecté |
| AUTH-04 | Inscription incomplète | Aucun | Laisser un champ vide ou mot de passe trop court | L'inscription est refusée avec message explicite |
| AUTH-05 | Déconnexion citoyen | Citoyen connecté | Appuyer sur `Se déconnecter` | L'utilisateur revient à un état non connecté |
| AUTH-06 | Sortie du mode invité | Invité connecté | Aller sur `Profil`, appuyer sur `Quitter le mode invité` | Le mode invité est quitté, l'utilisateur redevient non connecté |

## 3. Consultation des ressources

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| RES-01 | Liste des ressources | App ouverte | Ouvrir l'onglet `Ressources` | La liste des ressources mockées s'affiche |
| RES-02 | Recherche | Liste affichée | Saisir un mot-clé dans le champ de recherche | La liste est filtrée selon le mot-clé |
| RES-03 | Filtre relation | Liste affichée | Sélectionner un filtre de relation | Seules les ressources correspondantes sont visibles |
| RES-04 | Filtre accès | Liste affichée | Sélectionner `Public` ou `Restreint` si présent dans l'interface | La liste reflète le filtre choisi |
| RES-05 | Tri | Liste affichée | Changer le tri | L'ordre des ressources se met à jour |
| RES-06 | Détail ressource publique | Ressource publique visible | Ouvrir une ressource publique | Le détail complet de la ressource s'affiche |
| RES-07 | Détail ressource restreinte visiteur | Non connecté | Ouvrir une ressource restreinte | Le contenu complet est bloqué et une invitation à se connecter apparaît |
| RES-08 | Détail ressource restreinte invité | Invité connecté | Ouvrir une ressource restreinte | Le contenu complet reste bloqué |
| RES-09 | Détail ressource restreinte citoyen | Citoyen connecté | Ouvrir une ressource restreinte | Le contenu complet devient consultable |
| RES-10 | Partage d'une ressource | Ressource affichée | Appuyer sur `Partager` | Le partage natif est déclenché |

## 4. Interactions avec les ressources

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| INT-01 | Ajout favori citoyen | Citoyen connecté | Depuis une carte ou un détail, ajouter en favori | La ressource passe en favori |
| INT-02 | Retrait favori citoyen | Citoyen connecté avec favori | Retirer des favoris | La ressource est retirée des favoris |
| INT-03 | Mise de côté citoyen | Citoyen connecté | Mettre une ressource de côté | La ressource apparaît dans la collection correspondante |
| INT-04 | Marquage exploitée citoyen | Citoyen connecté | Marquer une ressource exploitée | La ressource apparaît dans `déjà exploitées` |
| INT-05 | Action favori invité | Invité connecté | Appuyer sur `Favori` | Aucune activation effective, l'interface reste en mode consultation |
| INT-06 | Action mise de côté invité | Invité connecté | Appuyer sur `Mettre de côté` | Aucune activation effective |
| INT-07 | Action exploitée invité | Invité connecté | Appuyer sur `Marquer exploitée` | Aucune activation effective |

## 5. Progression et collections

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| PROG-01 | Tableau de bord progression | Citoyen connecté | Ouvrir `Progression` | Les compteurs de favoris, mises de côté et exploitées s'affichent |
| PROG-02 | Accès favoris | Citoyen connecté avec favoris | Ouvrir la collection favoris | La liste des ressources favorites s'affiche |
| PROG-03 | Accès mises de côté | Citoyen connecté avec ressources mises de côté | Ouvrir la collection correspondante | La liste s'affiche correctement |
| PROG-04 | Accès exploitées | Citoyen connecté avec ressources exploitées | Ouvrir la collection correspondante | La liste s'affiche correctement |
| PROG-05 | Progression invité | Invité connecté | Ouvrir `Progression` | Les données ne doivent pas permettre une vraie progression personnelle active |

## 6. Création et édition de ressource

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| CRUD-01 | Accès création citoyen | Citoyen connecté | Ouvrir l'écran de création | Le formulaire de création s'affiche |
| CRUD-02 | Création ressource valide | Citoyen connecté | Saisir JT-RES-CR-01 puis publier | La ressource est créée et le détail s'ouvre |
| CRUD-03 | Création activité restreinte | Citoyen connecté | Saisir JT-RES-CR-02 puis publier | La ressource est créée avec le bon type et le bon niveau d'accès |
| CRUD-04 | Accès création invité | Invité connecté | Ouvrir l'écran de création | Un message indique que l'action est réservée au citoyen connecté |
| CRUD-05 | Édition de sa ressource | Citoyen ayant créé une ressource | Modifier le titre ou le résumé puis enregistrer | Les changements sont visibles sur le détail |
| CRUD-06 | Édition ressource d'un autre | Citoyen connecté sur une ressource non possédée | Tenter d'ouvrir l'édition | L'accès est refusé |
| CRUD-07 | Édition invité | Invité connecté | Tenter d'ouvrir l'édition | L'accès est refusé |

## 7. Commentaires et réponses

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| COM-01 | Lecture commentaires publics | Ressource publique | Ouvrir l'écran commentaires | Les commentaires existants sont visibles |
| COM-02 | Publication commentaire citoyen | Citoyen connecté | Publier JT-COM-01 | Le commentaire apparaît dans la liste |
| COM-03 | Réponse citoyen | Citoyen connecté | Répondre avec JT-COM-02 | La réponse apparaît sous le commentaire ciblé |
| COM-04 | Commentaires ressource restreinte | Ressource restreinte | Ouvrir l'écran commentaires | L'accès aux commentaires est refusé dans le prototype |
| COM-05 | Publication invité | Invité connecté | Ouvrir les commentaires d'une ressource publique | L'écran est en lecture seule, sans publication possible |
| COM-06 | Réponse invité | Invité connecté | Tenter de répondre à un commentaire | La réponse n'est pas possible |

## 8. Activités sociales

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| ACT-01 | Liste activités | App ouverte | Ouvrir l'onglet `Activités` | Les activités mockées s'affichent |
| ACT-02 | Démarrer activité citoyen | Citoyen connecté | Appuyer sur `Démarrer une nouvelle activité` | Une activité est créée puis ouverte |
| ACT-03 | Démarrer activité invité | Invité connecté | Appuyer sur le CTA de création | L'action est désactivée ou sans effet |
| ACT-04 | Inviter un participant | Citoyen connecté dans une activité | Saisir JT-ACT-01 puis inviter | Le participant est ajouté à la liste |
| ACT-05 | Inviter en invité | Invité connecté | Ouvrir une activité et tenter d'inviter | L'écran est en consultation seule |
| ACT-06 | Ouvrir messagerie | Activité existante | Ouvrir le chat de l'activité | La messagerie s'affiche |
| ACT-07 | Envoyer message citoyen | Citoyen connecté | Envoyer JT-ACT-02 | Le message apparaît dans la conversation |
| ACT-08 | Envoyer message invité | Invité connecté | Ouvrir le chat | La messagerie est en lecture seule |

## 9. Profil

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| PROF-01 | Profil non connecté | Aucun | Ouvrir `Profil` | L'application propose connexion et création de compte |
| PROF-02 | Profil citoyen | Citoyen connecté | Ouvrir `Profil` | Les informations du compte et les statistiques s'affichent |
| PROF-03 | Mise à jour profil citoyen | Citoyen connecté | Modifier prénom, ville ou e-mail puis enregistrer | Le message de confirmation apparaît et les nouvelles valeurs restent affichées |
| PROF-04 | Profil invité | Invité connecté | Ouvrir `Profil` | Un écran spécifique décrit les limitations du mode invité |

## 10. Cohérence transverse

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| TRANS-01 | Persistance locale de session | Utilisateur connecté ou invité | Naviguer entre plusieurs onglets | Le statut courant reste cohérent pendant la session |
| TRANS-02 | Cohérence favoris / progression | Citoyen connecté | Ajouter un favori puis ouvrir `Progression` | Le compteur et la collection sont cohérents |
| TRANS-03 | Cohérence création / détail | Citoyen connecté | Créer une ressource puis ouvrir son détail | Les données affichées correspondent à la saisie |
| TRANS-04 | Cohérence activité / chat | Citoyen connecté | Démarrer une activité puis ouvrir le chat | L'activité créée est bien utilisée dans l'écran de chat |
| TRANS-05 | Lisibilité mobile | App ouverte | Parcourir les écrans principaux sur smartphone | Les textes et actions restent lisibles et tactiles |

## 11. Couverture attendue

Ce cahier de tests couvre :

- les parcours nominaux
- les restrictions du mode invité
- les refus d'accès
- les créations et modifications
- les interactions sociales
- la navigation et la cohérence globale

Il permet donc de couvrir l'ensemble des fonctionnalités présentes dans le prototype mobile.
