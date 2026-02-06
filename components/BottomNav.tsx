
import React from 'react';
import { Icons } from './Icons';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center justify-center gap-1 w-full h-full ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`;

  // --- UNIVERSE LOGIC ---
  const isImportUniverse = location.pathname.includes('import');
  const isProUniverse = location.pathname.includes('pro') || location.pathname.includes('store') || user?.type === 'pro';

  let ctaConfig = {
    label: 'Publier',
    path: '/post',
    bg: 'bg-accent-500', // Orange
    shadow: 'shadow-accent-500/40',
    icon: Icons.PlusCircle,
    color: 'text-accent-600 dark:text-accent-400' // Text color below button
  };

  if (isImportUniverse) {
    ctaConfig = {
      label: 'Import',
      path: '/import-entry',
      bg: 'bg-indigo-600',
      shadow: 'shadow-indigo-500/40',
      icon: Icons.Plane,
      color: 'text-indigo-600 dark:text-indigo-400'
    };
  } else if (isProUniverse) {
    ctaConfig = {
      label: 'Pro',
      path: '/post',
      bg: 'bg-brand-600', // Blue
      shadow: 'shadow-brand-600/40',
      icon: Icons.Store,
      color: 'text-brand-600 dark:text-brand-400'
    };
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 h-16 pb-safe z-50 flex items-center justify-around px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <NavLink to="/" className={navClass}>
        <Icons.Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Accueil</span>
      </NavLink>
      <NavLink to="/search" className={navClass}>
        <Icons.Search className="w-6 h-6" />
        <span className="text-[10px] font-medium">Explorer</span>
      </NavLink>
      
      {/* Dynamic Central Button */}
      <NavLink to={ctaConfig.path} className="flex flex-col items-center justify-center -mt-6 group">
        <div className={`${ctaConfig.bg} text-white p-3 rounded-full shadow-lg ${ctaConfig.shadow} group-active:scale-95 transition-transform`}>
          <ctaConfig.icon className="w-7 h-7" />
        </div>
        <span className={`text-[10px] font-medium mt-1 ${ctaConfig.color}`}>{ctaConfig.label}</span>
      </NavLink>

      <NavLink to="/favorites" className={navClass}>
        <Icons.Heart className="w-6 h-6" />
        <span className="text-[10px] font-medium">Favoris</span>
      </NavLink>
      <NavLink to="/account" className={navClass}>
        <Icons.User className="w-6 h-6" />
        <span className="text-[10px] font-medium">Compte</span>
      </NavLink>
    </div>
  );
};
