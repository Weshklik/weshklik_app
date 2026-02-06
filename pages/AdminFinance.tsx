
import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_PAYOUTS } from '../data';
import { Icons } from '../components/Icons';
import { formatCurrency } from '../utils/currency';
import { useNavigate } from 'react-router-dom';

export const AdminFinance: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'global' | 'transactions' | 'payouts' | 'anomalies'>('global');

  // --- CALCS ---
  const totalVolumeDZD = MOCK_TRANSACTIONS.reduce((sum, t) => t.status === 'CAPTURED' ? sum + t.amountTotalDZD : sum, 0);
  const totalCommissionDZD = MOCK_TRANSACTIONS.reduce((sum, t) => t.status === 'CAPTURED' ? sum + t.amountCommissionDZD : sum, 0);
  const totalNetSellerDZD = MOCK_TRANSACTIONS.reduce((sum, t) => t.status === 'CAPTURED' ? sum + t.amountNetSellerDZD : sum, 0);
  const pendingPayouts = MOCK_PAYOUTS.filter(p => p.status === 'processing' || p.status === 'pending')
                                     .reduce((sum, p) => sum + p.amountDZD, 0);

  // Anomaly Detection
  const anomalies = MOCK_TRANSACTIONS.filter(t => {
      // Rule 1: Captured but sums don't match
      const total = t.amountNetSellerDZD + t.amountCommissionDZD;
      const isMathError = Math.abs(total - t.amountTotalDZD) > 1;
      
      // Rule 2: Explicit anomaly flag
      const isFlagged = !!t.metadata?.anomaly;

      // Rule 3: Negative Commission
      const isNegativeComm = t.amountCommissionDZD < 0;

      return isMathError || isFlagged || isNegativeComm;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
         <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg text-slate-900">
                    <Icons.BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight">WeshKlik Finance</h1>
                    <p className="text-xs text-slate-400">Admin Dashboard</p>
                </div>
            </div>
            <div className="flex gap-4 text-sm font-medium">
               <button onClick={() => setView('global')} className={`${view === 'global' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Vue Globale</button>
               <button onClick={() => setView('transactions')} className={`${view === 'transactions' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Transactions</button>
               <button onClick={() => setView('payouts')} className={`${view === 'payouts' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Virements</button>
               <button onClick={() => setView('anomalies')} className={`flex items-center gap-1 ${view === 'anomalies' ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}>
                  <Icons.AlertCircle className="w-4 h-4" /> Anomalies ({anomalies.length})
               </button>
            </div>
            <button onClick={() => navigate('/')} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs">Retour Site</button>
         </div>
      </header>

      <main className="container mx-auto px-4 py-8">
         
         {/* VIEW: GLOBAL */}
         {view === 'global' && (
            <div className="space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-500 uppercase">Volume d'Affaires</p>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{formatCurrency(totalVolumeDZD, 'DZD')}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Commissions (Revenu)</p>
                        <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{formatCurrency(totalCommissionDZD, 'DZD')}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-500 uppercase">Net Vendeurs</p>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{formatCurrency(totalNetSellerDZD, 'DZD')}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900">
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Virements en attente</p>
                        <p className="text-2xl font-extrabold text-orange-700 dark:text-orange-300 mt-1">{formatCurrency(pendingPayouts, 'DZD')}</p>
                    </div>
                </div>

                {/* Simulation E2E Tool */}
                <div className="bg-slate-900 text-white p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2"><Icons.TestTube className="w-5 h-5 text-yellow-400" /> Simulation de Paiement E2E</h3>
                        <p className="text-slate-400 text-sm mt-1">Crée une transaction mockée pour valider le flux financier sans carte bancaire.</p>
                    </div>
                    <button onClick={() => alert("Simulation lancée dans la console. (Mock Function)")} className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200">Lancer Test</button>
                </div>
            </div>
         )}

         {/* VIEW: TRANSACTIONS */}
         {view === 'transactions' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden animate-in fade-in">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="p-4">ID / Date</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4">Client / Vendeur</th>
                            <th className="p-4 text-right">Montant Payé</th>
                            <th className="p-4 text-right">Commission</th>
                            <th className="p-4 text-right">Net Vendeur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {MOCK_TRANSACTIONS.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4">
                                    <span className="block font-mono font-bold text-gray-900 dark:text-white">{tx.id}</span>
                                    <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tx.status === 'CAPTURED' ? 'bg-green-100 text-green-700' : tx.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="block text-gray-900 dark:text-white">{tx.buyerId}</span>
                                    <span className="text-xs text-gray-500">→ {tx.sellerId}</span>
                                </td>
                                <td className="p-4 text-right">
                                    <span className="block font-bold text-gray-900 dark:text-white">{formatCurrency(tx.paymentAmount, tx.paymentCurrency)}</span>
                                    {tx.paymentCurrency !== 'DZD' && <span className="text-xs text-gray-500">~ {formatCurrency(tx.amountTotalDZD, 'DZD')}</span>}
                                </td>
                                <td className="p-4 text-right font-mono text-green-600">{formatCurrency(tx.amountCommissionDZD, 'DZD')}</td>
                                <td className="p-4 text-right font-mono">{formatCurrency(tx.amountNetSellerDZD, 'DZD')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         )}

         {/* VIEW: ANOMALIES */}
         {view === 'anomalies' && (
             <div className="space-y-6 animate-in fade-in">
                 {anomalies.length === 0 ? (
                     <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-xl">
                         <Icons.CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucune anomalie détectée</h3>
                         <p className="text-gray-500">Toutes les transactions sont équilibrées.</p>
                     </div>
                 ) : (
                     <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-red-100 dark:border-red-900">
                         <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-100 dark:border-red-900 flex items-center gap-2 text-red-800 dark:text-red-200">
                             <Icons.AlertCircle className="w-5 h-5" />
                             <span className="font-bold">Attention : {anomalies.length} transactions nécessitent une vérification manuelle.</span>
                         </div>
                         <table className="w-full text-sm text-left">
                             <thead className="bg-gray-50 dark:bg-gray-800">
                                 <tr>
                                     <th className="p-4">Transaction</th>
                                     <th className="p-4">Problème détecté</th>
                                     <th className="p-4 text-right">Montants (Total / Net / Comm)</th>
                                     <th className="p-4">Action</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                 {anomalies.map(tx => (
                                     <tr key={tx.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10">
                                         <td className="p-4 font-mono font-bold">{tx.id}</td>
                                         <td className="p-4 text-red-600 font-bold">
                                             {tx.metadata?.anomaly || "Incohérence mathématique"}
                                         </td>
                                         <td className="p-4 text-right font-mono">
                                             {tx.amountTotalDZD} / {tx.amountNetSellerDZD} / {tx.amountCommissionDZD}
                                         </td>
                                         <td className="p-4">
                                             <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200">Geler</button>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
             </div>
         )}

         {/* VIEW: PAYOUTS */}
         {view === 'payouts' && (
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden animate-in fade-in">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                         <tr>
                             <th className="p-4">ID Payout</th>
                             <th className="p-4">Vendeur</th>
                             <th className="p-4">Période</th>
                             <th className="p-4">Statut</th>
                             <th className="p-4 text-right">Montant DZD</th>
                             <th className="p-4">Action</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                         {MOCK_PAYOUTS.map(po => (
                             <tr key={po.id}>
                                 <td className="p-4 font-mono">{po.id}</td>
                                 <td className="p-4 font-bold">{po.sellerId}</td>
                                 <td className="p-4 text-gray-500">{po.periodStart} au {po.periodEnd}</td>
                                 <td className="p-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${po.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {po.status}
                                     </span>
                                 </td>
                                 <td className="p-4 text-right font-bold">{formatCurrency(po.amountDZD, 'DZD')}</td>
                                 <td className="p-4">
                                     {po.status !== 'paid' && (
                                         <button className="text-blue-600 hover:underline font-medium">Valider virement</button>
                                     )}
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}

      </main>
    </div>
  );
};
