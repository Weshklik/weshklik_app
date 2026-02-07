
import React from 'react';
import { CATEGORIES, MOCK_LISTINGS, MOCK_STORES } from '../data';
import { Icons } from '../components/Icons';
import { ListingCard } from '../components/ListingCard';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- FEATURE FLAGS ---
const ENABLE_UNIVERSE_CARDS_V2 = true;
const ENABLE_UNIVERSE_COLOR_REFACTOR = true;
const ENABLE_HOME_CATEGORIES_SECTIONS = true;
const ENABLE_CENTERED_CATEGORY_MENU = true;
const ENABLE_CATEGORY_MENU_AB_TEST = true; // Metadata flag for tracking
const ENABLE_MOBILE_CATEGORIES_IN_HEADER = false; // false = Hidden on Mobile Home, accessible via Hamburger only
const ENABLE_WESHKLIK_VALUE_BLOCKS = true; // Marketing Value Blocks
const ENABLE_WESHKLIK_ADS = true; // Advertising Banners

// --- ADVERTISING DATA ---
const ADS_DATA = {
  top: {
    id: 'ad_top',
    title: "Livraison Express 58 Wilayas",
    subtitle: "Profitez de -20% sur votre première expédition avec notre partenaire logistique.",
    cta: "Voir l'offre",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    color: "from-slate-900 to-blue-900"
  },
  middle: {
    id: 'ad_middle',
    title: "Assurance Auto Tous Risques",
    subtitle: "Protégez votre nouveau véhicule dès l'achat. Devis gratuit en 2 minutes.",
    cta: "Simuler mon tarif",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    color: "from-emerald-900 to-teal-900"
  }
};

// --- AD COMPONENT ---
const AdBanner = ({ data, className }: { data: typeof ADS_DATA['top'], className?: string }) => {
  if (!ENABLE_WESHKLIK_ADS) return null;
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group cursor-pointer ${className}`}>
      <div className="absolute inset-0">
        <img src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
        <div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-90 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/20 mb-3 backdrop-blur-md uppercase tracking-wider">
            <Icons.Megaphone className="w-3 h-3" />
            Sponsorisé
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{data.title}</h3>
          <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">{data.subtitle}</p>
        </div>
        <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95 whitespace-nowrap flex items-center gap-2">
          {data.cta} <Icons.ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Select top stores from mock data
  const featuredStores = ['u1', 'u4', 'u7', 'u2'];

  // Universal handler for all Pro Intent actions
  const handleProAction = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/pro-entry');
  };

  // Universal handler for Import Intent - Discovery First
  const handleImportAction = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/import');
  };

  // --- V2 HELPERS ---
  const getProCardState = () => {
    if (!isAuthenticated) return { theme: 'neutral', label: 'Espace Pro', cta: 'Découvrir', badge: 'Pro' };
    if (user?.type === 'pro') return { theme: 'green', label: 'Espace Pro', cta: 'Mon Dashboard', badge: 'Actif' };
    return { theme: 'blue', label: 'Espace Pro', cta: 'Ouvrir mon Store', badge: 'Passer Pro' };
  };

  const getImportCardState = () => {
    if (isAuthenticated && user?.type === 'pro' && user?.sector === 'auto_vente') {
        return { theme: 'green', label: 'Import Auto', cta: 'Gérer mes imports', badge: 'Certifié' };
    }
    if (isAuthenticated) {
        return { theme: 'blue', label: 'Import Auto', cta: 'Voir les offres', badge: 'Nouveau' };
    }
    return { theme: 'neutral', label: 'Import Auto', cta: 'Découvrir', badge: 'Nouveau' };
  };

  const getMarketplaceState = () => {
      // Legacy Behavior (V2.0)
      if (!ENABLE_UNIVERSE_COLOR_REFACTOR) {
          if (isAuthenticated && user?.type === 'individual') return { theme: 'green', label: 'Marketplace', cta: 'Accéder aux annonces', badge: 'Connecté' };
          return { theme: 'blue', label: 'Marketplace', cta: 'Accéder aux annonces', badge: null };
      }

      // New Refactor Behavior (V2.1)
      if (isAuthenticated) {
          return { theme: 'blue', label: 'Marketplace', cta: 'Accéder aux annonces', badge: 'Connecté' };
      }
      return { theme: 'neutral', label: 'Marketplace', cta: 'Découvrir', badge: null };
  };

  // Legacy Styles
  const THEME_STYLES_LEGACY: Record<string, string> = {
      green: 'border-[#16A34A] bg-[#16A34A]/5 hover:bg-[#16A34A]/10 text-[#16A34A]',
      blue: 'border-[#2563EB] bg-[#2563EB]/5 hover:bg-[#2563EB]/10 text-[#2563EB]',
      violet: 'border-[#7C3AED] bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10 text-[#7C3AED]',
      neutral: 'border-gray-200 bg-white hover:border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
  };

  const ICON_STYLES_LEGACY: Record<string, string> = {
      green: 'text-[#16A34A] bg-white dark:bg-gray-900',
      blue: 'text-[#2563EB] bg-white dark:bg-gray-900',
      violet: 'text-[#7C3AED] bg-white dark:bg-gray-900',
      neutral: 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
  };

  // New Refactor Styles
  const THEME_STYLES_REFACTOR: Record<string, string> = {
      green: 'bg-[#F0FDF4] border-[#16A34A] text-[#16A34A] dark:bg-[#052E16] dark:border-[#16A34A] dark:text-[#E5E7EB] hover:shadow-md hover:shadow-green-900/10 transition-all duration-200',
      blue: 'bg-[#F9FAFB] border-[#DBEAFE] text-[#111827] dark:bg-[#111827] dark:border-[#1D4ED8] dark:text-[#E5E7EB] hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-all duration-200',
      violet: 'bg-[#FAF5FF] border-[#7C3AED] text-[#7C3AED] dark:bg-[#2E1065] dark:border-[#7C3AED] dark:text-[#E5E7EB] hover:shadow-md hover:shadow-purple-900/10 transition-all duration-200',
      neutral: 'bg-white border-[#E5E7EB] text-gray-900 dark:bg-[#0F172A] dark:border-[#1F2933] dark:text-[#E5E7EB] hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200'
  };

  const ICON_STYLES_REFACTOR: Record<string, string> = {
      green: 'text-[#16A34A] bg-white dark:bg-[#064E3B] dark:text-[#4ADE80] shadow-sm',
      blue: 'text-[#2563EB] bg-white dark:bg-[#1E3A8A] dark:text-[#60A5FA] shadow-sm',
      violet: 'text-[#7C3AED] bg-white dark:bg-[#4C1D95] dark:text-[#A78BFA] shadow-sm',
      neutral: 'text-[#9CA3AF] bg-gray-50 dark:bg-[#1E293B] dark:text-[#9CA3AF]'
  };

  const THEME_STYLES = ENABLE_UNIVERSE_COLOR_REFACTOR ? THEME_STYLES_REFACTOR : THEME_STYLES_LEGACY;
  const ICON_STYLES = ENABLE_UNIVERSE_COLOR_REFACTOR ? ICON_STYLES_REFACTOR : ICON_STYLES_LEGACY;

  // --- VALUE BLOCKS DATA ---
  const VALUE_BLOCKS = [
    {
      id: 'delivery',
      title: 'Achetez et vendez en toute sérénité.',
      text: 'La livraison est assurée partout en Algérie grâce aux partenaires WeshKlik.',
      bullets: ['Partenaires vérifiés', 'Livraison sécurisée', 'Suivi transparent'],
      image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800', // Delivery box/person
      cta: null
    },
    {
      id: 'diaspora',
      title: 'Achetez depuis l’étranger, simplement.',
      text: 'Paiement en devise autorisé pour la diaspora et les visiteurs étrangers.',
      bullets: ['Carte bancaire internationale', 'Location voitures & vacances', 'Réservation à distance'],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800', // Travel/Passport/Cards
      cta: null
    },
    {
      id: 'import',
      title: 'Importez votre véhicule en toute confiance.',
      text: 'Des professionnels certifiés depuis l’Europe pour des véhicules récents et contrôlés.',
      bullets: ['Import Europe', 'Pros agréés', 'Zéro surprise'],
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800', // Luxury car
      cta: 'Découvrir l\'import'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* 3 Main Modules "Watertight" Selector - PREMIUM DESIGN */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Choisissez votre univers</h2>
          </div>
          
          {ENABLE_UNIVERSE_CARDS_V2 ? (
            /* --- V2 RENDER (COMPACT & STRICT COLORS) --- */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. MARKETPLACE V2 */}
                {(() => {
                    const state = getMarketplaceState();
                    return (
                        <Link 
                            to="/search" 
                            className={`group relative h-[150px] p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between ${THEME_STYLES[state.theme]} ${!ENABLE_UNIVERSE_COLOR_REFACTOR ? 'hover:-translate-y-1 hover:shadow-lg' : 'hover:-translate-y-0.5'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${ICON_STYLES[state.theme]}`}>
                                        <Icons.ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">{state.label}</h3>
                                </div>
                                <Icons.ArrowLeft className={`w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1 ${state.theme === 'neutral' ? 'text-gray-400' : 'text-current'}`} />
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <span className={`text-sm font-semibold underline decoration-2 underline-offset-4 ${state.theme === 'neutral' ? 'text-gray-600 dark:text-gray-300' : 'text-current'}`}>
                                    {state.cta}
                                </span>
                                {state.badge && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-current/20`}>
                                        {state.badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })()}

                {/* 2. ESPACE PRO V2 */}
                {(() => {
                    const state = getProCardState();
                    return (
                        <div 
                            onClick={handleProAction}
                            className={`group relative h-[150px] p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between ${THEME_STYLES[state.theme]} ${!ENABLE_UNIVERSE_COLOR_REFACTOR ? 'hover:-translate-y-1 hover:shadow-lg' : 'hover:-translate-y-0.5'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${ICON_STYLES[state.theme]}`}>
                                        <Icons.Store className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">{state.label}</h3>
                                </div>
                                <Icons.ArrowLeft className={`w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1 ${state.theme === 'neutral' ? 'text-gray-400' : 'text-current'}`} />
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <span className={`text-sm font-semibold underline decoration-2 underline-offset-4 ${state.theme === 'neutral' ? 'text-gray-600 dark:text-gray-300' : 'text-current'}`}>
                                    {state.cta}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-current/20`}>
                                    {state.badge}
                                </span>
                            </div>
                        </div>
                    );
                })()}

                {/* 3. IMPORT AUTO V2 */}
                {(() => {
                    const state = getImportCardState();
                    return (
                        <div 
                            onClick={handleImportAction}
                            className={`group relative h-[150px] p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between ${THEME_STYLES[state.theme]} ${!ENABLE_UNIVERSE_COLOR_REFACTOR ? 'hover:-translate-y-1 hover:shadow-lg' : 'hover:-translate-y-0.5'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${ICON_STYLES[state.theme]}`}>
                                        <Icons.Plane className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">{state.label}</h3>
                                </div>
                                <Icons.ArrowLeft className={`w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1 ${state.theme === 'neutral' ? 'text-gray-400' : 'text-current'}`} />
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <span className={`text-sm font-semibold underline decoration-2 underline-offset-4 ${state.theme === 'neutral' ? 'text-gray-600 dark:text-gray-300' : 'text-current'}`}>
                                    {state.cta}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-current/20`}>
                                    {state.badge}
                                </span>
                            </div>
                        </div>
                    );
                })()}

            </div>
          ) : (
            /* --- V1 RENDER (LEGACY FALLBACK) --- */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. MARKETPLACE */}
                <Link to="/search" className="group relative overflow-hidden rounded-3xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-blue-900/10"></div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <Icons.ShoppingBag className="w-6 h-6" />
                        </div>
                        {isAuthenticated && user?.type === 'individual' && (
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide">Connecté</span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Marketplace</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                        Achetez et vendez entre particuliers et professionnels en toute simplicité.
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2">
                        {['Immobilier', 'Véhicules', 'Tech', 'Maison'].map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                </Link>

                {/* 2. ESPACE PRO */}
                <div className="group relative overflow-hidden rounded-3xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-slate-800/30"></div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform duration-300">
                            <Icons.Store className="w-6 h-6" />
                        </div>
                        {isAuthenticated && user?.type === 'pro' && (
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">Connecté</span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Espace Pro</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                        Digitalisez votre commerce, gérez vos annonces et touchez plus de clients.
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                            <Icons.Award className="w-4 h-4 fill-current" />
                            Stores Certifiés
                        </div>
                        <button 
                            onClick={handleProAction}
                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            {user?.type === 'pro' ? 'Mon Tableau de Bord' : 'Ouvrir mon Store'}
                        </button>
                    </div>
                </div>
                </div>

                {/* 3. IMPORT AUTO */}
                <button 
                onClick={handleImportAction}
                className="group relative overflow-hidden rounded-3xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col"
                >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-indigo-900/10"></div>
                
                {!(isAuthenticated && user?.type === 'pro' && user?.sector === 'auto_vente') && (
                    <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm">
                            NOUVEAU
                        </div>
                    </div>
                )}

                <div className="relative z-10 flex flex-col h-full w-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                            <Icons.Plane className="w-6 h-6" />
                        </div>
                        {isAuthenticated && user?.type === 'pro' && user?.sector === 'auto_vente' && (
                            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wide mr-8">Partenaire</span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Import Auto</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                        Véhicules de moins de 3 ans importés d'Europe et Dubaï par des pros agréés.
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                            🇩🇪 Allemagne
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                            🇫🇷 France
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                            🇦🇪 Dubaï
                        </span>
                    </div>
                </div>
                </button>

            </div>
          )}
        </div>
      </div>

      {/* Categories Scroller - AB TEST MENU CENTRÉ */}
      <div className={`bg-white dark:bg-gray-900 py-4 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 ${!ENABLE_MOBILE_CATEGORIES_IN_HEADER ? 'hidden md:block' : ''}`}>
        <div className="container mx-auto px-4">
          
          {ENABLE_CENTERED_CATEGORY_MENU ? (
            /* --- VARIANT B: CENTERED & NORMALIZED --- */
            <div className="flex md:flex-row md:justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {CATEGORIES.map((cat) => {
                    const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
                    return (
                    <Link to={`/search?category=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-2 min-w-[72px] group cursor-pointer">
                        <div className={`
                            w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center 
                            bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                            border border-gray-100 dark:border-gray-700
                            group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-200
                            dark:group-hover:bg-brand-900/20 dark:group-hover:text-brand-400 dark:group-hover:border-brand-800
                            transition-all duration-300 shadow-sm group-active:scale-95
                        `}>
                            <Icon className="w-6 h-6" strokeWidth={1.75} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center truncate w-full group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {cat.name}
                        </span>
                    </Link>
                    );
                })}
            </div>
          ) : (
            /* --- VARIANT A: LEFT ALIGNED & COLORED (LEGACY) --- */
            <div className="flex md:grid md:grid-cols-8 gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {CATEGORIES.map((cat) => {
                const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
                return (
                    <Link to={`/search?category=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-2 min-w-[72px] group cursor-pointer">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${cat.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-sm dark:bg-opacity-10 dark:text-opacity-90`}>
                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full group-hover:text-brand-600 dark:group-hover:text-brand-400">{cat.name}</span>
                    </Link>
                );
                })}
            </div>
          )}

        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Banner Pub / Hero */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-800 dark:to-brand-950 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 max-w-lg">
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded mb-3 inline-block">MOMENT GAGNANT</span>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">Vendez plus vite, achetez malin.</h1>
            <p className="text-brand-100 mb-6 text-sm md:text-base">Rejoignez la plus grande communauté marketplace d'Algérie. Boostez vos annonces dès maintenant.</p>
            <div className="flex gap-3">
              <Link to="/post" className="bg-white text-brand-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md">
                Déposer une annonce
              </Link>
              <Link to="/search" className="bg-brand-700 bg-opacity-40 border border-brand-400 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-700 transition-colors">
                Explorer
              </Link>
            </div>
          </div>
        </div>

        {/* --- AD BANNER: TOP --- */}
        <AdBanner data={ADS_DATA.top} />

        {/* Featured Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.Star className="w-5 h-5 text-accent-500 fill-accent-500" />
              Annonces à la une
            </h2>
            <Link to="/search?filter=featured" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <Icons.ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {MOCK_LISTINGS.filter(l => l.isPromoted).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* --- WHY WESHKLIK BLOCKS (V3 ADDITION) --- */}
        {ENABLE_WESHKLIK_VALUE_BLOCKS && (
          <section className="space-y-16 py-8">
            {VALUE_BLOCKS.map((block) => (
              <div key={block.id} className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
                {/* Text Side (Bottom on Mobile, Left on Desktop) */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {block.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {block.text}
                  </p>
                  <ul className="space-y-3 pt-2">
                    {block.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 p-1 rounded-full">
                          <Icons.Check className="w-4 h-4" strokeWidth={3} />
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {block.cta && (
                    <div className="pt-4">
                      <button 
                        onClick={block.id === 'import' ? handleImportAction : undefined}
                        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold hover:underline"
                      >
                        {block.cta} <Icons.ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Image Side (Top on Mobile, Right on Desktop) */}
                <div className="w-full md:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                    <img 
                      src={block.image} 
                      alt={block.title} 
                      className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* --- AD BANNER: MIDDLE (IN-FEED) --- */}
        <AdBanner data={ADS_DATA.middle} />

        {/* Recent Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Dernières annonces</h2>
            <Link to="/search" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <Icons.ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {MOCK_LISTINGS.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* --- STRUCTURED CATEGORY SECTIONS (V3 Feature) --- */}
        {ENABLE_HOME_CATEGORIES_SECTIONS && (
          <>
            {/* 1. Vehicles */}
            {(() => {
              const listings = MOCK_LISTINGS.filter(l => l.category === 'auto').slice(0, 4);
              if (listings.length === 0) return null;
              return (
                <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Icons.Car className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      Véhicules
                    </h2>
                    <Link to="/search?category=auto" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline flex items-center gap-1">
                      Voir tout <Icons.ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </section>
              );
            })()}

            {/* 2. Real Estate */}
            {(() => {
              const listings = MOCK_LISTINGS.filter(l => l.category === 'real_estate').slice(0, 4);
              if (listings.length === 0) return null;
              return (
                <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Icons.Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      Immobilier
                    </h2>
                    <Link to="/search?category=real_estate" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline flex items-center gap-1">
                      Voir tout <Icons.ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </section>
              );
            })()}

            {/* 3. Tech */}
            {(() => {
              const listings = MOCK_LISTINGS.filter(l => l.category === 'electronics').slice(0, 4);
              if (listings.length === 0) return null;
              return (
                <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Icons.Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      High-Tech
                    </h2>
                    <Link to="/search?category=electronics" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline flex items-center gap-1">
                      Voir tout <Icons.ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </section>
              );
            })()}
          </>
        )}

        {/* Stores Pro Section */}
        <section className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg mt-12">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-1">Stores Officiels</h2>
              <p className="text-gray-400 text-xs md:text-sm">Découvrez les meilleures offres des professionnels</p>
            </div>
            {/* View All also leads to /pro-entry for now to keep the "Pro Universe" consistent, or strictly lists stores via search if discovery is intended. 
                However, sticking to strict "Pro Entry" logic for consistency as per prompt. */}
            <button onClick={handleProAction} className="text-white text-sm font-medium hover:underline">Voir tout</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {featuredStores.map((id) => {
              const store = MOCK_STORES[id];
              return (
                <Link to={`/store/${id}`} key={id} className="bg-gray-800 dark:bg-gray-900 p-4 rounded-xl flex flex-col items-center text-center hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700 dark:border-gray-800">
                  <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-gray-900 font-bold overflow-hidden bg-white">
                    <img src={store?.avatar} alt={store?.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-sm truncate w-full">{store?.name || 'Store'}</h3>
                  <span className="text-xs text-gray-400 mt-1">Pro certifié</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
