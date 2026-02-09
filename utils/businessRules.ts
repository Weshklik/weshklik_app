
import { AuthUser } from '../context/AuthContext';
import { SECTOR_RULES, PACK_CAPABILITIES } from '../data';
import { FeatureAccessResult } from '../types';

/**
 * Fonction centrale de décision UX/Business.
 * Ne contient pas de logique API, mais détermine si l'UI doit bloquer ou autoriser.
 */
export const canUseFeature = (
  user: AuthUser | null,
  feature: 'import_auto' | 'import_csv'
): FeatureAccessResult => {
  
  // 1. Check if user is Pro
  if (!user || user.type !== 'pro') {
    return {
      allowed: false,
      reason: 'NOT_PRO',
      title: 'Accès Réservé',
      message: feature === 'import_auto' 
        ? "L’import de véhicules est réservé aux professionnels disposant d’une boutique."
        : "L'import CSV est un outil réservé aux boutiques professionnelles.",
      redirect: '/become-pro'
    };
  }

  // 1.5 Check Expiration (Global Block for Premium Features)
  if (user.package_expires_at && user.package_slug !== 'free') {
    const expiresAt = new Date(user.package_expires_at);
    if (expiresAt < new Date()) {
       return {
         allowed: false,
         reason: 'PACK_EXPIRED',
         title: 'Abonnement Expiré',
         message: "Votre pack a expiré. Veuillez renouveler votre abonnement pour accéder à nouveau à cette fonctionnalité.",
         redirect: '/pro-plans'
       };
    }
  }

  // If pro but no sector defined (edge case), block
  if (!user.sector || !SECTOR_RULES[user.sector]) {
    return {
      allowed: false,
      reason: 'SECTOR_RESTRICTED',
      title: 'Secteur non défini',
      message: "Veuillez compléter le profil de votre boutique pour accéder à ces outils."
    };
  }

  const sectorRule = SECTOR_RULES[user.sector];
  const userPackSlug = user.package_slug || 'free';
  const packCapabilities = PACK_CAPABILITIES[userPackSlug];

  // If pack definition is missing (should not happen), fallback to free
  if (!packCapabilities) {
      console.warn(`[BusinessRules] Unknown pack '${userPackSlug}', falling back to free.`);
      return { allowed: false, message: "Erreur configuration pack." };
  }

  // 2. Logic for Import Auto
  if (feature === 'import_auto') {
    // Check Sector Permission
    if (!sectorRule.importAutoAllowed) {
      return {
        allowed: false,
        reason: 'SECTOR_RESTRICTED',
        title: 'Service non disponible',
        message: "L'importation de véhicules n'est pas disponible pour votre secteur d'activité."
      };
    }
    // Check Pack Capability
    if (!packCapabilities.importAutoAccess) {
        return {
            allowed: false,
            reason: 'PACK_REQUIRED',
            title: 'Option Import Auto',
            message: "Votre pack actuel ne permet pas la gestion des demandes d'import.\n\n👉 Passez à un pack Silver ou Gold."
        };
    }

    // Allowed
    return {
      allowed: true,
      reason: 'OK',
      redirect: '/import-request',
      message: "Soumettez votre demande d’import. Un professionnel vous contactera." 
    };
  }

  // 3. Logic for Import CSV
  if (feature === 'import_csv') {
    // A. Check Sector
    if (sectorRule.csvImportMinPack === 'none') {
      return {
        allowed: false,
        reason: 'SECTOR_RESTRICTED',
        title: 'Import CSV indisponible',
        message: "Ce secteur ne permet pas l’import d’annonces en masse afin de garantir la qualité et la conformité des contenus."
      };
    }

    // B. Check Pack Capability
    if (!packCapabilities.importCsvAllowed) {
      return {
        allowed: false,
        reason: 'PACK_REQUIRED',
        title: 'Import CSV indisponible',
        message: "Votre pack actuel ne permet pas l’import d’annonces en masse.\n\n👉 Passez à un pack Medium ou Premium pour débloquer cette fonctionnalité."
      };
    }

    // Allowed
    return {
      allowed: true,
      reason: 'OK',
      message: "Importez plusieurs annonces en un seul fichier CSV."
    };
  }

  return { allowed: false, message: "Fonctionnalité inconnue" };
};
