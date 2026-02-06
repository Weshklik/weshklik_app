
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, PaymentStatus, BookingBreakdown, CurrencyCode } from '../types';
import { MOCK_TRANSACTIONS } from '../data';

// --- CONTRACT ---
interface PaymentContextType {
  initiateTransaction: (
    bookingId: string, 
    financials: BookingBreakdown, 
    buyerId: string, 
    sellerId: string
  ) => Promise<Transaction>;
  
  confirmTransaction: (
    transactionId: string, 
    pspReference: string
  ) => Promise<Transaction>;
  
  getTransaction: (id: string) => Transaction | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// --- SIMULATED BACKEND LOGIC ---
export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // In-memory store for session (pre-filled with MOCK_DATA for demo)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  /**
   * Generates a deterministic Idempotency Key
   * Prevents double charge for the same booking + price context
   */
  const generateIdempotencyKey = (bookingId: string, amount: number, currency: string) => {
    return `idemp_${bookingId}_${amount}_${currency}`;
  };

  /**
   * 1. INITIATE PAYMENT
   * Server-side simulation: Validates integrity, creates record with 'INITIATED' status.
   */
  const initiateTransaction = async (
    bookingId: string,
    financials: BookingBreakdown,
    buyerId: string,
    sellerId: string
  ): Promise<Transaction> => {
    
    // Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. Idempotency Check
    const key = generateIdempotencyKey(bookingId, financials.totalInCurrency, financials.currency);
    const existing = transactions.find(t => t.idempotencyKey === key);
    
    if (existing) {
      console.log(`[Payment] Idempotency Hit for key: ${key}. Returning existing transaction.`);
      return existing;
    }

    // 2. Integrity Check (Anti-Fraud)
    // Ensure Total DZD roughly equals Net + Commission (Allow small floating point diff)
    const calculatedTotal = financials.sellerNetDZD + financials.weshKlikCommissionDZD;
    if (Math.abs(calculatedTotal - financials.totalDZD) > 1) {
       console.error(`[Payment] INTEGRITY ERROR. Split ${calculatedTotal} != Total ${financials.totalDZD}`);
       throw new Error("Erreur de calcul financier critique. Transaction bloquée.");
    }

    // 3. Create Transaction Record
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      bookingId,
      idempotencyKey: key,
      amountTotalDZD: financials.totalDZD,
      amountCommissionDZD: financials.weshKlikCommissionDZD,
      amountNetSellerDZD: financials.sellerNetDZD,
      paymentCurrency: financials.currency,
      paymentAmount: financials.totalInCurrency,
      appliedRate: financials.exchangeRate,
      sellerId,
      buyerId,
      status: 'INITIATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);
    console.log(`[Payment] Transaction Initiated: ${newTx.id}`);
    return newTx;
  };

  /**
   * 2. CONFIRM PAYMENT
   * Called after PSP (Stripe/Satim) success. Updates status to CAPTURED.
   * STRICT STATE MACHINE: INITIATED -> CAPTURED only.
   */
  const confirmTransaction = async (transactionId: string, pspReference: string): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const txIndex = transactions.findIndex(t => t.id === transactionId);
    if (txIndex === -1) throw new Error("Transaction not found");

    const tx = transactions[txIndex];

    // State Guard
    if (tx.status === 'CAPTURED') return tx; // Already done
    if (tx.status !== 'INITIATED') {
        throw new Error(`Invalid state transition from ${tx.status} to CAPTURED`);
    }

    const updatedTx: Transaction = {
        ...tx,
        status: 'CAPTURED',
        updatedAt: new Date().toISOString(),
        metadata: { ...tx.metadata, pspReference }
    };

    // Update Store
    const newTransactions = [...transactions];
    newTransactions[txIndex] = updatedTx;
    setTransactions(newTransactions);

    console.log(`[Payment] Transaction Captured: ${updatedTx.id}`);
    return updatedTx;
  };

  const getTransaction = (id: string) => transactions.find(t => t.id === id);

  return (
    <PaymentContext.Provider value={{ initiateTransaction, confirmTransaction, getTransaction }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within PaymentProvider');
  return context;
};
