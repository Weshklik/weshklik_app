
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-800">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icons.Shield className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Accès Refusé</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Cette page est réservée aux comptes <strong>Professionnels</strong>. 
          Votre compte actuel ne dispose pas des droits nécessaires.
        </p>
        
        <div className="space-y-3">
          <button 
             onClick={() => navigate('/create-store')}
             className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
             Passer en compte Pro
          </button>
          <Link 
             to="/"
             className="block w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
          >
             Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};
