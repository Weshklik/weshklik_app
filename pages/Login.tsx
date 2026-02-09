
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/Icons';

// RÈGLE 1: QA Zone uniquement en DEV
// Pour la démo, on force à true. En prod réelle : process.env.NODE_ENV === 'development'
const SHOW_QA_ZONE = true; 

export const Login: React.FC = () => {
  const { login, debugLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Logic to handle intent from navigation (state or URL param)
  const searchParams = new URLSearchParams(location.search);
  const urlIntent = searchParams.get('intent');
  const stateIntent = location.state?.intent;
  
  const fromPathObj = location.state?.from;
  const fromPath = typeof fromPathObj === 'string' ? fromPathObj : fromPathObj?.pathname || '/';
  
  const isProIntent = 
    stateIntent === 'pro' || 
    urlIntent === 'pro' ||
    fromPath.includes('/create-store') || 
    fromPath.includes('/pro-dashboard') ||
    fromPath.includes('/become-pro') ||
    fromPath.includes('/pro-entry'); // Added pro-entry
  
  // State
  const [activeTab, setActiveTab] = useState<'individual' | 'pro'>('individual');
  const [email, setEmail] = useState(isProIntent ? 'pro@autoluxe.dz' : '0550123456');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  
  // Error States (Simulating Supabase responses)
  const [errorState, setErrorState] = useState<{
    type: 'not_found' | 'wrong_password' | null;
    message: string | null;
  }>({ type: null, message: null });

  const isOnboarding = ['/create-store', '/become-pro', '/pro-plans'].some(path => fromPath.startsWith(path));

  // Reset error when user types
  useEffect(() => {
    setErrorState({ type: null, message: null });
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we are in "User Not Found" state, the main button becomes a "Create Account" trigger
    if (errorState.type === 'not_found') {
        navigate('/register?intent=pro');
        return;
    }

    setIsLoading(true);
    setErrorState({ type: null, message: null });

    // --- SIMULATION LOGIC (MOCK BACKEND) ---
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network request

    // 1. Case: User Not Found (Trigger: email contains 'new')
    if (email.includes('new')) {
        setErrorState({
            type: 'not_found',
            message: 'Aucun compte n’a été trouvé avec ces informations.'
        });
        setIsLoading(false);
        return;
    }

    // 2. Case: Wrong Password (Trigger: password is not 'password123')
    if (password !== 'password123') {
        setErrorState({
            type: 'wrong_password',
            message: 'Mot de passe incorrect.'
        });
        setIsLoading(false);
        return;
    }

    // 3. Case: Success
    // Determine simulated role based on input/intent for the Mock Context
    const roleToLogin = isProIntent || email.includes('@') ? 'pro' : 'individual';
    login(roleToLogin);
    
    // Strict Redirection Logic
    if (isProIntent) {
        navigate('/pro-entry', { replace: true });
    } else {
        navigate(fromPath === '/login' ? '/' : fromPath, { replace: true });
    }
    
    setIsLoading(false);
  };

  // Helper for quick debug login
  const handleDebugLogin = (storeId: string) => {
      debugLogin(storeId);
      navigate('/pro-entry', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-800">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-brand-600 text-white p-2 rounded-xl">
              <Icons.Store className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-brand-900 dark:text-white tracking-tight">Wesh<span className="text-brand-600 dark:text-brand-400">Klik</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isProIntent 
              ? 'Accéder à l’Espace Pro' 
              : (isOnboarding ? 'Finaliser la création' : 'Bienvenue')
            }
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
            {isProIntent
              ? <>Connectez-vous si vous avez déjà un compte.<br/>Sinon, créez-en un pour ouvrir votre store professionnel.</>
              : (isOnboarding 
                  ? "Identifiez-vous pour choisir votre pack et activer votre store."
                  : "Connectez-vous pour accéder à votre espace."
                )
            }
          </p>
        </div>

        {/* Tab Switcher - Hidden if Pro Intent (Future Proof: Single Form) */}
        {!isProIntent && (
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'individual'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icons.User className="w-4 h-4" />
              Particulier
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'pro'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icons.Store className="w-4 h-4" />
              Professionnel
            </button>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleLogin} className="space-y-5">
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {!isProIntent && activeTab === 'individual' ? 'Email ou Téléphone' : 'Email Professionnel'}
             </label>
             <div className="relative">
                <input 
                    type={(!isProIntent && activeTab === 'individual') ? "text" : "email"} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${errorState.type === 'not_found' ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 focus:ring-brand-500'}`}
                    placeholder={(!isProIntent && activeTab === 'individual') ? "0550..." : "contact@store.com"}
                />
                <Icons.User className={`w-5 h-5 absolute left-3 top-3.5 ${errorState.type === 'not_found' ? 'text-red-500' : 'text-gray-400'}`} />
             </div>
           </div>
           
           <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
             </div>
             <div className="relative">
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${errorState.type === 'wrong_password' ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 focus:ring-brand-500'}`}
                    placeholder="••••••••"
                />
                <Icons.Shield className={`w-5 h-5 absolute left-3 top-3.5 ${errorState.type === 'wrong_password' ? 'text-red-500' : 'text-gray-400'}`} />
             </div>
           </div>

           {/* INLINE ERROR MESSAGES */}
           {errorState.message && (
               <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg animate-in slide-in-from-top-2">
                   <Icons.AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                   <div className="flex-1">
                       <p className="font-medium leading-snug">{errorState.message}</p>
                       {errorState.type === 'wrong_password' && (
                           <a href="#" className="text-xs font-bold underline mt-1 block hover:text-red-800 dark:hover:text-red-300">
                               Mot de passe oublié ?
                           </a>
                       )}
                   </div>
               </div>
           )}

           <button 
                type="submit"
                disabled={isLoading}
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
                    errorState.type === 'not_found'
                    ? 'bg-gray-900 text-white hover:bg-black border border-gray-800' // Create Account State
                    : (activeTab === 'individual' || isProIntent
                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20')
                } ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
           >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                    errorState.type === 'not_found' 
                        ? <>Créer mon compte Pro <Icons.ArrowLeft className="w-4 h-4 rotate-180" /></>
                        : 'Continuer'
                )}
           </button>
        </form>

        {/* Dynamic Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          {isProIntent ? (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Vous n’avez pas encore de compte Pro ?</span>{' '}
                <Link to="/register?intent=pro" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Créer un compte</Link>
              </div>
          ) : (
              (activeTab === 'individual') ? (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Pas encore de compte ?</span>{' '}
                    <Link to="/register" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">S'inscrire gratuitement</Link>
                  </div>
              ) : (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 text-left flex items-start gap-3">
                      <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-full text-indigo-600 dark:text-indigo-300 shrink-0">
                          <Icons.PlusCircle className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Vous êtes un professionnel ?</p>
                          <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 mb-2">Digitalisez votre commerce et touchez des milliers de clients.</p>
                          <Link to="/create-store" className="text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1">
                              Créez votre Store en 2 minutes <Icons.ArrowLeft className="w-3 h-3 rotate-180" />
                          </Link>
                      </div>
                  </div>
              )
          )}
          
          {!isProIntent && activeTab === 'individual' && (
             <div className="mt-6">
                <button onClick={() => setActiveTab('pro')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                   Vous êtes professionnel ? Connectez-vous ici.
                </button>
             </div>
          )}
        </div>
      </div>

      {/* --- DEBUG SECTION (QA ZONE) --- */}
      {SHOW_QA_ZONE && (
        <div className="mt-8 max-w-md w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 border-l-4 border-l-yellow-500">
           <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 text-center flex items-center justify-center gap-2">
             <Icons.Wrench className="w-3 h-3" />
             ACCÈS RAPIDE (STORES MOCK)
           </h4>
           <div className="grid grid-cols-2 gap-2">
              <button 
                  onClick={() => handleDebugLogin('u1')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                  <Icons.Car className="w-3 h-3" /> Auto Luxe (Gold)
              </button>
              <button 
                  onClick={() => handleDebugLogin('u_import')} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                  <Icons.Plane className="w-3 h-3" /> Expert Import (Gold)
              </button>
              <button 
                  onClick={() => handleDebugLogin('u2')} 
                  className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                  <Icons.Home className="w-3 h-3" /> Immo Prestige (Silver)
              </button>
              <button 
                  onClick={() => handleDebugLogin('u4')} 
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                  <Icons.Laptop className="w-3 h-3" /> Tech Store (Free)
              </button>
              <button 
                  onClick={() => { login('individual'); navigate('/'); }} 
                  className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 col-span-2"
              >
                  <Icons.User className="w-3 h-3" /> Compte Particulier
              </button>
           </div>
        </div>
      )}

    </div>
  );
};
