
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { WILAYAS } from '../data';
import { useAuth } from '../context/AuthContext';

export const PartnerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, applyForPartner } = useAuth(); // Hook
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user && 'phone' in user ? (user as any).phone : '',
    socialLinks: '',
    wilayas: [] as string[],
    maxAmount: '',
    paymentMethods: [] as string[],
    idDocument: null as string | null,
    acceptCharter: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, idDocument: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleWilaya = (code: string) => {
    setFormData(prev => {
      const exists = prev.wilayas.includes(code);
      if (exists) return { ...prev, wilayas: prev.wilayas.filter(w => w !== code) };
      return { ...prev, wilayas: [...prev.wilayas, code] };
    });
  };

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => {
      const exists = prev.paymentMethods.includes(method);
      if (exists) return { ...prev, paymentMethods: prev.paymentMethods.filter(m => m !== method) };
      return { ...prev, paymentMethods: [...prev.paymentMethods, method] };
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      return formData.fullName.length > 3 && formData.phone.length >= 10;
    }
    if (currentStep === 2) {
      return formData.wilayas.length > 0 && formData.paymentMethods.length > 0 && formData.maxAmount !== '';
    }
    if (currentStep === 3) {
      return formData.idDocument !== null && formData.acceptCharter;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call AuthContext Logic
    applyForPartner(formData);
    
    setIsSubmitting(false);
    alert("Candidature envoyée avec succès ! Validation sous 24h.");
    navigate('/partner-dashboard'); // Go to dashboard to see "Pending" state
  };

  const paymentOptions = [
    { id: 'hand_delivery', label: 'Remise en main propre', icon: Icons.Handshake },
    { id: 'cod', label: 'Cash à la livraison', icon: Icons.Truck },
    { id: 'mandat', label: 'Mandat Cash / CCP', icon: Icons.CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
            <Icons.ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Devenir Partenaire</span>
          <div className="w-10"></div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        
        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.User className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Qui êtes-vous ?</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Vos informations de contact pour les acheteurs.</p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom & Prénom <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro WhatsApp / Téléphone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="0550 12 34 56"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Liens Réseaux Sociaux (FB, Insta)</label>
                  <input
                    type="text"
                    name="socialLinks"
                    value={formData.socialLinks}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="facebook.com/votreprofil"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optionnel, mais recommandé pour la confiance.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.MapPin className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Votre Offre</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Où et comment pouvez-vous aider ?</p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
                
                {/* Wilayas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wilaya(s) desservie(s) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      onChange={(e) => {
                        if(e.target.value) toggleWilaya(e.target.value);
                        e.target.value = '';
                      }}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white mb-3"
                    >
                      <option value="">Ajouter une wilaya...</option>
                      {WILAYAS.map(w => (
                        <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                      {formData.wilayas.map(code => {
                        const name = WILAYAS.find(w => w.code === code)?.name;
                        return (
                          <span key={code} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                            {code} - {name}
                            <button type="button" onClick={() => toggleWilaya(code)} className="hover:text-indigo-900"><Icons.X className="w-3 h-3" /></button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Moyens de paiement acceptés <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {paymentOptions.map(opt => {
                      const isSelected = formData.paymentMethods.includes(opt.id);
                      return (
                        <div 
                          key={opt.id}
                          onClick={() => togglePaymentMethod(opt.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                          <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            <opt.icon className="w-4 h-4" />
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>{opt.label}</span>
                          {isSelected && <Icons.Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Max Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant maximum par transaction (DA) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="Ex: 50000"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vérification</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Dernière étape pour valider votre profil de confiance.</p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
                
                {/* ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pièce d'identité (CNI ou Permis) <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${formData.idDocument ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                    {formData.idDocument ? (
                      <div className="relative w-full h-40">
                        <img src={formData.idDocument} alt="ID Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold">
                          <Icons.Check className="w-6 h-6 mr-2" /> Document chargé
                        </div>
                      </div>
                    ) : (
                      <>
                        <Icons.Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Cliquez pour ajouter une photo</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Icons.Lock className="w-3 h-3" />
                    Ce document reste confidentiel et sert uniquement à la vérification.
                  </p>
                </div>

                {/* Charter */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Charte du Partenaire WeshKlik</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2 list-disc pl-4 mb-4">
                    <li>Je m'engage à honorer les transactions acceptées.</li>
                    <li>Je ne demanderai jamais d'acompte avant la rencontre (sauf accord spécifique sécurisé).</li>
                    <li>Je respecterai les règles de courtoisie et de sécurité.</li>
                  </ul>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.acceptCharter}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptCharter: e.target.checked }))}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">J'accepte la charte partenaire</span>
                  </label>
                </div>

              </div>
            </div>
          )}

        </form>
      </main>

      {/* Footer Navigation */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 z-50">
         <div className="container mx-auto max-w-2xl flex gap-4">
            
            <button 
                onClick={() => {
                  if (step > 1) setStep(step - 1);
                  else navigate('/');
                }}
                className="flex-1 py-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                {step === 1 ? 'Annuler' : 'Précédent'}
            </button>

            {step === 3 ? (
               <button 
                  onClick={handleSubmit}
                  disabled={!validateStep(3) || isSubmitting}
                  className={`flex-[2] py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                     !validateStep(3) || isSubmitting
                     ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                     : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                  }`}
               >
                  {isSubmitting ? 'Envoi...' : 'Envoyer ma candidature'}
               </button>
            ) : (
               <button 
                  onClick={() => validateStep(step) && setStep(step + 1)} 
                  disabled={!validateStep(step)}
                  className={`flex-[2] py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                     !validateStep(step)
                     ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                     : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                  }`}
               >
                  Suivant
               </button>
            )}
         </div>
      </div>

    </div>
  );
};
