
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

/**
 * IMPORT ENTRY POINT (Action Route)
 * -------------------------------------------
 * Centralizes the user intent decision for the "Import Auto" service.
 * Determines the downstream flow (Request vs Publish vs Create Store).
 * REQUIRES AUTHENTICATION.
 * 
 * Supports query param `?intent=request` or `?intent=publish` to customize UI text and default highlighting.
 */
export const ImportEntry: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Get Intent (default to 'request' for buying flow)
  const intent = searchParams.get('intent') || 'request';
  const isRequest = intent === 'request';

  useEffect(() => {
    if (!isAuthenticated) {
        // Redirect to login while preserving the original intent in the 'from' state
        navigate('/login', { 
            state: { 
                intent: 'import', 
                from: `/import-entry?intent=${intent}` 
            }, 
            replace: true 
        });
    }
  }, [isAuthenticated, navigate, intent]);

  const handleChoice = (path: string) => {
    navigate(path);
  };

  // Prevent flash of content if redirecting
  if (!isAuthenticated) return null;

  // --- UI CONFIGURATION BASED ON INTENT ---
  
  const title = isRequest ? "Importer un véhicule" : "Publier une offre Import";
  const subtitle = isRequest 
    ? "Choisissez votre profil pour lancer votre demande d’importation." 
    : "Choisissez votre profil pour accéder à l’espace dédié.";

  // Styles helpers
  const primaryStyle = "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30";
  const secondaryStyle = "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700";
  
  const iconPrimaryStyle = "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm";
  const iconSecondaryStyle = "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-200";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Icons.Plane className="w-8 h-8" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {subtitle}
          </p>
        </div>

        {/* Options Stack */}
        <div className="space-y-4">
          
          {/* Option 1: Particulier (ONLY if Request Intent) */}
          {isRequest && (
            <button 
                onClick={() => handleChoice('/import-request')}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group relative overflow-hidden ${primaryStyle}`}
            >
                <div className={`p-3 rounded-full transition-colors z-10 ${iconPrimaryStyle}`}>
                <Icons.User className="w-6 h-6" />
                </div>
                <div className="z-10">
                <h4 className="font-bold text-gray-900 dark:text-white">Je suis Particulier</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Je souhaite commander un véhicule.
                </p>
                </div>
                {/* Hover Decorator */}
                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200 z-0" />
            </button>
          )}

          {/* Option 2: Pro Store (Primary if Publish, Secondary if Request) */}
          <button 
            onClick={() => handleChoice('/post?category=auto&subCategory=import_auto&mode=pro_bypass')}
            className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group relative overflow-hidden ${!isRequest ? primaryStyle : secondaryStyle}`}
          >
            <div className={`p-3 rounded-full transition-colors z-10 ${!isRequest ? iconPrimaryStyle : iconSecondaryStyle}`}>
               <Icons.Store className="w-6 h-6" />
            </div>
            <div className="z-10">
              <h4 className="font-bold text-gray-900 dark:text-white">Je suis Pro <span className="font-normal text-gray-500 text-xs">(Avec Store)</span></h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                 {isRequest ? "Accéder à mon espace Import Pro." : "Publier et gérer des offres Import."}
              </p>
            </div>
             {/* Hover Decorator */}
             {!isRequest && <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200 z-0" />}
          </button>

          {/* Option 3: Pro No Store (Always Secondary/Dashed) */}
          <button 
            onClick={() => handleChoice('/create-store')}
            className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left flex items-center gap-4 opacity-80 hover:opacity-100 transition-all duration-200 group"
          >
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-full text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
               <Icons.PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-300">Je suis Pro <span className="font-normal text-gray-400 text-xs">(Sans Store)</span></h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Créer mon Store Pro.</p>
            </div>
          </button>

        </div>

        {/* Footer Action */}
        <button 
          onClick={() => handleChoice('/import')}
          className="w-full mt-6 py-2 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Revenir à la découverte
        </button>

        {/* Reassurance Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
           <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
             <Icons.Shield className="w-3 h-3 inline-block mr-1 mb-0.5" />
             Import Auto est un service sécurisé opéré par des partenaires professionnels sélectionnés.
           </p>
        </div>

      </div>
    </div>
  );
};
