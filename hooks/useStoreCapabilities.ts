
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PACK_CAPABILITIES } from '../data';
import { useListings } from '../context/ListingsContext';
import { StoreCapabilities } from '../types/storeCapabilities';

export const useStoreCapabilities = (): StoreCapabilities => {
  const { user } = useAuth();
  const { listings } = useListings(); // Use context source

  return useMemo(() => {
    // 1. BASE DATA
    const hasStore = user?.type === 'pro';
    const sectors = user?.sectors || [];
    const currentPack = (user?.package_slug as any) || 'free';
    const packConfig = PACK_CAPABILITIES[currentPack] || PACK_CAPABILITIES['free'];

    // 2. USAGE METRICS (Source: Dynamic Context Listings)
    const myListings = listings.filter(l => l.seller.id === user?.id);
    const listingsUsed = myListings.length;
    
    // Mock Boost Usage (Count promoted listings)
    const boostsUsed = myListings.filter(l => l.isPromoted).length;

    // 3. LIMITS CALCULATION
    const maxListings = packConfig.maxActiveListings;
    const isUnlimitedListings = maxListings === -1;
    const listingsRemaining = isUnlimitedListings ? 9999 : Math.max(0, maxListings - listingsUsed);

    const boostsTotal = packConfig.boostsPerMonth;
    const boostsRemaining = Math.max(0, boostsTotal - boostsUsed);

    // 4. SECTOR FLAGS (UX Shortcuts)
    const isAuto = sectors.some(s => s.startsWith('auto_'));
    const isImport = sectors.includes('auto_import');
    const isImmo = sectors.includes('immobilier');
    const isServices = sectors.includes('services');

    // 5. PERMISSIONS LOGIC (The Brain)
    
    // Can Post? Yes if unlimited OR quota remaining
    const canPostListings = hasStore && (isUnlimitedListings || listingsRemaining > 0);

    // Can CSV? Yes if Pack allows it (Silver+)
    const canImportCSV = hasStore && packConfig.importCsvAllowed;

    // Can Import Requests? 
    // MUST match BOTH:
    // A. Sector: Must be 'auto_import' OR 'auto_vente' (Dealers)
    // B. Pack: Must be Silver+ (importAutoAccess = true)
    const canReceiveImportRequests = hasStore && 
                                     (isImport || sectors.includes('auto_vente')) && 
                                     packConfig.importAutoAccess;

    // Can Boost? Yes if pack has boosts remaining
    // (Later we can add || canPayPerUse)
    const canUseBoost = hasStore && boostsRemaining > 0;

    return {
      hasStore,
      storeName: user?.name || 'Mon Store',
      sectors,
      currentPack,

      canPostListings,
      canImportCSV,
      canReceiveImportRequests,
      canUseBoost,
      canAccessAPI: packConfig.apiAccess,

      maxListings,
      listingsUsed,
      listingsRemaining,

      boostsTotal,
      boostsUsed,
      boostsRemaining,

      isAuto,
      isImport,
      isImmo,
      isServices
    };
  }, [user, listings]);
};
