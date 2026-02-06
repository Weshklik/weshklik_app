
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../data';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProPackState } from '../hooks/useProPackState';
import { CurrencySelector } from './CurrencySelector';
import { useCart } from '../context/CartContext'; // NEW

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Cart
  const { cartCount } = useCart();

  // New Hook Usage for Badge
  const { status } = useProPackState();
  const isExpired = status === 'expired';
  const isExpiringSoon = status === 'expiring';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // --- UNIVERSE CONTEXT LOGIC (PREMIUM V3) ---
  const isImportUniverse = location.pathname.includes('import');
  const isProUniverse = location.pathname.includes('pro') || location.pathname.includes('create-store') || location.pathname.includes('store');
  const isPartnerUniverse = location.pathname.includes('partner') || location.pathname.includes('find-partner'); 
  
  // Default: Marketplace
  let contextConfig = {
    label: 'Marketplace',
    subLabel: isAuthenticated ? (user?.type === 'pro' ? 'Compte Professionnel' : 'Compte Particulier') : 'Visiteur',
    icon: Icons.User,
    style: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    tooltip: 'Vous naviguez dans l’espace Marketplace grand public.'
  };

  if (isImportUniverse) {
    // Import Auto - Premium Expert
    const isCertified = user?.type === 'pro' && user.sector === 'auto_vente';
    contextConfig = {
      label: 'Import Auto',
      subLabel: isCertified ? 'Pro certifié' : (user?.type === 'pro' ? 'Compte Pro' : 'Visiteur'),
      icon: Icons.Shield,
      style: 'bg-purple-50 text-purple-700 border-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.15)] dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      tooltip: 'Service réservé aux professionnels certifiés Import Auto.'
    };
  } else if (isProUniverse) {
    // Espace Pro - Premium Business
    contextConfig = {
      label: 'Espace Pro',
      subLabel: user?.type === 'pro' ? 'Compte Professionnel' : (isAuthenticated ? 'Création' : 'Visiteur'),
      icon: Icons.Store,
      style: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      tooltip: 'Vous êtes connecté avec un compte professionnel.'
    };
  } else if (isPartnerUniverse) {
    // Espace Partenaire
    contextConfig = {
      label: 'Service Achat',
      subLabel: 'Mise en relation',
      icon: Icons.Handshake,
      style: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
      tooltip: 'Trouvez un partenaire pour payer vos achats.'
    };
  }

  const ContextIcon = contextConfig.icon;
  
  const microCopy = isImportUniverse ? "Accès sécurisé · Stores certifiés" : null;

  // --- CTA LOGIC (Action Context) ---
  let ctaConfig = {
    label: 'Déposer une annonce',
    icon: Icons.PlusCircle,
    path: '/post',
    style: 'bg-accent-500 hover:bg-accent-600 text-white shadow-accent-500/30' 
  };

  if (isImportUniverse) {
    ctaConfig = {
      label: 'Action Import',
      icon: Icons.Plane,
      path: '/import-entry',
      style: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
    };
  } else if (user?.type === 'pro') {
    ctaConfig = {
      label: 'Déposer une annonce Pro',
      icon: Icons.Briefcase,
      path: '/post',
      style: 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30' 
    };
  } else if (isPartnerUniverse) {
     ctaConfig = {
      label: 'Devenir Partenaire',
      icon: Icons.Handshake,
      path: '/partner-entry',
      style: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30' 
    };
  }

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const toggleCategory = (id: string) => {
    setExpandedCat(expandedCat === id ? null : id);
  };

  const handleSearch = (catId: string, subCatId?: string) => {
    const params = new URLSearchParams();
    if (catId) params.set('category', catId);
    if (subCatId) params.set('subCategory', subCatId);
    navigate(`/search?${params.toString()}`);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/pro-entry');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <button 
              className="md:hidden p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" 
              onClick={() => setIsMenuOpen(true)}
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-1 mr-2">
              <div className="bg-brand-600 text-white p-1 rounded-lg">
                <Icons.Store className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-brand-900 dark:text-white tracking-tight hidden sm:inline">Wesh<span className="text-brand-600">Klik</span></span>
            </Link>
            
            <div 
               className={`lg:hidden flex items-center justify-center w-8 h-8 rounded-full border ${contextConfig.style}`}
               title={contextConfig.label}
            >
               <ContextIcon className="w-4 h-4 opacity-90" />
            </div>

            <div className="hidden lg:flex flex-col items-start justify-center">
              <div 
                title={contextConfig.tooltip}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all cursor-help select-none ${contextConfig.style}`}
              >
                 <ContextIcon className="w-3.5 h-3.5 opacity-80" />
                 <span className="font-bold tracking-tight">{contextConfig.label}</span>
                 <span className="text-[10px] opacity-60">·</span>
                 <span className="font-medium opacity-90">{contextConfig.subLabel}</span>
              </div>
              {microCopy && (
                 <span className="text-[10px] text-purple-600 dark:text-purple-300 font-medium px-2 mt-0.5 animate-in fade-in slide-in-from-top-1 tracking-wide">
                    {microCopy}
                 </span>
              )}
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={isImportUniverse ? "Rechercher un véhicule importé..." : "Que cherchez-vous aujourd'hui ?"}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all outline-none"
              />
              <Icons.Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            
            <div className="hidden md:block">
               <CurrencySelector />
            </div>

            <button 
              onClick={toggleTheme}
              className="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {theme === 'dark' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
            </button>

            {/* --- CART ICON --- */}
            {cartCount > 0 && (
              <Link 
                to="/cart"
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Icons.ShoppingBag className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {cartCount}
                </span>
              </Link>
            )}

            <Link 
              to="/find-partner"
              className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Payer sans carte bancaire"
            >
                <Icons.Handshake className="w-6 h-6" />
                <span className="text-sm font-medium hidden lg:block">Service Achat</span>
            </Link>
            
            {!location.pathname.includes('/pro-dashboard') && (
              <button 
                onClick={handleProNavigation}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-medium border relative ${
                  user?.type === 'pro' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent'
                }`}
              >
                <Icons.Store className="w-5 h-5" />
                <span className="text-sm hidden lg:block">Espace Pro</span>
                {user?.type === 'pro' && (isExpired || isExpiringSoon) && (
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${isExpired ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                )}
              </button>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {user.avatar ? (
                       <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 font-bold">
                         {user.name.charAt(0)}
                       </div>
                    )}
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.type === 'pro' ? 'Compte Pro' : 'Particulier'}</p>
                    </div>
                    <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Mon Compte</Link>
                    <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Mes Messages</Link>
                    
                    <Link to="/partner-dashboard" className="block px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium">Espace Partenaire</Link>

                    {user.type === 'individual' && (
                       <Link to="/create-store" className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold">Devenir Pro</Link>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
               <Link to="/login" className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-brand-600 dark:hover:text-brand-400">
                  <Icons.User className="w-6 h-6" />
                  <span>Se connecter</span>
               </Link>
            )}

            <Link 
              to={ctaConfig.path} 
              className={`${ctaConfig.style} px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-lg`}
            >
              <ctaConfig.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{ctaConfig.label}</span>
              <span className="sm:hidden text-sm">Action</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3 bg-white dark:bg-gray-900">
          <div className="relative">
            <input
              type="text"
              placeholder={isImportUniverse ? "Rechercher un véhicule importé..." : "Que cherchez-vous aujourd'hui ?"}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm text-gray-900 dark:text-white dark:placeholder-gray-400"
            />
            <Icons.Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Truncated) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
            
            <div className="relative w-[85%] max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                        <CurrencySelector />
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            {theme === 'dark' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {/* CART LINK IN DRAWER */}
                    {cartCount > 0 && (
                        <Link to="/cart" className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-700 dark:text-brand-300 font-bold mb-2">
                            <Icons.ShoppingBag className="w-5 h-5" />
                            Mon Panier ({cartCount})
                        </Link>
                    )}

                    <Link to="/find-partner" className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold mb-4">
                        <Icons.Handshake className="w-5 h-5" />
                        Trouver un Partenaire d'Achat
                    </Link>
                    
                    <Link to="/" className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">
                        <Icons.Home className="w-5 h-5" /> Accueil
                    </Link>

                    {/* CATEGORIES GRID FOR MOBILE NAV */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">Catégories</p>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map(cat => {
                                const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => handleSearch(cat.id)}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-2"
                                    >
                                        <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{cat.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
};
