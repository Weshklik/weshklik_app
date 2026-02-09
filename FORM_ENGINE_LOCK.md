
# 🔒 WESHKLIK FORM ENGINE — ARCHITECTURE LOCK

Ce document définit les règles immuables du moteur de formulaire.
Toute modification du formulaire doit respecter ces principes.

## 1. Philosophie
*   **Source de Vérité Unique** : Le fichier Schema (`.ts`) définit TOUT (champs, validation, UI hints, dépendances).
*   **UI "Dumb"** : Le composant React (`FormRenderer`) ne connaît pas le métier. Il ne fait qu'afficher ce que le schéma lui dit.
*   **IA & Voice Ready** : Chaque champ possède un `aiHint` permettant à un LLM de mapper une phrase naturelle ("Je vends une Golf 2020") vers les champs structurés.

## 2. Structure du Schéma (`FormSchema`)
Un schéma est un objet JSON/TS statique.

```typescript
interface FormField {
  id: string;          // Clé de donnée (ex: 'brand')
  type: string;        // 'select', 'text', 'number', etc.
  required: boolean;   // Validation
  
  // 🧠 Cerveau
  dependsOn?: string;  // ID du champ parent (ex: 'brand')
  source?: string;     // Nom de la source de données (ex: 'models_by_brand')
  
  // 🤖 IA & Import
  aiHint?: string;     // Intention NLP (ex: 'car_brand')
  csvColumn?: string;  // Nom de la colonne CSV (si différent de id)
}
```

## 3. Workflow de Données

### A. Saisie Manuelle (Starter / Particulier)
1.  L'utilisateur sélectionne Catégorie/Sous-catégorie.
2.  Le `FormEngine` charge le schéma correspondant.
3.  Le `FormRenderer` affiche les champs.
4.  À chaque changement, `useFormEngine` nettoie les dépendances (ex: reset modèle si marque change).

### B. Import CSV (Pro Premium)
1.  Le Pro uploade un CSV.
2.  Le `CsvEngine` charge le MÊME schéma.
3.  Pour chaque ligne du CSV :
    *   Mappe les colonnes vers `field.id`.
    *   Exécute `validate(schema, row)`.
    *   Rapporte les erreurs précises (ligne 4, colonne 'Prix' invalide).

## 4. Règles d'Or
1.  **Jamais de `if (category === 'auto')` dans le JSX.**
2.  **Jamais de validation hardcodée dans le `handleSubmit`.** Tout est dans le schéma (min, max, regex).
3.  **Les listes de choix (Marques, Villes) sont dans `registry.ts`, pas dans le composant.**

---
*Version 1.0 - Locked*
