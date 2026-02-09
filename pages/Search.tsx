
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_LISTINGS, CATEGORIES, WILAYAS } from '../data';
import { ListingCard } from '../components/ListingCard';
import { Icons } from '../components/Icons';
import { MapWidget } from '../components/MapWidget';

// --- FEATURE FLAG: NAVIGATION V2 ---
const NAV_V2 = true;

// --- SMART INPUT COMPONENT ---
const SmartFilterInput = ({ 
    value, 
    onChange, 
    placeholder, 
    type = 'text',
    className,
    icon: Icon
}: { 
    value: string; 
    onChange: (val: string) => void; 
    placeholder?: string;
    type?: string;
    className?: string;
    icon?: any;
}) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync from parent if changed externally
    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    const handleBlur = () => {
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <div className="relative w-full">
            <input 
                type={type}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={className}
            />
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon className="w-4 h-4" />
                </div>
            )}
        </div>
    );
};

// --- STYLED ACCORDION SECTION ---
const FilterSection = ({ 
  title, 
  icon: Icon,
  isOpen, 
  onToggle, 
  children,
  count,
  isActive
}: { 
  title: string; 
  icon?: any;
  isOpen: boolean; 
  onToggle: () => void; 
  children?: React.ReactNode;
  count?: number;
  isActive?: boolean;
}) => (
  <div className={`mb-3 rounded-xl border transition-all duration-200 overflow-hidden ${isActive ? 'border-brand-200 dark:border-brand-900 bg-brand-50/50 dark:bg-brand-900/10 shadow-sm' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
    <button 
      onClick={onToggle}
      className="flex items-center justify-between w-full p-4 text-left group select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {Icon && (
           <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
              <Icon className="w-4 h-4" />
           </div>
        )}
        <span className={`font-semibold text-sm ${isActive ? 'text-brand-900 dark:text-brand-100' : 'text-gray-900 dark:text-white'}`}>
            {title}
        </span>
        {count && count > 0 ? (
            <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {count}
            </span>
        ) : null}
      </div>
      <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
         <Icons.ChevronDown className="w-4 h-4" />
      </div>
    </button>
    
    {isOpen && (
        <div className="p-4 pt-0 border-t border-dashed border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="pt-4 space-y-4">
                {children}
            </div>
        </div>
    )}
  </div>
);

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [isListening, setIsListening] = useState(false);
  
  // --- SIDEBAR VISIBILITY LOGIC ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Default open on desktop, closed on mobile (handled by CSS 'hidden md:block')
    // We persist preference for desktop mainly
    const saved = localStorage.getItem('wk_search_sidebar');
    return saved === 'true'; 
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('wk_search_sidebar', String(newState));
  };

  // Accordion States
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    subcategory: true,
    location: true,
    price: true,
    specs: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get current state from URL
  const searchQuery = searchParams.get('q');
  const categoryId = searchParams.get('category');
  const subCategoryId = searchParams.get('subCategory');
  const wilayaCode = searchParams.get('wilaya');
  const communeName = searchParams.get('commune');

  // Derive current category/subcategory objects
  const currentCategory = CATEGORIES.find(c => c.id === categoryId);
  const currentSubCategory = currentCategory?.subCategories?.find(s => s.id === subCategoryId);
  const isImportAuto = subCategoryId === 'import_auto';
  const isHolidayRent = subCategoryId === 'holiday_rent';

  const selectedEnvironment = searchParams.get('spec_environment');
  
  const selectedWilayaData = WILAYAS.find(w => w.code === wilayaCode);
  const availableCommunes = selectedWilayaData?.communes || [];

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === id) {
      newParams.delete('category');
      newParams.delete('subCategory');
    } else {
      newParams.set('category', id);
      newParams.delete('subCategory');
    }
    setSearchParams(newParams);
  };
  
  const handleWilayaChange = (code: string) => {
      const newParams = new URLSearchParams(searchParams);
      if(code === '') {
          newParams.delete('wilaya');
          newParams.delete('commune');
      } else {
          newParams.set('wilaya', code);
          newParams.delete('commune');
      }
      setSearchParams(newParams);
  }

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("La recherche vocale n'est pas supportée par votre navigateur.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      updateParam('q', text);
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- Active Filters Generation ---
  const activeFilters = useMemo(() => {
    const filters: { id: string; label: string; onRemove: () => void }[] = [];

    if (searchQuery) filters.push({ id: 'q', label: `"${searchQuery}"`, onRemove: () => updateParam('q', null) });
    if (currentCategory) filters.push({ id: 'category', label: currentCategory.name, onRemove: () => handleCategoryChange(currentCategory.id) });
    if (currentSubCategory) filters.push({ id: 'subCategory', label: currentSubCategory.name, onRemove: () => updateParam('subCategory', null) });
    if (selectedWilayaData) filters.push({ id: 'wilaya', label: selectedWilayaData.name, onRemove: () => handleWilayaChange('') });
    if (communeName) filters.push({ id: 'commune', label: communeName, onRemove: () => updateParam('commune', null) });

    const pMin = searchParams.get('price_min');
    const pMax = searchParams.get('price_max');
    if (pMin) filters.push({ id: 'price_min', label: `> ${pMin} DA`, onRemove: () => updateParam('price_min', null) });
    if (pMax) filters.push({ id: 'price_max', label: `< ${pMax} DA`, onRemove: () => updateParam('price_max', null) });

    searchParams.forEach((value, key) => {
      if (key.startsWith('spec_')) {
        const fieldId = key.replace('spec_', '').replace('_min', '').replace('_max', '');
        const fieldDef = currentSubCategory?.fields.find(f => f.id === fieldId);
        if (fieldDef) {
           let label = `${fieldDef.label}: ${value}`;
           if (key.endsWith('_min')) label = `${fieldDef.label} > ${value}`;
           if (key.endsWith('_max')) label = `${fieldDef.label} < ${value}`;
           if (fieldDef.type === 'checkbox' && value === 'true') label = fieldDef.label;
           filters.push({ id: key, label: label, onRemove: () => updateParam(key, null) });
        }
      }
    });
    return filters;
  }, [searchParams, currentCategory, currentSubCategory, selectedWilayaData, communeName, searchQuery]);


  // --- Filtering Logic ---
  const filteredListings = MOCK_LISTINGS.filter(l => {
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesCategory = l.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory) return false;
    }
    if (categoryId && l.category !== categoryId) return false;
    if (isImportAuto && l.subCategory !== 'import_auto') return false;
    if (subCategoryId && l.subCategory !== subCategoryId && !isImportAuto) {
         if (l.subCategory !== subCategoryId) return false;
    }
    
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    if (priceMin && l.price < parseInt(priceMin)) return false;
    if (priceMax && l.price > parseInt(priceMax)) return false;

    if (wilayaCode) {
        const wName = WILAYAS.find(w => w.code === wilayaCode)?.name;
        if (wName && l.location !== wName) return false;
    }
    if (communeName && l.commune !== communeName) return false;

    if (currentSubCategory?.fields) {
        for (const field of currentSubCategory.fields) {
            const val = searchParams.get(`spec_${field.id}`);
            const min = searchParams.get(`spec_${field.id}_min`);
            const max = searchParams.get(`spec_${field.id}_max`);

            if (!val && !min && !max) continue;
            const itemSpecValue = l.specs?.[field.label] || l.specs?.[field.id];
            
            // Allow undefined if filter is not set (handled by continue above), 
            // but if filter IS set and item has no spec, exclude it.
            if (itemSpecValue === undefined || itemSpecValue === null) return false; 

            if (field.type === 'number' || field.id === 'year') {
                const cleanValue = itemSpecValue.toString().replace(/\s/g, '').replace(/[^0-9.]/g, '');
                const numVal = parseFloat(cleanValue);
                if (isNaN(numVal)) continue;
                if (min && numVal < parseFloat(min)) return false;
                if (max && numVal > parseFloat(max)) return false;
            } else if (field.type === 'checkbox') {
                if (val === 'true') {
                    // Check loosely for 'Oui', 'True', 'Yes', '1'
                    const s = itemSpecValue.toString().toLowerCase();
                    if (s !== 'oui' && s !== 'true' && s !== 'yes' && s !== '1') return false;
                }
            } else {
                if (val && !itemSpecValue.toString().toLowerCase().includes(val.toLowerCase())) return false;
            }
        }
    }
    return true;
  });

  return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
            {/* STICKY SEARCH HEADER (Z-40 to be below Main Header Z-50) */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 p-3 sticky top-16 z-40 transition-colors duration-300">
                <div className="container mx-auto flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* Mobile Filter Trigger */}
                        <button 
                            onClick={toggleSidebar}
                            className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shadow-sm border ${isSidebarOpen ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'}`}
                        >
                            <Icons.Filter className="w-4 h-4" />
                            Filtres
                            {activeFilters.length > 0 && <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-[10px]">{activeFilters.length}</span>}
                        </button>

                        {/* Desktop Categories (Horizontal) */}
                        <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            <span className="text-xs font-bold text-gray-400 uppercase mr-2">Rapide:</span>
                            {CATEGORIES.slice(0, 5).map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`px-3 py-1.5 border rounded-full text-xs whitespace-nowrap transition-colors ${
                                        categoryId === cat.id 
                                        ? 'bg-brand-600 border-brand-600 text-white font-bold' 
                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        
                        {/* Result Count & Toggle View */}
                        <div className="flex items-center justify-end flex-1 gap-3">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{filteredListings.length} annonces</span>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <button onClick={() => setLayout('grid')} className={`p-1.5 rounded ${layout === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}><Icons.Store className="w-4 h-4" /></button>
                                <button onClick={() => setLayout('list')} className={`p-1.5 rounded ${layout === 'list' ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}><Icons.Menu className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE FILTERS ROW (Desktop & Mobile Sticky) */}
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pb-1 animate-in fade-in slide-in-from-top-1">
                            {activeFilters.map(filter => (
                                <button 
                                    key={filter.id}
                                    onClick={filter.onRemove}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-800 rounded-full text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group shadow-sm"
                                >
                                    {filter.label}
                                    <Icons.X className="w-3 h-3 group-hover:text-red-500" />
                                </button>
                            ))}
                            <button onClick={() => setSearchParams({})} className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline ml-auto">
                                Tout effacer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Banner Import Auto (Conditional) */}
            {isImportAuto && (
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 text-white">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full"><Icons.Plane className="w-5 h-5" /></div>
                            <div>
                                <h2 className="text-sm font-bold">Importation Véhicules</h2>
                                <p className="text-indigo-100 text-xs hidden md:block">Véhicules récents (-3 ans) depuis l'Europe.</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/import-entry?intent=request')} className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold text-xs shadow-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
                            Commander
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT LAYOUT */}
            <div className="container mx-auto px-4 py-6 flex items-start gap-6 relative">
                
                {/* SIDEBAR */}
                <aside className={`
                    flex-shrink-0 transition-all duration-300 
                    z-[60] md:z-[30] 
                    ${isSidebarOpen 
                        ? 'fixed inset-0 h-[100dvh] bg-white dark:bg-gray-900 flex flex-col md:sticky md:h-auto md:top-[8.5rem] md:max-h-[calc(100vh-10rem)] md:w-80 md:bg-transparent md:dark:bg-transparent md:flex md:shadow-none' 
                        : 'hidden md:flex md:flex-col md:w-80 md:sticky md:top-[8.5rem] md:max-h-[calc(100vh-10rem)]'
                    }
                `}>
                    {/* Mobile Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 md:hidden bg-white dark:bg-gray-900 flex-shrink-0">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtres</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600">
                            <Icons.X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 overflow-y-auto flex-1 min-h-0 p-4 md:p-0 md:pr-2 no-scrollbar pb-20 md:pb-4 overscroll-contain">
                        
                        {/* Mobile Active Filters Display */}
                        <div className="md:hidden">
                            {activeFilters.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Filtres actifs ({activeFilters.length})</span>
                                        <button onClick={() => setSearchParams({})} className="text-xs text-brand-600 font-medium">Effacer</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeFilters.map(filter => (
                                            <button key={filter.id} onClick={filter.onRemove} className="inline-flex items-center gap-1 px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs font-medium">
                                                {filter.label} <Icons.X className="w-3 h-3" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 0. KEYWORD SEARCH */}
                        <div className="relative">
                            <SmartFilterInput 
                                value={searchQuery || ''}
                                onChange={(val) => updateParam('q', val)}
                                placeholder="Mots-clés (ex: Golf, iPhone)..."
                                className="w-full pl-10 pr-10 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white shadow-sm"
                                icon={Icons.Search}
                            />
                            <button 
                                onClick={handleVoiceSearch}
                                className={`absolute right-3 top-3 p-1 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' : 'text-gray-400 hover:text-brand-600'}`}
                            >
                                <Icons.Mic className="w-4 h-4" />
                            </button>
                        </div>

                        {/* 1. Category */}
                        <FilterSection 
                            title="Catégorie" 
                            icon={Icons.Tag}
                            isOpen={expandedSections.category} 
                            onToggle={() => toggleSection('category')}
                            isActive={!!categoryId}
                        >
                            <div className="space-y-1">
                                {CATEGORIES.map(c => (
                                <label key={c.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${categoryId === c.id ? 'bg-brand-50 dark:bg-brand-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                    <input 
                                    type="radio" 
                                    name="category"
                                    checked={categoryId === c.id}
                                    onChange={() => handleCategoryChange(c.id)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                                    />
                                    <span className={`text-sm flex-1 ${categoryId === c.id ? 'font-bold text-brand-700 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'}`}>{c.name}</span>
                                </label>
                                ))}
                            </div>
                        </FilterSection>

                        {/* 1.5. Sub-Category (Standalone Section) */}
                        {currentCategory?.subCategories && currentCategory.subCategories.length > 0 && (
                            <FilterSection
                                title={`Type de ${currentCategory.name}`}
                                icon={Icons.Filter} // Or List icon
                                isOpen={expandedSections.subcategory}
                                onToggle={() => toggleSection('subcategory')}
                                isActive={!!subCategoryId}
                            >
                                <div className="space-y-1 animate-in slide-in-from-left-2 fade-in">
                                    <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <input 
                                            type="radio" 
                                            name="subcategory"
                                            checked={!subCategoryId}
                                            onChange={() => updateParam('subCategory', null)}
                                            className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Tout</span>
                                    </label>
                                    {currentCategory.subCategories.map(sub => (
                                        <label key={sub.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${subCategoryId === sub.id ? 'bg-brand-50 dark:bg-brand-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                            <input 
                                                type="radio" 
                                                name="subcategory"
                                                checked={subCategoryId === sub.id}
                                                onChange={() => updateParam('subCategory', sub.id)}
                                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                                            />
                                            <span className={`text-sm ${subCategoryId === sub.id ? 'font-semibold text-brand-600' : 'text-gray-600 dark:text-gray-400'}`}>{sub.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>
                        )}

                        {/* 2. Localisation */}
                        <FilterSection 
                            title="Localisation" 
                            icon={Icons.MapPin}
                            isOpen={expandedSections.location} 
                            onToggle={() => toggleSection('location')}
                            count={wilayaCode ? (communeName ? 2 : 1) : 0}
                            isActive={!!wilayaCode}
                        >
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block uppercase">Wilaya</label>
                                    <select 
                                        value={wilayaCode || ''}
                                        onChange={(e) => handleWilayaChange(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none text-gray-900 dark:text-white transition-colors"
                                    >
                                        <option value="">Toutes les wilayas</option>
                                        {WILAYAS.map(w => (
                                        <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {wilayaCode && (
                                    <div className="animate-in slide-in-from-left-2 fade-in">
                                        <label className="text-xs font-medium text-gray-500 mb-1.5 block uppercase">Commune</label>
                                        <select 
                                            value={communeName || ''}
                                            onChange={(e) => updateParam('commune', e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none text-gray-900 dark:text-white transition-colors"
                                        >
                                            <option value="">Toutes les communes</option>
                                            {availableCommunes.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </FilterSection>

                        {/* 3. Price */}
                        <FilterSection 
                            title="Budget (DZD)" 
                            icon={Icons.Wallet}
                            isOpen={expandedSections.price} 
                            onToggle={() => toggleSection('price')}
                            isActive={!!searchParams.get('price_min') || !!searchParams.get('price_max')}
                        >
                            <div className="flex gap-2 items-center">
                                <SmartFilterInput
                                    type="number" 
                                    placeholder="Min" 
                                    value={searchParams.get('price_min') || ''}
                                    onChange={(val) => updateParam('price_min', val)}
                                    className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white" 
                                />
                                <span className="text-gray-400 font-bold">-</span>
                                <SmartFilterInput 
                                    type="number" 
                                    placeholder="Max" 
                                    value={searchParams.get('price_max') || ''}
                                    onChange={(val) => updateParam('price_max', val)}
                                    className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white" 
                                />
                            </div>
                        </FilterSection>

                        {/* 4. Specs */}
                        {currentSubCategory?.fields && currentSubCategory.fields.length > 0 && (
                            <FilterSection 
                                title="Caractéristiques" 
                                icon={Icons.Settings}
                                isOpen={expandedSections.specs} 
                                onToggle={() => toggleSection('specs')}
                                isActive={Array.from(searchParams.keys()).some((k: string) => k.startsWith('spec_'))}
                            >
                                <div className="space-y-4">
                                    {currentSubCategory.fields.map(field => (
                                        <div key={field.id}>
                                            <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1">
                                                {field.label}
                                            </h3>
                                            
                                            {/* Year & Number Ranges */}
                                            {(field.id === 'year' || field.type === 'number') && (
                                                <div className="flex gap-2">
                                                    <SmartFilterInput 
                                                        type="number" 
                                                        placeholder="Min" 
                                                        value={searchParams.get(`spec_${field.id}_min`) || ''}
                                                        onChange={(val) => updateParam(`spec_${field.id}_min`, val)}
                                                        className="w-1/2 p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white" 
                                                    />
                                                    <SmartFilterInput 
                                                        type="number" 
                                                        placeholder="Max" 
                                                        value={searchParams.get(`spec_${field.id}_max`) || ''}
                                                        onChange={(val) => updateParam(`spec_${field.id}_max`, val)}
                                                        className="w-1/2 p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white" 
                                                    />
                                                </div>
                                            )}

                                            {/* Selects */}
                                            {(field.type === 'select' || field.type === 'radio') && field.id !== 'year' && (
                                                <select 
                                                    value={searchParams.get(`spec_${field.id}`) || ''}
                                                    onChange={(e) => updateParam(`spec_${field.id}`, e.target.value)}
                                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none text-gray-900 dark:text-white appearance-none"
                                                >
                                                    <option value="">Tout</option>
                                                    {field.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {/* Checkbox */}
                                            {field.type === 'checkbox' && (
                                                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                                    <input 
                                                        type="checkbox"
                                                        checked={searchParams.get(`spec_${field.id}`) === 'true'}
                                                        onChange={(e) => updateParam(`spec_${field.id}`, e.target.checked ? 'true' : null)}
                                                        className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
                                                </label>
                                            )}

                                            {/* Text */}
                                            {field.type === 'text' && (
                                                <SmartFilterInput 
                                                    type="text"
                                                    placeholder={`Rechercher ${field.label}...`}
                                                    value={searchParams.get(`spec_${field.id}`) || ''}
                                                    onChange={(val) => updateParam(`spec_${field.id}`, val)}
                                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white" 
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </FilterSection>
                        )}
                    </div>

                    {/* Mobile Footer Button */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 md:hidden bg-white dark:bg-gray-900 sticky bottom-0 flex-shrink-0">
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                        >
                            Voir {filteredListings.length} résultats
                        </button>
                    </div>
                </aside>

                {/* RESULTS GRID */}
                <div className="flex-1 min-w-0">
                    
                    {/* Map Widget (Conditional) */}
                    {isHolidayRent && (
                        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <MapWidget 
                                environment={selectedEnvironment || ''} 
                                wilayaCode={wilayaCode}
                                communeName={communeName}
                                listings={filteredListings} 
                                listingCount={filteredListings.length} 
                            />
                        </div>
                    )}

                    {/* Listings */}
                    {filteredListings.length > 0 ? (
                        <div className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {filteredListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} layout={layout} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                                <Icons.Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Aucun résultat trouvé</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                                Essayez de modifier vos filtres ou effectuez une nouvelle recherche.
                            </p>
                            <button 
                                onClick={() => setSearchParams({})}
                                className="mt-6 text-brand-600 dark:text-brand-400 font-bold hover:underline"
                            >
                                Effacer tous les filtres
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
