
import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_LISTINGS, WILAYAS } from '../data';
import { Icons } from '../components/Icons';
import { MapWidget } from '../components/MapWidget';
import { useAuth } from '../context/AuthContext';
import { ContactModal } from '../components/ContactModal';
import { BookingWidget } from '../components/BookingWidget';
import { PriceDisplay } from '../components/PriceDisplay';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { ImportQuoteModal } from '../components/ImportQuoteModal';
import { CartConflictModal, CartSuccessToast } from '../components/CartProtection'; // NEW

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Cart Hooks
  const { addToCart, clearCart, storeName } = useCart();

  const [showPhone, setShowPhone] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Cart UX States
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const listing = MOCK_LISTINGS.find(l => l.id === id);

  if (!listing) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Annonce introuvable</div>;

  // --- UNIVERSE DETECTION ---
  const isImport = listing.subCategory === 'import_auto';
  const isRental = ['holiday_rent', 'rent', 'car_rental'].includes(listing.subCategory || '');
  const isIndividual = listing.seller.type === 'individual';
  // A listing is "Pro Store" if seller is pro AND it's not import AND not rental
  const isProStore = listing.seller.type === 'pro' && !isImport && !isRental;

  const isOwner = user?.id === listing.seller.id;
  
  const wilayaObj = WILAYAS.find(w => w.name === listing.location);
  const wilayaCode = wilayaObj?.code;

  const handleContactAction = (action: 'modal' | 'phone') => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (action === 'modal') {
      setIsContactModalOpen(true);
    } else if (action === 'phone') {
      setShowPhone(true);
    }
  };

  const handleWhatsAppDirect = () => {
     if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const message = encodeURIComponent(`Bonjour, je suis intéressé par votre annonce "${listing.title}" sur WeshKlik.`);
    window.open(`https://wa.me/213550000000?text=${message}`, '_blank');
  };

  // --- CART HANDLER (PRO ONLY) ---
  const handleAddToCart = () => {
      const result = addToCart(listing);
      
      if (result === 'success') {
          // Toast Feedback
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
      } else if (result === 'conflict_store') {
          // Open Custom Modal
          setShowConflictModal(true);
      } else if (result === 'error') {
          // Safeguard fallback
          alert("Action non autorisée pour ce type d'annonce.");
      }
  };

  const handleConfirmSwitchStore = () => {
      clearCart();
      addToCart(listing);
      setShowConflictModal(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // --- WIDGETS ---

  const SellerProfileHeader = () => (
    <Link to={`/store/${listing.seller.id}`} className="flex items-center gap-4 mb-6 group">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100 dark:border-gray-700">
            <img src={`https://ui-avatars.com/api/?name=${listing.seller.name}&background=random`} alt={listing.seller.name} className="w-full h-full object-cover" />
        </div>
        <div>
            <h3 className="font-bold text-lg flex items-center gap-1 text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {listing.seller.name}
                {listing.seller.verified && <Icons.CheckCircle2 className="w-4 h-4 text-brand-500 fill-brand-100" />}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {listing.seller.type === 'pro' ? 'Store Certifié' : 'Particulier'}
            </p>
            <div className="flex items-center gap-1 text-xs mt-1 text-gray-400">
                <Icons.Clock className="w-3 h-3" />
                <span>Répond vite</span>
            </div>
        </div>
    </Link>
  );

  const OwnerActions = () => (
    <div className="space-y-3">
        <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Modifier l'annonce
        </button>
        <button className="w-full border-2 border-brand-600 text-brand-600 dark:text-brand-400 font-bold py-3.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
            Booster la visibilité
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 md:pb-12 transition-colors duration-300">
      
      {/* Toast */}
      <CartSuccessToast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} />

      {/* Mobile Back Header */}
      <div className="md:hidden absolute top-4 left-4 z-10">
        <Link to="/" className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full shadow-sm block text-gray-800 dark:text-white">
           <Icons.ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="container mx-auto md:py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Image Gallery Mock */}
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 md:rounded-2xl overflow-hidden relative">
              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Icons.Smartphone className="w-3 h-3" /> 1/5
              </div>
              
              {/* Import Watermark Overlay */}
              {isImport && (
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Icons.Plane className="w-3 h-3" />
                    Véhicule d'importation
                  </span>
                </div>
              )}
            </div>

            <div className="px-4 md:px-0">
               <div className="flex justify-between items-start mb-2">
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{listing.title}</h1>
                 <button className="text-gray-400 hover:text-red-500"><Icons.Heart className="w-6 h-6" /></button>
               </div>
               
               {/* PRICE SECTION (Dynamic based on Category) */}
               <div className="mb-4">
                 {isRental ? (
                    // RENTAL: Full Multi-Currency Display
                    <PriceDisplay priceDZD={listing.price} suffix="/ nuit" size="xl" layout="column" />
                 ) : (
                    // STANDARD: Simple DZD
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${isImport ? 'text-indigo-600 dark:text-indigo-400' : 'text-brand-600 dark:text-brand-400'}`}>
                        {formatCurrency(listing.price, 'DZD')}
                        </p>
                        {isImport && listing.specs?.['Prix affiché'] && (
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {listing.specs['Prix affiché']}
                        </span>
                        )}
                    </div>
                 )}
               </div>

               <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                 <div className="flex items-center gap-1">
                   <Icons.MapPin className="w-4 h-4" />
                   {listing.location}
                 </div>
                 <div className="flex items-center gap-1">
                   <Icons.CheckCircle2 className="w-4 h-4" />
                   Publié le {listing.date}
                 </div>
                 <div className="flex items-center gap-1">
                   <Icons.Store className="w-4 h-4" />
                   {listing.category}
                 </div>
               </div>

               {/* Import Process Block */}
               {isImport && (
                 <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 mb-8 border border-indigo-100 dark:border-indigo-900">
                    <h3 className="text-indigo-900 dark:text-indigo-200 font-bold mb-4 flex items-center gap-2">
                      <Icons.FileCheck className="w-5 h-5" />
                      Procédure d'acquisition
                    </h3>
                    <div className="space-y-4">
                       {/* Steps... */}
                       <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-indigo-600 font-bold flex items-center justify-center shrink-0">1</div>
                          <div>
                             <p className="font-bold text-sm text-indigo-900 dark:text-indigo-200">Demande de devis</p>
                             <p className="text-xs text-indigo-700 dark:text-indigo-300">Contactez le vendeur pour obtenir le prix final livré.</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-indigo-600 font-bold flex items-center justify-center shrink-0">2</div>
                          <div>
                             <p className="font-bold text-sm text-indigo-900 dark:text-indigo-200">Validation & Contrat</p>
                             <p className="text-xs text-indigo-700 dark:text-indigo-300">Signature du contrat d'importation avec le pro agréé.</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Description</h3>
               <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
                 {listing.description || "Aucune description fournie."}
               </div>

               <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                 <Icons.FileText className="w-5 h-5 text-gray-400" />
                 Caractéristiques techniques
               </h4>
               <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-8">
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                   {listing.specs && Object.entries(listing.specs).map(([k, v]) => (
                     <li key={k} className={`flex justify-between border-b border-gray-200 dark:border-gray-800 py-2 last:border-0 ${k === 'Options & Équipements' ? 'sm:col-span-2 flex-col gap-1 items-start' : ''}`}>
                       <span className="text-gray-500 dark:text-gray-400">{k}</span>
                       <span className={`font-medium text-gray-900 dark:text-white ${k === 'Options & Équipements' ? 'text-left leading-relaxed' : 'text-right'}`}>{v}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                 <Icons.MapPin className="w-5 h-5 text-gray-400" />
                 Localisation
               </h4>
               <MapWidget 
                 wilayaCode={wilayaCode} 
                 communeName={listing.commune} 
                 listingCount={1}
                 price={listing.price}
               />
            </div>
          </div>

          {/* --- RIGHT COLUMN: DYNAMIC ACTION WIDGETS --- */}
          <div className="hidden md:block px-4 md:px-0">
            
            {/* 1. RENTAL FLOW */}
            {isRental && <BookingWidget listing={listing} />}

            {/* 2. INDIVIDUAL FLOW (C2C) */}
            {isIndividual && !isOwner && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                    <SellerProfileHeader />
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleContactAction('phone')}
                            className={`w-full py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${showPhone ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <Icons.Phone className="w-5 h-5" />
                            {showPhone ? '0550 12 34 56' : 'Afficher le numéro'}
                        </button>
                        
                        <button 
                            onClick={handleWhatsAppDirect}
                            className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                        >
                            <Icons.MessageCircle className="w-5 h-5" />
                            Discuter sur WhatsApp
                        </button>

                        <button 
                            onClick={() => handleContactAction('modal')}
                            className="w-full border-2 border-brand-600 text-brand-600 dark:text-brand-400 font-bold py-3.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <Icons.MessageCircle className="w-5 h-5" />
                            Messagerie Interne
                        </button>
                    </div>

                    {/* Partner Upsell for C2C */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-full text-indigo-600 shadow-sm shrink-0">
                                    <Icons.Handshake className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Besoin d'un intermédiaire ?</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2 leading-relaxed">
                                        Passez par un partenaire pour payer en cash ou à la livraison en toute sécurité.
                                    </p>
                                    <Link to="/find-partner" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                        Trouver un partenaire <Icons.ArrowLeft className="w-3 h-3 rotate-180" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 p-2 rounded-lg">
                        <Icons.Shield className="w-3 h-3" />
                        <span>Ne versez jamais d'acompte à l'avance.</span>
                    </div>
                </div>
            )}

            {/* 3. PRO STORE FLOW (Store & Import) */}
            {(isProStore || isImport) && !isOwner && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                    <SellerProfileHeader />
                    
                    <div className="space-y-3">
                        {/* Add to Cart - PRO ONLY */}
                        {isProStore && (
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
                            >
                                <Icons.ShoppingBag className="w-5 h-5" />
                                Ajouter au panier
                            </button>
                        )}

                        {/* IMPORT SPECIFIC CTA */}
                        {isImport && (
                            <button 
                                onClick={() => setIsImportModalOpen(true)}
                                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                            >
                                <Icons.FileText className="w-5 h-5" />
                                Demander un devis
                            </button>
                        )}

                        {/* Fallback Contact - Hidden for Import main action, but kept as secondary if desired, 
                            here effectively "Contacter la boutique" is only for normal stores if we want to force Quote for Import.
                            But user might want to ask questions. Let's keep it but styling can differ.
                        */}
                        {!isImport && (
                            <button 
                                onClick={handleWhatsAppDirect}
                                className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                                    isProStore 
                                    ? 'bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50 dark:bg-gray-900 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900/20' 
                                    : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30'
                                }`}
                            >
                                <Icons.Store className="w-5 h-5" />
                                Contacter la boutique
                            </button>
                        )}
                        
                        <button 
                            onClick={() => handleContactAction('phone')}
                            className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Icons.Phone className="w-5 h-5" />
                            Appeler
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <Icons.Award className="w-5 h-5 text-brand-500" />
                            <span>Garantie vendeur professionnel</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <Icons.FileText className="w-5 h-5 text-brand-500" />
                            <span>Facture fournie</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. OWNER VIEW */}
            {isOwner && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                    <SellerProfileHeader />
                    <OwnerActions />
                </div>
            )}

          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-6 md:hidden z-[60] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center gap-3">
          
          {isRental ? (
             // MOBILE RENTAL CTA
             <button 
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg"
             >
                Réserver {formatCurrency(listing.price, 'DZD')}
             </button>
          ) : (
             // MOBILE STANDARD CTA
             <>
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                        <img src={`https://ui-avatars.com/api/?name=${listing.seller.name}&background=random`} alt={listing.seller.name} className="w-full h-full object-cover" />
                    </div>
                </div>
                
                <button 
                    onClick={() => handleContactAction('phone')}
                    className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                >
                    <Icons.Phone className="w-5 h-5" />
                </button>
                
                {isIndividual ? (
                    <button 
                        onClick={handleWhatsAppDirect}
                        className="flex-1 bg-green-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 active:scale-95 transition-transform"
                    >
                        <Icons.MessageCircle className="w-5 h-5" />
                        Discuter
                    </button>
                ) : (
                    // PRO Actions Mobile
                    <>
                        {isImport ? (
                            <button 
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex-1 bg-indigo-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform"
                            >
                                <Icons.FileText className="w-5 h-5" />
                                Demander Devis
                            </button>
                        ) : isProStore ? (
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-brand-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 active:scale-95 transition-transform"
                            >
                                <Icons.ShoppingBag className="w-5 h-5" />
                                Ajouter au panier
                            </button>
                        ) : (
                            <button 
                                onClick={handleWhatsAppDirect}
                                className="flex-1 bg-brand-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 active:scale-95 transition-transform"
                            >
                                <Icons.Store className="w-5 h-5" />
                                Contacter Store
                            </button>
                        )}
                    </>
                )}
             </>
          )}
        </div>
      )}

      {/* Cart Protection Modals */}
      <CartConflictModal 
        isOpen={showConflictModal} 
        onClose={() => setShowConflictModal(false)}
        onConfirm={handleConfirmSwitchStore}
        currentStoreName={storeName}
        newStoreName={listing.seller.name}
      />

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        seller={listing.seller}
        listingTitle={listing.title}
      />

      {/* Import Quote Modal */}
      <ImportQuoteModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        listing={listing}
      />
    </div>
  );
};
