
import React, { useState } from 'react';
import { Icons } from './Icons';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => void;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, targetName }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit(reason, description);
    setReason('');
    setDescription('');
    onClose();
  };

  const reasons = [
    "Partenaire injoignable",
    "Demande d'acompte suspecte",
    "Comportement inapproprié",
    "Non-respect du tarif affiché",
    "Arnaque / Fraude",
    "Autre"
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
        
        <div className="flex items-center gap-3 mb-6 text-red-600 dark:text-red-500">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <Icons.Flag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Signaler {targetName}</h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Votre signalement est anonyme et sera traité par notre équipe de modération.
        </p>

        <div className="space-y-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motif</label>
                <select 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                >
                    <option value="">Sélectionner un motif...</option>
                    {reasons.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Détails (Optionnel)</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white resize-none"
                    placeholder="Décrivez la situation..."
                />
            </div>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={onClose}
                className="flex-1 py-3 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
                Annuler
            </button>
            <button 
                onClick={handleSubmit}
                disabled={!reason}
                className={`flex-1 py-3 rounded-xl text-white font-bold transition-all shadow-lg ${
                    reason 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
            >
                Signaler
            </button>
        </div>

      </div>
    </div>
  );
};
