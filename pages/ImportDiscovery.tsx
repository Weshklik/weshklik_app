
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LISTINGS } from '../data';
import { ListingCard } from '../components/ListingCard';
import { Icons } from '../components/Icons';

export const ImportDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const importListings = MOCK_LISTINGS.filter(l => l.subCategory === 'import_auto');
  
  // Simple Client Side Filters for Discovery
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    yearMin: '',
    yearMax: '',
    mileageMin: '',
    mileageMax: '',
    fuel: '',
    transmission: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filtered = importListings.filter(l => {
    // 1. Origin Filter
    if (selectedOrigin !== 'all' && l.specs?.['Pays de provenance'] !== selectedOrigin) return false;

    // 2. Year Filter
    const year = parseInt(l.specs?.['Année'] || '0');
    if (filters.yearMin && year < parseInt(filters.yearMin)) return false;
    if (filters.yearMax && year > parseInt(filters.yearMax)) return false;

    // 3. Mileage Filter (Clean '0 km' -> 0)
    const mileageStr = l.specs?.['Kilométrage']?.replace(/[^0-9]/g, '') || '0';
    const mileage = parseInt(mileageStr);
    if (filters.mileageMin && mileage < parseInt(filters.mileageMin)) return false;
    if (filters.mileageMax && mileage > parseInt(filters.mileageMax)) return false;

    // 4. Fuel Filter
    if (filters.fuel && l.specs?.['Carburant'] !== filters.fuel) return false;

    // 5. Transmission Filter
    if (filters.transmission && l.specs?.['Boite'] !== filters.transmission) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white pt-10 pb-20 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-indigo-200 text-xs md:text-sm font-medium mb-6 border border-white/10">
              <Icons.Plane className="w-4 h-4" />
              Service Import Auto
           </div>
           <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
             Véhicules d'importation <br/>
             <span className="text-indigo-400">Certifiés & Garantis</span>
           </h1>
           <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
             Découvrez une sélection exclusive de véhicules de moins de 3 ans, importés d'Europe et de Dubaï par nos Stores Pro agréés.
           </p>
           
           <div className="flex flex-col sm:flex-row items-start justify-center gap-6 sm:gap-8">
              <div className="flex flex-col items-center w-full sm:w-auto">
                <button 
                  onClick={() => navigate('/import-entry?intent=request')}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Icons.PlusCircle className="w-5 h-5" />
                  Importer un véhicule
                </button>
                <p className="text-xs text-indigo-200 mt-3 max-w-[200px] text-center leading-snug opacity-80">
                  Vous ne trouvez pas le véhicule idéal ? Nos experts s’en chargent pour vous.
                </p>
              </div>

              <div className="flex flex-col items-center w-full sm:w-auto">
                <button 
                  onClick={() => navigate('/import-entry?intent=publish')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur flex items-center justify-center gap-2"
                >
                  <Icons.Store className="w-5 h-5" />
                  Publier une offre Import
                </button>
                <p className="text-xs text-indigo-200 mt-3 max-w-[200px] text-center leading-snug opacity-80">
                  Réservé aux professionnels de l’import automobile.
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* Discovery Content */}
      <div className="container mx-auto px-4 py-8 -mt-12 relative z-10">
         
         {/* Trust Badges */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                <Icons.Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Stores professionnels agréés</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                <Icons.CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Véhicules de moins de 3 ans</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                <Icons.FileCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Dossier import & conformité inclus</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                <Icons.Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Accompagnement jusqu’à l’immatriculation</span>
            </div>
         </div>

         {/* Filters Section */}
         <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Offres Disponibles</h2>
                
                {/* Advanced Filter Toggle */}
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${showAdvancedFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
                >
                  <Icons.Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtres avancés</span>
                </button>
            </div>

            {/* Origins Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => setSelectedOrigin('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${selectedOrigin === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:dark:bg-gray-700'}`}>Tout voir</button>
                <button onClick={() => setSelectedOrigin('Allemagne')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${selectedOrigin === 'Allemagne' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:dark:bg-gray-700'}`}>🇩🇪 Allemagne</button>
                <button onClick={() => setSelectedOrigin('France')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${selectedOrigin === 'France' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:dark:bg-gray-700'}`}>🇫🇷 France</button>
                <button onClick={() => setSelectedOrigin('Dubaï (EAU)')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${selectedOrigin === 'Dubaï (EAU)' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:dark:bg-gray-700'}`}>🇦🇪 Dubaï</button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
                    {/* Year Range */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Année</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.yearMin}
                                onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                            />
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={filters.yearMax}
                                onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Mileage Range */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Kilométrage</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.mileageMin}
                                onChange={(e) => handleFilterChange('mileageMin', e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                            />
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={filters.mileageMax}
                                onChange={(e) => handleFilterChange('mileageMax', e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Fuel */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Carburant</label>
                        <select 
                            value={filters.fuel}
                            onChange={(e) => handleFilterChange('fuel', e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                        >
                            <option value="">Tout</option>
                            <option value="Essence">Essence</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hybride">Hybride</option>
                            <option value="Électrique">Électrique</option>
                        </select>
                    </div>

                    {/* Transmission */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Boîte</label>
                        <select 
                            value={filters.transmission}
                            onChange={(e) => handleFilterChange('transmission', e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                        >
                            <option value="">Toutes</option>
                            <option value="Automatique">Automatique</option>
                            <option value="Manuelle">Manuelle</option>
                        </select>
                    </div>
                </div>
            )}
         </div>

         {/* Listings Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(listing => (
               <ListingCard key={listing.id} listing={listing} />
            ))}
         </div>
         
         {filtered.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 transition-colors">
               <Icons.Plane className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
               <p className="text-gray-500 dark:text-gray-400">Aucune offre disponible pour ce filtre actuellement.</p>
               <button onClick={() => navigate('/import-entry?intent=request')} className="mt-4 text-indigo-600 font-bold hover:underline">Faire une demande spécifique</button>
            </div>
         )}
      </div>
    </div>
  );
};
