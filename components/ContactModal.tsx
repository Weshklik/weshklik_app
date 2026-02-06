
import React from 'react';
import { Icons } from './Icons';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: User;
  listingTitle: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, seller, listingTitle }) => {
  if (!isOpen) return null;

  const handleWhatsApp = () => {
    // Simulate WhatsApp opening
    const message = encodeURIComponent(`Bonjour, je suis intéressé par votre annonce "${listingTitle}" sur WeshKlik.`);
    // Using a dummy number if seller phone isn't real/available in this mock
    const phone = '213550000000'; 
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contacter {seller.name}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Option A: WhatsApp (Recommended) */}
          <button 
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Icons.MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-green-900 dark:text-green-300">WhatsApp</span>
                <span className="text-xs text-green-700 dark:text-green-400">Réponse rapide recommandée</span>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>

          {/* Option B: Internal Chat */}
          <Link 
            to="/messages" 
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icons.MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-gray-900 dark:text-white">Messagerie WeshKlik</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Sécurisé & interne</span>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          {/* Option C: Phone */}
          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icons.Phone className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-gray-900 dark:text-white">Appeler</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">0550 ** ** ** (Cliquez pour voir)</span>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Icons.Shield className="w-3 h-3" />
            Ne versez jamais d'acompte avant de voir le produit.
          </p>
        </div>
      </div>
    </div>
  );
};
