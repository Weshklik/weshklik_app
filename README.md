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