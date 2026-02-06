
import React, { useReducer, useRef, useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CATEGORIES, WILAYAS, MOCK_LISTINGS, SECTOR_RULES, PRO_SECTORS } from '../data';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useSectorRules } from '../hooks/useSectorRules';

// --- State Types & Reducer ---

interface FormData {
  category: string;
  subCategory: string;
  title: string;
  price: string;
  wilaya: string;
  commune: string;
  description: string;
  images: string[];
  pack: string;
  date: string;
  specs: Record<string, any>;
}

interface State {
  step: number;
  loading: boolean;
  isCompressing: boolean;
  isDragging: boolean;
  isListening: boolean;
  showExitModal: boolean;
  formData: FormData;
}

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FORM'; payload: Partial<FormData> }
  | { type: 'APPEND_DESCRIPTION'; payload: string }
  | { type: 'RESET_SUBCATEGORY' }
  | { type: 'ADD_IMAGES'; payload: string[] }
  | { type: 'REMOVE_IMAGE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_COMPRESSING'; payload: boolean }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_EXIT_MODAL'; payload: boolean };

const initialState: State = {
  step: 1,
  loading: false,
  isCompressing: false,
  isDragging: false,
  isListening: false,
  showExitModal: false,
  formData: {
    category: '',
    subCategory: '',
    title: '',
    price: '',
    wilaya: '',
    commune: '',
    description: '',
    images: [],
    pack: 'free',
    date: new Date().toISOString().split('T')[0],
    specs: {}
  }
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'UPDATE_FORM':
      return { 
        ...state, 
        formData: { ...state.formData, ...action.payload } 
      };
    case 'APPEND_DESCRIPTION':
      return {
        ...state,
        formData: {
          ...state.formData,
          description: state.formData.description 
            ? `${state.formData.description} ${action.payload}`
            : action.payload
        }
      };
    case 'RESET_SUBCATEGORY':
      return { 
        ...state, 
        formData: { ...state.formData, subCategory: '', specs: {} } 
      };
    case 'ADD_IMAGES':
      return { 
        ...state, 
        formData: { ...state.formData, images: [...state.formData.images, ...action.payload] } 
      };
    case 'REMOVE_IMAGE':
      return { 
        ...state, 
        formData: { ...state.formData, images: state.formData.images.filter((_, i) => i !== action.payload) } 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_COMPRESSING':
      return { ...state, isCompressing: action.payload };
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    case 'SET_EXIT_MODAL':
      return { ...state, showExitModal: action.payload };
    default:
      return state;
  }
}

export const PostAd: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth(); // Get user to check role
  const { mustUpgrade, freeLimit, importAutoAllowed } = useSectorRules(); // Check Rules
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Gatekeeper State: null (hidden) | 'block' (show restriction) | 'success' (show request sent)
  const [gatekeeperMode, setGatekeeperMode] = useState<'block' | 'success' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { step, formData, loading, isCompressing, isDragging, isListening, showExitModal } = state;

  // Determine if Boost step should be shown (Pro only)
  const isPro = user?.type === 'pro';
  const isImportContext = formData.subCategory === 'import_auto';
  
  // Dynamic Total Steps based on flow
  const totalSteps = isPro ? 4 : 3;

  // --- SECTOR CONTEXT LOGIC ---
  const sectorName = user?.sector ? PRO_SECTORS.find(s => s.id === user.sector)?.label : null;
  const authorizedCategories = useMemo(() => {
    if (!isPro || !user?.sector) return CATEGORIES; // Everyone else sees all
    
    const rule = SECTOR_RULES[user.sector];
    if (!rule || !rule.allowedCategories) return CATEGORIES;

    // Filter categories strictly based on sector rules
    return CATEGORIES.filter(cat => rule.allowedCategories.includes(cat.id));
  }, [isPro, user]);

  // Initialize from URL params if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    const subCatParam = searchParams.get('subCategory');
    const mode = searchParams.get('mode');

    if (catParam) {
      // Security Check: If Pro, ensure catParam is allowed
      if (isPro && !authorizedCategories.find(c => c.id === catParam)) {
         alert('Cette catégorie ne correspond pas à votre secteur d\'activité.');
         return;
      }

      dispatch({ type: 'UPDATE_FORM', payload: { category: catParam } });
      
      if (subCatParam) {
         // Auto-bypass logic is handled in handleSubCategorySelect usually,
         // but for URL initialization, we do it here:
         if (subCatParam === 'import_auto' && mode !== 'pro_bypass') {
            // Check if user is legally allowed (Certified Sector)
            if (isPro && importAutoAllowed) {
                dispatch({ type: 'UPDATE_FORM', payload: { subCategory: subCatParam } });
            } else {
                setGatekeeperMode('block');
            }
         } else {
            dispatch({ type: 'UPDATE_FORM', payload: { subCategory: subCatParam } });
         }
      }
    }
  }, [isPro, authorizedCategories, importAutoAllowed]);

  // Helper to get current category and subcategory objects
  const currentCategory = authorizedCategories.find(c => c.id === formData.category);
  const currentSubCategory = currentCategory?.subCategories?.find(s => s.id === formData.subCategory);
  
  // Get communes for selected Wilaya
  const selectedWilayaData = WILAYAS.find(w => w.code === formData.wilaya);
  const availableCommunes = selectedWilayaData?.communes || [];

  // Protect against accidental browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // If we have selected a category, consider the form "dirty"
      if (formData.category) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData.category]);

  // --- Dynamic Labels Helper ---
  const fieldTexts = useMemo(() => {
    const { category, subCategory, specs } = formData;
    let texts = {
      titleLabel: "Titre de l'annonce",
      titlePlaceholder: "Ex: iPhone 14 Pro Max 256Go",
      priceLabel: "Prix",
      descLabel: "Description",
      descPlaceholder: "Décrivez votre produit en détail..."
    };

    if (category === 'jobs_services') {
       if (subCategory === 'jobs') {
         texts.titleLabel = "Intitulé du poste";
         texts.titlePlaceholder = "Ex: Vendeur(se), Développeur, Comptable...";
         texts.priceLabel = "Salaire (DA)";
         texts.descPlaceholder = "Décrivez les responsabilités, le profil recherché, les horaires, etc.";
       } else {
         texts.titleLabel = "Titre du service";
         texts.titlePlaceholder = "Ex: Plombier qualifié, Transport de déménagement...";
         texts.priceLabel = "Tarif / Budget";
         texts.descPlaceholder = "Détaillez vos prestations, votre expérience, vos disponibilités...";
       }
    } else if (category === 'real_estate') {
       texts.titlePlaceholder = "Ex: Appartement F3 à Alger Centre";
       texts.descPlaceholder = "Précisez l'étage, l'orientation, les commodités, le voisinage...";
       
       // Handle commercial real estate specifically or rental categories
       const isRent = ['rent', 'holiday_rent'].includes(subCategory) || 
                      (subCategory === 'commercial' && specs?.['transaction'] === 'Location');

       if (isRent) {
         texts.priceLabel = "Loyer (DA)";
       } else {
         texts.priceLabel = "Prix de vente";
       }
    } else if (category === 'auto') {
       texts.titlePlaceholder = "Ex: Golf 7 GTD 2018";
       texts.descPlaceholder = "Mentionnez l'état du moteur, la carrosserie, l'entretien, les pneus...";
    }

    return texts;
  }, [formData.category, formData.subCategory, formData.specs]);

  // --- Validation Logic ---

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.category) return false;
        if (currentCategory?.subCategories && currentCategory.subCategories.length > 0 && !formData.subCategory) return false;
        return true;
      case 2:
        // Check dynamic required fields
        if (currentSubCategory?.fields) {
          for (const field of currentSubCategory.fields) {
            if (field.required && (!formData.specs[field.id] || formData.specs[field.id] === '')) {
              return false;
            }
          }
        }
        // Check common fields
        return !!(
          formData.title.trim() && 
          formData.price && 
          parseInt(formData.price) > 0 && // Ensure price is positive
          formData.description.trim() && 
          formData.wilaya && 
          formData.date
        );
      case 3:
        return formData.images.length > 0;
      case 4:
        return true; // Pack selection is always valid (default selected)
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === totalSteps) {
        handleSubmit();
      } else {
        dispatch({ type: 'NEXT_STEP' });
      }
    }
  };

  const handleBack = () => {
    if (step === 1 && formData.subCategory) {
      dispatch({ type: 'RESET_SUBCATEGORY' });
    } else {
      dispatch({ type: 'PREV_STEP' });
    }
  };

  const handleSubCategorySelect = (subId: string) => {
    if (subId === 'import_auto') {
      // SMART GATEKEEPER CHECK
      // If user is a Pro AND their sector allows import (e.g. 'auto_vente'), they bypass the check.
      if (isPro && importAutoAllowed) {
          dispatch({ type: 'UPDATE_FORM', payload: { subCategory: subId } });
          return;
      }
      
      // Otherwise (Individual or Pro in wrong sector), show the gatekeeper
      setGatekeeperMode('block');
      return;
    }
    dispatch({ type: 'UPDATE_FORM', payload: { subCategory: subId } });
  };

  // Smart Back Handler for Header
  const handleHeaderBack = () => {
    const isSubCatView = formData.subCategory && currentCategory?.subCategories;
    
    // If we are at the very beginning (selecting category) or if we haven't selected anything yet
    if (step === 1 && !isSubCatView) {
      // If the user has started (selected a category previously but went back, or just dirty state logic)
      if (formData.category) {
        dispatch({ type: 'SET_EXIT_MODAL', payload: true });
      } else {
        navigate('/');
      }
    } else {
      // Standard internal navigation
      handleBack();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    dispatch({ type: 'SET_LOADING', payload: false });
    navigate(isPro ? '/pro-dashboard' : '/');
    alert('Annonce publiée avec succès !');
  };

  // --- Voice Input Logic --- (Same as before)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (isListening) {
      recognition.stop();
      dispatch({ type: 'SET_LISTENING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LISTENING', payload: true });
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        dispatch({ 
          type: 'APPEND_DESCRIPTION', 
          payload: transcript 
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      dispatch({ type: 'SET_LISTENING', payload: false });
    };

    recognition.onend = () => {
      dispatch({ type: 'SET_LISTENING', payload: false });
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
      dispatch({ type: 'SET_LISTENING', payload: false });
    }
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      dispatch({ type: 'SET_COMPRESSING', payload: true });
      try {
        const files = Array.from(e.target.files);
        const compressedImages = await Promise.all(files.map(compressImage));
        dispatch({ type: 'ADD_IMAGES', payload: compressedImages });
      } catch (error) {
        console.error("Error compressing images", error);
        alert("Une erreur est survenue lors du traitement des images.");
      } finally {
        dispatch({ type: 'SET_COMPRESSING', payload: false });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: true });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: false });
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: false });
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
        .filter((file: any) => file.type.startsWith('image/'));
        
      if (files.length > 0) {
        dispatch({ type: 'SET_COMPRESSING', payload: true });
        try {
          const compressedImages = await Promise.all(files.map(compressImage));
          dispatch({ type: 'ADD_IMAGES', payload: compressedImages });
        } catch (error) {
          console.error("Error compressing images", error);
          alert("Une erreur est survenue lors du traitement des images.");
        } finally {
          dispatch({ type: 'SET_COMPRESSING', payload: false });
        }
      }
    }
  };

  const removeImage = (index: number) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: index });
  };

  const formatPriceDisplay = (value: string | number) => {
    if (!value) return '';
    const number = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('fr-DZ').format(number);
  };

  const PACKS = [
    { id: 'free', name: 'Standard', price: 0, days: 30, color: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700' },
    { id: 'silver', name: 'Silver Boost', price: 500, days: 45, color: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', recommended: true },
    { id: 'gold', name: 'Gold Premium', price: 1200, days: 60, color: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
  ];

  // --- Market Price Logic ---
  const marketStats = useMemo(() => {
    if (!formData.category || !formData.wilaya) return null;
    const wilayaName = WILAYAS.find(w => w.code === formData.wilaya)?.name;
    if (!wilayaName) return null;

    const similarListings = MOCK_LISTINGS.filter(l => 
      l.category === formData.category && 
      l.location.includes(wilayaName)
    );

    if (similarListings.length === 0) return null;

    const total = similarListings.reduce((sum, l) => sum + l.price, 0);
    const avg = total / similarListings.length;

    return { avg, count: similarListings.length, wilayaName };
  }, [formData.category, formData.wilaya]);

  // --- RENDER FUNCTIONS ---

  // Render Category Selection (GRID)
  const renderStepCategory = () => {
    // If category is already selected, show subcats
    if (formData.category && currentCategory?.subCategories && !formData.subCategory) {
      return (
        <div>
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-gray-400 font-normal text-base">Catégorie :</span> {currentCategory.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCategory.subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubCategorySelect(sub.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all group text-left ${
                  sub.id === 'import_auto' 
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 hover:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {sub.id === 'import_auto' && <Icons.Plane className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                  <span className={`font-medium ${sub.id === 'import_auto' ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-200'} group-hover:text-brand-700 dark:group-hover:text-brand-400`}>
                    {sub.name}
                  </span>
                </div>
                <Icons.ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-brand-500" />
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {authorizedCategories.map((cat) => {
          const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
          const isSelected = formData.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                const hasSubs = cat.subCategories && cat.subCategories.length > 0;
                dispatch({ 
                  type: 'UPDATE_FORM', 
                  payload: { 
                    category: cat.id, 
                    subCategory: hasSubs ? '' : 'default',
                    specs: {} 
                  }
                });
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-brand-200 dark:hover:border-brand-800'
              }`}
            >
              <div className={`p-3 rounded-full mb-3 ${isSelected ? 'bg-brand-200 dark:bg-brand-800' : cat.color + ' bg-opacity-20'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-center text-gray-900 dark:text-gray-100">{cat.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderStepDetails = () => {
    const currentPrice = parseInt(formData.price || '0', 10);
    const isPriceHigh = marketStats && currentPrice > (marketStats.avg * 1.2);
    const isPriceLow = marketStats && currentPrice > 0 && currentPrice < (marketStats.avg * 0.5);

    return (
    <div className="space-y-6">
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between text-sm text-blue-800 dark:text-blue-200">
        <div className="flex items-center gap-2">
           <Icons.CheckCircle2 className="w-5 h-5" />
           <span className="font-medium">{currentCategory?.name}</span>
           {currentSubCategory && (
             <>
               <Icons.ChevronRight className="w-4 h-4 text-blue-400" />
               <span className="font-medium">{currentSubCategory.name}</span>
             </>
           )}
        </div>
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })} className="text-blue-600 dark:text-blue-400 hover:underline">Modifier</button>
      </div>

      {formData.subCategory === 'import_auto' && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900 p-4 rounded-lg flex items-start gap-3 text-sm text-indigo-900 dark:text-indigo-200">
          <Icons.AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Attention :</strong> Conformément à la législation algérienne, l'importation de véhicules d'occasion est limitée aux véhicules de <strong>moins de 3 ans</strong>.
          </p>
        </div>
      )}

      {currentSubCategory?.fields && currentSubCategory.fields.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
          <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Caractéristiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSubCategory.fields.map((field) => (
              <div key={field.id} className={field.type === 'radio' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'text' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.specs[field.id] || ''}
                      onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { specs: { ...formData.specs, [field.id]: e.target.value } } })}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
                    />
                    {field.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">{field.suffix}</span>}
                  </div>
                )}

                {field.type === 'number' && (
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.specs[field.id] || ''}
                      onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { specs: { ...formData.specs, [field.id]: e.target.value } } })}
                      required={field.required}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
                    />
                    {field.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">{field.suffix}</span>}
                  </div>
                )}

                {field.type === 'date' && (
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.specs[field.id] || ''}
                      onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { specs: { ...formData.specs, [field.id]: e.target.value } } })}
                      required={field.required}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {field.type === 'select' && (
                  <select
                    value={formData.specs[field.id] || ''}
                    onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { specs: { ...formData.specs, [field.id]: e.target.value } } })}
                    required={field.required}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none appearance-none text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionner</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === 'radio' && (
                  <div className="flex flex-wrap gap-3">
                    {field.options?.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input
                          type="radio"
                          name={`field_${field.id}`}
                          value={opt}
                          checked={formData.specs[field.id] === opt}
                          onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { specs: { ...formData.specs, [field.id]: e.target.value } } })}
                          required={field.required}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Fields */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
         <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Informations Générales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wilaya <span className="text-red-500">*</span></label>
              <select 
                value={formData.wilaya}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { wilaya: e.target.value, commune: '' } })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
              >
                <option value="">Sélectionner une wilaya</option>
                {WILAYAS.map(w => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                ))}
              </select>
            </div>

            {formData.wilaya && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commune <span className="text-gray-400 font-normal">(Optionnel)</span></label>
                  <select 
                    value={formData.commune}
                    onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { commune: e.target.value } })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900 text-gray-900 dark:text-white"
                    disabled={!formData.wilaya}
                  >
                    <option value="">Sélectionner une commune</option>
                    {availableCommunes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {availableCommunes.length === 0 && <option disabled>Aucune commune listée</option>}
                  </select>
                </div>
            )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldTexts.priceLabel} <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="text"
              inputMode="numeric" 
              value={formatPriceDisplay(formData.price)}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                dispatch({ type: 'UPDATE_FORM', payload: { price: val } });
              }}
              placeholder="Ex: 120 000"
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none pr-16 text-gray-900 dark:text-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-500 dark:text-gray-300">
              DZD
            </div>
          </div>
          
          {isPriceHigh && marketStats && (
            <div className="mt-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-2.5 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
              <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Le prix moyen pour cette catégorie à <strong>{marketStats.wilayaName}</strong> est de <strong>{formatPriceDisplay(marketStats.avg.toFixed(0))} DA</strong>.
                Votre prix semble un peu élevé.
              </span>
            </div>
          )}

           {isPriceLow && marketStats && (
            <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-2.5 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
              <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Le prix semble très bas par rapport à la moyenne de <strong>{marketStats.wilayaName}</strong> ({formatPriceDisplay(marketStats.avg.toFixed(0))} DA). 
                Vérifiez qu'il n'y a pas d'erreur de saisie.
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldTexts.titleLabel} <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={formData.title}
            onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { title: e.target.value } })}
            placeholder={fieldTexts.titlePlaceholder}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de publication</label>
          <div className="relative">
            <input 
              type="date"
              value={formData.date}
              onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { date: e.target.value } })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{fieldTexts.descLabel} <span className="text-red-500">*</span></label>
            <button
              onClick={handleVoiceInput}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/30'
              }`}
              type="button"
            >
              {isListening ? (
                <>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                  Écoute...
                </>
              ) : (
                <>
                  <Icons.MessageCircle className="w-3.5 h-3.5" />
                  Dicter
                </>
              )}
            </button>
          </div>
          <textarea 
            value={formData.description}
            onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { description: e.target.value } })}
            rows={4}
            placeholder={isListening ? "Parlez maintenant..." : fieldTexts.descPlaceholder}
            className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none transition-colors text-gray-900 dark:text-white ${
              isListening ? 'border-red-300 ring-2 ring-red-100 bg-red-50' : 'border-gray-200 dark:border-gray-700'
            }`}
          />
        </div>
      </div>
    </div>
    );
  };

  const renderStepImages = () => (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
          isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className="hidden" 
          multiple 
          accept="image/*" 
        />
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 rounded-full flex items-center justify-center mb-4">
          <Icons.Camera className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ajoutez des photos</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-xs">
          Glissez-déposez vos images ici ou cliquez pour parcourir. (Max 10 photos)
        </p>
      </div>

      {isCompressing && (
        <div className="text-center py-4 text-brand-600 dark:text-brand-400 font-medium animate-pulse">
          Optimisation des images en cours...
        </div>
      )}

      {formData.images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
              <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icons.X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStepPack = () => (
    <div className="grid md:grid-cols-3 gap-4">
      {PACKS.map(pack => (
        <button
          key={pack.id}
          onClick={() => dispatch({ type: 'UPDATE_FORM', payload: { pack: pack.id } })}
          className={`relative p-6 rounded-xl border-2 text-left transition-all ${
            formData.pack === pack.id 
              ? `border-brand-600 ring-1 ring-brand-600 ${pack.color}` 
              : `border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600`
          }`}
        >
          {pack.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              RECOMMANDÉ
            </div>
          )}
          <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{pack.name}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {pack.price === 0 ? 'Gratuit' : `${formatPriceDisplay(pack.price)} DA`}
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Icons.Check className="w-4 h-4 text-green-500" />
              Visibilité {pack.days} jours
            </li>
            {pack.price > 0 && (
               <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                 <Icons.Star className="w-4 h-4 text-yellow-500" />
                 En tête de liste
               </li>
            )}
          </ul>
        </button>
      ))}
    </div>
  );

  // --- GATEKEEPER RENDER (RESTRICTION PRO) ---
  if (gatekeeperMode === 'block') {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
             
             {/* HEADER */}
             <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <Icons.Shield className="w-8 h-8" />
             </div>
             
             <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-3 leading-tight">
                Service réservé aux Stores Import certifiés
             </h3>
             
             <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6 leading-relaxed">
               La publication d'offres d'importation de véhicules (de moins de 3 ans) est réservée aux <strong>Stores professionnels certifiés</strong> Import Auto.
             </p>
             
             {/* ACTIONS */}
             <div className="space-y-3">
                {!isPro ? (
                    // IF NOT PRO -> UPSKILL
                    <>
                      <button 
                          onClick={() => navigate('/create-store')}
                          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                      >
                          J'ouvre mon Store Pro
                      </button>
                      <button 
                          onClick={() => navigate('/import-request')}
                          className="w-full py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      >
                          Je suis Particulier (Faire une demande)
                      </button>
                    </>
                ) : (
                    // IF PRO (Wrong Sector) -> CERTIFY
                    <button 
                      onClick={() => setGatekeeperMode('success')}
                      className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                    >
                      Demander la certification Import Auto
                    </button>
                )}
                
                <button 
                    onClick={() => {
                        setGatekeeperMode(null);
                        // Safe exit logic
                        if (isPro) navigate('/pro-dashboard');
                        else navigate('/'); 
                    }}
                    className="w-full py-2 rounded-xl text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm font-medium"
                >
                    Annuler
                </button>
             </div>
          </div>
        </div>
      );
  }

  // --- GATEKEEPER RENDER (SUCCESS STATE) ---
  if (gatekeeperMode === 'success') {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-3 leading-tight">
                    Demande envoyée
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6 leading-relaxed">
                    Votre demande de certification Import Auto a été transmise.
                    <br/>
                    Notre équipe vous contactera après vérification de votre activité.
                </p>
                
                <button 
                    onClick={() => {
                        setGatekeeperMode(null);
                        navigate('/pro-dashboard');
                    }}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    Retour à mon espace Pro
                </button>
          </div>
        </div>
      );
  }

  // --- STANDARD RESTRICTION (LIMIT REACHED) ---
  if (mustUpgrade) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Limite Atteinte</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Votre pack actuel (Free) vous permet de publier <strong>{freeLimit} annonce{freeLimit > 1 ? 's' : ''}</strong> maximum dans ce secteur.
                    <br/><br/>
                    Passez à un pack supérieur pour continuer à vendre.
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/pro-plans')}
                        className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
                    >
                        Voir les Packs
                    </button>
                    <button 
                        onClick={() => navigate('/pro-dashboard')}
                        className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Retour au Tableau de Bord
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- DYNAMIC HEADER STYLE ---
  const headerStyle = isImportContext 
    ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10'
    : (isPro 
        ? 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10'
        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900');

  const activeColor = isImportContext ? 'bg-indigo-600' : (isPro ? 'bg-brand-600' : 'bg-accent-500');
  const inactiveColor = isImportContext ? 'bg-indigo-200 dark:bg-indigo-900' : (isPro ? 'bg-blue-200 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-700');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      
      {/* CONTEXT BANNER (PRO ONLY) */}
      {isPro && (
        <div className={`${isImportContext ? 'bg-indigo-600' : 'bg-brand-600'} text-white px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 shadow-sm relative z-20`}>
           <Icons.Store className="w-4 h-4" />
           Contexte Store : {user.name} ({sectorName})
        </div>
      )}

      {/* Wizard Header */}
      <header className={`${headerStyle} border-b px-4 h-16 flex items-center justify-between sticky top-0 z-50 transition-colors`}>
        <button 
          onClick={handleHeaderBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <Icons.ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {step === 1 ? 'Catégorie' : step === 2 ? 'Détails' : step === 3 ? 'Photos' : 'Booster'}
          </span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
              <div 
                key={s} 
                className={`h-1 w-8 rounded-full transition-colors ${s <= step ? activeColor : inactiveColor}`} 
              />
            ))}
          </div>
        </div>

        <button 
          onClick={() => dispatch({ type: 'SET_EXIT_MODAL', payload: true })}
          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Fermer
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {step === 1 && renderStepCategory()}
        {step === 2 && renderStepDetails()}
        {step === 3 && renderStepImages()}
        {step === 4 && isPro && renderStepPack()}
      </main>

      {/* Footer Actions */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 z-50">
        <div className="container mx-auto max-w-3xl flex gap-4">
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Précédent
            </button>
          )}
          <button 
            onClick={step === totalSteps ? handleSubmit : handleNext}
            disabled={!validateStep(step) || loading}
            className={`flex-1 py-3.5 rounded-xl text-white font-bold shadow-lg transition-all ${
               !validateStep(step) || loading
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none' 
                : `${activeColor} hover:opacity-90 active:scale-[0.98] shadow-md`
            }`}
          >
            {loading ? 'Publication...' : step === totalSteps ? 'Publier l\'annonce' : 'Suivant'}
          </button>
        </div>
      </footer>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Abandonner l'annonce ?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Si vous quittez maintenant, les informations saisies seront perdues.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => dispatch({ type: 'SET_EXIT_MODAL', payload: false })}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Annuler
              </button>
              <button 
                onClick={() => navigate(isPro ? '/pro-dashboard' : '/')}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
