
import { CurrencyCode, ExchangeRate } from '../types';

// TAUX OFFICIELS BANCAIRES (FIXES POUR L'INSTANT - A CONNECTER API)
// Source: Banque d'Algérie (Simulation)
const OFFICIAL_RATES: Record<CurrencyCode, number> = {
  'DZD': 1,
  'EUR': 146.50, // 1 Euro = 146.50 DZD
  'USD': 134.20  // 1 Dollar = 134.20 DZD
};

export const getOfficialRate = (currency: CurrencyCode): ExchangeRate => {
  return {
    code: currency,
    rate: OFFICIAL_RATES[currency],
    source: 'Bank Of Algeria',
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Convertit DZD vers Devise Cible (Affichage / Paiement Client)
 * @param amountDZD Montant en Dinars
 * @param targetCurrency Devise souhaitée (EUR, USD)
 */
export const convertFromDZD = (amountDZD: number, targetCurrency: CurrencyCode): number => {
  if (targetCurrency === 'DZD') return amountDZD;
  const rate = OFFICIAL_RATES[targetCurrency];
  return amountDZD / rate;
};

/**
 * Convertit Devise vers DZD (Stockage / Comptabilité)
 * @param amount Montant en devise
 * @param sourceCurrency Devise source
 */
export const convertToDZD = (amount: number, sourceCurrency: CurrencyCode): number => {
  if (sourceCurrency === 'DZD') return amount;
  const rate = OFFICIAL_RATES[sourceCurrency];
  return amount * rate;
};

/**
 * Formate un montant avec la devise locale ou internationale
 * CORRECTION CRITIQUE: DZD = 0 decimales, EUR/USD = 2 decimales fixes.
 * Empêche l'erreur RangeError (min > max).
 */
export const formatCurrency = (amount: number, currency: CurrencyCode): string => {
  // Sécurité: Si amount est null, undefined ou NaN, on force 0
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  const locale = currency === 'DZD' ? 'fr-DZ' : 'en-US';
  
  // Règle stricte : 0 décimale pour DZD, 2 pour les devises étrangères
  const digits = currency === 'DZD' ? 0 : 2;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits // Doit être >= minimumFractionDigits
    }).format(safeAmount);
  } catch (e) {
    console.error("Erreur formatage devise:", e);
    // Fallback safe en cas d'erreur navigateur
    return `${safeAmount.toFixed(digits)} ${currency}`;
  }
};
