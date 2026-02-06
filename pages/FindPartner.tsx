
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PARTNERS, WILAYAS } from '../data';
import { Icons } from '../components/Icons';

export const FindPartner: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredPartners = MOCK_PARTNERS.filter(p => {
    if (selectedWilaya && !p.wilayasCovered.includes(selectedWilaya)) return false;
    // Simple filter for payment methods
    if (paymentFilter === 'cash' && !p.paymentMethods.some(m => m.includes('Main propre'))) return false;
    if (paymentFilter === 'ccp' && !p.paymentMethods.some(m => m.includes('CCP'))) return false;
    return true;
  }).sort((a, b) => {
      // Priority Rule: Active Plan First
      if (a.partnerPlan === 'partner_active' && b.partnerPlan !== 'partner_active') return -1;
      if (a.partnerPlan !== 'partner_active' && b.partnerPlan === 'partner_active') return 1;
      return 0;
  });

  const handleContact = (phone: string, partnerName: string) => {
      // Direct WA or Phone intent
      const message = encodeURIComponent(`Bonjour ${partnerName}, je vous contacte via WeshKlik pour un service d'achat.`);
      window.open(`https://wa.me/213550000000?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero Header */}
      <div className="bg-indigo-900 text-white p-8 md:p-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
         <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Paiement Cash & Facilité</h1>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Pas de carte bancaire ? Trouvez un <span className="font-bold text-white">Partenaire d'Achat certifié</span> dans votre wilaya pour payer en espèces (CCP ou Main à main).
            </p>
            
            {/* Search Box */}
            <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                    <Icons.MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <select 
                        value={selectedWilaya}
                        onChange={(e) => setSelectedWilaya(e.target.value)}
                        className="w-full pl-10 p-3 bg-transparent text-gray-900 dark:text-white outline-none appearance-none"
                    >
                        <option value="" className="dark:bg-gray-900">Toutes les wilayas</option>
                        {WILAYAS.map(w => (
                            <option key={w.code} value={w.code} className="dark:bg-gray-900">{w.code} - {w.name}</option>
                        ))}
                    </select>
                </div>
                <div className="h-px md:h-auto md:w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <div className="flex-1 relative">
                    <Icons.Wallet className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <select 
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="w-full pl-10 p-3 bg-transparent text-gray-900 dark:text-white outline-none appearance-none"
                    >
                        <option value="all" className="dark:bg-gray-900">Tous les paiements</option>
                        <option value="cash" className="dark:bg-gray-900">Espèces (Main propre)</option>
                        <option value="ccp" className="dark:bg-gray-900">CCP / BaridiMob</option>
                    </select>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Chercher
                </button>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8">
         
         {/* Disclaimer Banner */}
         <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-4 rounded-xl flex gap-3 text-sm text-orange-800 dark:text-orange-200 mb-8 max-w-4xl mx-auto">
            <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
                <strong>Avertissement important :</strong> WeshKlik agit uniquement comme un annuaire de mise en relation. 
                Nous n'intervenons pas dans la transaction financière entre vous et le partenaire. 
                Vérifiez toujours l'identité du partenaire et privilégiez les remises en main propre pour la première transaction.
            </p>
         </div>

         {/* Results */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map(partner => (
                <div 
                    key={partner.id} 
                    className={`bg-white dark:bg-gray-900 rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${
                        partner.partnerPlan === 'partner_active' 
                        ? 'border-indigo-200 dark:border-indigo-800' 
                        : 'border-gray-100 dark:border-gray-800'
                    }`}
                >
                    {/* Active Badge */}
                    {partner.partnerPlan === 'partner_active' && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                            TOP PARTENAIRE
                        </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={partner.avatar} alt={partner.name} className="w-12 h-12 rounded-full bg-gray-100 object-cover" />
                                {partner.partnerPlan === 'partner_active' && (
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-900">
                                        <Icons.Star className="w-3 h-3 fill-current" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    {partner.name}
                                    <Icons.CheckCircle2 className="w-4 h-4 text-green-500" />
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                    <Icons.Star className="w-3 h-3 fill-current" />
                                    {partner.rating} <span className="text-gray-400 font-normal">({partner.reviewCount} avis)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[40px]">
                        {partner.bio}
                    </p>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Icons.MapPin className="w-3.5 h-3.5" />
                            <span>Couverture : {partner.wilayasCovered.length} Wilayas</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Icons.Wallet className="w-3.5 h-3.5" />
                            <span>Commission : <span className="font-bold text-gray-700 dark:text-gray-200">{partner.commissionRate}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Icons.Clock className="w-3.5 h-3.5" />
                            <span>Réponse : {partner.responseTime}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleContact(partner.phone, partner.name)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-green-500/20 shadow-lg"
                        >
                            <Icons.MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                        <button className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Icons.Phone className="w-4 h-4" /> Appeler
                        </button>
                    </div>
                </div>
            ))}
         </div>

         {filteredPartners.length === 0 && (
             <div className="text-center py-20">
                 <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                     <Icons.Search className="w-8 h-8" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucun partenaire trouvé</h3>
                 <p className="text-gray-500 dark:text-gray-400">Essayez de changer de Wilaya ou de filtre.</p>
             </div>
         )}

         {/* Footer CTA */}
         <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vous proposez ce service ?</h2>
             <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
                 Devenez Partenaire d'Achat WeshKlik et gagnez des commissions en aidant les autres à acheter.
                 Zéro commission pour WeshKlik, juste un abonnement fixe.
             </p>
             <button 
                onClick={() => navigate('/partner-entry')}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
             >
                 Devenir Partenaire
             </button>
         </div>

      </div>
    </div>
  );
};
