
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { SECTOR_RULES, MOCK_LISTINGS } from '../data';

export const useSectorRules = () => {
  const { user } = useAuth();

  const rules = useMemo(() => {
    // Default rules if no user or no sector
    const defaultRules = {
      freeLimit: 1,
      importAutoAllowed: false,
      csvImportMinPack: 'none',
      manualValidation: false,
      currentListingCount: 0,
      canPost: true,
      mustUpgrade: false,
      remainingFreeSlots: 1
    };

    if (!user || user.type !== 'pro' || !user.sector) return defaultRules;

    const sectorRule = SECTOR_RULES[user.sector];
    if (!sectorRule) return defaultRules;

    // Count user listings from mock data
    const currentListingCount = MOCK_LISTINGS.filter(l => l.seller.id === user.id).length;
    
    // Determine Pack Status
    const isFreePack = !user.package_slug || user.package_slug === 'free';
    
    // Logic: If free pack, check limit. If paid pack, unlimited (for now).
    let canPost = true;
    let mustUpgrade = false;
    let remainingFreeSlots = 0;

    if (isFreePack) {
        remainingFreeSlots = Math.max(0, sectorRule.freeLimit - currentListingCount);
        if (remainingFreeSlots === 0) {
            canPost = false;
            mustUpgrade = true;
        }
    } else {
        remainingFreeSlots = Infinity;
    }

    return {
      ...sectorRule,
      currentListingCount,
      canPost,
      mustUpgrade,
      remainingFreeSlots,
      isFreePack
    };
  }, [user]);

  return rules;
};
