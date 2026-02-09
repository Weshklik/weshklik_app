
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { CATEGORIES, PRO_SECTORS } from '../data';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext'; // Import Context
import { useSectorRules } from '../hooks/useSectorRules';
import { resolveAdContext } from '../utils/categoryContextResolver';
import { getFormSchema } from '../form-schemas/registry';
import { useFormEngine } from '../hooks/useFormEngine';
import { FormRenderer } from '../components/form/FormRenderer';
import { Listing } from '../types';

export const PostAd: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addListing } = useListings(); // Use Hook
  const rules = useSectorRules(); 
  
  const [step, setStep] = useState(1); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selection State (Before schema load)
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('');

  // --- 1. RESOLVE CONTEXT (Source of Truth) ---
  const adContext = useMemo(() => {
    return resolveAdContext({ user, searchParams });
  }, [user, searchParams]);

  const { allowedCategories, forcedCategory, forcedSubCategory, isLocked, context: contextType } = adContext;

  // --- 2. LOAD SCHEMA ---
  const formSchema = useMemo(() => {
      if (selectedCat && selectedSubCat) {
          // Pass contextType to enforce rules
          return getFormSchema(selectedCat, selectedSubCat, contextType);
      }
      return null;
  }, [selectedCat, selectedSubCat, contextType]);

  // --- 3. INIT ENGINE ---
  const { formData, errors, setFieldValue, validate } = useFormEngine(formSchema);

  // --- 4. APPLY CONTEXT RULES (Auto-Select) ---
  useEffect(() => {
    // A. Apply Forced Category
    if (forcedCategory && selectedCat !== forcedCategory) {
        setSelectedCat(forcedCategory);
    }
    // B. Apply Forced SubCategory
    if (forcedSubCategory && selectedSubCat !== forcedSubCategory) {
        setSelectedSubCat(forcedSubCategory);
    }
    // C. Auto-Jump
    if (forcedCategory && forcedSubCategory && step === 1) {
        setStep(2);
    }
    // D. Pre-fill from URL
    if (!isLocked && !forcedCategory) {
        const cat = searchParams.get('category');
        const sub = searchParams.get('subCategory');
        if (cat && allowedCategories.some(c => c.id === cat)) {
             if (selectedCat !== cat) setSelectedCat(cat);
             if (sub && selectedSubCat !== sub) setSelectedSubCat(sub);
             if (sub) setStep(2);
        }
    }
  }, [adContext, step, selectedCat, selectedSubCat, searchParams]);

  // Permission Check
  useEffect(() => {
    if (!rules.canPost) {
      alert("Limite d'annonces atteinte pour votre pack actuel.");
      navigate('/pro-plans');
    }
  }, [rules, navigate]);

  const handleSubmit = async () => {
    if (validate() && user) {
        setIsSubmitting(true);
        
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create Listing Object
        const newListing: Listing = {
            id: `l_${Date.now()}`,
            title: formData.title || 'Nouvelle Annonce',
            price: Number(formData.price) || 0,
            currency: 'DZD',
            category: selectedCat,
            subCategory: selectedSubCat,
            location: formData.wilaya ? formData.wilaya.split(' - ')[1] || formData.wilaya : 'Algérie',
            commune: formData.commune,
            image: formData.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
            date: "À l'instant",
            seller: user,
            description: formData.description,
            specs: { ...formData }, // Store all fields as specs
            isPromoted: false
        };

        // Add to Global Context
        addListing(newListing);

        setIsSubmitting(false);
        
        // Redirect based on role
        if (user.type === 'pro') {
            navigate('/pro/annonces');
        } else {
            navigate('/');
        }
    } else {
        alert("Veuillez corriger les erreurs dans le formulaire.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- RENDERERS ---

  const renderCategorySelection = () => (
    <div className="space-y-6 animate-in slide-in-from-right">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Que vendez-vous ?</h2>
        
        {/* Context Banner */}
        {contextType !== 'INDIVIDUAL' && (
            <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 inline-block text-left">
                <p className="text-xs text-indigo-800 dark:text-indigo-200">
                    <span className="font-bold">{adContext.bannerTitle}</span>
                </p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize mt-0.5">
                    {adContext.bannerSubtitle}
                </p>
            </div>
        )}
      </div>
      
      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allowedCategories.map(cat => {
          const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
          const isSelected = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCat(cat.id); setSelectedSubCat(''); }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-500 shadow-sm' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className={`p-3 rounded-full mb-2 ${isSelected ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-brand-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {allowedCategories.find(c => c.id === selectedCat) && (
        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Type précis</label>
          <div className="flex flex-wrap gap-2">
            {allowedCategories.find(c => c.id === selectedCat)?.subCategories?.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCat(sub.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedSubCat === sub.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- IMPORT AUTO DIVERSION BLOCK --- */}
      {selectedCat === 'auto' && contextType === 'INDIVIDUAL' && (
          <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Icons.Plane className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Vous cherchez à importer un véhicule ?</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Les particuliers ne peuvent pas publier d'annonces d'import. Faites plutôt une demande aux professionnels.
                      </p>
                  </div>
              </div>
              <button 
                  onClick={() => navigate('/import-request')}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                  Faire une demande
              </button>
          </div>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => step === 1 ? navigate('/') : setStep(step - 1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            <Icons.ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-bold text-gray-900 dark:text-white">Déposer une annonce</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Étape {step} sur 2</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {step === 1 && renderCategorySelection()}
        
        {step === 2 && (
            formSchema ? (
                <div className="space-y-6">
                    {/* Context Banner */}
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-full text-brand-600 dark:text-brand-400">
                                <Icons.Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Catégorie</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {allowedCategories.find(c => c.id === selectedCat)?.name} <span className="text-gray-400">/</span> {allowedCategories.find(c => c.id === selectedCat)?.subCategories?.find(s => s.id === selectedSubCat)?.name}
                                </p>
                            </div>
                        </div>
                        {!isLocked ? (
                            <button onClick={() => setStep(1)} className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">Modifier</button>
                        ) : (
                            <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-800">Imposé</span>
                        )}
                    </div>

                    {/* THE ENGINE RENDERER */}
                    <FormRenderer 
                        schema={formSchema} 
                        formData={formData} 
                        errors={errors} 
                        onChange={setFieldValue} 
                    />
                </div>
            ) : (
                /* --- NO SCHEMA AVAILABLE STATE (BLOCKER) --- */
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center">
                        <Icons.Construction className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Module Indisponible</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Ce formulaire métier spécifique est en cours de développement ou n'est pas encore activé pour votre secteur.
                    </p>
                    <button 
                        onClick={() => navigate('/pro-dashboard')}
                        className="mt-4 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Retour au Dashboard
                    </button>
                </div>
            )
        )}
      </main>

      {/* Footer Actions */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 z-50">
        <div className="container mx-auto max-w-3xl">
          <button
            onClick={() => {
                if (step === 1) {
                    if (selectedCat && selectedSubCat) setStep(2);
                    else alert("Veuillez sélectionner une catégorie.");
                } else {
                    handleSubmit();
                }
            }}
            disabled={
                isSubmitting || 
                (step === 1 && (!selectedCat || !selectedSubCat)) ||
                (step === 2 && !formSchema) // Disable if no schema
            }
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              isSubmitting || (step === 1 && (!selectedCat || !selectedSubCat)) || (step === 2 && !formSchema)
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-95'
            }`}
          >
            {isSubmitting ? 'Publication...' : step === 2 ? 'Publier l\'annonce' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
};
