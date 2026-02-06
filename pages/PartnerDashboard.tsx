
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext'; 
// formatCurrency removed as we don't display amount anymore

export const PartnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getPartnerTransactions, updateTransactionStatus } = usePartner();
  
  // Guard: If no user, redirect
  if (!user) {
      navigate('/login');
      return null;
  }

  // Use state from AuthContext (Current User)
  const partnerStatus = user.partnerStatus || 'pending';
  const partnerPlan = user.partnerPlan || 'partner_free';
  const partnerId = user.id;

  // Stats
  const myTransactions = getPartnerTransactions(partnerId);
  const completedCount = myTransactions.filter(t => t.status === 'completed').length;
  const pendingCount = myTransactions.filter(t => t.status === 'initiated').length;

  if (partnerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Icons.Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Candidature en cours</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Votre dossier est en cours d'analyse par notre équipe. Vous recevrez une notification dès validation.
          </p>
          <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isFreePlan = partnerPlan === 'partner_free';

  // Handler helpers with confirmation
  const handleComplete = (txId: string) => {
      if (window.confirm("Confirmez-vous avoir reçu le paiement et livré le service ?\nCette action est irréversible.")) {
          updateTransactionStatus(txId, 'completed');
      }
  };

  const handleCancel = (txId: string) => {
      if (window.confirm("Voulez-vous vraiment annuler cette transaction ?")) {
          updateTransactionStatus(txId, 'cancelled');
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Icons.Handshake className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Espace Partenaire</span>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Subscription Upsell Banner (If Free Plan) */}
        {isFreePlan && (
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full text-indigo-200">
                <Icons.Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Boostez votre visibilité</h3>
                <p className="text-indigo-200 text-sm max-w-lg">
                  Passez au plan <strong>Actif</strong> pour obtenir le badge certifié, apparaître en tête des résultats et recevoir des demandes illimitées.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/partner-plans')}
              className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-md whitespace-nowrap"
            >
              Activer le Badge
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-4">Transactions (Ce mois)</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{myTransactions.length}</span>
              <span className="text-gray-400 mb-1">demandes</span>
            </div>
            <div className="flex gap-4 text-xs mt-4">
                <span className="text-green-600 font-bold">{completedCount} terminées</span>
                <span className="text-orange-600 font-bold">{pendingCount} en cours</span>
            </div>
          </div>

          {/* Profile Quick View */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Mon Profil Public</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  !isFreePlan 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                 {isFreePlan ? 'Plan Standard' : 'Partenaire Actif'}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                 {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    {user?.name}
                    {!isFreePlan && <Icons.Star className="w-4 h-4 text-yellow-400 fill-current" />}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Vérifié</span>
                  <span>•</span>
                  <span>ID: {partnerId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TRANSACTIONS LIST --- */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Demandes de transactions</h3>
                {/* STEP 6: REMINDER FOR PARTNER */}
                <div className="flex items-center gap-2 text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-lg border border-yellow-100 dark:border-yellow-900">
                    <Icons.AlertCircle className="w-4 h-4" />
                    <span>Vous êtes responsable de l'encaissement et de la livraison (Hors plateforme).</span>
                </div>
            </div>
            
            {myTransactions.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <Icons.Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune demande pour le moment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Détails Commande</th>
                                <th className="p-4">Annonce</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4">Avis Client</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {myTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="p-4 text-gray-500 dark:text-gray-400 align-top">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{tx.listingTitle}</p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {tx.listingId}</p>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">{tx.paymentMethod}</p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <button 
                                            onClick={() => window.open(`#/listing/${tx.listingId}`, '_blank')}
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <Icons.ExternalLink className="w-3 h-3" /> Voir annonce
                                        </button>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                            tx.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {tx.status === 'initiated' ? 'En cours' : tx.status === 'completed' ? 'Terminé' : 'Annulé'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        {tx.rating ? (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <span className="font-bold">{tx.rating}</span>
                                                <Icons.Star className="w-3 h-3 fill-current" />
                                                {tx.review && (
                                                    <span className="text-xs text-gray-400 ml-1 truncate max-w-[100px]" title={tx.review}>
                                                        "{tx.review}"
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right align-top">
                                        {tx.status === 'initiated' ? (
                                            <div className="flex flex-col gap-2">
                                                <button 
                                                    onClick={() => handleComplete(tx.id)}
                                                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Icons.Check className="w-3 h-3" /> Paiement Reçu
                                                </button>
                                                <button 
                                                    onClick={() => handleCancel(tx.id)}
                                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 text-xs font-medium flex items-center justify-center gap-2"
                                                >
                                                    <Icons.X className="w-3 h-3" /> Annuler
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Clôturé</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};
