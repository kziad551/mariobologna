// app/lib/scrollFlag.ts
export const SCROLL_TO_PRODUCTS_FLAG = 'scrollToProducts';

export const markScrollToProducts = () => {
  try { 
    sessionStorage.setItem(SCROLL_TO_PRODUCTS_FLAG, '1'); 
  } catch {
    // Silently fail if sessionStorage is not available
  }
};
