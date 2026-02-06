
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useProPackState } from '../hooks/useProPackState';
import { useSectorRules } from '../hooks/useSectorRules';

type PricingCategory = 'auto' | 'immo' | 'services';

export const ProPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProPack, isAuthenticated } = useAuth();
  
  // States & Context
  const { packCode, status } = useProPackState(); // packCode is internal (free/silver/gold)
  const { importAutoAllowed } = useSectorRules();

  // Pricing State
  const [activeCategory, setActiveCategory] = useState<PricingCategory>('auto');
  
  // Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    storeName: '',
    contactName: '',
    phone: '',
    email: '',
    category: 'auto',
    volume: '100-500',
    apiInterest: false
  });

  // Auto-detect category based on user sector
  useEffect(() => {
    if (user?.sector) {
       if (['auto_vente', 'auto_location', 'transport_logistique'].includes(user.sector)) {
         setActiveCategory('auto');
       } else if (['immobilier', 'tourisme'].includes(user.sector)) {
         setActiveCategory('immo');
       } else {
         setActiveCategory('services');
       }
    }
  }, [user]);

  // Action Handler
  const handleSelectPack = (packId: 'free' | 'silver' | 'gold') => {
    if (!isAuthenticated) {
        navigate('/login', { state: { intent: 'pro', from: '/create-store' } });
        return;
    }
    if (user?.type !== 'pro') {
        navigate('/create-store');
        return;
    }
    updateProPack(packId);
    navigate('/pro-dashboard');
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setQuoteSent(true);
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setQuoteSent(false); // Reset for next time
    setQuoteForm({
        storeName: '',
        contactName: '',
        phone: '',
        email: '',
        category: 'auto',
        volume: '100-500',
        apiInterest: false
    });
  };

  // --- DATA CONFIGURATION ---

  const PRICING_CONFIG = {
    auto: {
        label: 'Véhicules',
        icon: Icons.Car,
        starter: '0 DA',
        proPlus: '7 000 DA',
        proMax: '15 000 DA'
    },
    immo: {
        label: 'Immobilier',
        icon: Icons.Home,
        starter: '0 DA',
        proPlus: '5 000 DA',
        proMax: '9 000 DA'
    },
    services: {
        label: 'Services & Autres',
        icon: Icons.Briefcase,
        starter: '0 DA',
        proPlus: '4 000 DA',
        proMax: '7 000 DA'
    }
  };

  const PLANS = [
    {
      id: 'free',
      name: 'Starter', 
      price: PRICING_CONFIG[activeCategory].starter,
      target: 'Pour découvrir la plateforme.',
      features: [
          'Création de Store',
          'Statistiques de base',
          'Support email standard',
          'Aucun boost inclus'
      ],
      cta: 'Commencer',
      color: 'border-gray-200 dark:border-gray-700',
      bg: 'bg-white dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white',
      subTextColor: 'text-gray-500 dark:text-gray-400',
      featureIconColor: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      buttonStyle: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
    },
    {
      id: 'silver',
      name: 'Pro Plus',
      price: PRICING_CONFIG[activeCategory].proPlus,
      period: '/ mois',
      target: 'Pour les professionnels actifs.',
      features: [
          'Badge "Pro Vérifié"',
          'Accès aux Boosts payants',
          'Support prioritaire',
          '+100 Points Fidélité / mois'
      ],
      cta: 'Choisir Pro Plus',
      color: 'border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-gray-900 dark:text-white',
      subTextColor: 'text-gray-600 dark:text-gray-300',
      featureIconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30',
      highlight: true
    },
    {
      id: 'gold',
      name: 'Pro Max',
      price: PRICING_CONFIG[activeCategory].proMax,
      period: '/ mois',
      target: 'Pour une domination totale.',
      features: [
          'Visibilité Maximale',
          '3 Boosts inclus / mois',
          'Support WhatsApp dédié',
          '+200 Points Fidélité / mois'
      ],
      cta: 'Choisir Pro Max',
      color: 'border-purple-200 dark:border-purple-800',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-gray-900 dark:text-white',
      subTextColor: 'text-gray-600 dark:text-gray-300',
      featureIconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
      buttonStyle: 'bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20',
      isImport: importAutoAllowed 
    },
    {
      id: 'premium',
      name: 'Pro Premium',
      price: 'Sur devis',
      period: '',
      target: 'Grand compte (100 à 500+ annonces).',
      features: [
          'Volume d\'annonces élevé',
          'Import CSV illimité & prioritaire',
          '10 Boosts inclus / mois',
          'Accès API (sur demande)',
          'Statistiques avancées',
          'Support dédié'
      ],
      cta: 'Demander un devis',
      color: 'border-slate-600 dark:border-slate-700',
      bg: 'bg-slate-900', // Always dark background
      textColor: 'text-white',
      subTextColor: 'text-slate-300',
      featureIconColor: 'bg-slate-800 text-indigo-400',
      buttonStyle: 'border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm',
      isQuote: true,
      badge: 'Sur devis'
    }
  ];

  const BOOSTS = [
      { name: 'Boost Visibilité', price: '800 DA', duration: '3 jours', desc: "Remonte l'annonce en tête de liste." },
      { name: 'Boost Urgent', price: '1 200 DA', duration: '5 jours', desc: "Badge rouge distinctif + priorité." },
      { name: 'Boost Premium', price: '2 000 DA', duration: '7 jours', desc: "Mise en avant forte (Accueil + Recherche)." },
      { name: 'Boost Store', price: '3 000 DA', duration: '7 jours', desc: "Mise en avant de votre boutique entière." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      
      {/* Header Fixe - Clarification Immédiate */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
                <div className="p-2 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                    <Icons.ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wide">Retour</span>
            </button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-4"></div>
            
            <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Packs & Tarifs
            </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl space-y-16">
        
        {/* --- 1. PROMESSE COMMERCIALE --- */}
        <section className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                La flexibilité d’aujourd’hui,<br/>
                <span className="text-indigo-600 dark:text-indigo-400">la performance de demain.</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                Des packs simples, sans engagement, pensés pour les professionnels algériens.
                Payez uniquement pour la visibilité dont vous avez besoin. Pas de frais cachés.
            </p>
        </section>

        {/* --- 2. CATEGORY SELECTOR --- */}
        <section className="flex justify-center">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl shadow-inner">
                {(Object.keys(PRICING_CONFIG) as PricingCategory[]).map((cat) => {
                    const isActive = activeCategory === cat;
                    const config = PRICING_CONFIG[cat];
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                isActive 
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            <config.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-white' : ''}`} />
                            {config.label}
                        </button>
                    );
                })}
            </div>
        </section>

        {/* --- 3. PACKS GRID (4 Columns on Desktop) --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {PLANS.map((plan: any) => {
                const isCurrent = packCode === plan.id;
                const canRenew = isCurrent && (status === 'expired' || status === 'expiring');
                const isButtonDisabled = isCurrent && !canRenew && !plan.isQuote;
                
                return (
                <div 
                    key={plan.id}
                    className={`
                        relative rounded-3xl p-6 flex flex-col transition-all duration-300 border-2
                        ${plan.color} ${plan.bg} 
                        ${plan.highlight ? 'shadow-xl ring-4 ring-blue-500/10 scale-[1.02] z-10' : 'shadow-sm hover:shadow-md'}
                    `}
                >
                    {/* Badge Recommandé */}
                    {plan.highlight && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg flex items-center gap-1 whitespace-nowrap">
                            <Icons.Star className="w-3 h-3 fill-white" /> Recommandé
                        </div>
                    )}

                    {/* Badge Pro Premium (Sur devis) */}
                    {plan.badge && (
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-white/10">
                            {plan.badge}
                        </div>
                    )}
                    
                    {/* Badge Actuel */}
                    {isCurrent && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1">
                            <Icons.Check className="w-3 h-3" /> Actif
                        </div>
                    )}

                    {/* Niveau 1: Nom & Cible */}
                    <div className="mb-6 text-center">
                        <h3 className={`text-xl font-bold mb-2 ${plan.textColor}`}>{plan.name}</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-2">
                            <span className={`text-2xl font-extrabold tracking-tight ${plan.textColor}`}>{plan.price}</span>
                            {plan.period && <span className={`text-xs font-medium ${plan.subTextColor}`}>{plan.period}</span>}
                        </div>
                        <p className={`text-xs leading-snug min-h-[32px] ${plan.subTextColor}`}>
                            {plan.target}
                        </p>
                    </div>

                    <div className={`w-full h-px mb-6 ${plan.isQuote ? 'bg-slate-700' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

                    {/* Niveau 2: Bénéfices */}
                    <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feat: string, idx: number) => (
                            <li key={idx} className={`flex items-start gap-3 text-xs font-medium ${plan.isQuote ? 'text-slate-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${plan.featureIconColor}`}>
                                   <Icons.Check className="w-3 h-3" />
                                </div>
                                <span className="leading-snug">{feat}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Niveau 3: Action */}
                    <div className="mt-auto">
                        <button
                            onClick={() => plan.isQuote ? setShowQuoteModal(true) : handleSelectPack(plan.id)}
                            disabled={isButtonDisabled}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                                isButtonDisabled
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                                : plan.buttonStyle
                            }`}
                        >
                            {plan.isQuote
                                ? plan.cta
                                : (isCurrent 
                                    ? (status === 'expired' ? 'Renouveler' : status === 'expiring' ? 'Renouveler' : 'Pack Actif') 
                                    : plan.cta)
                            }
                            {!isButtonDisabled && <Icons.ArrowLeft className="w-3 h-3 rotate-180" />}
                        </button>
                        {plan.isQuote && (
                            <p className="text-[9px] text-slate-400 text-center mt-3 leading-tight">
                                Offre personnalisée – réponse sous 24h ouvrées.<br/>
                                Import auto hors pack – commission uniquement.
                            </p>
                        )}
                    </div>
                </div>
            )})}
        </section>

        {/* --- 4. BOOSTS (USAGE) --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full mb-4">
                    <Icons.Zap className="w-6 h-6 fill-current" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Boosts à la demande
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Accélérez vos ventes quand vous en avez besoin. Disponibles pour les packs <strong>Pro Plus</strong> et <strong>Pro Max</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {BOOSTS.map((boost, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col text-center hover:border-yellow-400 transition-colors">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{boost.name}</h4>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{boost.duration}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{boost.desc}</p>
                        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{boost.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* --- 5. LOYALTY PROGRAM --- */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-indigo-200 text-xs font-bold mb-4 border border-white/10">
                        <Icons.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        Programme Fidélité
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Gagnez des Points Wesh</h2>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Plus vous êtes actif, plus vous êtes récompensé. Utilisez vos points pour obtenir des boosts gratuits ou des remises sur vos abonnements.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-yellow-400">+100</div>
                            <span className="font-medium">Points par mois (Pack Pro Plus)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-yellow-400">+200</div>
                            <span className="font-medium">Points par mois (Pack Pro Max)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-yellow-400">+20</div>
                            <span className="font-medium">Par annonce complétée à 100%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Icons.ShoppingBag className="w-5 h-5" />
                        Boutique de Points
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span>1 Boost Visibilité</span>
                            <span className="font-bold text-yellow-400">100 pts</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span>Réduction Boost -20%</span>
                            <span className="font-bold text-yellow-400">150 pts</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span>Boost Store (7j)</span>
                            <span className="font-bold text-yellow-400">200 pts</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                            <span>1 mois Pro Plus offert</span>
                            <span className="font-bold text-yellow-400">500 pts</span>
                        </div>
                    </div>
                    <p className="text-xs text-indigo-300 mt-4 text-center">
                        * Les points ne sont ni convertibles en cash, ni transférables.
                    </p>
                </div>
            </div>
        </section>

        {/* --- 6. IMPORT AUTO --- */}
        <section className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Professionnels de l'Import Auto ?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm mb-6">
                Le module d'importation est un service exclusif <strong>hors packs</strong>, réservé aux partenaires contractuels.
                Rémunération par commission uniquement en cas de vente réussie.
            </p>
            <button 
                onClick={() => navigate('/import-entry?intent=publish')}
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black dark:hover:bg-gray-700 transition-colors"
            >
                <Icons.FileText className="w-4 h-4" />
                Demander un partenariat Import
            </button>
        </section>

        {/* --- 7. CGU SUMMARY --- */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-8 border-t border-gray-100 dark:border-gray-800 max-w-3xl mx-auto space-y-2">
            <p className="font-bold uppercase tracking-widest">Conditions Générales Simplifiées</p>
            <p>
                Les abonnements sont mensuels et sans engagement de durée. Les Boosts sont des achats uniques non remboursables après activation.
                Les Points de fidélité sont des avantages promotionnels à la discrétion de WeshKlik.
                L'accès aux fonctionnalités "Pro" nécessite la validation des documents légaux (RC/NIF).
            </p>
        </div>

      </main>

      {/* --- QUOTE MODAL --- */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-gray-200 dark:border-gray-800 overflow-hidden">
                {quoteSent ? (
                    <div className="text-center py-10 animate-in zoom-in">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icons.Check className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Demande reçue !</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Notre équipe commerciale dédiée aux Grands Comptes vous contactera sous <strong>24h ouvrées</strong> avec une offre personnalisée.
                        </p>
                        <button onClick={closeQuoteModal} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                            Fermer
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Demande de devis Premium</h3>
                            <button type="button" onClick={closeQuoteModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Configurez votre besoin. Offre réservée aux structures à fort volume.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Société / Store</label>
                                <input required type="text" value={quoteForm.storeName} onChange={e => setQuoteForm({...quoteForm, storeName: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nom & Prénom</label>
                                <input required type="text" value={quoteForm.contactName} onChange={e => setQuoteForm({...quoteForm, contactName: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                                <input required type="tel" value={quoteForm.phone} onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Pro</label>
                                <input required type="email" value={quoteForm.email} onChange={e => setQuoteForm({...quoteForm, email: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Volume souhaité (Annonces actives)</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 hover:border-indigo-500 transition-colors">
                                    <input type="radio" name="volume" value="100-500" checked={quoteForm.volume === '100-500'} onChange={e => setQuoteForm({...quoteForm, volume: e.target.value})} className="text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-medium dark:text-white">100 à 500</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 hover:border-indigo-500 transition-colors">
                                    <input type="radio" name="volume" value="500+" checked={quoteForm.volume === '500+'} onChange={e => setQuoteForm({...quoteForm, volume: e.target.value})} className="text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-medium dark:text-white">500 et plus</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Catégorie Principale</label>
                            <select value={quoteForm.category} onChange={e => setQuoteForm({...quoteForm, category: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white">
                                <option value="auto">Automobile / Transport</option>
                                <option value="immo">Immobilier</option>
                                <option value="services">Services / E-commerce</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <input type="checkbox" checked={quoteForm.apiInterest} onChange={e => setQuoteForm({...quoteForm, apiInterest: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                            <span className="text-sm text-indigo-900 dark:text-indigo-200">Je suis intéressé par l'accès API (Intégration CRM/ERP)</span>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                                Envoyer la demande
                            </button>
                            <p className="text-[10px] text-center text-gray-400 mt-3">
                                En envoyant ce formulaire, vous acceptez d'être recontacté par l'équipe commerciale WeshKlik.
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
      )}

    </div>
  );
};
