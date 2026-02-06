
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  
  const [role, setRole] = useState<'individual' | 'pro'>(intent === 'pro' ? 'pro' : 'individual');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API registration then auto-login
    login('individual');
    navigate('/');
  };

  const handleProRedirect = () => {
    // Redirect to the dedicated Pro creation wizard
    navigate('/create-store');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Rejoignez la communauté WeshKlik.</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
          <button
            onClick={() => setRole('individual')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              role === 'individual' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Particulier
          </button>
          <button
            onClick={() => setRole('pro')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              role === 'pro' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Professionnel
          </button>
        </div>

        {role === 'individual' ? (
          <form onSubmit={handleIndividualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
              <input type="text" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" required placeholder="Ex: Amine B." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de téléphone</label>
              <input type="tel" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" required placeholder="0550..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
              <input type="password" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" required placeholder="••••••••" />
            </div>
            
            <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
              S'inscrire
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
             <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icons.Store className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-gray-900 dark:text-white text-lg">Vous êtes un professionnel ?</h3>
             <p className="text-sm text-gray-600 dark:text-gray-300">
               Pour garantir la qualité de notre marketplace, les comptes Pros nécessitent la création d'un <strong>Store Vérifié</strong> (RC & NIF).
             </p>
             <button 
               onClick={handleProRedirect}
               className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
             >
               <Icons.PlusCircle className="w-5 h-5" />
               Créer mon Store Pro
             </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Déjà inscrit ?</span>{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};
