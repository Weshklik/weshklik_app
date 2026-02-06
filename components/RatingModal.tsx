
import React, { useState } from 'react';
import { Icons } from './Icons';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  partnerName: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit, partnerName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Noter {partnerName}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Comment s'est passée votre transaction ?
            </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                    <Icons.Star 
                        className={`w-8 h-8 ${
                            star <= (hoveredRating || rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-700'
                        }`} 
                    />
                </button>
            ))}
        </div>

        {/* Comment */}
        <div className="mb-6">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Écrivez un commentaire (optionnel)..."
                rows={3}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white resize-none"
            />
        </div>

        <div className="flex gap-3">
            <button 
                onClick={onClose}
                className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
                Annuler
            </button>
            <button 
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`flex-1 py-3 rounded-xl text-white font-bold transition-all shadow-lg ${
                    rating > 0 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' 
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
            >
                Envoyer
            </button>
        </div>

      </div>
    </div>
  );
};
