
import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { Icons } from './Icons';

interface QuickEditModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSave: (updatedListing: Listing) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({ isOpen, listing, onClose, onSave }) => {
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState('');

  // Sync state when listing changes
  useEffect(() => {
      if(listing) {
          setPrice(listing.price);
          setTitle(listing.title);
      }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const handleSave = () => {
      onSave({ ...listing, price, title });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
       <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 dark:border-gray-800 scale-100 animate-in zoom-in-95">
           <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                   <Icons.FileText className="w-5 h-5 text-indigo-600" />
                   Modification Rapide
               </h3>
               <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                   <Icons.X className="w-5 h-5" />
               </button>
           </div>
           
           <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Titre</label>
                   <input 
                     type="text" 
                     value={title} 
                     onChange={e => setTitle(e.target.value)}
                     className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium"
                   />
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Prix (DZD)</label>
                   <input 
                     type="number" 
                     value={price} 
                     onChange={e => setPrice(Number(e.target.value))}
                     className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-bold font-mono text-lg"
                   />
               </div>
           </div>

           <div className="flex gap-3 mt-8">
               <button onClick={onClose} className="flex-1 py-3 text-gray-600 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                   Annuler
               </button>
               <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                   Enregistrer
               </button>
           </div>
       </div>
    </div>
  );
};
