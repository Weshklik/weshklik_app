
import React, { useState, useEffect } from 'react';
import { CATEGORIES, MOCK_LISTINGS, MOCK_STORES } from '../data';
import { Icons } from '../components/Icons';
import { ListingCard } from '../components/ListingCard';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- CONFIGURATION ---
const ENABLE_MOBILE_CATEGORIES_IN_HEADER = true; 
const ENABLE_WESHKLIK_VALUE_BLOCKS = false; 

// --- DATA: HERO SLIDES (VACATION & RENTALS THEME) ---
const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542052680-7291a270e542?auto=format&fit=crop&q=80&w=1600", // Sahara
    title: "L'Appel du Sud",
    subtitle: "4x4, Bivouacs et Séjours inoubliables au cœur du Sahara.",
    badge: "Saison Saharienne",
    cta: "Explorer le Sud",
    path: "/search?category=auto&subCategory=rent&spec_environment=Sud+%2F+Sahara+(Désert)",
    align: "center"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1600", // Mediterranean
    title: "Vacances pieds dans l'eau",
    subtitle: "Villas et appartements vue mer : Oran, Béjaïa, Jijel, Annaba.",
    badge: "Été 2024",
    cta: "Réserver",
    path: "/search?category=real_estate&subCategory=holiday_rent&spec_environment=Mer+%2F+Plage+(Littoral)",
    align: "left"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1620942240269-6604d7c67c59?auto=format&fit=crop&q=80&w=1600", // Delivery
    title: "Livraison 58 Wilayas",
    subtitle: "Achetez et vendez partout en Algérie. Paiement à la livraison sécurisé.",
    badge: "Service Pro",
    cta: "Voir les partenaires",
    path: "/find-partner",
    align: "left"
  }
];

// --- DATA: ADVERTISING BLOCKS ---
const ADS_DATA = {
  delivery: {
    id: 'ad_delivery',
    title: "Livraison Express & Sécurisée",
    subtitle: "Expédiez vos colis ou recevez vos achats dans les 58 Wilayas.",
    cta: "Trouver un livreur",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=1200", 
    color: "from-slate-900 to-gray-800",
    icon: <Icons.Truck className="w-4 h-4" />,
    path: "/find-partner"
  },
  diaspora: {
    id: 'ad_diaspora',
    title: "Diaspora ? Payez en € et $",
    subtitle: "Réservez une voiture ou un appartement depuis l'étranger.",
    cta: "Offres Devises",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1200", 
    color: "from-emerald-800 to-teal-900",
    icon: <Icons.Globe className="w-4 h-4" />,
    path: "/search?currency=EUR"
  },
  pro: {
    id: 'ad_pro',
    title: "Espace Pro Automobile",
    subtitle: "Importateurs et Concessionnaires : Digitalisez votre stock.",
    cta: "Créer mon Store",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200", 
    color: "from-blue-900 to-indigo-900",
    icon: <Icons.Store className="w-4 h-4" />,
    path: "/create-store"
  }
};

// --- COMPONENT: AD BANNER (Compact Version) ---
const AdBanner = ({ data, className }: { data: typeof ADS_DATA['delivery'], className?: string }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(data.path)}
      className={`relative rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 group cursor-pointer my-4 ${className} h-[140px] md:h-[160px]`}
    >
      <div className="absolute inset-0">
        <img src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
        <div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-95 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white border border-white/20 mb-1.5 backdrop-blur-md uppercase tracking-wider">
            {data.icon}
            Sponsorisé
          </span>
          <h3 className="text-lg md:text-xl font-extrabold text-white mb-1 leading-tight">{data.title}</h3>
          <p className="text-white/80 text-xs font-medium leading-relaxed max-w-md line-clamp-2 md:line-clamp-none">{data.subtitle}</p>
        </div>
        <button className="bg-white text-gray-900 px-3 py-1.5 rounded-lg font-bold text-[10px] md:text-xs hover:bg-gray-100 transition-all shadow-xl active:scale-95 whitespace-nowrap flex items-center gap-1 group-hover:shadow-white/20 mt-auto md:mt-0">
          {data.cta} <Icons.ArrowLeft className="w-3 h-3 rotate-180 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT: HERO CAROUSEL (Reduced Height) ---
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden rounded-b-3xl md:rounded-3xl shadow-xl bg-gray-900">
      {HERO_SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className={`absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col ${slide.align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
             <span className="bg-accent-500 text-white text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block shadow-lg border border-white/20">
               {slide.badge}
             </span>
             <h1 className="text-xl md:text-3xl font-extrabold text-white mb-1 leading-tight max-w-xl drop-shadow-lg">
               {slide.title}
             </h1>
             <p className="text-gray-200 text-[10px] md:text-sm mb-4 max-w-lg drop-shadow-md line-clamp-1 md:line-clamp-none opacity-90">
               {slide.subtitle}
             </p>
             <button 
               onClick={() => navigate(slide.path)}
               className="bg-white text-brand-900 px-4 py-2 rounded-lg font-bold text-[10px] md:text-xs hover:bg-gray-100 transition-all shadow-xl active:scale-95 flex items-center gap-1.5"
             >
               {slide.cta} <Icons.ArrowLeft className="w-3 h-3 rotate-180" />
             </button>
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/40 w-1.5 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const featuredStores = ['u1', 'u4', 'u7', 'u2'];

  const handleProAction = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/pro-entry');
  };

  // --- UNIVERSE SELECTION LOGIC ---
  // If user is Pro in 'auto_vente' sector, Highlight Import.
  // Else if user is Pro, highlight Pro.
  // Else Highlight Marketplace.
  const isPro = user?.type === 'pro';
  const isImportPro = isPro && user?.sector === 'auto_vente';
  
  const activeUniverse = isImportPro ? 'import' : (isPro ? 'pro' : 'marketplace');

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
  const UNIVERSE_CARDS = [
    {
      id: 'marketplace',
      title: 'Marketplace',
      subtitle: 'Particulier',
      action: 'Accéder aux annonces',
      icon: Icons.ShoppingBag,
      path: '/search',
      isActive: activeUniverse === 'marketplace',
      activeColor: 'border-brand-500 ring-4 ring-brand-500/10 bg-brand-50/50 dark:bg-brand-900/10',
      iconColor: 'text-brand-600',
      baseBg: 'bg-white dark:bg-gray-800'
    },
    {
      id: 'pro',
      title: 'Espace Pro',
      subtitle: 'Professionnel',
      action: 'Gérer mon Store',
      icon: Icons.Store,
      path: '/pro-entry',
      isActive: activeUniverse === 'pro',
      activeColor: 'border-indigo-500 ring-4 ring-indigo-500/10 bg-indigo-50/50 dark:bg-indigo-900/10',
      iconColor: 'text-indigo-600',
      baseBg: 'bg-white dark:bg-gray-800'
    },
    {
      id: 'import',
      title: 'Import Auto',
      subtitle: 'Service',
      action: 'Voir les offres',
      icon: Icons.Plane,
      path: '/import',
      isActive: activeUniverse === 'import',
      activeColor: 'border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/50 dark:bg-blue-900/10',
      iconColor: 'text-blue-600',
      baseBg: 'bg-white dark:bg-gray-800'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* 1. HERO SECTION & UNIVERSE SELECTOR */}
      <div className="bg-white dark:bg-gray-900 pb-20 md:pb-24 transition-colors duration-300 relative">
        <div className="container mx-auto px-0 md:px-4 pt-0 md:pt-4 relative z-10">
           <HeroCarousel />
        </div>
        
        {/* 1.5 UNIVERSE SELECTOR (Overlapping) */}
        <div className="container mx-auto px-4 absolute left-0 right-0 -bottom-28 md:-bottom-16 z-20">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl p-4 md:p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                        Choisissez votre univers
                    </h2>
                    {isAuthenticated && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Connecté en tant que <strong className="text-gray-900 dark:text-white capitalize">{isImportPro ? 'Expert Import' : (isPro ? 'Professionnel' : 'Particulier')}</strong>
                        </span>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {UNIVERSE_CARDS.map(card => (
                        <Link 
                            to={card.path} 
                            key={card.id} 
                            className={`
                                group relative rounded-xl p-3 md:p-4 border transition-all duration-200 flex items-center justify-between
                                ${card.isActive ? card.activeColor : `border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${card.baseBg}`}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 ${card.iconColor} shadow-sm group-hover:scale-105 transition-transform`}>
                                    <card.icon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-bold text-sm md:text-base ${card.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {card.title}
                                        </h3>
                                        {card.isActive && (
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                        {card.action}
                                    </p>
                                </div>
                            </div>
                            
                            {card.isActive && (
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-2 py-0.5 rounded">
                                    Actif
                                </span>
                            )}
                            {!card.isActive && <Icons.ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Spacer for overlapping content - Reduced for tighter layout */}
      <div className="h-36 md:h-24"></div>

      {/* 2. CATEGORY SHORTCUTS */}
      <div className={`bg-white dark:bg-gray-900 py-3 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 sticky top-16 z-30 shadow-sm/50 ${!ENABLE_MOBILE_CATEGORIES_IN_HEADER ? 'hidden md:block' : ''}`}>
        <div className="container mx-auto px-4">
            <div className="flex md:flex-row md:justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {CATEGORIES.map((cat) => {
                    const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
                    return (
                    <Link to={`/search?category=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-1.5 min-w-[64px] group cursor-pointer">
                        <div className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                            bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                            border border-gray-100 dark:border-gray-700
                            group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-200
                            dark:group-hover:bg-brand-900/20 dark:group-hover:text-brand-400 dark:group-hover:border-brand-800
                            transition-all duration-300 shadow-sm group-active:scale-95
                        `}>
                            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.75} />
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-gray-600 dark:text-gray-400 text-center truncate w-full group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {cat.name}
                        </span>
                    </Link>
                    );
                })}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-6">
        
        {/* 3. FEATURED LISTINGS */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.Star className="w-4 h-4 text-accent-500 fill-accent-500" />
              Annonces à la une
            </h2>
            <Link to="/search?filter=featured" className="text-brand-600 dark:text-brand-400 text-xs md:text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <Icons.ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {MOCK_LISTINGS.filter(l => l.isPromoted).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* --- AD BLOCK 1 --- */}
        <AdBanner data={ADS_DATA.diaspora} />

        {/* 4. VEHICLES SECTION */}
        {(() => {
            const listings = MOCK_LISTINGS.filter(l => l.category === 'auto').slice(0, 4);
            if (listings.length === 0) return null;
            return (
            <section>
                <div className="flex items-center justify-between mb-3">
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                        <Icons.Car className="w-4 h-4" />
                    </div>
                    Véhicules & Location
                </h2>
                <Link to="/search?category=auto" className="text-brand-600 dark:text-brand-400 text-xs md:text-sm font-medium hover:underline flex items-center gap-1">
                    Voir tout <Icons.ChevronRight className="w-3 h-3" />
                </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                </div>
            </section>
            );
        })()}

        {/* --- AD BLOCK 2 --- */}
        <AdBanner data={ADS_DATA.delivery} />

        {/* 5. REAL ESTATE */}
        {(() => {
            const listings = MOCK_LISTINGS.filter(l => l.category === 'real_estate').slice(0, 4);
            if (listings.length === 0) return null;
            return (
            <section>
                <div className="flex items-center justify-between mb-3">
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600 dark:text-emerald-400">
                        <Icons.Home className="w-4 h-4" />
                    </div>
                    Vacances & Immobilier
                </h2>
                <Link to="/search?category=real_estate" className="text-brand-600 dark:text-brand-400 text-xs md:text-sm font-medium hover:underline flex items-center gap-1">
                    Voir tout <Icons.ChevronRight className="w-3 h-3" />
                </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                </div>
            </section>
            );
        })()}

        {/* --- AD BLOCK 3 --- */}
        <AdBanner data={ADS_DATA.pro} />

        {/* 7. OFFICIAL STORES SECTION */}
        <section className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg mt-8">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold mb-1">Stores Officiels</h2>
              <p className="text-gray-400 text-xs">Découvrez les meilleures offres des professionnels</p>
            </div>
            <button onClick={handleProAction} className="text-white text-sm font-medium hover:underline">Voir tout</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            {featuredStores.map((id) => {
              const store = MOCK_STORES[id];
              return (
                <Link to={`/store/${id}`} key={id} className="bg-gray-800 dark:bg-gray-900 p-3 rounded-xl flex flex-col items-center text-center hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center text-gray-900 font-bold overflow-hidden bg-white">
                    <img src={store?.avatar} alt={store?.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-xs truncate w-full">{store?.name || 'Store'}</h3>
                  <span className="text-[10px] text-gray-400 mt-0.5">Pro certifié</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
