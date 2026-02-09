
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
  sectors?: string[]; // CHANGED: Array support
  sector?: string; // DEPRECATED: Kept for legacy compatibility during migration
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
  sectors: ['auto_vente'], // Default
  categories: ['concessionnaire']
};

// Mock Partner User
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

  // Migration Helper: Fix Sector if it doesn't exist in current RULES or migrate string to array
  const migrateUserStore = (u: AuthUser): AuthUser => {
    if (u.type !== 'pro') return u;

    let updatedUser = { ...u };

    // 1. Migrate single sector to array if missing
    if (!updatedUser.sectors && updatedUser.sector) {
        updatedUser.sectors = [updatedUser.sector];
    }

    // 2. Validate sectors exist in V3 Rules
    if (updatedUser.sectors) {
        const validSectors = updatedUser.sectors.map(s => {
            if (SECTOR_RULES[s]) return s;
            // Map legacy
            if (s === 'transport') return 'auto_vente';
            if (s === 'vehicules') return 'auto_vente';
            if (s === 'commerce') return 'retail';
            return null;
        }).filter(Boolean) as string[];
        
        if (validSectors.length === 0) validSectors.push('retail'); // Fallback
        updatedUser.sectors = validSectors;
    }

    return updatedUser;
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
      sectors: store.sectors,
      categories: store.categories,
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
    expiresAt.setDate(now.getDate() + 30); 

    const updatedUser: AuthUser = {
      ...user,
      package_slug: packSlug,
      package_updated_at: now.toISOString(),
      package_expires_at: expiresAt.toISOString()
    };

    setUser(updatedUser);
    localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
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
      storeId: 'u_' + Date.now(), 
      package_slug: 'free',
      package_updated_at: now.toISOString(),
      package_expires_at: expiresAt.toISOString(),
      name: storeData.storeName || user.name, 
      sectors: storeData.sectors, // Array
      categories: storeData.categories,
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
          partnerStatus: 'pending', 
          partnerPlan: 'partner_free' 
      };
      setUser(updatedUser);
      localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
  };

  // 7. Update Partner Plan (Step 3: Subscription)
  const updatePartnerPlan = (plan: 'partner_free' | 'partner_active') => {
      if (!user) return;
      const updatedUser: AuthUser = {
          ...user,
          partnerPlan: plan,
          partnerStatus: 'approved', 
          partnerSubscriptionDate: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('wk_auth_user', JSON.stringify(updatedUser));
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
