
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { MOCK_IMPORT_REQUESTS } from '../data';
import { ImportRequest, Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext'; // Import Listings Context
import { formatCurrency } from '../utils/currency';
import { Toast } from '../components/Toast';
import { QuickEditModal } from '../components/QuickEditModal';
import { FeatureLockedModal } from '../components/FeatureLockedModal';

// --- THE BRAIN ---
import { useStoreCapabilities } from '../hooks/useStoreCapabilities';

// --- CSV Engine ---
import { validateCsvAgainstSchema, parseCsvText, generateCsvTemplate, CsvValidationResult } from '../utils/csvEngine';
import { vehicleSchema } from '../form-schemas/vehicle';

// --- Nav Item Component ---
const NavItem = ({ 
  icon: Icon, 
  label, 
  onClick, 
  active = false, 
  badge = 0,
  isAction = false,
  locked = false,
  variant = 'default' 
}: any) => {
  const baseColors = variant === 'import' 
    ? {
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/30',
        activeText: 'text-indigo-700 dark:text-indigo-300',
        activeBorder: 'border-indigo-100 dark:border-indigo-800',
        iconActive: 'text-indigo-600 dark:text-indigo-400'
      }
    : {
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/30', 
        activeText: 'text-indigo-700 dark:text-indigo-300',
        activeBorder: 'border-indigo-100 dark:border-indigo-800',
        iconActive: 'text-indigo-600 dark:text-indigo-400'
    };

  return (
    <button 
      onClick={locked ? undefined : onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer text-sm group relative
        ${isAction 
          ? `bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 ${locked ? 'opacity-50 cursor-not-allowed' : ''}` 
          : active
            ? `${baseColors.activeBg} ${baseColors.activeText} font-bold border ${baseColors.activeBorder}`
            : `text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border border-transparent ${locked ? 'opacity-60 cursor-not-allowed' : ''}`
        }
      `}
    >
      <Icon className={`w-5 h-5 ${isAction ? 'text-white' : (active ? baseColors.iconActive : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300')}`} />
      <span className="flex-1 text-left truncate">{label}</span>
      
      {badge > 0 && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isAction ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
          {badge}
        </span>
      )}
      
      {locked && (
         <Icons.Lock className="w-3.5 h-3.5 text-gray-400 ml-auto" />
      )}
    </button>
  );
};

export const ProDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams(); 
  const { user } = useAuth();
  const { listings, addListing, updateListing } = useListings(); // Use dynamic listings
  
  // 🔥 SOURCE OF TRUTH 🔥
  const cap = useStoreCapabilities();
  
  // Local State
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState<'new' | 'replied' | 'history'>('new');
  const [showWelcome, setShowWelcome] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // CSV State
  const [csvStep, setCsvStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [csvResult, setCsvResult] = useState<CsvValidationResult | null>(null);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [listingToBoost, setListingToBoost] = useState<Listing | null>(null);
  const [modalState, setModalState] = useState({
    isOpen: false, title: '', message: '', icon: 'lock' as any, primaryAction: undefined as any
  });

  // Derived Data: Filter global listings by current user
  const myListings = useMemo(() => {
      return listings.filter(l => l.seller.id === user?.id);
  }, [listings, user]);

  const newRequestsCount = MOCK_IMPORT_REQUESTS.filter(r => r.status === 'new').length;

  // --- ROUTING SYNC ---
  useEffect(() => {
      const path = location.pathname;
      if (path.includes('/messages')) setCurrentView('messages');
      else if (path.includes('/statistiques')) setCurrentView('stats');
      else if (path.includes('/import-csv')) setCurrentView('import_csv');
      else if (path.includes('/annonces')) {
          setCurrentView('listings');
          // Auto-Open Edit
          if (routeId && path.includes('/edit')) {
              const target = myListings.find(l => l.id === routeId);
              if (target) setEditingListing(target);
          }
      }
      else setCurrentView('dashboard');
  }, [location.pathname, routeId, myListings]);

  // --- ACTIONS HANDLERS (Using Capabilities) ---

  const handleAddListingClick = () => {
      if (cap.canPostListings) {
          navigate('/pro/post-ad');
      } else {
          setModalState({
              isOpen: true,
              title: "Limite atteinte",
              message: `Vous avez utilisé vos ${cap.maxListings} annonces gratuites.\n\nPassez au niveau supérieur pour débloquer plus d'espace.`,
              icon: 'lock',
              primaryAction: { label: "Voir les packs", onClick: () => { setModalState(prev => ({...prev, isOpen: false})); navigate('/pro/plans'); } }
          });
      }
  };

  const handleImportAutoClick = () => {
      if (cap.canReceiveImportRequests) {
          navigate('/pro/import-requests'); // In a real app this would have a route
          // For demo, we just switch view if logic allows, or show alert
          showToast("Module Import Auto actif", "info");
      } else {
          // Determine WHY it is blocked to give better message
          const msg = cap.isAuto 
            ? "L'accès aux demandes d'import est réservé aux packs Silver et Gold." 
            : "Ce module est réservé aux professionnels de l'automobile.";
            
          setModalState({
              isOpen: true,
              title: "Module Verrouillé",
              message: msg,
              icon: 'lock',
              primaryAction: cap.isAuto ? { label: "Upgrader Pack", onClick: () => { setModalState(prev => ({...prev, isOpen: false})); navigate('/pro/plans'); } } : undefined
          });
      }
  };

  const handleImportCsvClick = () => {
      if (cap.canImportCSV) {
          navigate('/pro/import-csv');
      } else {
          setModalState({
              isOpen: true,
              title: "Import CSV Pro",
              message: "Gagnez du temps en important vos stocks via Excel/CSV.\n\nFonctionnalité réservée aux packs Silver et Gold.",
              icon: 'lock',
              primaryAction: { label: "Découvrir les offres", onClick: () => { setModalState(prev => ({...prev, isOpen: false})); navigate('/pro/plans'); } }
          });
      }
  };

  const handleBoostClick = (listing: Listing) => {
      if (cap.canUseBoost) {
          setListingToBoost(listing);
      } else {
          setModalState({
              isOpen: true,
              title: "Boosts épuisés",
              message: "Vous n'avez plus de crédits boost inclus dans votre pack ce mois-ci.",
              icon: 'info',
              primaryAction: { label: "Acheter des boosts", onClick: () => { setModalState(prev => ({...prev, isOpen: false})); navigate('/pro/plans'); } }
          });
      }
  };

  // --- CSV LOGIC ---
  const handleDownloadTemplate = () => {
      const csvContent = generateCsvTemplate(vehicleSchema);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template_stock_auto.csv';
      link.click();
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsProcessingCsv(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
          const text = ev.target?.result as string;
          await new Promise(r => setTimeout(r, 800));
          const rows = parseCsvText(text);
          const validation = validateCsvAgainstSchema(rows, vehicleSchema);
          setCsvResult(validation);
          setCsvStep('preview');
          setIsProcessingCsv(false);
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  const confirmImport = async () => {
      if (!csvResult || !user) return;
      setIsProcessingCsv(true);
      await new Promise(r => setTimeout(r, 1500));
      
      const newItems: Listing[] = csvResult.validRows.map((row, i) => ({
          id: `imp_${Date.now()}_${i}`,
          title: `${row.brand || 'Auto'} ${row.model || ''}`,
          price: Number(row.price) || 0,
          currency: 'DZD',
          category: 'auto',
          subCategory: 'car',
          location: (row.wilaya as string) || 'Alger',
          image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
          date: 'À l\'instant',
          seller: user,
          specs: row
      }));

      // Update Global State via Context
      newItems.forEach(item => addListing(item));
      
      setIsProcessingCsv(false);
      setCsvStep('success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
  };

  // --- KPI GENERATOR ---
  const kpiStats = useMemo(() => {
    // 1. AUTO
    if (cap.isAuto) {
        return [
            { label: 'Stock en ligne', value: cap.listingsUsed, icon: Icons.Car, action: () => navigate('/pro/annonces') },
            { label: 'Vues (30j)', value: "1.2k", icon: Icons.Eye, action: () => navigate('/pro/statistiques') },
            { label: 'Appels', value: 24, icon: Icons.Phone, action: () => navigate('/pro/statistiques') },
            { label: 'Boosts actifs', value: cap.boostsUsed, icon: Icons.Zap, action: () => navigate('/pro/annonces') },
        ];
    }
    // 2. IMMO
    if (cap.isImmo) {
        return [
            { label: 'Biens actifs', value: cap.listingsUsed, icon: Icons.Home, action: () => navigate('/pro/annonces') },
            { label: 'Contacts', value: 8, icon: Icons.UserCheck, action: () => navigate('/pro/messages') },
            { label: 'Vues', value: "850", icon: Icons.Eye, action: () => navigate('/pro/statistiques') },
            { label: 'Mandats', value: 3, icon: Icons.FileText, action: () => navigate('/pro/annonces') },
        ];
    }
    // 3. DEFAULT
    return [
        { label: 'Annonces', value: cap.listingsUsed, icon: Icons.ShoppingBag, action: () => navigate('/pro/annonces') },
        { label: 'Messages', value: 3, icon: Icons.MessageCircle, action: () => navigate('/pro/messages') },
        { label: 'Vues', value: "420", icon: Icons.BarChart3, action: () => navigate('/pro/statistiques') },
        { label: 'Note', value: "4.8", icon: Icons.Star, action: () => navigate('/pro/dashboard') },
    ];
  }, [cap, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col sticky top-0 h-screen z-30">
         <div className="p-6 pb-2">
            <div className="flex items-center gap-3 px-2 mb-6">
               <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                  <Icons.Store className="w-6 h-6" />
               </div>
               <div className="overflow-hidden">
                  <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-none mb-1">Espace Pro</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate" title={cap.storeName}>{cap.storeName}</p>
               </div>
            </div>
         </div>

         <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-6">
            <NavItem icon={Icons.LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => navigate('/pro/dashboard')} />
            
            <div className="py-2">
               <NavItem 
                 icon={Icons.PlusCircle} 
                 label="Publier une annonce" 
                 isAction 
                 onClick={handleAddListingClick} 
               />
            </div>
            
            <NavItem icon={Icons.ShoppingBag} label="Mes annonces" onClick={() => navigate('/pro/annonces')} active={currentView === 'listings'} />
            <NavItem icon={Icons.MessageCircle} label="Messages" badge={3} onClick={() => navigate('/pro/messages')} active={currentView === 'messages'} />
            <NavItem icon={Icons.BarChart3} label="Statistiques" onClick={() => navigate('/pro/statistiques')} active={currentView === 'stats'} />
            <NavItem icon={Icons.CreditCard} label="Mon pack" onClick={() => navigate('/pro/plans')} />
            
            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-2"></div>
            
            {/* FEATURE GATED ITEMS */}
            <NavItem 
                icon={Icons.FileText} 
                label="Import Stock (CSV)" 
                onClick={handleImportCsvClick} 
                locked={!cap.canImportCSV} 
                active={currentView === 'import_csv'} 
            />
            
            {/* Show only if Sector allows it (Auto) */}
            {(cap.isAuto || cap.isImport) && (
               <NavItem 
                 icon={Icons.Plane} 
                 label="Demandes d'import" 
                 badge={cap.canReceiveImportRequests ? newRequestsCount : 0} 
                 onClick={handleImportAutoClick}
                 locked={!cap.canReceiveImportRequests}
               />
            )}
         </nav>
         
         <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
             <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-white hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-all shadow-sm">
                <Icons.ArrowLeft className="w-4 h-4" /> Retour Marketplace
             </button>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between z-40">
           <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              <Icons.Store className="w-5 h-5 text-indigo-600" />
              Espace Pro
           </div>
           <button onClick={() => navigate('/')} className="text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Icons.X className="w-5 h-5" />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
           
           {/* DASHBOARD VIEW */}
           {currentView === 'dashboard' && (
              <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                 {/* Header */}
                 <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cap.storeName}</h1>
                        <div className="flex flex-wrap gap-2">
                            {cap.sectors.map(s => (
                                <span key={s} className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
                                    {s.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-lg font-bold text-sm uppercase">{cap.currentPack}</div>
                        <button onClick={() => navigate('/pro/plans')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><Icons.Settings className="w-5 h-5" /></button>
                    </div>
                 </div>

                 {/* KPI Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {kpiStats.map((stat, idx) => (
                        <div key={idx} onClick={stat.action} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-36 hover:shadow-md cursor-pointer group">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-bold text-xs uppercase">{stat.label}</span>
                                <stat.icon className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recent Listings */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm">Dernières Annonces</h3>
                            <button onClick={() => navigate('/pro/annonces')} className="text-xs font-bold text-brand-600">Voir tout</button>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                            {myListings.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">Aucune annonce. Commencez à vendre !</div>
                            ) : (
                                myListings.slice(0, 5).map(l => (
                                    <div key={l.id} className="p-4 flex gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                            <img src={l.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm truncate dark:text-white">{l.title}</h4>
                                            <p className="text-xs text-gray-500">{formatCurrency(l.price, 'DZD')}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/pro/annonces/${l.id}/edit`)} 
                                            className="text-xs font-bold text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20"
                                        >
                                            Modifier
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Subscription Widget */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm mb-4">Abonnement</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold flex items-center gap-2 dark:text-white"><Icons.CreditCard className="w-4 h-4 text-brand-600" /> Mon Pack</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${cap.currentPack === 'gold' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    {cap.currentPack}
                                </span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">Annonces actives</span>
                                    <span className="font-bold dark:text-white">{cap.listingsUsed} <span className="text-gray-400">/ {cap.maxListings === -1 ? '∞' : cap.maxListings}</span></span>
                                </div>
                                {cap.maxListings !== -1 && (
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.min(100, (cap.listingsUsed / cap.maxListings) * 100)}%` }}></div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mb-6 flex-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Icons.FileSpreadsheet className="w-3.5 h-3.5" /> Import CSV</span>
                                    {cap.canImportCSV ? <Icons.Check className="w-4 h-4 text-green-500" /> : <Icons.Lock className="w-3.5 h-3.5 text-gray-300" />}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Icons.Rocket className="w-3.5 h-3.5" /> Boosts</span>
                                    <span className={`font-bold ${cap.boostsRemaining > 0 ? 'text-green-600' : 'text-gray-400'}`}>{cap.boostsRemaining}</span>
                                </div>
                            </div>

                            <button onClick={() => navigate('/pro/plans')} className="w-full py-2 rounded-lg text-xs font-bold border bg-brand-50 dark:bg-brand-900/10 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800 hover:bg-brand-100">
                                Gérer mon pack
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
           )}

           {/* LISTINGS VIEW */}
           {currentView === 'listings' && (
              <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Annonces</h2>
                    <button onClick={handleAddListingClick} className="bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-700 flex items-center gap-2">
                        <Icons.PlusCircle className="w-4 h-4" /> <span className="hidden md:inline">Nouvelle annonce</span>
                    </button>
                 </div>

                 {myListings.length > 0 ? (
                    <div className="space-y-4">
                        {myListings.map(listing => (
                            <div key={listing.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center group">
                                <div className="w-full md:w-24 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                    <img src={listing.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{listing.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="font-semibold text-brand-600">{formatCurrency(listing.price, 'DZD')}</span>
                                        <span className="flex items-center gap-1"><Icons.Clock className="w-3 h-3" /> {listing.date}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => navigate(`/pro/annonces/${listing.id}/edit`)} className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200">Modifier</button>
                                        <button className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg">Désactiver</button>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                    <button 
                                        onClick={() => handleBoostClick(listing)}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all ${
                                            cap.canUseBoost 
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-md' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!cap.canUseBoost}
                                    >
                                        <Icons.Zap className="w-4 h-4 fill-white" /> Booster
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <Icons.ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold dark:text-white">Aucune annonce</h3>
                        <button onClick={handleAddListingClick} className="mt-4 bg-brand-600 text-white px-6 py-2 rounded-xl font-bold">Créer une annonce</button>
                    </div>
                 )}
              </div>
           )}

           {/* CSV IMPORT VIEW */}
           {currentView === 'import_csv' && cap.canImportCSV && (
               <div className="p-6 h-full flex flex-col">
                   <div className="mb-6 flex items-center gap-3">
                       <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Icons.FileSpreadsheet className="w-6 h-6" /></div>
                       <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import de Masse</h2>
                   </div>
                   <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex-1 p-8 flex flex-col items-center justify-center">
                       {csvStep === 'upload' && (
                           <div className="max-w-xl w-full text-center space-y-6">
                               <div className="grid grid-cols-2 gap-4 text-left">
                                   <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                       <h4 className="font-bold mb-2 text-gray-900 dark:text-white">1. Modèle</h4>
                                       <button onClick={handleDownloadTemplate} className="text-brand-600 font-bold text-xs flex items-center gap-1 hover:underline"><Icons.Download className="w-3 h-3" /> Télécharger CSV</button>
                                   </div>
                                   <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                       <h4 className="font-bold mb-2 text-gray-900 dark:text-white">2. Remplir</h4>
                                       <p className="text-xs text-gray-500">Ajoutez vos données dans le fichier.</p>
                                   </div>
                               </div>
                               <div onClick={() => csvInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 cursor-pointer hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all">
                                   {isProcessingCsv ? (
                                       <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
                                   ) : (
                                       <>
                                           <Icons.Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                           <p className="font-bold text-gray-900 dark:text-white">Cliquez pour importer</p>
                                       </>
                                   )}
                               </div>
                               <input type="file" ref={csvInputRef} onChange={handleCsvFileChange} className="hidden" accept=".csv" />
                           </div>
                       )}
                       {csvStep === 'preview' && csvResult && (
                           <div className="w-full max-w-2xl">
                               <div className="flex gap-4 mb-6">
                                   <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center"><span className="block text-2xl font-bold dark:text-white">{csvResult.totalRows}</span><span className="text-xs uppercase text-gray-500">Total</span></div>
                                   <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center text-green-600"><span className="block text-2xl font-bold">{csvResult.validRows.length}</span><span className="text-xs uppercase">Valides</span></div>
                                   <div className="flex-1 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-center text-red-600"><span className="block text-2xl font-bold">{csvResult.errors.length}</span><span className="text-xs uppercase">Erreurs</span></div>
                               </div>
                               {csvResult.errors.length > 0 && (
                                   <div className="mb-4 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-left max-h-40 overflow-y-auto">
                                       {csvResult.errors.map((err, i) => (
                                           <p key={i} className="text-xs text-red-600 mb-1">Ligne {err.row} ({err.field}): {err.message}</p>
                                       ))}
                                   </div>
                               )}
                               <div className="flex justify-end gap-3">
                                   <button onClick={() => setCsvStep('upload')} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Annuler</button>
                                   <button onClick={confirmImport} disabled={csvResult.validRows.length === 0} className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50">Confirmer Import</button>
                               </div>
                           </div>
                       )}
                       {csvStep === 'success' && (
                           <div className="text-center">
                               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><Icons.Check className="w-10 h-10" /></div>
                               <h3 className="text-2xl font-bold mb-4 dark:text-white">Import Réussi !</h3>
                               <button onClick={() => navigate('/pro/annonces')} className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold">Voir mes annonces</button>
                           </div>
                       )}
                   </div>
               </div>
           )}

           {/* PLACEHOLDER VIEWS */}
           {(currentView === 'messages' || currentView === 'stats') && (
               <div className="p-12 text-center text-gray-500">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Icons.Construction className="w-8 h-8" /></div>
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bientôt disponible</h2>
                   <p className="mt-2">Ce module est en cours de développement.</p>
               </div>
           )}

        </div>
      </main>

      {/* Feature Modal (Guard) */}
      <FeatureLockedModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))} 
        title={modalState.title}
        message={modalState.message}
        icon={modalState.icon}
        primaryAction={modalState.primaryAction}
      />

      {/* Quick Edit Modal */}
      <QuickEditModal 
         isOpen={!!editingListing} 
         listing={editingListing} 
         onClose={() => {
             setEditingListing(null);
             if (location.pathname.includes('/edit')) navigate('/pro/annonces');
         }}
         onSave={(updated) => {
            // Update via Context
            updateListing(updated);
            setEditingListing(null);
            showToast("Annonce mise à jour !", "success");
            if (location.pathname.includes('/edit')) navigate('/pro/annonces');
         }}
      />

    </div>
  );
};
