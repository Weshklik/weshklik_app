
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { formatCurrency } from '../utils/currency';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    storeName: string;
    total: number;
    itemsCount: number;
    deliveryInfo: { fullName: string; phone: string; address: string };
  } | undefined;

  // Fallback if accessed directly without state
  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-gray-500 mb-4">Aucune commande récente trouvée.</p>
        <Link to="/" className="text-brand-600 font-bold hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const orderRef = `CMD-${Math.floor(Math.random() * 1000000)}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          {/* Confetti Decoration (CSS only) */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-brand-500 to-indigo-500"></div>
          
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-in zoom-in duration-300">
            <Icons.Check className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Commande Confirmée !</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Merci {state.deliveryInfo.fullName.split(' ')[0]}, votre commande a bien été transmise à <strong className="text-brand-600 dark:text-brand-400">{state.storeName}</strong>.
          </p>

          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Référence</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{orderRef}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total à payer</span>
                <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{formatCurrency(state.total, 'DZD')}</span>
             </div>
             <p className="text-xs text-center text-gray-400 mt-4">
                (Hors frais de livraison éventuels)
             </p>
          </div>
        </div>

        {/* Reassurance Steps */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-800">
           <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Icons.Clock className="w-5 h-5 text-indigo-600" />
              Et maintenant ?
           </h3>
           
           <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
              
              <div className="relative pl-12">
                 <div className="absolute left-0 top-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md z-10">1</div>
                 <h4 className="font-bold text-gray-900 dark:text-white text-sm">Confirmation par téléphone</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    La boutique va vous appeler sur le <strong>{state.deliveryInfo.phone}</strong> pour valider l'adresse et le délai.
                 </p>
              </div>

              <div className="relative pl-12">
                 <div className="absolute left-0 top-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm z-10">2</div>
                 <h4 className="font-bold text-gray-900 dark:text-white text-sm">Expédition</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Votre colis est préparé et remis au livreur (Yalidine, ZR Express ou livreur interne).
                 </p>
              </div>

              <div className="relative pl-12">
                 <div className="absolute left-0 top-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm z-10">3</div>
                 <h4 className="font-bold text-gray-900 dark:text-white text-sm">Réception & Paiement</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Vous vérifiez votre colis et payez le montant exact au livreur.
                 </p>
                 <div className="mt-3 inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-100 dark:border-yellow-900">
                    <Icons.AlertCircle className="w-4 h-4" />
                    Ne payez rien avant la livraison !
                 </div>
              </div>

           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
           <button 
             onClick={() => navigate('/')}
             className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
           >
             Retour à la boutique
           </button>
           <button 
             onClick={() => navigate('/account')}
             className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
           >
             Suivre ma commande
           </button>
        </div>

      </div>
    </div>
  );
};
