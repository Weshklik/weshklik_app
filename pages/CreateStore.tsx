
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { WILAYAS, PRO_SECTORS } from '../data';
import { useAuth } from '../context/AuthContext';

export const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const { upgradeToPro } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    storeName: '',
    sectors: [] as string[], // Changed to Array
    categories: [] as string[],
    slogan: '',
    rcNumber: '',
    nifNumber: '',
    phone: '',
    wilaya: '',
    address: '',
    acceptTerms: false,
    logo: null as string | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, logo: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleSector = (sectorId: string) => {
    setFormData(prev => {
      const isSelected = prev.sectors.includes(sectorId);
      let newSectors = [];
      if (isSelected) {
        newSectors = prev.sectors.filter(s => s !== sectorId);
      } else {
        if (prev.sectors.length >= 3) return prev; // Max 3 sectors
        newSectors = [...prev.sectors, sectorId];
      }
      
      // When deselecting a sector, remove its categories
      if (isSelected) {
          const sectorCats = PRO_SECTORS.find(s => s.id === sectorId)?.categories.map(c => c.id) || [];
          return {
              ...prev,
              sectors: newSectors,
              categories: prev.categories.filter(c => !sectorCats.includes(c))
          };
      }
      
      return { ...prev, sectors: newSectors };
    });
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(catId);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== catId) };
      } else {
        if (prev.categories.length >= 10) return prev; // Global limit
        return { ...prev, categories: [...prev.categories, catId] };
      }
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      return (
        formData.storeName.length > 3 && 
        formData.sectors.length > 0 && 
        formData.categories.length > 0 &&
        formData.phone.length >= 10
      );
    }
    if (currentStep === 2) {
      return formData.rcNumber.length > 5 && formData.nifNumber.length > 5 && formData.wilaya !== '';
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) return;
    setIsSubmitting(true);
    
    // Simulation API Call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Critical: Upgrade User Context immediately
    upgradeToPro(formData);
    
    setIsSubmitting(false);
    
    // Redirect directly to Dashboard with flag to bypass potential race conditions in ProtectedRoute
    navigate('/pro-dashboard', { 
      replace: true,
      state: { 
        newPro: true,
        from: 'store-created' 
      } 
    });
  };

  const handleCancel = () => {
      if (step > 1) {
          setStep(step - 1);
      } else {
          navigate('/');
      }
  };

  const selectedSectorsData = PRO_SECTORS.filter(s => formData.sectors.includes(s.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={handleCancel} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
            <Icons.ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Création Store Pro</span>
          <div className="w-10"></div> {/* Spacer */}
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
        
        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Store className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Identité du Store</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Définissez votre enseigne et vos activités.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
              
              {/* Logo Upload */}
              <div className="flex justify-center mb-6">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors relative overflow-hidden"
                 >
                   {formData.logo ? (
                     <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                   ) : (
                     <div className="text-center">
                       <Icons.Camera className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto" />
                       <span className="text-[10px] text-gray-400 dark:text-gray-500">Logo</span>
                     </div>
                   )}
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                     className="hidden" 
                     accept="image/*" 
                   />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'enseigne / Store <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="Ex: Auto Luxe DZ, Electro Planet..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* SECTOR MULTI-SELECTION */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secteurs d'activité (Max 3) <span className="text-red-500">*</span></label>
                 
                 <div className="grid grid-cols-2 gap-3 mb-4">
                     {PRO_SECTORS.map((sector) => {
                       const Icon = Icons[sector.icon as keyof typeof Icons] || Icons.Store;
                       const isSelected = formData.sectors.includes(sector.id);
                       return (
                         <button
                           key={sector.id}
                           onClick={() => toggleSector(sector.id)}
                           className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2 group ${
                               isSelected 
                               ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                               : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                           }`}
                         >
                            <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                               <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>{sector.label}</span>
                         </button>
                       );
                     })}
                 </div>

                 {/* CATEGORIES FOR SELECTED SECTORS */}
                 {formData.sectors.length > 0 && (
                   <div className="space-y-4 animate-in fade-in bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Spécialités</label>
                      <div className="space-y-4">
                        {selectedSectorsData.map(sector => (
                            <div key={sector.id}>
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                    <Icons.ChevronRight className="w-3 h-3" /> {sector.label}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sector.categories.map(cat => {
                                        const isSelected = formData.categories.includes(cat.id);
                                        return (
                                            <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                                isSelected
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
                                            }`}
                                            >
                                                {cat.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                      </div>
                      {formData.categories.length === 0 && <p className="text-xs text-red-500 mt-2">Veuillez sélectionner au moins une spécialité.</p>}
                   </div>
                 )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone Professionnel <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0550 00 00 00"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slogan ou courte description</label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  placeholder="Ex: Le spécialiste de l'occasion..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Legal Info (Unchanged Logic, just rendering) */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             {/* Content logic same as original, just ensuring correct wrapping */}
             <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.FileCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Informations Légales</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Ces informations sont obligatoires pour valider votre statut Pro.</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-200">
              <Icons.Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Vos documents sont sécurisés et ne seront pas visibles publiquement. Seul le badge "Vérifié" sera affiché.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de Registre de Commerce (RC) <span className="text-red-500">*</span></label>
                <div className="relative">
                   <input
                    type="text"
                    name="rcNumber"
                    value={formData.rcNumber}
                    onChange={handleInputChange}
                    placeholder="Ex: 16/00-1234567B19"
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono text-gray-900 dark:text-white"
                  />
                  <Icons.FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro d'Identification Fiscale (NIF) <span className="text-red-500">*</span></label>
                <div className="relative">
                   <input
                    type="number"
                    name="nifNumber"
                    value={formData.nifNumber}
                    onChange={handleInputChange}
                    placeholder="Ex: 001916012345678"
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-gray-900 dark:text-white"
                  />
                  <Icons.Hash className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wilaya d'activité <span className="text-red-500">*</span></label>
                    <select
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                    >
                      <option value="">Choisir wilaya...</option>
                      {WILAYAS.map(w => (
                        <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse complète</label>
                   <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Quartier, Rue..."
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  />
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Récapitulatif</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Vérifiez vos informations avant de soumettre.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
               <div className="h-32 bg-gray-800 relative">
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                       {formData.logo ? (
                         <img src={formData.logo} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                            {formData.storeName.charAt(0)}
                         </div>
                       )}
                    </div>
                  </div>
               </div>
               <div className="pt-12 pb-6 px-6">
                  <div className="flex justify-between items-start">
                     <div>
                       <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.storeName}</h2>
                       <p className="text-gray-500 dark:text-gray-400 text-sm">{formData.slogan}</p>
                     </div>
                     <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">PRO</span>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                     <div className="flex justify-between py-1">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Secteurs</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm text-right">
                            {selectedSectorsData.map(s => s.label).join(', ')}
                        </span>
                     </div>
                     <div className="flex justify-between py-1">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Spécialités</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm text-right max-w-[50%] truncate">
                            {formData.categories.map(c => 
                                selectedSectorsData.flatMap(s => s.categories).find(cat => cat.id === c)?.label
                            ).join(', ')}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                className="mt-1 w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Je certifie l'exactitude des informations fournies et j'accepte les <span className="text-indigo-600 dark:text-indigo-400 underline">Conditions Générales d'Utilisation pour les Professionnels</span>.
              </span>
            </label>

          </div>
        )}

      </main>

      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 z-50">
         <div className="container mx-auto max-w-2xl flex gap-4">
            
            <button 
                onClick={handleCancel}
                className="flex-1 py-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                {step === 1 ? 'Annuler' : 'Précédent'}
            </button>

            {step === 3 ? (
               <button 
                  onClick={handleSubmit} 
                  disabled={!formData.acceptTerms || isSubmitting}
                  className={`flex-[2] py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                     !formData.acceptTerms || isSubmitting
                     ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                     : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                  }`}
               >
                  {isSubmitting ? 'Traitement...' : 'Confirmer et Créer'}
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
