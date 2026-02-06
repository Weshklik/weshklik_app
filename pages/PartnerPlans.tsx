
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PARTNER_PLANS } from '../data';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import { PartnerPlanId } from '../types';

export const PartnerPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user, updatePartnerPlan } = useAuth(); 
  const { updatePartnerPlanInDirectory } = usePartner();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Guard: If no user, redirect
  React.useEffect(() => {
      if (!user) {
          navigate('/login?intent=pro'); // Using pro intent as fallback
      }
  }, [user, navigate]);

  const handleSelect = async (planId: string) => {
    if (!user) return;
    
    setSelectedPlanId(planId);
    setIsProcessing(true);
    
    // Simulate API call to activate plan
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const plan = planId as PartnerPlanId;
    
    // 1. Update Session User
    updatePartnerPlan(plan);
    
    // 2. Update Directory Listing (so visibility changes immediately)
    updatePartnerPlanInDirectory(user.id, plan);
    
    setIsProcessing(false);
    
    // Feedback
    alert("Plan activé avec succès ! Votre profil est à jour.");
    navigate('/partner-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
             <Icons.ArrowLeft className="w-5 h-5" /> Retour
           </button>
           <span className="font-bold text-gray-900 dark:text-white">Abonnement Partenaire</span>
           <div className="w-10"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Choisissez votre niveau d'engagement
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Démarrez gratuitement pour tester, ou passez en mode Actif pour maximiser vos gains.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
          {PARTNER_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all duration-300 ${
                plan.highlight 
                  ? 'border-indigo-600 shadow-xl scale-105 z-10' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  RECOMMANDÉ
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 font-medium">DA</span>
                  {plan.price > 0 && <span className="text-gray-500 text-sm">/ mois</span>}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${feature.check ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {feature.check ? <Icons.Check className="w-3 h-3" /> : <Icons.X className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${feature.check ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSelect(plan.id)}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isProcessing && selectedPlanId === plan.id ? 'Activation...' : plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        {/* STEP 7: MANDATORY DISCLAIMER IN PRICING */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 text-center">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Note Importante</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            L’abonnement "Partenaire Actif" correspond à un service de mise en relation prioritaire. 
            WeshKlik n'intervient pas dans les paiements des transactions que vous réalisez pour vos clients.
            Le paiement de l'abonnement est indépendant de vos volumes de transactions.
            <br className="mb-2"/>
            Annulation possible à tout moment depuis votre espace.
          </p>
        </div>
      </div>
    </div>
  );
};
