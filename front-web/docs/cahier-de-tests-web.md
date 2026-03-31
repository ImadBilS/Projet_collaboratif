# Cahier de tests web

## Statuts possibles

- `OK`
- `KO`
- `Bloqué`
- `Non testé`

## 1. Accès public et routage

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| WEB-NAV-01 | Accès login | Front lancé | Ouvrir `/login` | La page de connexion s'affiche |
| WEB-NAV-02 | Accès register | Front lancé | Ouvrir `/register` | La page d'inscription s'affiche |
| WEB-NAV-03 | Route privée sans session | Aucun token local | Ouvrir `/dashboard` | Redirection automatique vers `/login` |
| WEB-NAV-04 | Route racine authentifiée | Session valide | Ouvrir `/` | Redirection vers `/dashboard` |

## 2. Connexion

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| WEB-AUTH-01 | Connexion administrateur valide | Back local disponible | Saisir JT-WEB-AUTH-01 puis valider | Connexion réussie, redirection vers `/dashboard`, token stocké localement |
| WEB-AUTH-02 | Connexion modérateur valide | Back local disponible | Saisir JT-WEB-AUTH-02 puis valider | Connexion réussie, accès autorisé au portail |
| WEB-AUTH-03 | Connexion invalide | Back local disponible | Saisir JT-WEB-AUTH-04 puis valider | Message d'erreur affiché, pas de redirection |
| WEB-AUTH-04 | Rôle non autorisé | Back local disponible | Saisir JT-WEB-AUTH-03 puis valider | Accès refusé avec message explicite |
| WEB-AUTH-05 | État de chargement connexion | Requête en cours | Cliquer sur le bouton de connexion | Le bouton affiche l'état de chargement |

## 3. Inscription

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| WEB-REG-01 | Affichage formulaire | Front lancé | Ouvrir `/register` | Le formulaire complet est affiché |
| WEB-REG-02 | Inscription valide | Back local disponible | Saisir JT-WEB-REG-01 puis valider | Message de succès puis redirection vers `/login` |
| WEB-REG-03 | Mots de passe différents | Aucun | Saisir JT-WEB-REG-02 puis soumettre | L'inscription est bloquée avec message `Les mots de passe ne correspondent pas.` |
| WEB-REG-04 | Champs requis | Aucun | Laisser des champs obligatoires vides puis soumettre | Le navigateur ou le formulaire bloque l'envoi |
| WEB-REG-05 | État de chargement inscription | Requête en cours | Soumettre le formulaire | L'interface affiche l'état de chargement |

## 4. Layout administrateur

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| WEB-LAYOUT-01 | Affichage sidebar | Session valide | Ouvrir le dashboard | La sidebar contient logo, menu et déconnexion |
| WEB-LAYOUT-02 | Navigation dashboard | Session valide | Cliquer sur `Vue d'ensemble` | La page dashboard s'affiche |
| WEB-LAYOUT-03 | Navigation utilisateurs | Session valide | Cliquer sur `Utilisateurs` | La page placeholder utilisateurs s'affiche |
| WEB-LAYOUT-04 | Navigation annonces | Session valide | Cliquer sur `Annonces` | La page placeholder annonces s'affiche |
| WEB-LAYOUT-05 | État actif menu | Session valide | Naviguer entre les pages | L'entrée active est visuellement distinguée |

## 5. Dashboard

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| WEB-DASH-01 | Chargement dashboard | Session valide | Ouvrir `/dashboard` | Le message de chargement s'affiche puis disparaît |
| WEB-DASH-02 | KPI utilisateurs | Session valide | Attendre la fin du chargement | La carte `Utilisateurs Inscrits` affiche `142` |
| WEB-DASH-03 | KPI annonces | Session valide | Attendre la fin du chargement | La carte `Annonces en ligne` affiche `56` |
| WEB-DASH-04 | KPI signalements | Session valide | Attendre la fin du chargement | La carte `Signalements à traiter` affiche `3` |
| WEB-DASH-05 | Activité récente | Session valide | Observer le bloc d'activité | La liste des activités récentes mockées s'affiche |

## 6. Déconnexion et session

| ID | Fonction | Précondition | Étapes | Résultat attendu |
|---|---|---|---|---|
| WEB-SESSION-01 | Déconnexion | Session valide | Cliquer sur `Déconnexion` | Le token et l'utilisateur sont supprimés du localStorage, redirection vers `/login` |
| WEB-SESSION-02 | Réaccès après déconnexion | Session supprimée | Tenter d'ouvrir `/dashboard` | Redirection vers `/login` |
| WEB-SESSION-03 | Session locale présente | Token local valide | Recharger la page sur `/dashboard` | Le layout privé reste accessible |

## 7. Couverture attendue

Ce cahier de tests couvre le périmètre réellement présent du web :

- accès public
- connexion et inscription
- contrôle d'autorisation
- routes protégées
- dashboard
- navigation admin
- déconnexion

Il est donc pertinent et complet pour l'état actuel du front web, même si certaines rubriques `Utilisateurs` et `Annonces` restent encore en placeholder.
