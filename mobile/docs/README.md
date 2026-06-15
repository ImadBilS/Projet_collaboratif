# Documentation de recette mobile

Ce dossier regroupe les documents de validation fonctionnelle du prototype mobile `(RE)Sources Relationnelles`.

Contenu :

- `recette-mobile.md` : plan de recette, prérequis, environnement et stratégie de validation.
- `jeux-de-tests-mobile.md` : données et comptes à utiliser pendant la recette.
- `cahier-de-tests-mobile.md` : cas de tests détaillés couvrant l'ensemble des fonctionnalités du prototype mobile.
- `script-de-test-mobile.md` : déroulé opérationnel pas à pas pour exécuter la recette.

Périmètre couvert :

- consultation des ressources
- authentification citoyen
- mode invité
- favoris, mise de côté, progression
- création et édition de ressource
- commentaires et réponses
- activités sociales et messagerie
- profil et déconnexion

Le périmètre volontairement exclu :

- back-office
- administration
- synchronisation serveur réelle
- notifications push
- paiement

Le prototype s'appuie sur des données mockées locales. La recette porte donc sur le comportement fonctionnel visible dans l'application mobile, et non sur des échanges réels avec une API distante.
