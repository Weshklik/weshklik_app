
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PartnerTransaction, PartnerProfile, PartnerPlanId } from '../types';
import { MOCK_PARTNERS } from '../data';

interface PartnerContextType {
  partners: PartnerProfile[];
  transactions: PartnerTransaction[];
  createTransaction: (
    buyerId: string, 
    partnerId: string, 
    listingId: string,
    listingTitle: string,
    // listingAmount Removed for Step 8 Compliance
    paymentMethod: string
  ) => void;
  updateTransactionStatus: (txId: string, status: 'completed' | 'cancelled') => void;
  rateTransaction: (txId: string, rating: number, review?: string) => void;
  submitReport: (targetId: string, reason: string, description: string) => void;
  getPartnerTransactions: (partnerId: string) => PartnerTransaction[];
  getBuyerTransactions: (buyerId: string) => PartnerTransaction[];
  
  // Admin/Self Update
  updatePartnerPlanInDirectory: (partnerId: string, plan: PartnerPlanId) => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

// Initial Mock Data for transactions
const MOCK_PARTNER_TRANSACTIONS: PartnerTransaction[] = [
  {
    id: 'ptx_1',
    buyerId: 'u_buyer_1',
    partnerId: 'p_1',
    listingId: '2',
    listingTitle: 'Appartement F4 Haut Standing',
    // listingAmount: 24000000, // REMOVED
    paymentMethod: 'Espèces (Main propre)',
    status: 'initiated',
    date: '2024-02-20T10:00:00Z'
  },
  // Example of a completed unrated transaction for user 'u_indiv_123' (Mock Individual User)
  {
    id: 'ptx_mock_completed',
    buyerId: 'u_indiv_123',
    partnerId: 'p_1',
    listingId: '4',
    listingTitle: 'Renault Clio 4 GT Line',
    // listingAmount: 2100000, // REMOVED
    paymentMethod: 'Espèces (Main propre)',
    status: 'completed',
    date: '2024-02-18T14:30:00Z'
  }
];

export const PartnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<PartnerProfile[]>(MOCK_PARTNERS);
  const [transactions, setTransactions] = useState<PartnerTransaction[]>(MOCK_PARTNER_TRANSACTIONS);

  const createTransaction = (
    buyerId: string, 
    partnerId: string, 
    listingId: string,
    listingTitle: string,
    // amount: number, // Removed
    paymentMethod: string
  ) => {
    const newTx: PartnerTransaction = {
      id: `ptx_${Date.now()}`,
      buyerId,
      partnerId,
      listingId,
      listingTitle,
      // listingAmount: amount, // Removed
      paymentMethod,
      status: 'initiated',
      date: new Date().toISOString()
    };
    
    setTransactions(prev => [newTx, ...prev]);
    console.log('[Partner] Transaction Declarative Created (No Amount Tracked):', newTx);
  };

  const updateTransactionStatus = (txId: string, status: 'completed' | 'cancelled') => {
    setTransactions(prev => prev.map(tx => {
      // Guard: Only allow transition from initiated
      if (tx.id === txId && tx.status === 'initiated') {
          return { ...tx, status };
      }
      return tx;
    }));
  };

  // STEP 6: Notation & Réputation Logic
  const rateTransaction = (txId: string, rating: number, review?: string) => {
    let targetPartnerId: string | null = null;

    // 1. Update Transaction
    setTransactions(prev => prev.map(tx => {
        if (tx.id === txId) {
            targetPartnerId = tx.partnerId;
            console.log(`[Partner] Rating submitted for ${txId}: ${rating}/5`);
            return { ...tx, rating, review };
        }
        return tx;
    }));

    // 2. Update Partner Reputation (Weighted Average)
    if (targetPartnerId) {
        setPartners(prev => prev.map(p => {
            if (p.id === targetPartnerId) {
                const newCount = p.reviewCount + 1;
                // Formula: (OldAvg * OldCount + NewRating) / NewCount
                const newRating = ((p.rating * p.reviewCount) + rating) / newCount;
                
                return {
                    ...p,
                    reviewCount: newCount,
                    rating: parseFloat(newRating.toFixed(1)) // Round to 1 decimal
                };
            }
            return p;
        }));
    }
  };

  // STEP 8: Report
  const submitReport = (targetId: string, reason: string, description: string) => {
      // In a real app, this would send to an admin endpoint
      console.log(`[Safety] Report submitted against ${targetId}:`, { reason, description });
  };

  const getPartnerTransactions = (partnerId: string) => {
    return transactions.filter(tx => tx.partnerId === partnerId);
  };

  const getBuyerTransactions = (buyerId: string) => {
    return transactions.filter(tx => tx.buyerId === buyerId);
  };

  // Helper to sync directory state when a user updates their own plan
  const updatePartnerPlanInDirectory = (partnerId: string, plan: PartnerPlanId) => {
      setPartners(prev => prev.map(p => 
          p.id === partnerId 
            ? { ...p, partnerPlan: plan, subscriptionStatus: 'active', partnerStatus: 'approved' } 
            : p
      ));
  };

  return (
    <PartnerContext.Provider value={{ 
      partners, 
      transactions, 
      createTransaction, 
      updateTransactionStatus,
      rateTransaction,
      submitReport,
      getPartnerTransactions,
      getBuyerTransactions,
      updatePartnerPlanInDirectory
    }}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (!context) throw new Error('usePartner must be used within PartnerProvider');
  return context;
};
