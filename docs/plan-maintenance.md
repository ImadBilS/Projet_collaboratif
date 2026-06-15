# Plan de maintenance

Projet : **Projet_collaboratif / plateforme de ressources relationnelles**

Ce document décrit comment sont suivis les anomalies et les demandes
d'évolution, la méthodologie de gestion des incidents et où trouver le
tableau de suivi de l'activité.

## 1. Suivi des anomalies et demandes (GitHub Issues)

Le suivi est réalisé via les **GitHub Issues** du dépôt. Deux modèles
d'issue sont disponibles (`.github/ISSUE_TEMPLATE/`) :

- **Signalement de bug** (`bug_report.md`) : description, étapes de
  reproduction, comportement attendu/observé, environnement, sévérité.
- **Demande de fonctionnalité** (`feature_request.md`) : contexte, solution
  proposée, alternatives.

### Labels utilisés

| Label | Usage |
| ----- | ----- |
| `bug` | Dysfonctionnement de l'application |
| `enhancement` | Amélioration ou nouvelle fonctionnalité |
| `question` | Question ou besoin de clarification, ne nécessitant pas forcément de modification du code |
| `critical` | Incident bloquant nécessitant une prise en charge immédiate (voir méthodologie ci-dessous) |

### Tableau de suivi

Le suivi de l'activité (issues ouvertes/fermées, avancement) est consultable
directement dans l'onglet **Issues** du dépôt GitHub, et peut être organisé
visuellement via un **GitHub Project** (vue Kanban : `À faire` / `En cours` /
`Terminé`) associé au dépôt :

> https://github.com/ImadBilS/Projet_collaboratif/issues
> https://github.com/ImadBilS/Projet_collaboratif/projects

## 2. Méthodologie de gestion des incidents

Chaque incident est qualifié selon son niveau de gravité, avec un délai de
prise en charge cible (SLA) :

| Niveau | Définition | Exemples | SLA de prise en charge |
| ------ | ---------- | -------- | ----------------------- |
| **Bloquant** | Application indisponible ou fonctionnalité critique inutilisable pour tous les utilisateurs | Site inaccessible, impossible de se connecter, perte de données | Prise en charge immédiate (< 4 h) |
| **Majeur** | Fonctionnalité importante impactée, mais contournement possible | Une page ne s'affiche pas correctement, une action échoue dans certains cas | Prise en charge sous 1 à 2 jours ouvrés |
| **Mineur** | Problème cosmétique, ponctuel, sans impact sur l'usage principal | Faute d'orthographe, alignement visuel, message d'erreur peu clair | Planifié dans un prochain cycle de développement |

### Procédure d'escalade (3 niveaux)

1. **Niveau 1 — Détection et qualification**
   - L'incident est signalé via une issue GitHub (template "Signalement de
     bug"), avec le label de sévérité approprié.
   - Pour un incident **bloquant**, le label `critical` est ajouté et
     l'équipe est notifiée immédiatement (message direct aux membres de
     l'équipe).

2. **Niveau 2 — Diagnostic et correction**
   - Un développeur prend en charge l'issue (auto-assignation), reproduit le
     problème en local ou sur l'environnement concerné.
   - Une branche `fix/<description>` est créée à partir de `main` (ou
     `develop` selon la gravité) pour corriger le problème
     (voir convention de branches dans
     [bonnes-pratiques.md](./bonnes-pratiques.md)).
   - La correction est testée (tests automatisés + vérification manuelle),
     puis intégrée via une pull request.

3. **Niveau 3 — Déploiement et suivi**
   - Une fois la pull request validée et fusionnée sur `main`, le pipeline
     CD (`.github/workflows/cd.yml`) déploie automatiquement la correction en
     production.
   - L'auteur du signalement est notifié et invité à confirmer la résolution.
   - L'issue est fermée avec un résumé de la cause et de la correction
     apportée, pour conserver un historique exploitable (post-mortem rapide).

### Cas d'incident bloquant en production

Si le déploiement automatique échoue ou aggrave la situation, un retour à la
version précédente est possible en redéployant l'image taguée précédente
(voir section "Versioning des images" du
[plan de déploiement](./plan-deploiement.md)) :

```bash
# Sur le serveur
docker pull ghcr.io/imadbils/projet_collaboratif-backend:<sha-precedent>
docker pull ghcr.io/imadbils/projet_collaboratif-frontend:<sha-precedent>
# Modifier le tag "image:" dans docker-compose.prod.yml puis :
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 3. Maintenance préventive

- **Dépendances** : revue régulière des dépendances npm (backend, front,
  mobile) pour appliquer les correctifs de sécurité.
- **Sauvegardes** : le volume Docker `pgdata_prod` contient les données de
  production ; une sauvegarde régulière (`pg_dump`) est recommandée avant
  toute opération de maintenance importante.
- **Logs applicatifs** : consultables via `docker compose logs <service>`
  sur le serveur, utiles pour diagnostiquer un incident (voir
  [bonnes-pratiques.md](./bonnes-pratiques.md) pour la convention de logs).
