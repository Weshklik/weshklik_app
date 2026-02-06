import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_LISTINGS, CATEGORIES, WILAYAS } from '../data';
import { ListingCard } from '../components/ListingCard';
import { Icons } from '../components/Icons';
import { MapWidget } from '../components/MapWidget';

// --- FEATURE FLAG: NAVIGATION V2 ---
// Mettre à 'false' pour revenir instantanément à l'ancien comportement.
const NAV_V2 = true;

// Helper Component for Accordion Sections
const FilterSection = ({ 
  title, 
  icon: Icon,
  isOpen, 
  onToggle, 
  children,
  count 
}: { 
  title: string; 
  icon?: any;
  isOpen: boolean; 
  onToggle: () => void; 
  children?: React.ReactNode;
  count?: number;
}) => (
  <div className="border-b border-gray-100 dark:border-gray-800 py-4 last:border-0">
    <button 
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left group select-none"
    >
      <div className="flex items-center gap-3">
        {Icon && (
           <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700'}`}>
              <Icon className="w-4 h-4" />
           </div>
        )}
        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {title}
            {count && count > 0 ? (
            <span className="bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {count}
            </span>
            ) : null}
        </span>
      </div>
      <div className={`p-1 rounded-full text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors ${isOpen ? 'rotate-180' : ''}`}>
         <Icons.ChevronDown className="w-4 h-4 transition-transform" />
      </div>
    </button>
    {isOpen && <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200 pl-1">{children}</div>}
  </div>
);

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  
  // --- SIDEBAR VISIBILITY LOGIC ---
  // Default closed on desktop, handled via localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('wk_search_sidebar');
    return saved === 'true'; // Default false if not set
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('wk_search_sidebar', String(newState));
  };

  // Accordion States
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    location: true,
    price: true,
    specs: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get current state from URL
  const categoryId = searchParams.get('category');
  const subCategoryId = searchParams.get('subCategory');
  const wilayaCode = searchParams.get('wilaya');
  const communeName = searchParams.get('commune');

  // Derive current category/subcategory objects
  const currentCategory = CATEGORIES.find(c => c.id === categoryId);
  const currentSubCategory = currentCategory?.subCategories?.find(s => s.id === subCategoryId);
  const isImportAuto = subCategoryId === 'import_auto';
  const isHolidayRent = subCategoryId === 'holiday_rent';

  // Specific params for maps
  const selectedEnvironment = searchParams.get('spec_environment');
  
  // Get communes for selected Wilaya
  const selectedWilayaData = WILAYAS.find(w => w.code === wilayaCode);
  const availableCommunes = selectedWilayaData?.communes || [];

  // Helper to update URL params
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

  // --- Active Filters Generation ---
  const activeFilters = useMemo(() => {
    const filters: { id: string; label: string; onRemove: () => void }[] = [];

    // Category
    if (currentCategory) {
      filters.push({
        id: 'category',
        label: currentCategory.name,
        onRemove: () => handleCategoryChange(currentCategory.id) // Toggles off
      });
    }

    // SubCategory
    if (currentSubCategory) {
      filters.push({
        id: 'subCategory',
        label: currentSubCategory.name,
        onRemove: () => updateParam('subCategory', null)
      });
    }

    // Location
    if (selectedWilayaData) {
      filters.push({
        id: 'wilaya',
        label: `Wilaya: ${selectedWilayaData.name}`,
        onRemove: () => handleWilayaChange('')
      });
    }
    if (communeName) {
      filters.push({
        id: 'commune',
        label: `Commune: ${communeName}`,
        onRemove: () => updateParam('commune', null)
      });
    }

    // Price
    const pMin = searchParams.get('price_min');
    const pMax = searchParams.get('price_max');
    if (pMin) filters.push({ id: 'price_min', label: `Min: ${pMin} DA`, onRemove: () => updateParam('price_min', null) });
    if (pMax) filters.push({ id: 'price_max', label: `Max: ${pMax} DA`, onRemove: () => updateParam('price_max', null) });

    // Dynamic Specs
    searchParams.forEach((value, key) => {
      if (key.startsWith('spec_')) {
        // Try to find a human readable label
        const fieldId = key.replace('spec_', '').replace('_min', '').replace('_max', '');
        const fieldDef = currentSubCategory?.fields.find(f => f.id === fieldId);
        
        if (fieldDef) {
           let label = `${fieldDef.label}: ${value}`;
           if (key.endsWith('_min')) label = `${fieldDef.label} Min: ${value}`;
           if (key.endsWith('_max')) label = `${fieldDef.label} Max: ${value}`;
           
           filters.push({
             id: key,
             label: label,
             onRemove: () => updateParam(key, null)
           });
        }
      }
    });

    return filters;
  }, [searchParams, currentCategory, currentSubCategory, selectedWilayaData, communeName]);


  // --- Client-side Filtering Logic ---
  const filteredListings = MOCK_LISTINGS.filter(l => {
    // 1. Basic Filters
    if (categoryId && l.category !== categoryId) return false;
    
    // Strict subcategory check for Import Auto to avoid mixing
    if (isImportAuto && l.subCategory !== 'import_auto') return false;
    if (subCategoryId && l.subCategory !== subCategoryId && !isImportAuto) {
         // If subcategory is selected, enforce it (unless it's a general search)
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

    // 2. Dynamic Specs Filter
    if (currentSubCategory?.fields) {
        for (const field of currentSubCategory.fields) {
            const val = searchParams.get(`spec_${field.id}`);
            const min = searchParams.get(`spec_${field.id}_min`);
            const max = searchParams.get(`spec_${field.id}_max`);

            // If no filter set for this field, skip
            if (!val && !min && !max) continue;

            // Get value from listing specs (Try Label first "Kilométrage", then ID "mileage")
            const itemSpecValue = l.specs?.[field.label] || l.specs?.[field.id];
            
            // If item doesn't have this spec but filter is active, exclude it
            if (!itemSpecValue) return false; 

            // Handle Numerical Ranges (Year, Mileage, etc.)
            if (field.type === 'number' || field.id === 'year') {
                // Clean the string: "85 000 km" -> "85000"
                const cleanValue = itemSpecValue.toString().replace(/\s/g, '').replace(/[^0-9.]/g, '');
                const numVal = parseFloat(cleanValue);
                
                if (isNaN(numVal)) continue;

                if (min && numVal < parseFloat(min)) return false;
                if (max && numVal > parseFloat(max)) return false;
            } else {
                // Handle Exact/Partial Match (Brand, Fuel, Transmission)
                if (val && !itemSpecValue.toString().toLowerCase().includes(val.toLowerCase())) return false;
            }
        }
    }

    return true;
  });

  // --- FILTERS CONTENT COMPONENT (REUSABLE) ---
  const FiltersContent = () => (
    <div className="space-y-1 overflow-y-auto flex-1 p-4 md:p-0 md:pr-2 no-scrollbar">
        {/* 1. Category Filter Accordion */}
        <FilterSection 
            title="Catégorie" 
            icon={Icons.Tag}
            isOpen={expandedSections.category} 
            onToggle={() => toggleSection('category')}
        >
        <div className="space-y-2">
            {CATEGORIES.map(c => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <input 
                type="checkbox" 
                checked={categoryId === c.id}
                onChange={() => handleCategoryChange(c.id)}
                className="rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                />
                <span className="flex-1">{c.name}</span>
            </label>
            ))}
        </div>

        {/* Sub-Category Filter (Nested) */}
        {currentCategory?.subCategories && (
            <div className="mt-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-2 animate-in fade-in slide-in-from-left-1">
                {currentCategory.subCategories.map(sub => (
                <label key={sub.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    <input 
                    type="radio" 
                    name="subcategory"
                    checked={subCategoryId === sub.id}
                    onChange={() => updateParam('subCategory', sub.id)}
                    className="text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                    />
                    {sub.name}
                </label>
                ))}
            </div>
        )}
        </FilterSection>

        {/* 2. Localisation Accordion */}
        <FilterSection 
            title="Localisation" 
            icon={Icons.MapPin}
            isOpen={expandedSections.location} 
            onToggle={() => toggleSection('location')}
            count={wilayaCode ? 1 : 0}
        >
        <div className="space-y-3">
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

            {/* Commune Filter (Dependent on Wilaya) */}
            {wilayaCode && (
                <div className="animate-in fade-in slide-in-from-left-2">
                        <select 
                        value={communeName || ''}
                        onChange={(e) => updateParam('commune', e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none text-gray-900 dark:text-white transition-colors"
                    >
                        <option value="">Toutes les communes</option>
                        {availableCommunes.map(c => (
                        <option key={c} value={c}>{c}</option>
                        ))}
                        {availableCommunes.length === 0 && <option disabled>Aucune commune listée</option>}
                    </select>
                </div>
            )}
        </div>
        </FilterSection>

        {/* 3. Price Accordion */}
        <FilterSection 
            title="Prix (DZD)" 
            icon={Icons.Wallet}
            isOpen={expandedSections.price} 
            onToggle={() => toggleSection('price')}
        >
        <div className="flex gap-2 items-center">
            <div className="relative w-full">
                <input 
                type="number" 
                placeholder="Min" 
                value={searchParams.get('price_min') || ''}
                onChange={(e) => updateParam('price_min', e.target.value)}
                className="w-full p-2 pl-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white dark:placeholder-gray-500" 
                />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative w-full">
                <input 
                type="number" 
                placeholder="Max" 
                value={searchParams.get('price_max') || ''}
                onChange={(e) => updateParam('price_max', e.target.value)}
                className="w-full p-2 pl-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white dark:placeholder-gray-500" 
                />
            </div>
        </div>
        </FilterSection>

        {/* 4. Dynamic Specs Accordion */}
        {currentSubCategory?.fields && currentSubCategory.fields.length > 0 && (
            <FilterSection 
                title="Caractéristiques" 
                icon={Icons.Settings}
                isOpen={expandedSections.specs} 
                onToggle={() => toggleSection('specs')}
            >
            <div className="space-y-4">
                {currentSubCategory.fields.map(field => (
                    <div key={field.id}>
                        <h3 className="font-medium mb-1.5 text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide">{field.label}</h3>
                        
                        {/* Special Case: Year (Needs Range) */}
                        {field.id === 'year' && field.options ? (
                            <div className="flex gap-2">
                                <select
                                value={searchParams.get(`spec_${field.id}_min`) || ''}
                                onChange={(e) => updateParam(`spec_${field.id}_min`, e.target.value)}
                                className="w-1/2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none appearance-none text-gray-900 dark:text-white"
                                >
                                <option value="">De</option>
                                {[...field.options].reverse().map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                                </select>
                                <select
                                value={searchParams.get(`spec_${field.id}_max`) || ''}
                                onChange={(e) => updateParam(`spec_${field.id}_max`, e.target.value)}
                                className="w-1/2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none appearance-none text-gray-900 dark:text-white"
                                >
                                <option value="">À</option>
                                {field.options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                                </select>
                            </div>
                        ) : (
                            <>
                            {/* Selects & Radios */}
                            {(field.type === 'select' || field.type === 'radio') && (
                                <select 
                                    value={searchParams.get(`spec_${field.id}`) || ''}
                                    onChange={(e) => updateParam(`spec_${field.id}`, e.target.value)}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="">Tout</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}

                            {/* Number Ranges */}
                            {field.type === 'number' && (
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={searchParams.get(`spec_${field.id}_min`) || ''}
                                        onChange={(e) => updateParam(`spec_${field.id}_min`, e.target.value)}
                                        className="w-1/2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white dark:placeholder-gray-500" 
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={searchParams.get(`spec_${field.id}_max`) || ''}
                                        onChange={(e) => updateParam(`spec_${field.id}_max`, e.target.value)}
                                        className="w-1/2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white dark:placeholder-gray-500" 
                                    />
                                </div>
                            )}

                            {/* Text Search */}
                            {field.type === 'text' && (
                                <input 
                                    type="text"
                                    placeholder={`Rechercher...`}
                                    value={searchParams.get(`spec_${field.id}`) || ''}
                                    onChange={(e) => updateParam(`spec_${field.id}`, e.target.value)}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-brand-500 text-gray-900 dark:text-white dark:placeholder-gray-500" 
                                />
                            )}
                            </>
                        )}
                    </div>
                ))}
            </div>
            </FilterSection>
        )}
    </div>
  );

  // --- RENDER V2 (STABILIZED LAYOUT) ---
  if (NAV_V2) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
            {/* Search Header (Sticky) */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 p-4 sticky top-16 z-40 transition-colors duration-300">
                <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button 
                            onClick={toggleSidebar}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${isSidebarOpen ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <Icons.Filter className="w-4 h-4" />
                            Filtres
                            {activeFilters.length > 0 && <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-white text-brand-600 font-bold text-[10px] shadow-sm">{activeFilters.length}</span>}
                        </button>
                        <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
                        {CATEGORIES.slice(0, 4).map(cat => (
                            <button 
                                key={cat.id} 
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-3 py-1.5 border rounded-full text-xs whitespace-nowrap transition-colors ${
                                    categoryId === cat.id 
                                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-400 font-medium' 
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 dark:hover:text-brand-400'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{filteredListings.length} résultats</span>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button 
                                onClick={() => setLayout('grid')} 
                                className={`p-1.5 rounded ${layout === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}
                            >
                                <Icons.Store className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setLayout('list')} 
                                className={`p-1.5 rounded ${layout === 'list' ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}
                            >
                                <Icons.Menu className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Import Auto */}
            {isImportAuto && (
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 text-white">
                    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Icons.Plane className="w-6 h-6" /> Service Importation Véhicules
                            </h2>
                            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
                                Véhicules de moins de 3 ans importés d'Europe et Dubaï. Service sécurisé via nos Boutiques Pro agréées.
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/import-entry?intent=request')}
                            className="bg-white text-indigo-700 dark:text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Icons.PlusCircle className="w-5 h-5" />
                            Importer un véhicule
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT V2 - STABILIZED LAYOUT */}
            <div className="container mx-auto px-4 py-6 flex items-start gap-6 relative">
                
                {/* SIDEBAR V2 */}
                <aside className={`
                    flex-shrink-0 transition-all duration-300
                    ${isSidebarOpen 
                        ? 'fixed inset-0 z-[60] bg-white dark:bg-gray-900 flex flex-col md:sticky md:z-0 md:flex md:w-72 md:top-40 md:h-[calc(100vh-10rem)] md:bg-transparent' 
                        : 'hidden'
                    }
                `}>
                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtres</h2>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => { setSearchParams({}); setIsSidebarOpen(false); }} 
                                className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                Réinitialiser
                            </button>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Content */}
                    <FiltersContent />

                    {/* Mobile Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 md:hidden bg-white dark:bg-gray-900 flex-shrink-0">
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
                    {/* ACTIVE FILTERS BAR */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1 uppercase tracking-wide">Filtres :</span>
                            {activeFilters.map(filter => (
                                <button 
                                    key={filter.id}
                                    onClick={filter.onRemove}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors group"
                                >
                                    {filter.label}
                                    <Icons.X className="w-3 h-3 text-brand-400 dark:text-brand-500 group-hover:text-red-500" />
                                </button>
                            ))}
                            <button 
                                onClick={() => setSearchParams({})} 
                                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline ml-auto pl-2"
                            >
                                Effacer tout
                            </button>
                        </div>
                    )}

                    {/* Map Widget */}
                    {isHolidayRent && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <MapWidget 
                                environment={selectedEnvironment || ''} 
                                wilayaCode={wilayaCode}
                                communeName={communeName}
                                listingCount={filteredListings.length} 
                            />
                        </div>
                    )}

                    {/* Listings */}
                    {filteredListings.length > 0 ? (
                        <div className={`grid gap-4 ${layout === 'grid' ? (isSidebarOpen ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4') : 'grid-cols-1'}`}>
                            {filteredListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} layout={layout} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed transition-colors">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                                <Icons.Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Aucun résultat trouvé</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                                Essayez de modifier vos filtres ou effectuez une nouvelle recherche.
                            </p>
                            <button 
                                onClick={() => setSearchParams({})}
                                className="mt-6 text-brand-600 dark:text-brand-400 font-medium hover:underline"
                            >
                                Effacer tous les filtres
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  }

  // --- RENDER V1 (LEGACY) ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 p-4 sticky top-16 z-40 transition-colors duration-300">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
             <button 
              onClick={toggleSidebar}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${isSidebarOpen ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <Icons.Filter className="w-4 h-4" />
              Filtres
              {activeFilters.length > 0 && <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-white text-brand-600 font-bold text-[10px] shadow-sm">{activeFilters.length}</span>}
            </button>
            <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
            {CATEGORIES.slice(0, 4).map(cat => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 border rounded-full text-xs whitespace-nowrap transition-colors ${
                    categoryId === cat.id 
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-400 font-medium' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 dark:hover:text-brand-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{filteredListings.length} résultats</span>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button 
                onClick={() => setLayout('grid')} 
                className={`p-1.5 rounded ${layout === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}
              >
                <Icons.Store className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setLayout('list')} 
                className={`p-1.5 rounded ${layout === 'list' ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}
              >
                <Icons.Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BLUE SERVICE BANNER (Import Auto Only) --- */}
      {isImportAuto && (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 text-white">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                   <Icons.Plane className="w-6 h-6" /> Service Importation Véhicules
                </h2>
                <p className="text-indigo-100 text-sm mt-1 max-w-xl">
                   Véhicules de moins de 3 ans importés d'Europe et Dubaï. Service sécurisé via nos Boutiques Pro agréées.
                </p>
             </div>
             <button 
               onClick={() => navigate('/import-entry?intent=request')}
               className="bg-white text-indigo-700 dark:text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
             >
                <Icons.PlusCircle className="w-5 h-5" />
                Importer un véhicule
             </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 flex gap-6 relative">
        
        {/* SIDEBAR FILTERS */}
        <aside className={`
            flex-shrink-0 transition-all duration-300
            md:sticky md:top-24 md:h-[calc(100vh-8rem)]
            ${isSidebarOpen 
                ? 'fixed inset-0 z-[60] bg-white dark:bg-gray-900 flex flex-col md:relative md:bg-transparent md:z-0 md:flex md:w-72' 
                : 'hidden'
            }
        `}>
           
           {/* Mobile Sidebar Header (Sticky Top) - Hidden on Desktop */}
           <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtres</h2>
             <div className="flex items-center gap-4">
                 <button 
                    onClick={() => { setSearchParams({}); setIsSidebarOpen(false); }} 
                    className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                 >
                    Réinitialiser
                 </button>
                 <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                   <Icons.X className="w-5 h-5" />
                 </button>
             </div>
           </div>

           <FiltersContent />

           {/* Mobile Footer (Sticky Bottom) */}
           <div className="p-4 border-t border-gray-100 dark:border-gray-800 md:hidden bg-white dark:bg-gray-900 flex-shrink-0">
             <button 
               onClick={() => setIsSidebarOpen(false)}
               className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
             >
               Voir {filteredListings.length} résultats
             </button>
           </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 min-w-0">
            {/* ACTIVE FILTERS BAR */}
            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Filtres actifs :</span>
                {activeFilters.map(filter => (
                  <button 
                    key={filter.id}
                    onClick={filter.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors group"
                  >
                    {filter.label}
                    <Icons.X className="w-3 h-3 text-brand-400 dark:text-brand-500 group-hover:text-red-500" />
                  </button>
                ))}
                <button 
                  onClick={() => setSearchParams({})} 
                  className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline ml-2"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Map Widget (Visible only for Holiday Rent) */}
            {isHolidayRent && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <MapWidget 
                        environment={selectedEnvironment || ''} 
                        wilayaCode={wilayaCode}
                        communeName={communeName}
                        listingCount={filteredListings.length} 
                    />
                </div>
            )}

            {filteredListings.length > 0 ? (
              <div className={`grid gap-4 ${layout === 'grid' ? (isSidebarOpen ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4') : 'grid-cols-1'}`}>
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} layout={layout} />
                ))}
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed transition-colors">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                        <Icons.Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Aucun résultat trouvé</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                        Essayez de modifier vos filtres ou effectuez une nouvelle recherche.
                    </p>
                    <button 
                        onClick={() => setSearchParams({})}
                        className="mt-6 text-brand-600 dark:text-brand-400 font-medium hover:underline"
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