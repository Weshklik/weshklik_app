
import React from 'react';
import { formatCurrency, convertFromDZD } from '../utils/currency';

interface PriceDisplayProps {
  priceDZD: number;
  suffix?: string; // e.g. "/ nuit"
  layout?: 'row' | 'column'; // Inline or stacked
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean; // Show "≈"
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  priceDZD, 
  suffix = '', 
  layout = 'column',
  size = 'md',
  showLabel = true 
}) => {
  
  // 1. Validation défensive
  const validPrice = typeof priceDZD === 'number' && !isNaN(priceDZD) ? priceDZD : 0;

  // 2. Conversion via Service (Aucun calcul local)
  const priceEUR = convertFromDZD(validPrice, 'EUR');
  const priceUSD = convertFromDZD(validPrice, 'USD');

  const mainSizeClass = size === 'xl' ? 'text-3xl' : size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-sm';
  const subSizeClass = size === 'xl' ? 'text-sm' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex ${layout === 'row' ? 'items-baseline gap-2' : 'flex-col items-start'}`}>
      
      {/* 1. MAIN PRICE DZD (Always visible, Always first) */}
      <div className={`font-bold text-gray-900 dark:text-white ${mainSizeClass}`}>
        {formatCurrency(validPrice, 'DZD')}
        {suffix && <span className="text-gray-500 dark:text-gray-400 font-normal text-[0.6em] ml-1">{suffix}</span>}
      </div>

      {/* 2. EQUIVALENTS (Always visible for rental categories) */}
      <div className={`flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium ${subSizeClass}`}>
        <span title="Taux Officiel Bancaire" className="flex items-center gap-1">
          {showLabel && '≈'} {formatCurrency(priceEUR, 'EUR')}
        </span>
        <span className="opacity-50">|</span>
        <span title="Taux Officiel Bancaire" className="flex items-center gap-1">
          {showLabel && '≈'} {formatCurrency(priceUSD, 'USD')}
        </span>
      </div>

    </div>
  );
};
