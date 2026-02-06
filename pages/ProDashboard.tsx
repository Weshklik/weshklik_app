
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { MOCK_IMPORT_REQUESTS, SECTOR_RULES } from '../data';
import { ImportRequest } from '../types';
import { useProPackState } from '../hooks/useProPackState';
import { useAuth } from '../context/AuthContext';
import { canUseFeature } from '../utils/businessRules';
import { FeatureLockedModal } from '../components/FeatureLockedModal';

// --- Sidebar Navigation Item Component ---
const NavItem = ({ 
  icon: Icon, 
  label, 
  onClick, 
  active = false, 
  badge = 0,
  isAction = false,
  locked = false,
  variant = 'default' // 'default' | 'import'
}: any) => {
  
  const baseColors = variant === 'import' 
    ? {
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/30',
        activeText: 'text-indigo-700 dark:text-indigo-300',
        activeBorder: 'border-indigo-100 dark:border-indigo-800',
        iconActive: 'text-indigo-600 dark:text-indigo-400'
      }
    : {
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/30', // Keeping blue/indigo for main consistent
        activeText: 'text-indigo-700 dark:text-indigo-300',
        activeBorder: 'border-indigo-100 dark:border-indigo-800',
        iconActive: 'text-indigo-600 dark:text-indigo-400'
    };

  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer text-sm group relative
        ${isAction 
          ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95' 
          : active
            ? `${baseColors.activeBg} ${baseColors.activeText} font-bold border ${baseColors.activeBorder}`
            : 'text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border border-transparent'
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
         <Icons.Lock className="w-3.5 h-3.5 text-gray-400" />
      )}
    </button>
  );
};

export const ProDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Use the new centralized hook
  const { status, packName, daysRemaining, formattedDate } = useProPackState();
  
  const [requests, setRequests] = useState(MOCK_IMPORT_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ImportRequest | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  
  // State for View & Tabs
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'import_requests' | 'listings' ...
  const [activeTab, setActiveTab] = useState<'new' | 'replied' | 'history'>('new'); // Filter for Import Module
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  
  // Feature Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    icon: 'lock' as 'lock' | 'warning',
    primaryAction: undefined as { label: string; onClick: () => void } | undefined
  });

  const csvInputRef = useRef<HTMLInputElement>(null);

  // Check for New Pro flag
  useEffect(() => {
    if (location.state?.newPro) {
      setShowWelcome(true);
      // Clean up state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Filter Logic for Requests
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'new') return r.status === 'new';
    if (activeTab === 'replied') return r.status === 'replied' || r.status === 'discussion';
    if (activeTab === 'history') return r.status === 'converted' || r.status === 'closed';
    return true;
  });

  const newRequestsCount = requests.filter(r => r.status === 'new').length;

  // --- FEATURE HANDLERS ---

  const handleImportAutoClick = () => {
    const result = canUseFeature(user, 'import_auto');

    if (result.allowed) {
        setCurrentView('import_requests');
        setActiveTab('new'); 
    } else if (result.reason === 'PACK_EXPIRED') {
        setModalState({
            isOpen: true,
            title: result.title || 'Abonnement Expiré',
            message: result.message || '',
            icon: 'warning',
            primaryAction: {
               label: 'Renouveler',
               onClick: () => {
                   setModalState(prev => ({ ...prev, isOpen: false }));
                   navigate('/pro-plans');
               }
            }
        });
    } else if (result.reason === 'NOT_PRO') {
        alert(result.message);
        navigate('/become-pro');
    } else {
        setModalState({
            isOpen: true,
            title: result.title || 'Accès Restreint',
            message: result.message || 'Non autorisé',
            icon: 'warning',
            primaryAction: undefined
        });
    }
  };

  const handleImportCsvClick = () => {
    const result = canUseFeature(user, 'import_csv');

    if (result.allowed) {
        setShowCsvModal(true);
    } else if (result.reason === 'PACK_EXPIRED') {
         setModalState({
            isOpen: true,
            title: result.title || 'Abonnement Expiré',
            message: result.message || '',
            icon: 'warning',
            primaryAction: {
               label: 'Renouveler',
               onClick: () => {
                   setModalState(prev => ({ ...prev, isOpen: false }));
                   navigate('/pro-plans');
               }
            }
        });
    } else if (result.reason === 'PACK_REQUIRED') {
        setModalState({
            isOpen: true,
            title: result.title || 'Feature Locked',
            message: result.message || '',
            icon: 'lock',
            primaryAction: {
                label: 'Voir les packs',
                onClick: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    navigate('/pro-plans');
                }
            }
        });
    } else {
        setModalState({
            isOpen: true,
            title: result.title || 'Non Autorisé',
            message: result.message || '',
            icon: 'warning',
            primaryAction: undefined
        });
    }
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          alert(`Fichier "${e.target.files[0].name}" prêt pour l'import. (Simulation)`);
          e.target.value = '';
          setShowCsvModal(false);
      }
  }

  // --- Existing Logic ---
  const handleOpenRequest = (request: ImportRequest) => {
    setSelectedRequest(request);
    setShowProposalForm(false);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setShowProposalForm(false);
  };

  const handleWhatsAppResponse = () => {
    if (!selectedRequest) return;
    const updatedRequests = requests.map(r => 
        r.id === selectedRequest.id ? { ...r, status: 'replied' as const } : r
    );
    setRequests(updatedRequests);
    const message = encodeURIComponent(`Bonjour ${selectedRequest.clientName}, ici le store Auto Luxe...`);
    window.open(`https://wa.me/213550000000?text=${message}`, '_blank');
    handleCloseModal();
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    const updatedRequests = requests.map(r => 
      r.id === selectedRequest.id ? { ...r, status: 'replied' as const } : r
    );
    setRequests(updatedRequests);
    alert('Votre proposition a été envoyée au client.');
    handleCloseModal();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-bold">Nouvelle</span>;
      case 'replied': return <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-bold">Répondue</span>;
      case 'discussion': return <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-bold">En discussion</span>;
      default: return null;
    }
  };

  const banner = (() => {
    if (status === 'expired') {
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-100 dark:border-red-900',
        icon: <Icons.AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
        title: 'Abonnement Expiré',
        text: 'Votre pack a expiré. Certaines fonctionnalités sont bloquées.',
        textColor: 'text-red-900 dark:text-red-200',
        subTextColor: 'text-red-700 dark:text-red-300',
        cta: 'Réactiver',
        ctaBg: 'bg-red-600 hover:bg-red-700'
      };
    }
    if (status === 'expiring') {
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-100 dark:border-orange-900',
        icon: <Icons.Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
        title: `Expire dans ${daysRemaining} jours`,
        text: 'Attention : votre pack expire bientôt.',
        textColor: 'text-orange-900 dark:text-orange-200',
        subTextColor: 'text-orange-700 dark:text-orange-300',
        cta: 'Renouveler',
        ctaBg: 'bg-orange-500 hover:bg-orange-600'
      };
    }
    if (status === 'active') {
       return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-100 dark:border-green-900',
        icon: <Icons.CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
        title: `Pack ${packName} Actif`,
        text: `${daysRemaining} jours restants.`,
        textColor: 'text-green-900 dark:text-green-200',
        subTextColor: 'text-green-700 dark:text-green-300',
        cta: 'Voir détails',
        ctaBg: 'bg-green-600 hover:bg-green-700'
      };
    }
    return null; 
  })();

  const isImportSector = user?.sector === 'auto_vente';
  const isImportMode = currentView === 'import_requests';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      
      {/* --- DYNAMIC SIDEBAR (DESKTOP) --- */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col sticky top-0 h-screen z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
         
         {/* Sidebar Header - Changes based on Context */}
         <div className="p-6 pb-2">
            {isImportMode ? (
               <div className="flex items-center gap-3 px-2 mb-6 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                     <Icons.Plane className="w-5 h-5" />
                  </div>
                  <div>
                     <h1 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide leading-none mb-0.5">Module Import</h1>
                     <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Espace Expert</p>
                  </div>
               </div>
            ) : (
               <div className="flex items-center gap-3 px-2 mb-6">
                  <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                     <Icons.Store className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                     <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-none mb-1">Espace Pro</h1>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate" title={user?.name}>{user?.name}</p>
                  </div>
               </div>
            )}
         </div>

         {/* Navigation Items - Switch Logic */}
         <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-6">
            
            {isImportMode ? (
               /* --- IMPORT SIDEBAR --- */
               <>
                  <div className="mb-2 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Gestion</div>
                  <NavItem 
                     icon={Icons.Bell} 
                     label="Demandes d'import" 
                     badge={newRequestsCount}
                     active={activeTab === 'new'} 
                     onClick={() => setActiveTab('new')} 
                     variant="import"
                  />
                  <NavItem 
                     icon={Icons.MessageCircle} 
                     label="Mes réponses" 
                     active={activeTab === 'replied'} 
                     onClick={() => setActiveTab('replied')} 
                     variant="import"
                  />
                  <NavItem 
                     icon={Icons.Clock} 
                     label="Historique" 
                     active={activeTab === 'history'} 
                     onClick={() => setActiveTab('history')} 
                     variant="import"
                  />
                  
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-2"></div>
                  
                  <NavItem 
                     icon={Icons.Store} 
                     label="Retour Store" 
                     onClick={() => setCurrentView('dashboard')} 
                  />
               </>
            ) : (
               /* --- MAIN SIDEBAR --- */
               <>
                  <NavItem 
                     icon={Icons.LayoutDashboard} 
                     label="Dashboard" 
                     active={currentView === 'dashboard'} 
                     onClick={() => setCurrentView('dashboard')} 
                  />
                  
                  <div className="py-2">
                     <NavItem 
                        icon={Icons.PlusCircle} 
                        label="Déposer une annonce Pro" 
                        isAction 
                        onClick={() => navigate('/post')} 
                     />
                  </div>

                  <NavItem icon={Icons.ShoppingBag} label="Mes annonces" onClick={() => setCurrentView('listings')} active={currentView === 'listings'} />
                  
                  {/* Moved Mon Pack Higher */}
                  <NavItem 
                     icon={Icons.CreditCard} 
                     label="Mon pack" 
                     onClick={() => navigate('/pro-plans')} 
                  />

                  <NavItem icon={Icons.MessageCircle} label="Messages" badge={3} onClick={() => setCurrentView('messages')} active={currentView === 'messages'} />
                  <NavItem icon={Icons.BarChart3} label="Statistiques" onClick={() => setCurrentView('stats')} active={currentView === 'stats'} />

                  {/* Separator Tools */}
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-2"></div>
                  
                  <NavItem 
                     icon={Icons.FileText} 
                     label="Import CSV" 
                     onClick={handleImportCsvClick}
                     locked={canUseFeature(user, 'import_csv').reason === 'PACK_REQUIRED'}
                  />

                  {isImportSector && (
                     <NavItem 
                        icon={Icons.Plane} 
                        label="Demandes d'import" 
                        badge={newRequestsCount}
                        onClick={handleImportAutoClick}
                     />
                  )}

                  {/* Separator Account */}
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-2"></div>
                  
                  <NavItem 
                     icon={Icons.Settings} 
                     label="Paramètres" 
                     onClick={() => setCurrentView('settings')}
                     active={currentView === 'settings'}
                  />
               </>
            )}

         </nav>
         
         {/* Sidebar Footer - Always Back to Marketplace */}
         <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
             <button 
                onClick={() => navigate('/')} 
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-white hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-all shadow-sm"
             >
                <Icons.ArrowLeft className="w-4 h-4" />
                Retour Marketplace
             </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between z-40">
           <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              {isImportMode ? <Icons.Plane className="w-5 h-5 text-indigo-600" /> : <Icons.Store className="w-5 h-5 text-indigo-600" />}
              {isImportMode ? 'Module Import' : 'Espace Pro'}
           </div>
           <button onClick={() => isImportMode ? setCurrentView('dashboard') : navigate('/')} className="text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              {isImportMode ? <Icons.ArrowLeft className="w-5 h-5" /> : <Icons.X className="w-5 h-5" />}
           </button>
        </header>

        {/* Dashboard Content Container */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
           
           {/* Welcome & Status Banners */}
           {!isImportMode && (
             <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                 {showWelcome && (
                   <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between animate-in slide-in-from-top">
                      <div>
                         <p className="font-bold text-lg">🎉 Votre Store est actif.</p>
                         <p className="text-green-100 text-sm">Vous êtes actuellement sur le pack Free.</p>
                      </div>
                      <button onClick={() => setShowWelcome(false)} className="bg-white/20 hover:bg-white/30 p-1 rounded-full"><Icons.X className="w-5 h-5" /></button>
                   </div>
                 )}

                 {banner && (
                   <div className={`${banner.bg} border-b ${banner.border} px-6 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                         {banner.icon}
                         <div>
                            <p className={`text-sm font-bold ${banner.textColor}`}>{banner.title}</p>
                            <p className={`text-xs ${banner.subTextColor}`}>{banner.text}</p>
                         </div>
                      </div>
                      <Link to="/pro-plans" className={`${banner.ctaBg} text-white text-xs font-bold px-4 py-2 rounded-lg`}>
                         {banner.cta}
                      </Link>
                   </div>
                 )}
             </div>
           )}

           {/* VIEW: DASHBOARD (Default) */}
           {currentView === 'dashboard' && (
              <div className="p-6">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tableau de Bord</h2>
                 <p className="text-gray-500 dark:text-gray-400 mb-8">Vue d'ensemble de votre activité.</p>
                 
                 {/* Mobile Quick Actions Grid */}
                 <div className="grid grid-cols-2 md:hidden gap-3 mb-8">
                    <button onClick={() => navigate('/post')} className="bg-brand-600 text-white p-4 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-2 shadow-lg">
                       <Icons.PlusCircle className="w-6 h-6" /> Déposer une annonce Pro
                    </button>
                    {isImportSector && (
                      <button onClick={handleImportAutoClick} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-4 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-800">
                         <Icons.Plane className="w-6 h-6" /> Import Auto
                      </button>
                    )}
                 </div>

                 {/* Placeholder Content for Dashboard Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-500 text-sm font-medium">Vues totales</span>
                          <Icons.BarChart3 className="w-5 h-5 text-gray-400" />
                       </div>
                       <p className="text-3xl font-bold text-gray-900 dark:text-white">1,240</p>
                       <span className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                          <Icons.Rocket className="w-3 h-3" /> +12% cette semaine
                       </span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-500 text-sm font-medium">Messages</span>
                          <Icons.MessageCircle className="w-5 h-5 text-gray-400" />
                       </div>
                       <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                       <span className="text-gray-400 text-xs mt-1">Non lus</span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-500 text-sm font-medium">Annonces actives</span>
                          <Icons.ShoppingBag className="w-5 h-5 text-gray-400" />
                       </div>
                       <p className="text-3xl font-bold text-gray-900 dark:text-white">2</p>
                       <Link to="/post" className="text-brand-600 text-xs font-bold hover:underline mt-1 block">Ajouter +</Link>
                    </div>
                 </div>
              </div>
           )}

           {/* VIEW: IMPORT REQUESTS (Now with dedicated Sidebar logic handled above) */}
           {currentView === 'import_requests' && isImportSector && (
              <div className="p-4 md:p-6 animate-in fade-in">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                   <div>
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       {activeTab === 'new' && "Nouvelles Demandes"}
                       {activeTab === 'replied' && "Mes Réponses"}
                       {activeTab === 'history' && "Historique"}
                     </h2>
                     <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {activeTab === 'new' && "Demandes qualifiées en attente de réponse."}
                        {activeTab === 'replied' && "Discussions en cours avec les clients."}
                        {activeTab === 'history' && "Demandes clôturées ou archivées."}
                     </p>
                   </div>
                 </div>

                 {/* Requests List */}
                 {filteredRequests.length > 0 ? (
                    <div className="space-y-4 max-w-5xl">
                        {filteredRequests.map(req => (
                        <div 
                            key={req.id} 
                            onClick={() => handleOpenRequest(req)}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer group transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${req.status === 'new' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                    {req.vehicleType === 'Moto' ? <Icons.Bike className="w-6 h-6" /> : <Icons.Car className="w-6 h-6" />}
                                    </div>
                                    <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {getStatusBadge(req.status)}
                                        <span className="text-xs text-gray-400">{req.date}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {req.brand} {req.model} <span className="text-gray-400 dark:text-gray-500 font-normal">({req.yearMin}+)</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Budget Max: <span className="font-semibold text-gray-700 dark:text-gray-300">{req.budgetMax.toLocaleString()} DA</span> • {req.originPreference}
                                    </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-50 dark:border-gray-800 pt-3 md:pt-0">
                                    <div className="text-right hidden md:block">
                                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{req.clientName}</span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">{req.wilaya}</span>
                                    </div>
                                    <button className="bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-2 rounded-full transition-colors">
                                    <Icons.ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                            <Icons.Inbox className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Aucune demande</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Rien à afficher dans cet onglet pour le moment.
                        </p>
                    </div>
                 )}
              </div>
           )}

           {/* OTHER VIEWS PLACEHOLDER */}
           {['listings', 'messages', 'stats', 'settings'].includes(currentView) && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-[60vh]">
                 <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-md">
                    <Icons.Construction className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">En développement</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                       Le module <strong>{currentView}</strong> sera bientôt disponible.
                    </p>
                    <button onClick={() => setCurrentView('dashboard')} className="text-brand-600 font-bold hover:underline">
                       Retour au Dashboard
                    </button>
                 </div>
              </div>
           )}

        </div>

      </main>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl scale-100 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                       <Icons.FileText className="w-6 h-6" />
                    </div>
                    Import en masse
                 </h3>
                 <button onClick={() => setShowCsvModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                    <Icons.X className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-6">
                 {/* Step 1: Download Templates */}
                 <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">1. Télécharger le modèle</h4>
                    <div className="grid grid-cols-2 gap-3">
                       <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Icons.FileSpreadsheet className="w-5 h-5 text-green-600" />
                          Modèle Excel (.xlsx)
                       </button>
                       <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Icons.FileText className="w-5 h-5 text-blue-600" />
                          Modèle CSV (.csv)
                       </button>
                    </div>
                 </div>

                 {/* Step 2: Upload */}
                 <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">2. Importer votre fichier</h4>
                    <div 
                       onClick={() => csvInputRef.current?.click()}
                       className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all group"
                    >
                       <Icons.Upload className="w-8 h-8 text-gray-400 group-hover:text-brand-500 mx-auto mb-2 transition-colors" />
                       <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cliquez pour sélectionner un fichier</p>
                       <p className="text-xs text-gray-400 mt-1">.csv, .xlsx (Max 5Mo)</p>
                    </div>
                    <input 
                       type="file" 
                       ref={csvInputRef} 
                       onChange={handleCsvFileChange} 
                       className="hidden" 
                       accept=".csv, .xlsx, .xls" 
                    />
                 </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                 <button 
                    onClick={() => setShowCsvModal(false)}
                    className="px-5 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-sm"
                 >
                    Annuler
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Detail Modal (Unchanged) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}></div>
           <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200 dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900 transition-colors">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">Détail de la demande</h3>
                 <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                    <Icons.X className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-gray-900 transition-colors">
                 {/* ... content unchanged ... */}
                 {showProposalForm && (
                    <form onSubmit={handleSubmitProposal} className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-900 rounded-xl p-6 shadow-lg animate-in slide-in-from-bottom-4">
                       <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4">Faire une proposition formelle</h4>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Véhicule proposé</label>
                             <input type="text" required placeholder="Ex: Audi Q3 S-Line 2024" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (DA)</label>
                                <input type="number" required placeholder="Prix TTC" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Délai (Jours)</label>
                                <input type="number" required placeholder="Ex: 25" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                             <textarea rows={3} placeholder="Détails supplémentaires..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                          </div>
                       </div>
                       <div className="flex gap-3 mt-6">
                          <button type="button" onClick={() => setShowProposalForm(false)} className="flex-1 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Annuler</button>
                          <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">Envoyer</button>
                       </div>
                    </form>
                 )}
                 {!showProposalForm && selectedRequest.status === 'new' && (
                     <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 grid grid-cols-2 gap-4">
                        <button 
                           onClick={handleWhatsAppResponse}
                           className="py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                           <Icons.MessageCircle className="w-5 h-5" />
                           Réponse WhatsApp
                        </button>
                        <button 
                           onClick={() => setShowProposalForm(true)}
                           className="py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
                        >
                           Devis
                        </button>
                     </div>
                  )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
