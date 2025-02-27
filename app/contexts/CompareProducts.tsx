import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {ProductCardFragment} from 'storefrontapi.generated';

type CompareProductType = ProductCardFragment & {metafields?: any[]};

interface CompareContextProps {
  compareProducts: CompareProductType[];
  toggleCompareProducts: (
    item: ProductCardFragment | CompareProductType,
  ) => void;
  clearCompareProducts: () => void;
}

const CompareContext = createContext<CompareContextProps>({
  compareProducts: [],
  toggleCompareProducts: () => {},
  clearCompareProducts: () => {},
});

export const CompareProductProvider = ({children}: {children: ReactNode}) => {
  const [compareProducts, setCompareProducts] = useState<CompareProductType[]>(
    () => {
      if (typeof window !== 'undefined') {
        // Read from local storage on initial load
        const savedProducts = localStorage.getItem('compare');
        return savedProducts
          ? (JSON.parse(savedProducts) as CompareProductType[])
          : [];
      }
      return [];
    },
  );

  const toggleCompareProducts = async (
    item: ProductCardFragment | CompareProductType,
  ) => {
    let updatedItems = [];
    const isItemInCompare = compareProducts.some(
      (compareItem) => compareItem.id === item.id,
    );
    if (isItemInCompare) {
      updatedItems = compareProducts.filter(
        (compareItem) => compareItem.id !== item.id,
      );
    } else if (compareProducts.length < 4) {
      const productID = item.id.split('/').pop();
      const response = await fetch('/api/products/metafields', {
        method: 'POST',
        body: JSON.stringify({ID: productID}),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
      });
      const result = (await response.json()) as any;
      if (result.success) {
        updatedItems = [...compareProducts, {...item, metafields: result.data}];
      } else {
        console.log('result', result);
        updatedItems = [...compareProducts, item];
      }
    } else {
      updatedItems = [...compareProducts];
    }
    setCompareProducts(updatedItems);
  };

  const clearCompareProducts = () => {
    setCompareProducts([]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save compare products to local storage whenever it changes
      localStorage.setItem('compare', JSON.stringify(compareProducts));
    }
  }, [compareProducts]);

  return (
    <CompareContext.Provider
      value={{compareProducts, toggleCompareProducts, clearCompareProducts}}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompareProducts = (): CompareContextProps => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error(
      'useCompareProducts must be used within a CompareProductProvider',
    );
  }
  return context;
};
