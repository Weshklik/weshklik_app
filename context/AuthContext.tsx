
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, StoreProfile } from '../types';
import { MOCK_STORES, SECTOR_RULES, MOCK_PARTNERS } from '../data';

// Extended User type for Auth purposes
export interface AuthUser extends User {
  email: string;
  storeId?: string; // For Pros
  // Merge StoreProfile capabilities directly into user for simplified access in this context
  package_slug?: string;
  package_updated_at?: string;
  package_expires_at?: string;
  // Phase 1.5: Sector Data
  sector?: string;
  categories?: string[];
  
  // Partner Module Specifics
  partnerPlan?: 'partner_free' | 'partner_active';
  partnerSubscriptionDate?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: 'individual' | 'pro') => void;
  debugLogin: (storeId: string) => void;
  logout: () => void;
  updateProPack: (packSlug: 'free' | 'silver' | 'gold') => void;
  upgradeToPro: (storeData: any) => void;
  // Partner Module
  applyForPartner: (data: any) => void;
  updatePartnerPlan: (plan: 'partner_free' | 'partner_active') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for Simulation
const MOCK_INDIVIDUAL_USER: AuthUser = {
  id: 'u_indiv_123',
  name: 'Amine Particulier',
  email: 'amine@test.com',
  type: 'individual',
  avatar: 'https://ui-avatars.com/api/?name=Amine+P&background=random',
  verified: true
};

const MOCK_PRO_USER: AuthUser = {
  id: 'u1', // Matches Auto Luxe DZ in data.ts
  name: 'Auto Luxe DZ',
  email: 'pro@autoluxe.dz',
  type: 'pro',
  avatar: MOCK_STORES['u1'].avatar,
  verified: true,
  storeId: 'u1',
  package_slug: 'free', // Default
  sector: 'auto_vente', // UPDATED DEFAULT
  categories: ['concessionnaire']
};

// Mock Partner User (for testing Step 3 directly if needed)
const MOCK_PARTNER_USER: AuthUser = {
    id: 'p_1',
    name: 'Karim Service',
    email: 'karim@partner.dz',
    type: 'individual',
    avatar: 'https://ui-avatars.com/api/?name=Karim+S&background=10b981&color=fff',
    verified: true,
    isPartner: true,
    partnerStatus: 'approved',
    partnerPlan: 'partner_free'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Migration Helper: Fix Sector if it doesn't exist in current RULES
  const migrateUserStore = (u: AuthUser): AuthUser => {
    if (u.type !== 'pro' || !u.sector) return u;

    // Check if sector exists in V1.5 rules
    if (!SECTOR_RULES[u.sector]) {
        console.warn(`[Migration] Sector '${u.sector}' not found. Migrating...`);
        let newSector = 'commerce'; // Default fallback
        
        // Simple mapping logic for old sectors
        if (u.sector === 'transport') newSector = 'auto_vente';
        if (u.sector === 'vehicules') newSector = 'auto_vente';
        
        return { ...u, sector: newSector };
    }
    return u;
  };

  // 1. Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('wk_auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const migrated = migrateUserStore(parsed);
        
        if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
            console.log('[Auth] User migrated to new Store structure');
            localStorage.setItem('wk_auth_user', JSON.stringify(migrated));
        }
        setUser(migrated);
      } catch (e) {
        console.error('Failed to parse auth user', e);
        localStorage.removeItem('wk_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Login Simulation
  const login = (role: 'individual' | 'pro') => {
    const userToSet = role === 'pro' ? MOCK_PRO_USER : MOCK_INDIVIDUAL_USER;
    setUser(userToSet);
    localStorage.setItem('wk_auth_user', JSON.stringify(userToSet));
  };

  // 2.5 Debug Login (For Test Accounts)
  const debugLogin = (storeId: string) => {
    // Special case for Partner Debug
    if (storeId === 'p_1') {
        setUser(MOCK_PARTNER_USER);
        localStorage.setItem('wk_auth_user', JSON.stringify(MOCK_PARTNER_USER));
        return;
    }

    const store = MOCK_STORES[storeId];
    if (!store) return;

    const userToSet: AuthUser = {
      id: store.id,
      name: store.name,
      email: `${store.id}@test.com`,
      type: 'pro',
      avatar: store.avatar,
      verified: store.verified || false,
      storeId: store.id,
      package_slug: store.package_slug,
      sector: store.sector,
      categories: store.categories,
      // Ensure expiration date is set for testing active status
      package_updated_at: new Date().toISOString(),
      package_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    setUser(userToSet);
    localStorage.setItem('wk_auth_user', JSON.stringify(userToSet));
  };

  // 3. Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('wk_auth_user');
  };

  // 4. Update Pack (SaaS Logic)
  const updateProPack = (packSlug: 'free' | 'silver' | 'gold') => {
    if (!user || user.type !== 'pro') return;

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 30); // 30 days subscription

    const updatedUser: AuthUser = {
      ...user,
      package_slug: packSlug,
      package_updated_at: now.toISOString(),
      package_expires_at: expiresAt.toISOString()
    };

    setUser(updatedUser);
    localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
    
    // In a real app, we would also update the MOCK_STORES or backend here
    console.log(`[DB] Updated Store ${user.storeId} with pack ${packSlug}. Expires: ${expiresAt.toISOString()}`);
  };

  // 5. Upgrade to Pro (Phase 2)
  const upgradeToPro = (storeData: any) => {
    if (!user) return;

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 30); // 30 days free trial

    const updatedUser: AuthUser = {
      ...user,
      type: 'pro',
      storeId: 'u_' + Date.now(), // Generate a mock store ID
      package_slug: 'free',
      package_updated_at: now.toISOString(),
      package_expires_at: expiresAt.toISOString(),
      name: storeData.storeName || user.name, // Use store name if provided
      sector: storeData.sector,
      categories: storeData.categories,
      // In a real app we'd save other storeData fields (category, phone, wilaya) to a separate store record
    };

    setUser(updatedUser);
    localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
    console.log('[DB] User upgraded to Pro with Free Pack', storeData);
  };

  // 6. Partner Onboarding (Step 2)
  const applyForPartner = (data: any) => {
      if (!user) return;
      const updatedUser: AuthUser = {
          ...user,
          isPartner: true,
          partnerStatus: 'pending', // Step 2: pending validation
          partnerPlan: 'partner_free' // Default
      };
      setUser(updatedUser);
      localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
      console.log('[DB] User applied for Partner', data);
  };

  // 7. Update Partner Plan (Step 3: Subscription)
  const updatePartnerPlan = (plan: 'partner_free' | 'partner_active') => {
      if (!user) return;
      const updatedUser: AuthUser = {
          ...user,
          partnerPlan: plan,
          partnerStatus: 'approved', // Auto-approve for demo/payment success
          partnerSubscriptionDate: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
      console.log(`[DB] Partner plan updated to ${plan}`);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      debugLogin,
      logout, 
      updateProPack,
      upgradeToPro,
      applyForPartner,
      updatePartnerPlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
