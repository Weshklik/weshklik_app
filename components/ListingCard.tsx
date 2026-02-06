
import React from 'react';
import { Listing } from '../types';
import { Icons } from './Icons';
import { Link } from 'react-router-dom';
import { PriceDisplay } from './PriceDisplay'; // Import new component

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'list';
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, layout = 'grid' }) => {
  const isGrid = layout === 'grid';
  
  // --- CONTEXT LOGIC ---
  const isImport = listing.subCategory === 'import_auto';
  
  // Detect Rental Category
  const isRental = ['car_rental', 'holiday_rent', 'rent'].includes(listing.subCategory || '');

  // --- 1. BADGE LOGIC (Strict Rule: 1 Badge Max) ---
  let badgeLabel = null;
  let badgeColor = null;

  if (listing.isPromoted) {
    badgeLabel = 'Sponsorisé';
    badgeColor = 'bg-black/60 text-white backdrop-blur-sm';
  } else if (isImport) {
    badgeLabel = 'Import Auto';
    badgeColor = 'bg-indigo-600/90 text-white backdrop-blur-sm shadow-sm';
  } else if (isRental) {
    badgeLabel = 'Réservable en ligne';
    badgeColor = 'bg-emerald-600/90 text-white backdrop-blur-sm shadow-sm';
  }

  // --- 2. META DATA EXTRACTION ---
  const specs = listing.specs || {};
  
  // Helpers
  const getSpec = (keys: string[]) => {
    for (const k of keys) {
      if (specs[k]) return specs[k];
    }
    return null;
  };

  const year = getSpec(['Année']);
  const mileage = getSpec(['Kilométrage', 'Kilométrage (km)']);
  const country = getSpec(['Pays de provenance']);
  const fuel = getSpec(['Carburant', 'Énergie']);
  
  const metaParts = [];
  if (country) metaParts.push(`📍 ${country}`);
  if (year) metaParts.push(year);
  if (mileage) metaParts.push(mileage);
  if (!country && fuel) metaParts.push(fuel);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`Bonjour, je suis intéressé par votre annonce "${listing.title}".`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <Link 
      to={`/listing/${listing.id}`} 
      className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex ${isGrid ? 'flex-col' : 'flex-row h-40'}`}
    >
      {/* --- IMAGE SECTION --- */}
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${isGrid ? 'aspect-[4/3] w-full' : 'w-48 shrink-0'}`}>
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {badgeLabel && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${badgeColor} z-10`}>
            {badgeLabel}
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:flex hidden">
           <button 
             onClick={(e) => { e.preventDefault(); /* Favorite logic */ }}
             className="p-2 bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm hover:scale-110 transition-transform"
           >
             <Icons.Heart className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className={`flex flex-col justify-between p-3 ${isGrid ? '' : 'flex-1 py-3 px-4'}`}>
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base leading-snug line-clamp-2 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {listing.title}
          </h3>

          {/* PRICE DISPLAY LOGIC */}
          <div className="mb-2">
             {isRental ? (
                // RENTAL: Use Multi-currency component
                <PriceDisplay 
                   priceDZD={listing.price} 
                   suffix="/ nuit" 
                   layout="column" 
                   size="md"
                   showLabel={false} // Clean card look
                />
             ) : (
                // STANDARD: Simple DZD display (using reusable component in simplified mode if desired, or plain text)
                <span className="font-bold text-brand-700 dark:text-brand-400 text-lg">
                   {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(listing.price)}
                </span>
             )}
          </div>

          {metaParts.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
              {metaParts.join(' · ')}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50 mt-1">
           <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 truncate max-w-[70%]">
              <Icons.MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{listing.location}</span>
              <span>·</span>
              <span className="shrink-0">{listing.date}</span>
           </div>

           <button 
              onClick={handleWhatsAppClick}
              className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 p-1.5 rounded-full transition-colors md:invisible md:group-hover:visible"
              title="WhatsApp"
           >
              <Icons.MessageCircle className="w-4 h-4" />
           </button>
        </div>

      </div>
    </Link>
  );
};
