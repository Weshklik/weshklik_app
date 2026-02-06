
import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Icons } from './Icons';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
        <Icons.Globe className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{currency}</span>
        <Icons.ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
        <div className="p-2 space-y-1">
          {['DZD', 'EUR', 'USD'].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c as any)}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between ${
                currency === c 
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>{c}</span>
              {currency === c && <Icons.Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-center">
           <p className="text-[9px] text-gray-400 leading-tight">Taux Officiel<br/>Bancaire</p>
        </div>
      </div>
    </div>
  );
};
