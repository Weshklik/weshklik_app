
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProPackState } from '../types';

export const useProPackState = (): ProPackState => {
  const { user } = useAuth();

  return useMemo(() => {
    // 1. Default State (Non-Pro or Error)
    const defaultState: ProPackState = {
      packCode: 'free',
      packName: 'Starter (Gratuit)',
      startedAt: null,
      expiresAt: null,
      formattedDate: '-',
      daysRemaining: null,
      status: 'free'
    };

    if (!user || user.type !== 'pro') return defaultState;

    const packCode = (user.package_slug as 'free' | 'silver' | 'gold') || 'free';
    
    // Pack Names Mapping
    const packNames: Record<string, string> = {
      'free': 'Starter',
      'silver': 'Pro Silver',
      'gold': 'Import Expert'
    };

    // 2. Handle Free Pack (Simulated logic: Free is "Active" but limited)
    if (packCode === 'free') {
       return {
         ...defaultState,
         status: 'free', // Special status for UI logic
         packName: 'Starter'
       };
    }

    // 3. Handle Paid Packs
    if (!user.package_expires_at) {
        // Fallback if data is missing but slug is paid
        return { ...defaultState, packCode, packName: packNames[packCode] };
    }

    const now = new Date();
    const expiresAtDate = new Date(user.package_expires_at);
    const startedAt = user.package_updated_at || new Date().toISOString();

    // Calculate diff
    const diffTime = expiresAtDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Determine Status
    let status: ProPackState['status'] = 'active';
    
    if (daysRemaining <= 0) {
      status = 'expired';
    } else if (daysRemaining <= 7) {
      status = 'expiring';
    }

    const formattedDate = expiresAtDate.toLocaleDateString('fr-DZ', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    return {
      packCode,
      packName: packNames[packCode],
      startedAt,
      expiresAt: user.package_expires_at,
      formattedDate,
      daysRemaining: Math.max(0, daysRemaining), // Don't show negative days
      status
    };

  }, [user]);
};
