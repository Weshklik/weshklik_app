
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_STORES, MOCK_LISTINGS, MOCK_REVIEWS } from '../data';
import { ListingCard } from '../components/ListingCard';
import { Icons } from '../components/Icons';
import { StoreProfile as IStoreProfile } from '../types';

export const StoreProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');
  
  // Fetch store data, fallback to generic if not found (for individual users in this mock)
  const store: IStoreProfile = MOCK_STORES[id || ''] || {
    id: id || 'unknown',
    name: 'Utilisateur WeshKlik',
    type: 'individual',
    verified: false,
    avatar: `https://ui-avatars.com/api/?name=User&background=random`,
    cover: 'https://picsum.photos/seed/cover_generic/1200/400',
    bio: 'Membre de la communauté WeshKlik.',
    location: 'Algérie',
    rating: 0,
    reviewCount: 0,
    responseRate: '-',
    responseTime: '-',
    memberSince: '2024',
    badges: [],
    phone: '',
    openingHours: undefined
  };

  const storeListings = MOCK_LISTINGS.filter(l => l.seller.id === id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
      {/* Cover Image */}
      <div className="h-32 md:h-64 w-full bg-gray-300 dark:bg-gray-800 relative">
        <img src={store.cover} alt="Cover" className="w-full h-full object-cover" />
        <Link to="/" className="absolute top-4 left-4 p-2 bg-white/30 backdrop-blur rounded-full text-white hover:bg-white/50 transition-colors">
          <Icons.ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="absolute top-4 right-4 flex gap-2">
           <button className="p-2 bg-white/30 backdrop-blur rounded-full text-white hover:bg-white/50">
             <Icons.Share2 className="w-5 h-5" />
           </button>
           <button className="p-2 bg-white/30 backdrop-blur rounded-full text-white hover:bg-white/50">
             <Icons.Flag className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 md:p-6 pb-2 transition-colors">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 -mt-12 md:-mt-16">
              <img src={store.avatar} alt={store.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     {store.name}
                     {store.verified && <Icons.CheckCircle2 className="w-5 h-5 text-brand-500 fill-brand-100" />}
                   </h1>
                   <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                     <Icons.MapPin className="w-4 h-4" />
                     {store.location}
                     <span className="mx-1">•</span>
                     <span>Membre depuis {store.memberSince}</span>
                   </div>
                   
                   <button 
                     onClick={() => setActiveTab('reviews')}
                     className="flex items-center gap-1 mt-2 group hover:bg-gray-50 dark:hover:bg-gray-800 p-1 -ml-1 rounded transition-colors"
                   >
                     <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                         <Icons.Star key={i} className={`w-4 h-4 ${i < Math.round(store.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                       ))}
                     </div>
                     <span className="font-bold text-gray-900 dark:text-white ml-1">{store.rating > 0 ? store.rating : 'Nouveau'}</span>
                     <span className="text-gray-400 dark:text-gray-500 text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">({store.reviewCount} avis)</span>
                   </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  {store.phone && (
                    <button className="flex-1 md:flex-none bg-brand-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-700">
                      <Icons.Phone className="w-4 h-4" />
                      <span className="md:hidden">Appeler</span>
                      <span className="hidden md:inline">Voir numéro</span>
                    </button>
                  )}
                  <button className="flex-1 md:flex-none bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-100 dark:hover:bg-brand-900/30">
                    <Icons.MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="text-center md:text-left">
                  <span className="block text-lg font-bold text-gray-900 dark:text-white">{storeListings.length}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Annonces</span>
                </div>
                <div className="text-center md:text-left border-l border-gray-100 dark:border-gray-800 pl-4 md:border-none md:pl-0">
                  <span className="block text-lg font-bold text-gray-900 dark:text-white">{store.responseRate}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Taux de réponse</span>
                </div>
                <div className="text-center md:text-left border-l border-gray-100 dark:border-gray-800 pl-4 md:border-none md:pl-0">
                  <span className="block text-lg font-bold text-gray-900 dark:text-white">{store.responseTime}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Temps de réponse</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mt-6 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('listings')}
              className={`pb-3 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === 'listings' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              Annonces ({storeListings.length})
              {activeTab === 'listings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === 'reviews' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              Avis clients ({store.reviewCount})
              {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-3 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === 'about' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              À propos
              {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'listings' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {storeListings.length > 0 ? (
              storeListings.map(l => <ListingCard key={l.id} listing={l} />)
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 border-dashed">
                <Icons.Store className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p>Aucune annonce active pour le moment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl space-y-4">
             {MOCK_REVIEWS.map(review => (
               <div key={review.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                       {review.author.charAt(0)}
                     </div>
                     <span className="font-semibold text-gray-900 dark:text-white">{review.author}</span>
                   </div>
                   <span className="text-xs text-gray-400 dark:text-gray-500">{review.date}</span>
                 </div>
                 <div className="flex text-yellow-400 mb-2">
                   {[...Array(5)].map((_, i) => (
                     <Icons.Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                   ))}
                 </div>
                 <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-3xl">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Présentation</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {store.bio}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icons.Award className="w-5 h-5 text-accent-500" />
                  Badges & Vérifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {store.verified && <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium border border-green-100 dark:border-green-800">Identité vérifiée</span>}
                  {store.badges.map(b => (
                    <span key={b} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800">{b}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icons.Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  Horaires d'ouverture
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {store.openingHours || "Non spécifié"}
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2 flex items-center gap-2">
                   <Icons.Map className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                   Localisation
                </h4>
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                   Map Placeholder ({store.location})
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
