
export interface StoreCapabilities {
  // --- IDENTITY ---
  hasStore: boolean;
  storeName: string;
  sectors: string[];
  currentPack: 'free' | 'silver' | 'gold' | 'premium';

  // --- PERMISSIONS (Can I do X?) ---
  canPostListings: boolean;
  canImportCSV: boolean;
  canReceiveImportRequests: boolean;
  canUseBoost: boolean;
  canAccessAPI: boolean;

  // --- QUOTAS (Numbers) ---
  maxListings: number; // -1 = Unlimited
  listingsUsed: number;
  listingsRemaining: number;
  
  boostsTotal: number;
  boostsUsed: number; // Mocked for MVP
  boostsRemaining: number;

  // --- UX HELPERS (For UI conditional rendering) ---
  isAuto: boolean;       // Any auto sector
  isImport: boolean;     // Specific import specialist
  isImmo: boolean;       // Real estate
  isServices: boolean;   // Services
}
