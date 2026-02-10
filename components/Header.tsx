
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../data';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProPackState } from '../hooks/useProPackState';
import { CurrencySelector } from './CurrencySelector';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Cart
  const { cartCount } = useCart();

  // Pro Badge Logic
  const { status } = useProPackState();
  const isExpired = status === 'expired';
  const isExpiringSoon = status === 'expiring';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // New state for mobile search toggle
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Sync search query with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    } else if (location.pathname !== '/search') {
      setSearchQuery('');
    }
  }, [location.search, location.pathname]);

  // Focus mobile search when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
        mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("La recherche vocale n'est pas supportée par votre navigateur.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'fr-FR'; // Default to French
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setSearchQuery(text);
      setIsListening(false);
      navigate(`/search?q=${encodeURIComponent(text)}`);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- UNIVERSE CONTEXT LOGIC (Reduced to minimal checks) ---
  const isImportUniverse = location.pathname.includes('import');
  const isProUniverse = location.pathname.includes('pro') || location.pathname.includes('create-store') || location.pathname.includes('store');
  
  // --- CTA LOGIC (Action Context) ---
  let ctaConfig = {
    path: '/post',
    colorClass: 'bg-orange-500 hover:bg-orange-600 text-white shadow-brand-500/30'
  };

  if (isImportUniverse) {
    ctaConfig = {
      path: '/import-entry',
      colorClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
    };
  } else if (user?.type === 'pro') {
    ctaConfig = {
      path: '/post',
      colorClass: 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30'
    };
  }

  // --- UNIFIED ACCOUNT HANDLER ---
  const handleAccountClick = (e: React.MouseEvent) => {
      if (!isAuthenticated) {
          navigate('/login');
      } else {
          setIsProfileDropdownOpen(!isProfileDropdownOpen);
      }
  };

  // Navigation Helpers
  const handleCategorySearch = (catId: string) => {
    navigate(`/search?category=${catId}`);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          
          {/* LEFT: Menu (Mobile) + Logo */}
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" 
              onClick={() => setIsMenuOpen(true)}
              aria-label="Menu"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 group">
              <div className="bg-orange-500 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Icons.LandmarkIcon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-lg md:text-xl font-bold text-brand-900 dark:text-white tracking-tight hidden sm:block">
                Wesh<span className="text-brand-600">Klik</span>
              </span>
            </Link>
          </div>

          {/* CENTER: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                placeholder={isImportUniverse ? "Rechercher un véhicule..." : "Rechercher..."}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all outline-none"
              />
              <button onClick={() => handleSearchSubmit()} className="absolute left-3.5 top-2.5 text-gray-400 group-hover:text-brand-500 transition-colors">
                <Icons.Search className="w-5 h-5" />
              </button>
              <button 
                onClick={handleVoiceSearch} 
                className={`absolute right-3.5 top-2.5 transition-colors hover:text-brand-600 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
                title="Recherche vocale"
              >
                <Icons.Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* RIGHT: Actions Icons (Mobile & Desktop) */}
          <div className="flex items-center gap-1 md:gap-3">
            
            {/* 1. Mobile Search Toggle */}
            <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Recherche"
            >
                <Icons.Search className="w-5 h-5" />
            </button>

            {/* Desktop Only: Currency & Theme */}
            <div className="hidden md:flex items-center gap-2">
                <CurrencySelector />
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                >
                    {theme === 'dark' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* NEW: Partner d'Achat Icon */}
            <Link 
              to="/find-partner"
              className="hidden md:flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
              title="Devenez Partenaire Achat"
            >
                <Icons.Handshake className="w-6 h-6" />
            </Link>            

            {/* 2. Cart / Partner Service (Icon Only) */}
            <Link 
              to="/cart"
              className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden md:flex"
              title="Mon Panier"
            >
              <Icons.ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 3. Store / Pro Space (Icon Only) */}
            {!location.pathname.includes('/pro-dashboard') && (
              <Link
                to="/pro-entry"
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden md:flex relative"
                title="Espace Pro"
              >
                <Icons.Store className="w-5 h-5 md:w-6 md:h-6" />
                {user?.type === 'pro' && (isExpired || isExpiringSoon) && (
                  <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                )}
              </Link>
            )}

            {/* 4. Favorites (Icon Only - Mobile & Desktop) */}
            <Link
                to="/favorites"
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Favoris"
            >
                <Icons.Heart className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            {/* 5. CTA Plus (Accent Color - Mobile & Desktop) */}
            <Link 
              to={ctaConfig.path}
              className={`p-2.5 md:px-4 md:py-2 rounded-full ${ctaConfig.colorClass} transition-all shadow-md active:scale-95 flex items-center justify-center`}
              title="Publier une annonce"
            >
              <Icons.PlusCircle className="w-5 h-5 md:w-5 md:h-5" />
              <span className="hidden md:inline-block ml-2 text-sm font-bold">Publier</span>
            </Link>

            {/* 6. Unified Account (Icon/Avatar Only - Mobile & Desktop) */}
            <div className="relative">
                <button 
                  onClick={handleAccountClick}
                  className="p-1 md:p-1.5 ml-1 md:ml-2 rounded-full focus:outline-none transition-transform hover:scale-105 active:scale-95"
                  title={isAuthenticated ? "Mon Compte" : "Se connecter"}
                >
                  {isAuthenticated && user ? (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-700">
                      {user.avatar ? (
                         <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 font-bold text-sm">
                           {user.name.charAt(0)}
                         </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                       <Icons.User className="w-5 h-5 md:w-5 md:h-5" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu (Desktop/Mobile unified) */}
                {isProfileDropdownOpen && isAuthenticated && user && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2 z-[60]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.type === 'pro' ? 'Compte Pro' : 'Particulier'}</p>
                    </div>
                    <Link to="/account" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                        <Icons.User className="w-4 h-4" /> Mon Profil
                    </Link>
                    <Link to="/messages" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                        <Icons.MessageCircle className="w-4 h-4" /> Messages
                    </Link>
                    <Link to="/favorites" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                        <Icons.Heart className="w-4 h-4" /> Favoris
                    </Link>
                    
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

                    <Link to="/partner-dashboard" className="block px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium flex items-center gap-2">
                        <Icons.Handshake className="w-4 h-4" /> Espace Partenaire
                    </Link>

                    {user.type === 'individual' && (
                       <Link to="/create-store" className="block px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold flex items-center gap-2">
                           <Icons.Store className="w-4 h-4" /> Devenir Pro
                       </Link>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Icons.LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-4 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all outline-none text-base text-gray-900 dark:text-white"
              />
              <button onClick={() => handleSearchSubmit()} className="absolute left-3.5 top-3.5 text-gray-400 hover:text-brand-500">
                <Icons.Search className="w-5 h-5" />
              </button>
              <button 
                  onClick={handleVoiceSearch} 
                  className={`absolute right-3.5 top-3.5 transition-colors hover:text-brand-600 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
              >
                  <Icons.Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
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
                    {/* Drawer Content - Nav Links */}
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium">
                        <Icons.Home className="w-5 h-5" /> Accueil
                    </Link>
                    
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium">
                        <Icons.ShoppingBag className="w-5 h-5" /> Mon Panier
                        {cartCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                    </Link>

                    <Link to="/pro-entry" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium">
                        <Icons.Store className="w-5 h-5" /> Espace Pro
                    </Link>

                    <Link to="/find-partner" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold mb-4">
                        <Icons.Handshake className="w-5 h-5" />
                        Partenaires d'Achat
                    </Link>

                    {/* CATEGORIES GRID */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">Catégories</p>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map(cat => {
                                const Icon = Icons[cat.icon as keyof typeof Icons] || Icons.HelpCircle;
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => handleCategorySearch(cat.id)}
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
