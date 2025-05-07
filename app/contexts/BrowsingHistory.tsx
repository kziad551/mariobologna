import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from '@remix-run/react';

interface BrowsingHistoryContextType {
  previousPage: string | null;
  currentPage: string | null;
  setPreviousPage: (page: string) => void;
}

const BrowsingHistoryContext = createContext<BrowsingHistoryContextType>({
  previousPage: null,
  currentPage: null,
  setPreviousPage: () => {},
});

export const useBrowsingHistory = () => useContext(BrowsingHistoryContext);

export const BrowsingHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // When location changes, update history
    if (typeof window !== 'undefined') {
      // Save current page before updating
      if (currentPage && currentPage !== location.pathname + location.search) {
        setPreviousPage(currentPage);
        // Store in localStorage for persistence across refreshes
        localStorage.setItem('previousPage', currentPage);
      }
      
      // Update current page
      setCurrentPage(location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    // On initial load, try to restore from localStorage
    if (typeof window !== 'undefined' && !previousPage) {
      const savedPreviousPage = localStorage.getItem('previousPage');
      if (savedPreviousPage) {
        setPreviousPage(savedPreviousPage);
      }
    }
  }, []);

  const contextValue = {
    previousPage,
    currentPage,
    setPreviousPage,
  };

  return (
    <BrowsingHistoryContext.Provider value={contextValue}>
      {children}
    </BrowsingHistoryContext.Provider>
  );
}; 