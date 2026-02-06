
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Icons } from '../components/Icons';
import { formatCurrency } from '../utils/currency';

export const Cart: React.FC = () => {
  const { items, storeName, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <Icons.ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
          Découvrez les boutiques Pro et ajoutez des articles pour commencer.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors"
        >
          Découvrir les offres
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    // STEP 4: Navigate to Checkout with Cart Mode
    navigate('/booking/checkout', { 
        state: { 
            mode: 'cart'
        }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-12 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-30">
        <div className="container mx-auto flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
             <Icons.ArrowLeft className="w-6 h-6" />
           </button>
           <h1 className="text-xl font-bold text-gray-900 dark:text-white">Panier</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Store Context Banner */}
        <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-xl p-4 flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <div className="bg-brand-600 text-white p-2 rounded-lg">
                 <Icons.Store className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wide">Boutique</p>
                 <h2 className="font-bold text-gray-900 dark:text-white">{storeName}</h2>
              </div>
           </div>
           <button 
             onClick={() => {
                if(window.confirm("Voulez-vous vider votre panier ?")) clearCart();
             }}
             className="text-xs text-red-500 font-medium hover:underline"
           >
             Vider
           </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           
           {/* Items List */}
           <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                 <div key={item.listing.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                       <img src={item.listing.image} alt={item.listing.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                       <div>
                          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.listing.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.listing.price, 'DZD')}</p>
                       </div>
                       <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                             <button 
                               onClick={() => updateQuantity(item.listing.id, -1)}
                               className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md shadow-sm text-gray-600 dark:text-gray-300 disabled:opacity-50"
                               disabled={item.quantity <= 1}
                             >
                               -
                             </button>
                             <span className="text-sm font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.listing.id, 1)}
                               className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md shadow-sm text-gray-600 dark:text-gray-300"
                             >
                               +
                             </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.listing.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                             <Icons.Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>

           {/* Summary */}
           <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4">Résumé</h3>
                 
                 <div className="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                       <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(cartTotal, 'DZD')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500 dark:text-gray-400">Livraison</span>
                       <span className="text-green-600 font-medium">À définir</span>
                    </div>
                 </div>

                 <div className="flex justify-between items-end mb-6">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{formatCurrency(cartTotal, 'DZD')}</span>
                 </div>

                 <button 
                   onClick={handleCheckout}
                   className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
                 >
                    Commander
                 </button>
                 
                 <p className="text-[10px] text-gray-400 text-center mt-3">
                    En validant, vous acceptez les CGV de la boutique {storeName}.
                 </p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
