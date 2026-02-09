weshklik-web-core-V2
Weshklik-App est une plateforme de marketplace et de petites annonces multi-catégories destinée au marché algérien, conçue pour faciliter la mise en relation entre acheteurs, vendeurs, partenaires et professionnels dans un environnement structuré et moderne, tout en privilégiant l’expérience utilisateur, l’accessibilité et l’adaptabilité locale.

🛍️ Fonctionnalités principales

Création et navigation d’annonces : les utilisateurs peuvent consulter, rechercher et filtrer des annonces dans une vaste gamme de catégories (immobilier, véhicules, services, emploi, multimédia, maison & jardin, mode, loisirs, etc.).

Comptes et profils utilisateurs : plate-forme supporte différents types de comptes pour particuliers, professionnels (Stores PRO), et partenaires d’achat, avec des permissions et interfaces dédiées pour chacun.

Stores PRO (boutiques métier) : les professionnels peuvent créer leur boutique dédiée avec un dashboard de gestion d’annonces, de demandes, de messages et de statistiques, ce qui facilite la gestion commerciale sur la plateforme.

Import Auto spécialisé : un module transversal permettant aux particuliers de formuler des demandes spécifiques d’importation de véhicules depuis l’Europe et Dubaï, gérées par les Stores PRO import auto via des devis, messages et suivis structurés.

IA assistive intégrée : Weshklik-App inclut des fonctionnalités d’IA textuelle et vocale pour aider les utilisateurs à rédiger, structurer et enrichir leurs annonces, optimiser les champs de formulaire et faire de la reconnaissance vocale pour améliorer la saisie, tout en restant optionnelle et non bloquante.

Communication interne : messagerie sécurisée intégrée pour dialoguer entre acheteurs, vendeurs, professionnels et partenaires sans exposer directement les coordonnées personnelles.

Recherche & filtres avancés : moteur de recherche puissant avec filtres multi-critères pour rapidité et précision dans les résultats.

Gestion des favoris et alertes : possibilité de sauvegarder des annonces, de recevoir des alertes personnalisées, et de gérer ses contenus préférés.

🛠️ Modèle économique

Monétisation via Packs & Options Premium : les utilisateurs PRO peuvent acheter des packs de visibilité, des boosts d’annonces, et des options premium (photo/video packs).

Partenaires d’achat et réputation : Weshklik-App intègre un système de partenaires d’achat pour faciliter certaines transactions locales, avec un système de notation pour garantir la qualité et la confiance.

Services additionnels : possibilité d’offrir des services de mise en avant, d’assistance ou de support payants pour booster la visibilité des annonces.

🗺️ Contexte & expérience locale

La plateforme est pensée pour refléter les usages spécifiques et contraintes du marché algérien, avec :

une interface multilingue (arabe, français, anglais),

des modes de paiement réalistes adaptés au contexte local,

des parcours utilisateur optimisés pour mobile et web.

📈 Objectif global

L’objectif de Weshklik-App est de devenir la plateforme de petites annonces la plus complète, fiable et intelligente en Algérie, en combinant :

l’étendue fonctionnelle d’un site de classifieds classique,

les avantages d’un système marketplace moderne,

l’IA pour améliorer l’expérience utilisateur,

des espaces utilisateurs distincts pour particuliers, professionnels et import auto. Description de la maturité du projet

⚠️ Important — Projet existant
Ce dépôt correspond à un projet déjà existant et fonctionnel.

Les objectifs actuels ne sont PAS de recréer la plateforme, mais de :

améliorer l’existant
ajouter de nouvelles fonctionnalités
renforcer l’UX et la séparation des espaces
intégrer progressivement des fonctionnalités IA assistives
❌ Toute modification doit :

éviter les refactors globaux
éviter de casser les parcours existants
respecter l’architecture, les patterns et la structure actuels
👉 Toute génération de code (Codex, Gemini, Google AI Studio) doit être :

incrémentale
ciblée
isolée
réversible
🔒 Séparation stricte des espaces
La plateforme est organisée autour de trois espaces totalement étanches :

Espace Particulier

consultation et publication d’annonces classiques
utilisation de l’IA pour rédiger/dicter
création de demandes d’import auto (formulaire dédié)
Espace Store PRO

gestion d’une boutique professionnelle
publication d’annonces PRO
dashboard métier, statistiques, leads
Espace Import Auto

module spécialisé et séparé
demandes d’import (jamais des annonces)
devis et suivi par Stores PRO Import
❌ Aucun mélange de contexte, de layout ou de logique métier entre ces espaces n’est autorisé.

🤖 IA — Règles d’intégration
L’IA est assistive, jamais obligatoire.

Elle est utilisée pour :

générer ou améliorer des titres et descriptions
proposer des champs intelligents dans les formulaires
permettre la dictée vocale des annonces
aider à la catégorisation et à la cohérence des données
Règles strictes :

aucune soumission automatique par IA
toujours laisser la main à l’utilisateur
IA contextuelle (Particulier / PRO / Import)
fallback manuel obligatoire
💳 Paiement — Contexte algérien
Weshklik n’encaisse jamais directement l’argent.

Les paiements sont externes et adaptés aux usages locaux :

Carte bancaire (pour les utilisateurs équipés)
BaridiMob / virement
Partenaire d’achat (profil validé + réputation)
Cash On Delivery (COD)
La plateforme assure la traçabilité, mais n’est pas un intermédiaire financier.

📌 Source of Truth pour Codex / Gemini
Ce README constitue la source de vérité unique.

Toute génération de code doit :

se baser exclusivement sur ce document
respecter les règles métier décrites
ne pas inventer de nouveaux parcours
ne pas modifier l’existant sans instruction explicite
En cas de doute : ➡️ demander clarification ➡️ ne pas supposer
⚠️ Note: `sync/new-project` is a historical migration branch (V2 introduction).
Do not use or delete it for now.
- `main` = V2 stable (source of truth)
- `S-dev` = développement actif
- `A-dev` / `Preprod` = staging & validation
- `exp/*` = expérimentations IA
- `sync/new-project` = migration historique V2 (ne pas utiliser)

OBJECTIF GLOBAL

À partir de maintenant, ton workflow Git ressemble à :

exp/*  →  S-dev  →  main


exp/ : branches expérimentales (IA, prototypes, nouvelles idées)

S-dev : développement actif, intégration continue

main : version stable, production-ready

A-dev / Preprod : branches staging / environnement de pré-prod (alignées sur V2)

L’objectif est de garder main propre, et d’itérer chaque feature dans un workflow structuré.

📌 BRANCHING WORKFLOW (SCHÉMA)
exp/FEATURE-BRANCH
        │
        ├── PR (exp → S-dev)
        │     - revue
        │     - tests automatisés
        │     - validations IA code + humains
        v
     S-dev (dev intégrée)
        │
        ├── QA / staging
        │
        v
     main (release / prod)

🧠 DÉTAILS DU WORKFLOW
🟡 1) exp/ — Branches expérimentales (Codex / Gemini)

Rôle :

Prototype IA, exploration

Prompt engineering

Génération de nouveaux composants avec Codex

Test de patterns IA sans casser le code

Intégration de nouvelles idées

Convention :

exp/ai-assist-integration
exp/import-auto-enhancements
exp/ui-search-ia


Règles IA :

L’IA code/tags/prompt est isolée ici

Pas de merge direct vers main

Code généré doit être revu par un humain

Inclure un résumé plus manuel que automatique

🔨 2) S-dev — Dev actif

Rôle :

Intégrer les features finalisées depuis exp/

Ajouter tests unitaires et e2e

Corriger bugs moyens

Préparer la release

Processus idéal :

Crée une PR depuis exp/feature → S-dev

Noter :

Qu’est-ce qui a été généré par IA

Quels tests ont été ajoutés

Revue

Validation

Merge

Checklists Git :

- [ ] Nouvelle fonctionnalité documentée
- [ ] Tests ajoutés
- [ ] Aucun code legacy accidentel
- [ ] Dépendances ajoutées validées
- [ ] Pas de secrets committés

🟢 3) main — Version stable prod

Rôle :

Contenir la version stable du projet

Minimum bugs

Validé par une équipe

Merge policy :

Seul S-dev → main passe

Via PR + review

Tag de version (v2.1.0, etc.)

📄 STANDARD OPERATING PROCEDURE (SOP)

Tu peux copier/coller la version ci-dessous dans un fichier
👉 /docs/GIT_WORKFLOW.md ou section dédiée du README :

# Git Workflow – Weshklik

## Branches

- `main`: version stable
- `S-dev`: développement intégré
- `A-dev`, `Preprod`: staging / pré-prod
- `exp/*`: expérimental / IA prototypage

## Expérimentations IA

Work only in branches with prefix `exp/`.

1. Create branch:
   `git checkout -b exp/feature-name main`
2. Add code (manual + IA assisted)
3. Test thoroughly
4. PR into `S-dev`
5. Review strictly before merging

## S-dev Merge Policy

- Only merge **exp/** branches into S-dev via PR
- Ensure:
  - tests pass
  - no high priority bugs
  - code review signed off

## Release to main

- Fast-forward from S-dev
- Create PR: `S-dev → main`
- Ensure:
  - change log updated
  - version bump made
  - developers sign off


🤖 WORKFLOW IA & CODEX (SPÉCIFIQUE)

Ce workflow définit comment utiliser Codex sans dérive :

🟦 Codex prompt discipline

Dans chaque exp/feature branch, la règle est :

📌 Prompt MUST include:

# CONTEXT
Use the README as source of truth.
This is an existing project.

# SCOPE
Only add or modify isolated feature X.

# CONSTRAINTS
Do not refactor global architecture.
Do not break existing flows.
Respect current API patterns.
Add tests where possible.


Codex doit générer patches commits isolés, pas remaniements globaux.

🧪 Tests obligatoires

Pour chaque commit IA :

Ajouter tests unitaires (Jest / Vitest)

Ajouter tests e2e (Playwright / Cypress)

Vérifier que rien de cassé sur S-dev

🚀 COMMENT COMMENCER À CODER AVEC CODEX

Exemple de premier prompt pour exp/ia-assist-integration :

Context:
Weshklik-App marketplace V2 exists.
This branch exp/ai-assist-integration is for enabling AI text assist for form fields.

Scope:
Add a button “Generate with AI” next to title and description fields.
When clicked:
  - call /ai/generate-text
  - populate fields
Include fallback manual edit.

Constraints:
Use existing FormRenderer hooks.
Do not refactor core architecture.
Add unit tests for new UI flows.
Provide type definitions where needed.

🧠 BONNES PRATIQUES POUR L’IA

✔ Prompt = contexte complet
✔ Prompt = limité et ciblé
✔ Ask for code + tests
✔ Ask for annotations
✔ Always review manually
✔ Keep test first approach

🧪 CHECKLIST POST-CODING

 Tests pass

 UI validated manually

 No console errors

 Code readable

 Types correct

 Prompt documented

📦 VERSIONNING & TAGGING

Pour une release :

git checkout main
git pull origin main
git tag v2.x.y
git push origin v2.x.y

📌 RECETTE RAPIDE AU DÉBUT DE CHAQUE FEATURE

git checkout main

git pull

git checkout -b exp/your-feature

Codex prompt + code

git push origin exp/your-feature

PR → S-dev

Merge → tests + QA

PR → main

🟢 EN BREF

exp → S-dev → main est ton workflow
il garantit :

stabilité

sécurité

productivité IA

cohérence produit

Place-la après la description du projet, avant les détails techniques.

## Development Workflow (Important)

This project follows a strict and safe development workflow, especially for
AI-assisted development (Codex / Google AI Studio / Gemini).

### Branching Strategy



exp/* → S-dev → main


### Branch Roles

- **`main`**  
  Stable V2 baseline. Source of truth.  
  No direct development or AI experimentation allowed.

- **`S-dev`**  
  Active development branch.  
  All validated features are merged here before reaching `main`.

- **`exp/*`**  
  Experimental branches dedicated to AI-assisted development and prototyping
  (Codex, Gemini, prompt testing).

⚠️ All AI-generated code must start in an `exp/*` branch and be reviewed
before merging into `S-dev`.

### Legacy Migration Branch

- **`sync/new-project`**  
  Historical branch used to migrate the legacy codebase to V2.  
  Must NOT be used for development and must NOT be deleted for now.

### Detailed Rules

For the complete AI development process, prompt guidelines, and QA rules,
see:

➡️ `docs/AI_DEV_WORKFLOW.md`