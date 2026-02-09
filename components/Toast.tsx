
import React, { useEffect } from 'react';
import { Icons } from './Icons';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  const icons = {
    success: Icons.Check,
    error: Icons.AlertCircle,
    info: Icons.Info
  };

  const Icon = icons[type];

  return (
    <div className="fixed bottom-6 right-6 z-[120] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`${bgColors[type]} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 pr-10 relative max-w-sm border border-white/10`}>
        <div className="p-1 bg-white/20 rounded-full shrink-0">
            <Icon className="w-4 h-4" />
        </div>
        <p className="text-sm font-bold leading-tight">{message}</p>
        <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors">
            <Icons.X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
