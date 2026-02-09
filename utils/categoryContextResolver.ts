
import { AuthUser } from '../context/AuthContext';
import { CATEGORIES, SECTOR_RULES, PRO_SECTORS } from '../data';
import { Category } from '../types';

export type AdContextType = 'IMPORT' | 'STORE_PRO' | 'INDIVIDUAL';

interface ResolverInput {
  user: AuthUser | null;
  searchParams: URLSearchParams;
}

export interface ResolverOutput {
  context: AdContextType;
  allowedCategories: Category[];
  forcedCategory: string | null;
  forcedSubCategory: string | null;
  isLocked: boolean;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

/**
 * SOURCE DE VÉRITÉ UNIQUE
 * Détermine le contexte de l'annonce : Qui décide de la catégorie ?
 */
export const resolveAdContext = ({ user, searchParams }: ResolverInput): ResolverOutput => {
  
  // 1. Context: IMPORT (Prioritaire si Pro & Intent Explicit)
  // Trigger : Le Pro a cliqué sur "Publier offre Import" ET il a le droit (Secteur Auto)
  // On le met en premier pour qu'un Pro puisse forcer ce mode même si son contexte par défaut est Store
  const intentMode = searchParams.get('mode');
  const intentSub = searchParams.get('subCategory');
  const isImportIntent = intentMode === 'pro_bypass' || intentSub === 'import_auto';
  
  // Vérification stricte du droit métier (pas juste l'URL)
  // Seuls les Pros du secteur Auto/Transport peuvent publier du STOCK Import
  // V3: Check if sectors includes auto_import OR auto_vente (some auto_vente may have capability)
  const canDoImport = user?.type === 'pro' && (user?.sectors?.includes('auto_import') || user?.sectors?.includes('auto_vente')); 

  if (isImportIntent && canDoImport) {
    const autoCat = CATEGORIES.find(c => c.id === 'auto');
    // On force la sous-catégorie import_auto ici, même si elle est masquée pour les particuliers
    return {
      context: 'IMPORT',
      allowedCategories: autoCat ? [autoCat] : [],
      forcedCategory: 'auto',
      forcedSubCategory: 'import_auto',
      isLocked: true,
      bannerTitle: 'Importation Véhicule',
      bannerSubtitle: 'Publication de Stock (Mode Expert)'
    };
  }

  // 2. Context: INDIVIDUAL (Particulier)
  // Si pas connecté ou type individual -> Accès libre MAIS filtré
  if (!user || user.type === 'individual') {
    // 🔒 SÉCURITÉ PRODUIT : On retire 'import_auto' des choix possibles.
    // Un particulier ne publie PAS d'annonce import, il fait une demande.
    const sanitizedCategories = CATEGORIES.map(cat => ({
      ...cat,
      subCategories: cat.subCategories?.filter(sub => sub.id !== 'import_auto')
    }));

    return {
      context: 'INDIVIDUAL',
      allowedCategories: sanitizedCategories,
      forcedCategory: null,
      forcedSubCategory: null,
      isLocked: false
    };
  }

  // 3. Context: STORE_PRO (Standard)
  // Le Pro est contraint par SES SECTEURS d'activité
  const userSectors = user.sectors || [];
  
  // Aggregation of permissions
  let permittedCategoryIds = new Set<string>();
  let permittedSubCategoryIds = new Set<string>(); // Global list of allowed subcats across all allowed cats
  
  let hasSectorWithNoSubCatLimit = false;

  userSectors.forEach(sectorId => {
      const rule = SECTOR_RULES[sectorId];
      if (rule) {
          rule.allowedCategories.forEach(c => permittedCategoryIds.add(c));
          
          if (rule.allowedSubCategories) {
              rule.allowedSubCategories.forEach(sc => permittedSubCategoryIds.add(sc));
          } else {
              // If one sector allows all subcats for a category, we flag it.
              // However, strictly speaking, `allowedSubCategories` being undefined means ALL are allowed for that sector's cats.
              // We need to handle the merge carefully.
              // Strategy: If a category is allowed, we show all its subcats UNLESS restricted by ALL sectors.
              // Actually, if I have 'auto_location' (restricts to 'rent') AND 'auto_vente' (restricts to 'car', 'moto'...), I should see BOTH sets.
              // So we should union the allowed subcats.
              // If a sector has `undefined` allowedSubCategories, it means it contributes ALL subcats of its allowedCategories.
              
              // To implement this simple union:
              // For each allowed category in this sector, add all its subcats to the permitted list if `allowedSubCategories` is undefined.
              rule.allowedCategories.forEach(catId => {
                  const catDef = CATEGORIES.find(c => c.id === catId);
                  catDef?.subCategories?.forEach(sub => permittedSubCategoryIds.add(sub.id));
              });
          }
      }
  });

  const allowedCats = CATEGORIES
    .filter(c => permittedCategoryIds.has(c.id))
    .map(c => ({
        ...c,
        // Filter subcategories based on the union of permissions
        subCategories: c.subCategories?.filter(sub => permittedSubCategoryIds.has(sub.id))
    }))
    .filter(c => c.subCategories && c.subCategories.length > 0); // Remove empty categories

  // Auto-Lock si une seule catégorie est possible (Ex: Immobilier)
  const isSingleCat = allowedCats.length === 1;
  const sectorLabel = userSectors.map(s => PRO_SECTORS.find(ps => ps.id === s)?.label).join(' + ');

  return {
    context: 'STORE_PRO',
    allowedCategories: allowedCats,
    forcedCategory: isSingleCat ? allowedCats[0].id : null,
    forcedSubCategory: null, // Le Pro choisit sa sous-catégorie (Vente, Loc...)
    isLocked: isSingleCat,
    bannerTitle: 'Mode Store Pro',
    bannerSubtitle: `Secteurs : ${sectorLabel}`
  };
};
