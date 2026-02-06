
import { BookingBreakdown, CurrencyCode, Listing, RentalOption } from '../types';
import { convertFromDZD, getOfficialRate } from './currency';

// CONFIGURATION COMMISSIONS WESHKLIK
const COMMISSION_RATES = {
  INDIVIDUAL_PERCENT: 0.15, // 15% pour particuliers
  PRO_PERCENT: 0.10, // 10% pour Pros
  FIXED_FEE_DZD: 500 // Frais fixes de dossier (ex: 500 DA)
};

/**
 * Calcule le prix total d'une réservation, la conversion et la répartition financière.
 */
export const calculateBookingPrice = (
  listing: Listing,
  startDate: Date,
  endDate: Date,
  selectedOptions: string[], // IDs des options
  displayCurrency: CurrencyCode
): BookingBreakdown => {
  
  // 1. Calcul Durée (Nuits ou Jours)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const billingDuration = duration === 0 ? 1 : duration; // Minimum 1 unité

  // 2. Prix de Base (DZD)
  // On suppose que listing.price est par nuit/jour et stocké en DZD
  const basePriceDZD = listing.price * billingDuration;

  // 3. Options (DZD)
  const optionsList: RentalOption[] = listing.rentalConfig?.options || [];
  let optionsPriceDZD = 0;

  selectedOptions.forEach(optId => {
    const opt = optionsList.find(o => o.id === optId);
    if (opt) {
      if (opt.type === 'per_day') {
        optionsPriceDZD += opt.priceDZD * billingDuration;
      } else {
        optionsPriceDZD += opt.priceDZD; // Prix fixe par séjour (ex: ménage)
      }
    }
  });

  // 4. Total Brut (DZD)
  const totalDZD = basePriceDZD + optionsPriceDZD;

  // 5. Calcul Commission (DZD)
  const isPro = listing.seller.type === 'pro';
  const commissionRate = isPro ? COMMISSION_RATES.PRO_PERCENT : COMMISSION_RATES.INDIVIDUAL_PERCENT;
  
  const variableCommission = totalDZD * commissionRate;
  const weshKlikCommissionDZD = variableCommission + COMMISSION_RATES.FIXED_FEE_DZD;

  // 6. Net Vendeur (DZD)
  // Ce que le vendeur recevra sur son compte en Algérie
  const sellerNetDZD = totalDZD - weshKlikCommissionDZD;

  // 7. Conversion Devise Client (Au taux officiel)
  const rateObj = getOfficialRate(displayCurrency);
  const totalInCurrency = convertFromDZD(totalDZD, displayCurrency);

  return {
    currency: displayCurrency,
    exchangeRate: rateObj.rate,
    duration: billingDuration,
    basePriceDZD,
    optionsPriceDZD,
    totalDZD,
    totalInCurrency,
    weshKlikCommissionDZD,
    sellerNetDZD
  };
};
