
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { WILAYAS } from '../data';

export const ImportRequest: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    vehicleType: 'Voiture',
    brand: '',
    model: '',
    yearMin: '2022',
    budgetMax: '',
    wilaya: '',
    description: '',
    originPreference: 'Europe'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Demande Envoyée !</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Votre demande d'importation a été transmise à notre réseau de <strong>Stores Pro Agréés</strong>. Vous recevrez des propositions sous 48h.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors"
                >
                    Retour à l'accueil
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* Header */}
        <div className="mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
                <Icons.ArrowLeft className="w-5 h-5" /> Retour
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Demande d'Importation</h1>
            <p className="text-gray-600 dark:text-gray-300">
                Décrivez le véhicule que vous recherchez. Nos partenaires importateurs agréés vous feront des offres personnalisées.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900 p-4 rounded-xl flex gap-3 text-sm text-indigo-800 dark:text-indigo-200">
                <Icons.Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Service gratuit et sécurisé.</strong> Votre demande est transmise uniquement à des professionnels agréés. Aucun engagement sans validation de votre part.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de véhicule</label>
                    <select 
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    >
                        <option value="Voiture">Voiture de Tourisme</option>
                        <option value="Utilitaire">Utilitaire / Camionnette</option>
                        <option value="Moto">Moto</option>
                        <option value="Camion">Camion / Poids Lourd</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wilaya de livraison</label>
                    <select 
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    >
                        <option value="">Sélectionner...</option>
                        {WILAYAS.map(w => (
                            <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marque</label>
                    <input 
                        type="text" 
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Volkswagen, Audi..." 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modèle</label>
                    <input 
                        type="text" 
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Golf 8, Q3..." 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Année Minimum</label>
                    <select 
                        name="yearMin"
                        value={formData.yearMin}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Max (DZD)</label>
                    <input 
                        type="number" 
                        name="budgetMax"
                        value={formData.budgetMax}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: 5000000" 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Préférence d'Origine</label>
                 <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="originPreference" value="Europe" checked={formData.originPreference === 'Europe'} onChange={handleInputChange} className="text-brand-600 focus:ring-brand-500" />
                        <span className="text-gray-700 dark:text-gray-300">Europe (Allemagne, France...)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="originPreference" value="Dubai" checked={formData.originPreference === 'Dubai'} onChange={handleInputChange} className="text-brand-600 focus:ring-brand-500" />
                        <span className="text-gray-700 dark:text-gray-300">Dubaï / Golfe</span>
                    </label>
                 </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Options souhaitées</label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Ex: Finition R-Line, Toit ouvrant obligatoire, couleur noire..."
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                ></textarea>
            </div>

            <div className="pt-4 flex gap-4">
                <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    className="flex-1 py-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`flex-[2] py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                        isSubmitting
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                        : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/30'
                    }`}
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
