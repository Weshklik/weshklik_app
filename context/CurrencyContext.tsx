
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode } from '../types';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>('DZD');

  useEffect(() => {
    // 1. Récupérer préférence locale
    const saved = localStorage.getItem('wk_currency') as CurrencyCode;
    if (saved) {
      setCurrency(saved);
      return;
    }

    // 2. Détection Auto (Timezone Heuristique)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Si hors Algérie, proposer EUR par défaut
    if (!timeZone.includes('Africa/Algiers')) {
      setCurrency('EUR');
    } else {
      setCurrency('DZD');
    }
  }, []);

  const updateCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    localStorage.setItem('wk_currency', c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
