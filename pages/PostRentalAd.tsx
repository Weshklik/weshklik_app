
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

export const PostRentalAd: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
         <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.Key className="w-8 h-8" />
         </div>
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Formulaire Location PRO</h1>
         <p className="text-gray-600 dark:text-gray-400 mb-6">
            Le module de publication avancé pour les locations (Gestion planning, Tarifs saisonniers, Options) est en cours de déploiement.
         </p>
         <button onClick={() => navigate('/pro-dashboard')} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700">
            Retour Dashboard
         </button>
      </div>
    </div>
  );
};
