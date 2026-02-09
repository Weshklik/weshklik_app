
import React, { useState } from 'react';
import { Icons } from './Icons';
import { Listing } from '../types';
import { formatCurrency } from '../utils/currency';

interface ImportQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
}

export const ImportQuoteModal: React.FC<ImportQuoteModalProps> = ({ isOpen, onClose, listing }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    confirmTerms: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Move to Success/Contact step
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Bonjour, je souhaite valider le devis pour l'importation de : ${listing.title} (Réf: ${listing.id}). Mon budget est prêt.`);
    // Use seller phone or fallback
    const phone = '213550000000'; 
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300 border border-gray-100 dark:border-gray-800">
        
        {step === 1 ? (
            <>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Icons.Plane className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Demande d'Import</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={listing.image} className="w-full h-full object-cover" alt="Car" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{listing.title}</h4>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-1">{formatCurrency(listing.price, 'DZD')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hors frais de dossier & carte grise</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="Votre nom"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                        <input 
                            type="tel" 
                            required 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="0550..."
                        />
                    </div>

                    <label className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl cursor-pointer border border-indigo-100 dark:border-indigo-800">
                        <input 
                            type="checkbox" 
                            required
                            checked={formData.confirmTerms}
                            onChange={e => setFormData({...formData, confirmTerms: e.target.checked})}
                            className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-xs text-indigo-800 dark:text-indigo-200">
                            Je comprends qu'il s'agit d'une <strong>demande de devis</strong>. 
                            Le contrat final et le paiement se feront directement avec le partenaire importateur agréé.
                        </span>
                    </label>

                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                    >
                        Envoyer la demande
                        <Icons.ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                </form>
            </>
        ) : (
            <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                    <Icons.CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Demande Reçue !</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
                    Le partenaire <strong>{listing.seller.name}</strong> a reçu votre demande. 
                    <br/>Il vous contactera sur le <strong>{formData.phone}</strong> sous 24h pour établir le contrat d'importation.
                </p>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleWhatsApp}
                        className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                    >
                        <Icons.MessageCircle className="w-5 h-5" />
                        Contacter sur WhatsApp
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-3.5 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
