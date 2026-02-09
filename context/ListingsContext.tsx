
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../data';

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (listing: Listing) => void;
  deleteListing: (id: string) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

  const addListing = (listing: Listing) => {
    // Add to top of list
    setListings(prev => [listing, ...prev]);
  };

  const updateListing = (updated: Listing) => {
    setListings(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <ListingsContext.Provider value={{ listings, addListing, updateListing, deleteListing }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) throw new Error('useListings must be used within ListingsProvider');
  return context;
};
