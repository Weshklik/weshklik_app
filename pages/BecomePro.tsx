
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { WILAYAS, PRO_SECTORS } from '../data';
import { useAuth } from '../context/AuthContext';

export const BecomePro: React.FC = () => {
  const navigate = useNavigate();
  const { upgradeToPro } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    sector: '',
    categories: [] as string[],
    phone: '',
    wilaya: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectorSelect = (sectorId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      sector: sectorId, 
      categories: [] // Reset categories when sector changes
    }));
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(catId);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== catId) };
      } else {
        if (prev.categories.length >= 5) return prev; // Max 5 limit
        return { ...prev, categories: [...prev.categories, catId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sector || formData.categories.length === 0) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    upgradeToPro(formData);
    setIsSubmitting(false);
    navigate('/pro-dashboard');
  };

  const currentSector = PRO_SECTORS.find(s => s.id === formData.sector);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
             <Icons.ArrowLeft className="w-5 h-5" /> Retour
           </button>
           <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <div className="bg-indigo-600 text-white p-1 rounded">
               <Icons.Store className="w-4 h-4" />
             </div>
             WeshKlik Pro
           </span>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lancez votre Store</h1>
           <p className="text-gray-600 dark:text-gray-400">
             Transformez votre compte en <span className="font-bold text-indigo-600 dark:text-indigo-400">Compte Pro</span> gratuitement pendant 30 jours.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 space-y-5">
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Store <span className="text-red-500">*</span></label>
             <div className="relative">
               <input 
                 type="text" 
                 name="storeName"
                 value={formData.storeName}
                 onChange={handleInputChange}
                 required
                 placeholder="Ex: Top Affaires DZ"
                 className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all"
               />
               <Icons.Store className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
             </div>
           </div>

           {/* SECTOR & CATEGORIES SELECTION (Mini version) */}
           <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Secteur d'activité <span className="text-red-500">*</span></label>
                 
                 {!formData.sector ? (
                   // Sector Selection (Grid)
                   <div className="grid grid-cols-3 gap-2">
                     {PRO_SECTORS.map((sector) => {
                       const Icon = Icons[sector.icon as keyof typeof Icons] || Icons.Store;
                       return (
                         <button
                           key={sector.id}
                           type="button"
                           onClick={() => handleSectorSelect(sector.id)}
                           className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-center gap-1 group"
                         >
                            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                            <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 leading-tight">{sector.label}</span>
                         </button>
                       );
                     })}
                   </div>
                 ) : (
                   // Selected Sector View & Categories
                   <div className="space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                         <div className="flex items-center gap-2">
                            {(() => {
                               const Icon = Icons[currentSector?.icon as keyof typeof Icons] || Icons.Store;
                               return <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
                            })()}
                            <span className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">{currentSector?.label}</span>
                         </div>
                         <button type="button" onClick={() => setFormData(prev => ({ ...prev, sector: '', categories: [] }))} className="text-xs text-indigo-600 dark:text-indigo-400 underline">Modifier</button>
                      </div>

                      <div>
                         <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Activités (Max 5)</label>
                         <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                            {currentSector?.categories.map(cat => {
                               const isSelected = formData.categories.includes(cat.id);
                               return (
                                 <button
                                   key={cat.id}
                                   type="button"
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
                         {formData.categories.length === 0 && <p className="text-xs text-red-500 mt-2">Au moins une activité requise.</p>}
                      </div>
                   </div>
                 )}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone Pro <span className="text-red-500">*</span></label>
             <div className="relative">
               <input 
                 type="tel" 
                 name="phone"
                 value={formData.phone}
                 onChange={handleInputChange}
                 required
                 placeholder="0550 12 34 56"
                 className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all"
               />
               <Icons.Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wilaya <span className="text-red-500">*</span></label>
             <div className="relative">
               <select 
                 name="wilaya"
                 value={formData.wilaya}
                 onChange={handleInputChange}
                 required
                 className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all appearance-none"
               >
                 <option value="">Sélectionner...</option>
                 {WILAYAS.map(w => (
                   <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                 ))}
               </select>
               <Icons.MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
               <Icons.ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-4 pointer-events-none" />
             </div>
           </div>

           <div className="pt-2 flex gap-4">
             <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="flex-1 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
             >
                Annuler
             </button>
             <button 
                type="submit"
                disabled={isSubmitting || !formData.sector || formData.categories.length === 0}
                className={`flex-[2] py-3.5 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || !formData.sector || formData.categories.length === 0
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 active:scale-[0.98]'
                }`}
             >
                {isSubmitting ? 'Création...' : 'Créer mon Store'}
                {!isSubmitting && <Icons.ArrowLeft className="w-4 h-4 rotate-180" />}
             </button>
           </div>
           
           <p className="text-xs text-center text-gray-500 dark:text-gray-400">
               En créant un store, vous acceptez les <span className="underline">CGU Pro</span>.
           </p>

        </form>
      </main>
    </div>
  );
};
