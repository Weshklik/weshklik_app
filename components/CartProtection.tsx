
import React from 'react';
import { Icons } from './Icons';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStoreName: string | null;
  newStoreName: string;
}

export const CartConflictModal: React.FC<ConflictModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentStoreName, 
  newStoreName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
        
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
           <Icons.Store className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
           Une boutique à la fois
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
           Votre panier contient déjà des articles de <strong>{currentStoreName}</strong>.
           <br/><br/>
           Pour commander chez <strong>{newStoreName}</strong>, vous devez commencer un nouveau panier (l'actuel sera vidé).
        </p>

        <div className="space-y-3">
           <button 
             onClick={onConfirm}
             className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
           >
             Démarrer un nouveau panier
           </button>
           
           <button 
             onClick={onClose}
             className="w-full py-2.5 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
           >
             Annuler
           </button>
        </div>

      </div>
    </div>
  );
};

interface CartSuccessToastProps {
  show: boolean;
  onClose: () => void;
}

export const CartSuccessToast: React.FC<CartSuccessToastProps> = ({ show, onClose }) => {
    if (!show) return null;
    
    return (
        <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right duration-300">
            <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900 rounded-xl shadow-xl p-4 flex items-center gap-3 pr-8">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full">
                    <Icons.Check className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Ajouté au panier !</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Continuez vos achats ou commandez.</p>
                </div>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Icons.X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
