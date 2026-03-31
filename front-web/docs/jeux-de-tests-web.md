# Jeux de tests web

## 1. Profils et comptes

### JT-WEB-AUTH-01

Compte administrateur valide :

- e-mail : `admin@gouv.fr`
- mot de passe : `Password123!`
- rôle attendu côté réponse API : `Administrateur`

### JT-WEB-AUTH-02

Compte modérateur valide :

- e-mail : `moderateur@gouv.fr`
- mot de passe : `Password123!`
- rôle attendu côté réponse API : `Modérateur`

### JT-WEB-AUTH-03

Compte non autorisé :

- e-mail : `citoyen@example.com`
- mot de passe : `Password123!`
- rôle attendu côté réponse API : autre que `Administrateur` ou `Modérateur`

### JT-WEB-AUTH-04

Connexion invalide :

- e-mail : `admin@gouv.fr`
- mot de passe : `WrongPassword`

## 2. Données de création de compte

### JT-WEB-REG-01

- prénom : `Nadia`
- nom : `Leroy`
- date de naissance : `1995-04-12`
- mail : `nadia.leroy@example.com`
- mot de passe : `Password123!`
- confirmation : `Password123!`
- rôle : `Citoyen`
- sexe : `Femme`
- numéro : `12`
- type de voie : `Rue`
- code postal : `59000`
- complément : `Bâtiment B`
- ville : `Lille`
- pays : `France`

### JT-WEB-REG-02

Jeu d'erreur de confirmation :

- mot de passe : `Password123!`
- confirmation : `Password456!`

## 3. Données attendues du dashboard

Valeurs mockées attendues :

- utilisateurs inscrits : `142`
- annonces en ligne : `56`
- signalements à traiter : `3`

Activités récentes attendues :

- `Jean B. - Inscription`
- `Marie L. - Nouvelle annonce : Jardinage`
- `Lucas T. - Avis posté`

## 4. Résultats attendus synthétiques

- seuls les rôles autorisés peuvent accéder au portail admin
- les routes privées restent protégées
- le dashboard affiche les statistiques mockées
- l'inscription valide déclenche la redirection vers la page de connexion
- la déconnexion nettoie la session locale
