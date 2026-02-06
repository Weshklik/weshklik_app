
import React from 'react';
import { Icons } from './Icons';

interface FeatureLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: 'lock' | 'warning' | 'info';
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const FeatureLockedModal: React.FC<FeatureLockedModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  icon = 'lock',
  primaryAction,
  secondaryAction
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800 text-center">
        
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          icon === 'lock' 
            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
            : icon === 'warning'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        }`}>
          {icon === 'lock' && <Icons.Lock className="w-8 h-8" />}
          {icon === 'warning' && <Icons.AlertCircle className="w-8 h-8" />}
          {icon === 'info' && <Icons.HelpCircle className="w-8 h-8" />}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>

        <div className="space-y-3">
          {primaryAction && (
            <button 
              onClick={primaryAction.onClick}
              className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
            >
              {primaryAction.label}
            </button>
          )}
          
          {secondaryAction ? (
            <button 
              onClick={secondaryAction.onClick}
              className="w-full py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm"
            >
              {secondaryAction.label}
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="w-full py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
