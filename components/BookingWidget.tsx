
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Listing, BookingBreakdown } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { calculateBookingPrice } from '../utils/pricing';
import { formatCurrency } from '../utils/currency';
import { useNavigate } from 'react-router-dom';
import { PriceDisplay } from './PriceDisplay';

interface BookingWidgetProps {
  listing: Listing;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ listing }) => {
  const { currency } = useCurrency();
  const navigate = useNavigate();
  
  // State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [breakdown, setBreakdown] = useState<BookingBreakdown | null>(null);
  
  // Mock options if not present (Simulation)
  const rentalOptions = listing.rentalConfig?.options || [
    { id: 'cleaning', label: 'Ménage fin de séjour', priceDZD: 3000, type: 'fixed' as const },
    { id: 'baby_seat', label: 'Siège Bébé', priceDZD: 500, type: 'per_day' as const }
  ];
  
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Effect: Recalculate price when inputs change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end > start) {
        const result = calculateBookingPrice(listing, start, end, selectedOptions, currency);
        setBreakdown(result);
      } else {
        setBreakdown(null);
      }
    }
  }, [startDate, endDate, selectedOptions, currency, listing]);

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBooking = () => {
    if (!breakdown) return;
    navigate('/booking/checkout', { 
      state: { 
        breakdown,
        listing,
        startDate,
        endDate
      } 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
      
      {/* HEADER: Systematic Multi-Currency Display */}
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <PriceDisplay priceDZD={listing.price} suffix="/ nuit" size="xl" />
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Arrivée</label>
          <input 
            type="date" 
            className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white font-medium"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Départ</label>
          <input 
            type="date" 
            className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white font-medium"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Options */}
      {rentalOptions.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase">Options & Services</p>
          {rentalOptions.map(opt => (
            <label key={opt.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedOptions.includes(opt.id)}
                  onChange={() => toggleOption(opt.id)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
              </div>
              <span className="text-xs font-medium text-gray-500">
                +{opt.priceDZD} DA {opt.type === 'per_day' ? '/j' : ''}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Live Breakdown */}
      {breakdown && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-2 animate-in slide-in-from-top-2">
           <div className="flex justify-between text-sm">
             <span className="text-gray-600 dark:text-gray-400">
               {formatCurrency(listing.price, 'DZD')} x {breakdown.duration} nuits
             </span>
             <span className="font-medium text-gray-900 dark:text-white">
               {formatCurrency(breakdown.basePriceDZD, 'DZD')}
             </span>
           </div>
           
           {breakdown.optionsPriceDZD > 0 && (
             <div className="flex justify-between text-sm">
               <span className="text-gray-600 dark:text-gray-400">Options</span>
               <span className="font-medium text-gray-900 dark:text-white">
                 {formatCurrency(breakdown.optionsPriceDZD, 'DZD')}
               </span>
             </div>
           )}

           <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between items-center">
             <span className="font-bold text-gray-900 dark:text-white">Total (DZD)</span>
             <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(breakdown.totalDZD, 'DZD')}
             </span>
           </div>

           {/* Dynamic Currency Payment Preview */}
           {currency !== 'DZD' && (
             <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800 text-center">
                <span className="block text-xs text-indigo-600 dark:text-indigo-300 mb-0.5">Montant à payer ({currency})</span>
                <span className="block text-xl font-extrabold text-indigo-700 dark:text-indigo-200">
                   {formatCurrency(breakdown.totalInCurrency, currency)}
                </span>
                <span className="text-[10px] text-indigo-400 dark:text-indigo-400">
                   Taux Officiel : 1 {currency} = {breakdown.exchangeRate} DZD
                </span>
             </div>
           )}
        </div>
      )}

      <button 
        onClick={handleBooking}
        disabled={!breakdown}
        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${
          !breakdown 
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-95 shadow-brand-500/20'
        }`}
      >
        Réserver
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
        <Icons.Shield className="w-3 h-3" />
        <span>Aucun paiement en ligne. Réglez sur place.</span>
      </p>
    </div>
  );
};
