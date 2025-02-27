// src/context/WishlistContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {ProductCardFragment} from 'storefrontapi.generated';

interface ViewedProductsContextProps {
  viewedProducts: ProductCardFragment[];
  addViewedProducts: (item: ProductCardFragment) => void;
  removeViewedProduct: (item: ProductCardFragment) => void;
  clearViewedProducts: () => void;
}

const ViewedProductsContext = createContext<ViewedProductsContextProps>({
  viewedProducts: [],
  addViewedProducts: () => {},
  removeViewedProduct: () => {},
  clearViewedProducts: () => {},
});

export const ViewedProductsProvider = ({children}: {children: ReactNode}) => {
  const [viewedProducts, setViewedProducts] = useState<ProductCardFragment[]>(
    () => {
      if (typeof window !== 'undefined') {
        // Read from local storage on initial load
        const productList = localStorage.getItem('viewed_products');
        return productList
          ? (JSON.parse(productList) as ProductCardFragment[])
          : [];
      }
      return [];
    },
  );

  const addViewedProducts = (item: ProductCardFragment) => {
    setViewedProducts((prevList) => {
      const isItemInList = prevList.some((product) => product.id === item.id);
      if (!isItemInList) {
        return [item, ...prevList];
      }
      return [...prevList];
    });
  };

  const removeViewedProduct = (item: ProductCardFragment) => {
    setViewedProducts((prevList) => {
      return prevList.filter((product) => product.id !== item.id);
    });
  };

  const clearViewedProducts = () => {
    setViewedProducts([]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save wishlist to local storage whenever it changes
      localStorage.setItem('viewed_products', JSON.stringify(viewedProducts));
    }
  }, [viewedProducts]);

  return (
    <ViewedProductsContext.Provider
      value={{
        viewedProducts,
        addViewedProducts,
        clearViewedProducts,
        removeViewedProduct,
      }}
    >
      {children}
    </ViewedProductsContext.Provider>
  );
};

export const useViewedProducts = (): ViewedProductsContextProps => {
  const context = useContext(ViewedProductsContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
