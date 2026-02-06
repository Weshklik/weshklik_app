
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import { Icons } from '../components/Icons';
// formatCurrency removed
import { RatingModal } from '../components/RatingModal';
import { ReportModal } from '../components/ReportModal'; 

export const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const { getBuyerTransactions, rateTransaction, submitReport, partners } = usePartner();
  
  const [ratingTxId, setRatingTxId] = useState<string | null>(null);
  const [reportTxId, setReportTxId] = useState<string | null>(null);

  if (!user) return null;

  const myTransactions = getBuyerTransactions(user.id);

  const getPartnerName = (partnerId: string) => {
      const p = partners.find(p => p.id === partnerId);
      return p ? p.name : 'Partenaire inconnu';
  };

  const handleRateSubmit = (rating: number, comment: string) => {
      if (ratingTxId) {
          rateTransaction(ratingTxId, rating, comment);
          setRatingTxId(null);
          alert('Merci pour votre avis !');
      }
  };

  const handleReportSubmit = (reason: string, description: string) => {
      if (reportTxId) {
          const tx = myTransactions.find(t => t.id === reportTxId);
          if (tx) {
              submitReport(tx.partnerId, reason, description);
              alert('Signalement envoyé. Nous allons étudier le dossier.');
          }
          setReportTxId(null);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mon Compte</h1>
                <button onClick={logout} className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline">
                    Déconnexion
                </button>
            </div>
        </div>

        <main className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
            
            {/* User Profile Card */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-600 dark:text-gray-300 capitalize">
                        {user.type === 'pro' ? 'Compte Professionnel' : 'Compte Particulier'}
                    </span>
                </div>
            </div>

            {/* PARTNER TRANSACTIONS SECTION */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icons.Handshake className="w-5 h-5 text-indigo-600" />
                    Mes Achats via Partenaire
                </h3>

                {myTransactions.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-800 border-dashed">
                        <Icons.ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Aucune transaction partenaire pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {myTransactions.map(tx => (
                            <div key={tx.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative group">
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            tx.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {tx.status === 'initiated' ? 'En cours' : tx.status === 'completed' ? 'Terminé' : 'Annulé'}
                                        </span>
                                        <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{tx.listingTitle}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Partenaire : <span className="font-medium text-gray-700 dark:text-gray-200">{getPartnerName(tx.partnerId)}</span>
                                    </p>
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                                        Paiement : {tx.paymentMethod}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {/* REPORT BUTTON */}
                                    <button 
                                        onClick={() => setReportTxId(tx.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Signaler un problème"
                                    >
                                        <Icons.Flag className="w-4 h-4" />
                                    </button>

                                    {/* ACTION: NOTATION */}
                                    {tx.status === 'completed' && !tx.rating && (
                                        <button 
                                            onClick={() => setRatingTxId(tx.id)}
                                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Icons.Star className="w-4 h-4 fill-white" />
                                            Noter
                                        </button>
                                    )}

                                    {tx.rating && (
                                        <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1.5 rounded-lg">
                                            <span className="text-sm">Votre note : {tx.rating}</span>
                                            <Icons.Star className="w-4 h-4 fill-current" />
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </main>

        {/* Rating Modal */}
        <RatingModal 
            isOpen={!!ratingTxId}
            onClose={() => setRatingTxId(null)}
            onSubmit={handleRateSubmit}
            partnerName={ratingTxId ? getPartnerName(myTransactions.find(t => t.id === ratingTxId)?.partnerId || '') : ''}
        />

        {/* Report Modal */}
        <ReportModal
            isOpen={!!reportTxId}
            onClose={() => setReportTxId(null)}
            onSubmit={handleReportSubmit}
            targetName={reportTxId ? getPartnerName(myTransactions.find(t => t.id === reportTxId)?.partnerId || '') : ''}
        />

    </div>
  );
};
