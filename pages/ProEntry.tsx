
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PRO ENTRY POINT (Smart Router)
 * ------------------------------
 * This is the single source of truth for "Espace Pro" navigation.
 * It decides where the user goes based on their state.
 * 
 * Logic:
 * 1. Guest -> Login (with Pro intent)
 * 2. Auth + No Store (Individual) -> Create Store
 * 3. Auth + Has Store (Pro) -> Pro Dashboard
 */
export const ProEntry: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Cas 1: Guest -> Login -> then Create Store
      navigate('/login', { 
        state: { 
          intent: 'pro', 
          from: '/create-store' 
        }, 
        replace: true 
      });
    } else if (user?.type === 'pro') {
      // Cas 3: Pro -> Dashboard
      navigate('/pro-dashboard', { replace: true });
    } else {
      // Cas 2: User -> Create Store
      navigate('/create-store', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // This component renders nothing, it's purely a router.
  return null;
};
