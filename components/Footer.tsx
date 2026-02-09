
import React from 'react';
import { Icons } from './Icons';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-12 pb-24 md:pb-12 transition-colors duration-300 relative z-40">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-4">
              <div className="bg-brand-600 text-white p-1 rounded-lg">
                <Icons.Store className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-brand-900 dark:text-white tracking-tight">Wesh<span className="text-brand-600">Klik</span></span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              La marketplace algérienne de référence pour l'achat, la vente et les services.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Découvrir</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/search" className="hover:text-brand-600 dark:hover:text-brand-400">Annonces</Link></li>
              <li><Link to="/find-partner" className="hover:text-brand-600 dark:hover:text-brand-400">Trouver un Partenaire</Link></li>
              <li><Link to="/import" className="hover:text-brand-600 dark:hover:text-brand-400">Import Auto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Professionnels</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/create-store" className="hover:text-brand-600 dark:hover:text-brand-400">Créer un Store</Link></li>
              <li><Link to="/pro-plans" className="hover:text-brand-600 dark:hover:text-brand-400">Tarifs & Packs</Link></li>
              <li><Link to="/partner-entry" className="hover:text-brand-600 dark:hover:text-brand-400">Devenir Partenaire Achat</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Aide</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Sécurité</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* STEP 7 & 9: MANDATORY LEGAL DISCLAIMER */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6 text-center border border-gray-100 dark:border-gray-700/50">
                <h5 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-2">Mentions Légales Partenaires</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
                    WeshKlik n’intervient pas dans le paiement du produit lors des transactions via un <strong>Partenaire d'Achat</strong>. 
                    Le règlement est effectué directement entre l’acheteur et le partenaire d’achat (Cash, CCP, Main propre).
                    L’abonnement WeshKlik "Partenaire" correspond uniquement à un service de mise en relation digitale et de visibilité dans l'annuaire.
                    WeshKlik ne prélève aucune commission sur les transactions réalisées hors plateforme.
                </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 text-xs text-gray-400">
                <p>© {new Date().getFullYear()} WeshKlik Algérie. Tous droits réservés.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">CGU</a>
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Confidentialité</a>
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Mentions Légales</a>
                </div>
            </div>
        </div>

      </div>
    </footer>
  );
};
