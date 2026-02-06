
import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { usePartner } from '../context/PartnerContext';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { ReportModal } from './ReportModal';
import { WILAYAS } from '../data';

interface PartnerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  listingId: string;
  listingTitle: string;
}

export const PartnerSelectorModal: React.FC<PartnerSelectorModalProps> = ({ 
  isOpen, 
  onClose, 
  amount,
  listingId,
  listingTitle
}) => {
  const { partners, createTransaction, submitReport } = usePartner();
  const { user } = useAuth();
  const [filterWilaya, setFilterWilaya] = useState('');
  
  // Reporting State
  const [reportTarget, setReportTarget] = useState<{ id: string, name: string } | null>(null);

  // STEP 8: Global Cap & Probation Cap
  const GLOBAL_CAP = 1000000; // 1M DA
  const PROBATION_CAP = 50000; // 50k DA for new partners

  // Filtering & Sorting Logic
  const availablePartners = useMemo(() => {
    return partners
      .filter(p => {
        // 1. Status Filter
        if (p.partnerStatus !== 'approved') return false;
        
        // 2. Budget Filter (Their Setting)
        // We use the amount for FILTERING ONLY, we do not store it in the transaction.
        if (p.maxBudget < amount) return false;

        // 3. STEP 8: Safety Caps
        if (p.isProbation && amount > PROBATION_CAP) return false;
        if (amount > GLOBAL_CAP) return false;

        // 4. Wilaya Filter (Optional)
        if (filterWilaya && !p.wilayasCovered.includes(filterWilaya)) return false;

        return true;
      })
      .sort((a, b) => {
        // 5. Priority Rule: Active Plan First
        if (a.partnerPlan === 'partner_active' && b.partnerPlan !== 'partner_active') return -1;
        if (a.partnerPlan !== 'partner_active' && b.partnerPlan === 'partner_active') return 1;
        
        // 6. Secondary Sort: Rating
        return b.rating - a.rating;
      });
  }, [partners, amount, filterWilaya]);

  const handleContact = (partner: any) => {
    if (!user) {
        alert("Veuillez vous connecter pour contacter un partenaire.");
        return;
    }

    // 1. Create Declarative Transaction (NO AMOUNT PASSED)
    createTransaction(
        user.id,
        partner.id,
        listingId,
        listingTitle,
        // amount, // REMOVED per Step 8 Constraints
        partner.paymentMethods[0] // Defaulting to first method for now
    );

    // 2. Open WhatsApp
    const message = encodeURIComponent(`Bonjour ${partner.name}, je souhaite passer par vous pour un achat sur WeshKlik.\n\nProduit: ${listingTitle}\nMontant: ${formatCurrency(amount, 'DZD')}`);
    window.open(`https://wa.me/${partner.phone}?text=${message}`, '_blank');
    
    // 3. Close & Feedback
    onClose();
    alert("Transaction initiée ! Vous pouvez suivre l'état dans votre espace.");
  };

  const handleReport = (reason: string, description: string) => {
      if (reportTarget) {
          submitReport(reportTarget.id, reason, description);
          setReportTarget(null);
          alert("Signalement reçu. Merci de contribuer à la sécurité de la plateforme.");
      }
  };

  // Helper to display Wilaya Names
  const getWilayaNames = (codes: string[]) => {
      const names = codes.map(c => WILAYAS.find(w => w.code === c)?.name).filter(Boolean);
      if (names.length > 3) return names.slice(0, 3).join(', ') + ` +${names.length - 3} autres`;
      return names.join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300 border border-gray-100 dark:border-gray-800">
        
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Icons.Handshake className="w-6 h-6 text-indigo-600" />
             Choisir un Partenaire
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
           <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Montant à payer : <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(amount, 'DZD')}</span></div>
           <div className="relative">
              <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Filtrer par code Wilaya (ex: 16, 31)..." 
                value={filterWilaya}
                onChange={(e) => setFilterWilaya(e.target.value)}
                className="w-full pl-9 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
           </div>
        </div>

        {/* STEP 9: MANDATORY LEGAL DISCLAIMER */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 border-y border-yellow-100 dark:border-yellow-900 text-xs text-yellow-800 dark:text-yellow-200 flex gap-3">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-bold mb-1">Modes de paiement autorisés :</p>
                <div className="flex gap-2 mb-2">
                    <span className="bg-white/50 px-1.5 rounded">Cash à la livraison</span>
                    <span className="bg-white/50 px-1.5 rounded">Mandat Cash</span>
                    <span className="bg-white/50 px-1.5 rounded">Main propre</span>
                </div>
                <p className="border-t border-yellow-200 dark:border-yellow-800 pt-1 mt-1 font-medium">
                    WeshKlik n’intervient pas dans le paiement du produit. 
                    Le règlement est effectué directement entre l’acheteur et le partenaire d’achat.
                </p>
            </div>
        </div>

        {/* STEP 8: Warning if Amount too high */}
        {amount > GLOBAL_CAP && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Icons.Shield className="w-12 h-12 mx-auto mb-3 text-red-500" />
                <p className="font-bold text-gray-900 dark:text-white">Montant trop élevé</p>
                <p>Pour des raisons de sécurité, les transactions partenaires sont limitées à {formatCurrency(GLOBAL_CAP, 'DZD')}.</p>
            </div>
        )}

        {amount <= GLOBAL_CAP && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {availablePartners.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <Icons.User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun partenaire trouvé pour ce montant dans cette zone.</p>
                    {amount > PROBATION_CAP && (
                        <p className="text-xs mt-2 text-gray-400">Certains nouveaux partenaires sont masqués pour ce montant élevé.</p>
                    )}
                </div>
            ) : (
                availablePartners.map(partner => (
                    <div 
                        key={partner.id}
                        className={`p-4 rounded-xl border flex gap-4 transition-all relative group ${
                            partner.partnerPlan === 'partner_active' 
                            ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10' 
                            : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'
                        }`}
                    >
                        {/* Report Button (Visible on Hover) */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setReportTarget({ id: partner.id, name: partner.name }); }}
                            className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Signaler"
                        >
                            <Icons.Flag className="w-4 h-4" />
                        </button>

                        <div className="relative">
                            <img src={partner.avatar} className="w-12 h-12 rounded-full object-cover bg-gray-200" alt={partner.name} />
                            {partner.partnerPlan === 'partner_active' && (
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-900">
                                    <Icons.Star className="w-3 h-3 fill-current" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                        {partner.name}
                                        {partner.verified && <Icons.CheckCircle2 className="w-3 h-3 text-green-500" />}
                                        {partner.isProbation && (
                                            <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 rounded ml-1">Nouveau</span>
                                        )}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
                                            {partner.rating} <Icons.Star className="w-3 h-3 fill-current" />
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Icons.MapPin className="w-3 h-3" />
                                            {getWilayaNames(partner.wilayasCovered)}
                                        </span>
                                    </div>
                                </div>
                                {partner.partnerPlan === 'partner_active' && (
                                    <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded mr-6">Top</span>
                                )}
                            </div>

                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <Icons.Wallet className="w-3 h-3 text-gray-400" />
                                    {partner.paymentMethods.join(', ')}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <Icons.CreditCard className="w-3 h-3 text-gray-400" />
                                    Plafond : {formatCurrency(partner.maxBudget, 'DZD')}
                                </p>
                            </div>

                            <button 
                                onClick={() => handleContact(partner)}
                                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <Icons.MessageCircle className="w-4 h-4" /> Contacter (WhatsApp)
                            </button>
                        </div>
                    </div>
                ))
            )}
            </div>
        )}

        <div className="p-3 bg-gray-50 dark:bg-gray-900 text-center text-[10px] text-gray-400 rounded-b-2xl">
            WeshKlik n'est pas responsable des transactions hors plateforme.
        </div>
      </div>

      {/* REPORT MODAL */}
      <ReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)} 
        onSubmit={handleReport}
        targetName={reportTarget?.name || 'Partenaire'}
      />
    </div>
  );
};
