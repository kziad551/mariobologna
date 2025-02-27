// src/context/WishlistContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {ProductCardFragment} from 'storefrontapi.generated';

interface WishlistContextProps {
  wishlist: ProductCardFragment[];
  toggleWishlist: (item: ProductCardFragment) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextProps>({
  wishlist: [],
  toggleWishlist: () => {},
  clearWishlist: () => {},
});

export const WishlistProvider = ({children}: {children: ReactNode}) => {
  const [wishlist, setWishlist] = useState<ProductCardFragment[]>(() => {
    if (typeof window !== 'undefined') {
      // Read from local storage on initial load
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist
        ? (JSON.parse(savedWishlist) as ProductCardFragment[])
        : [];
    }
    return [];
  });

  const toggleWishlist = (item: ProductCardFragment) => {
    setWishlist((prevWishlist) => {
      const isItemInWishlist = prevWishlist.some(
        (wishlistItem) => wishlistItem.id === item.id,
      );
      if (isItemInWishlist) {
        return prevWishlist.filter(
          (wishlistItem) => wishlistItem.id !== item.id,
        );
      } else {
        return [...prevWishlist, item];
      }
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save wishlist to local storage whenever it changes
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{wishlist, toggleWishlist, clearWishlist}}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextProps => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
