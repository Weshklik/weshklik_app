
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookingBreakdown, Listing } from '../types';
import { Icons } from '../components/Icons';
import { formatCurrency } from '../utils/currency';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

export const BookingCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, cartTotal, storeName, clearCart } = useCart(); 
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Delivery Form State (For Pro Cart)
  const [deliveryForm, setDeliveryForm] = useState({
      fullName: user?.name || '',
      phone: '',
      address: '',
      wilaya: ''
  });

  // Safe access to state passed from Widget or Cart
  const state = location.state as { 
      mode?: 'cart';
      breakdown?: BookingBreakdown; 
      listing?: Listing; 
      startDate?: string; 
      endDate?: string 
  } | undefined;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
           <p className="mb-4 text-gray-600">Session expirée ou invalide.</p>
           <button onClick={() => navigate('/')} className="text-brand-600 font-bold underline">Retour accueil</button>
        </div>
      </div>
    );
  }

  // --- MODE DETECTION ---
  const isCartMode = state.mode === 'cart';
  const breakdown = state.breakdown;
  const listing = state.listing;

  // --- LOGIC: CART CHECKOUT (PRO) ---
  const handleCartOrder = async () => {
      if (!user) { alert("Veuillez vous connecter."); return; }
      if (!deliveryForm.fullName || !deliveryForm.phone || !deliveryForm.address) {
          alert("Veuillez compléter les informations de livraison.");
          return;
      }

      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate order placement
      
      // Prepare data for Success Page BEFORE clearing cart
      const successData = {
          storeName: storeName || 'Boutique',
          total: cartTotal,
          itemsCount: items.length,
          deliveryInfo: deliveryForm
      };
      
      clearCart(); 
      setIsProcessing(false);
      navigate('/order-success', { state: successData });
  };

  // --- LOGIC: BOOKING CHECKOUT (RENTAL) ---
  const handleBookingPayment = async () => {
      if (!user || !breakdown || !listing) return;
      setIsProcessing(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 1500)); 
          alert("Réservation confirmée ! Le paiement se fera à l'arrivée.");
          navigate('/');
      } catch (error: any) {
          alert(`Erreur: ${error.message}`);
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Icons.ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
           </button>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
               {isCartMode ? 'Finaliser la commande' : 'Confirmation Réservation'}
           </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           
           {/* MAIN CONTENT */}
           <div className="md:col-span-2 space-y-6">
              
              {/* RECAP SECTION */}
              {isCartMode ? (
                  // CART LIST
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Icons.ShoppingBag className="w-5 h-5" /> Articles ({items.length})
                      </h3>
                      <div className="space-y-4">
                          {items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                      <img src={item.listing.image} className="w-full h-full object-cover" alt={item.listing.title} />
                                  </div>
                                  <div>
                                      <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.listing.title}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Qté: {item.quantity}</p>
                                      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{formatCurrency(item.listing.price * item.quantity, 'DZD')}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  // SINGLE LISTING (RENTAL)
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex gap-4">
                     <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        <img src={listing?.image} alt={listing?.title} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{listing?.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{listing?.location}</p>
                        <div className="flex items-center gap-2 text-xs">
                           <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-medium text-gray-700 dark:text-gray-300">
                              {state.startDate}
                           </span>
                           <Icons.ArrowLeft className="w-3 h-3 rotate-180 text-gray-400" />
                           <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-medium text-gray-700 dark:text-gray-300">
                              {state.endDate}
                           </span>
                        </div>
                     </div>
                  </div>
              )}

              {/* DELIVERY FORM (CART ONLY) */}
              {isCartMode && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Icons.MapPin className="w-5 h-5" /> Informations de livraison
                      </h3>
                      <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nom complet</label>
                                  <input 
                                    type="text" 
                                    value={deliveryForm.fullName}
                                    onChange={e => setDeliveryForm({...deliveryForm, fullName: e.target.value})}
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                    placeholder="Votre nom"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Téléphone</label>
                                  <input 
                                    type="tel" 
                                    value={deliveryForm.phone}
                                    onChange={e => setDeliveryForm({...deliveryForm, phone: e.target.value})}
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                    placeholder="0550..."
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Adresse exacte</label>
                              <textarea 
                                value={deliveryForm.address}
                                onChange={e => setDeliveryForm({...deliveryForm, address: e.target.value})}
                                rows={2}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none"
                                placeholder="Cité, Rue, N° Bâtiment..."
                              />
                          </div>
                      </div>
                  </div>
              )}

              {/* PAYMENT SECTION - STRICT CASH ONLY */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icons.Wallet className="w-5 h-5 text-gray-900 dark:text-white" /> Mode de règlement
                 </h3>
                 
                 <div className="space-y-3">
                    
                    {isCartMode ? (
                        /* CART MODE (PRO STORE) */
                        <label className="flex items-center gap-3 p-4 border-2 border-brand-600 bg-brand-50 dark:bg-brand-900/10 rounded-xl cursor-pointer">
                            <div className="flex-1">
                                <span className="font-bold text-gray-900 dark:text-white block">Paiement à la livraison</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Règlement en espèces à la réception du colis.
                                </span>
                            </div>
                            <div className="w-5 h-5 rounded-full border-4 border-brand-600"></div>
                        </label>
                    ) : (
                        /* RENTAL MODE - STRICT 'PAY ON ARRIVAL' */
                        <div className="p-4 border-2 border-brand-600 bg-brand-50 dark:bg-brand-900/10 rounded-xl flex items-start gap-4">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-brand-600 shrink-0">
                                <Icons.Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Paiement à l’arrivée</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                                    Le règlement s’effectue directement sur place.
                                    <br/>
                                    <strong>WeshKlik n’encaisse aucun montant.</strong>
                                </p>
                            </div>
                            <div className="ml-auto mt-1">
                                <div className="w-5 h-5 rounded-full border-4 border-brand-600"></div>
                            </div>
                        </div>
                    )}

                 </div>
              </div>

              {/* ACTION BUTTON */}
              {isCartMode ? (
                  <button 
                    onClick={handleCartOrder}
                    disabled={isProcessing}
                    className={`w-full py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 transition-all active:scale-95 text-lg flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? 'Traitement...' : 'Confirmer la commande'}
                  </button>
              ) : (
                  <button 
                    onClick={handleBookingPayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 transition-all active:scale-95 text-lg"
                  >
                    {isProcessing ? 'Traitement...' : 'Confirmer la réservation'}
                  </button>
              )}

           </div>

           {/* SIDEBAR: SUMMARY */}
           <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4">Total à régler</h3>
                 
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Total</span>
                    <span className="font-bold text-xl text-accent-500 dark:text-white">
                        {formatCurrency(isCartMode ? cartTotal : (breakdown?.totalDZD || 0), 'DZD')}
                    </span>
                 </div>
                 
                 {isCartMode ? (
                     <p className="text-xs text-green-600 font-medium text-right mt-1">
                         + Frais de livraison (Payés à la réception)
                     </p>
                 ) : (
                     <p className="text-xs text-gray-500 text-right mt-1">
                         À régler sur place
                     </p>
                 )}
                 
                 <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                     <p className="text-xs text-gray-400 text-center">
                         En confirmant, vous acceptez les conditions de vente de {isCartMode ? storeName : listing?.seller.name}.
                     </p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
