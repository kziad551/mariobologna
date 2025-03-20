import {NavigateFunction} from '@remix-run/react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import {countries} from '~/data/countries';

import type {I18nLocale} from './type';
import {currencyType} from '~/data/currencies';

export function missingClass(string?: string, prefix?: string) {
  if (!string) {
    return true;
  }

  const regex = new RegExp(` ?${prefix}`, 'g');
  return string.match(regex) === null;
}

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: '',
});

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

export function usePrefixPathWithLocale(path: string) {
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;

  return `${selectedLocale.pathPrefix}${
    path.startsWith('/') ? path : '/' + path
  }`;
}

export function parseAsCurrency(value: number, currency: currencyType) {
  return new Intl.NumberFormat('EN' + '-' + currency.countryCode, {
    style: 'currency',
    currency: currency.currency['en'],
  }).format(value);
}

export function formatDateToDM(dateString: string, range?: number): string {
  const date = new Date(dateString);
  if (range) {
    date.setDate(date.getDate() + range);
  }
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-based month
  return `${day}/${month}`;
}

export const toggleDesigner = (
  setSelectedDesigners: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: string;
      }[]
    >
  >,
  designer: {[key: string]: string},
) => {
  setSelectedDesigners((prevSelected) =>
    prevSelected.some((d) => d === designer)
      ? prevSelected.filter((d) => d !== designer)
      : [...prevSelected, designer],
  );
};

export const handleCreateCheckout = async ({
  lines,
  navigate,
}: {
  lines: CartLineInput[];
  navigate: NavigateFunction;
}) => {
  try {
    console.log('Starting Buy Now process with lines:', lines);
    
    // Check if lines are valid
    if (!lines || !lines.length || !lines[0].merchandiseId) {
      console.error('Invalid lines for checkout:', lines);
      alert('Please select a valid product variant');
      return;
    }
    
    // First check if user is authenticated
    console.log('Checking authentication status...');
    const checkAuthResponse = await fetch('/api/account/check-auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });
    
    const authResult = await checkAuthResponse.json() as { authenticated: boolean };
    console.log('Authentication result:', authResult);
    
    if (!authResult.authenticated) {
      // Save current page URL for redirect back after login
      const returnTo = window.location.pathname + window.location.search;
      console.log('User not authenticated, redirecting to login with returnTo:', returnTo);
      navigate(`/account/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    
    // Get current cart items
    console.log('Fetching current cart items...');
    const cartResponse = await fetch('/api/bag/get_cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });
    
    // Start with the Buy Now item
    let mergedLines = [...lines];
    
    if (cartResponse.ok) {
      try {
        // Define the cart result type
        type CartResult = {
          success: boolean;
          data?: {
            id?: string;
            lines?: {
              nodes?: Array<{
                id?: string;
                merchandise: {
                  id: string;
                };
                quantity: number;
              }>;
            };
          };
          message?: string;
        };
        
        const cartResult = await cartResponse.json() as CartResult;
        console.log('Current cart response:', cartResult);
        
        // Check if cart has items
        if (cartResult && 
            cartResult.success && 
            cartResult.data && 
            cartResult.data.lines && 
            cartResult.data.lines.nodes && 
            Array.isArray(cartResult.data.lines.nodes) && 
            cartResult.data.lines.nodes.length > 0) {
          
          // Extract cart lines ensuring they have merchandiseId
          const cartLines = cartResult.data.lines.nodes
            .filter(line => line && line.merchandise && line.merchandise.id)
            .map(line => ({
              merchandiseId: line.merchandise.id,
              quantity: line.quantity || 1,
            }));
          
          if (cartLines.length > 0) {
            console.log('Found existing cart lines:', cartLines);
            
            // Check for duplicates and merge quantities instead of adding duplicate items
            const lineMap = new Map<string, CartLineInput>();
            
            // First add the Buy Now item
            for (const line of lines) {
              lineMap.set(line.merchandiseId, {
                merchandiseId: line.merchandiseId,
                quantity: line.quantity || 1
              });
            }
            
            // Then add or merge cart items
            for (const line of cartLines) {
              if (lineMap.has(line.merchandiseId)) {
                // If item already exists, increase quantity
                const existing = lineMap.get(line.merchandiseId);
                if (existing) {
                  existing.quantity = (existing.quantity || 1) + (line.quantity || 1);
                  lineMap.set(line.merchandiseId, existing);
                }
              } else {
                lineMap.set(line.merchandiseId, line);
              }
            }
            
            // Convert back to array
            mergedLines = Array.from(lineMap.values());
            console.log('Merged lines for checkout (with duplicates handled):', mergedLines);
          }
        } else {
          console.log('Cart is empty or has no items');
        }
      } catch (error) {
        console.error('Error parsing cart response:', error);
        // Continue with just the Buy Now item if there's an error
      }
    } else {
      console.error('Error fetching cart, status:', cartResponse.status);
    }
    
    // User is authenticated, proceed with checkout
    console.log('Creating checkout cart with merged lines:', mergedLines);
    const response = await fetch('/api/bag/checkout/create_cart', {
      method: 'POST',
      body: JSON.stringify({lines: mergedLines}),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Cart creation failed, status:', response.status);
      alert('There was a problem creating your cart. Please try again.');
      return;
    }
    
    const result = await response.json();
    console.log('Cart creation result:', result);
    
    if (typeof result === 'string') {
      console.log('Received string result, navigating to:', result);
      navigate(result, {replace: true});
      return;
    }

    // Define the expected result type
    type CheckoutResult = {
      success: boolean;
      data?: { 
        checkoutUrl?: string;
      };
      formError?: string;
    };

    if (result && typeof result === 'object' && 'success' in result && result.success) {
      const checkoutResult = result as CheckoutResult;
      const checkoutUrl = checkoutResult.data?.checkoutUrl;
      console.log('Redirecting to checkout URL:', checkoutUrl);
      if (checkoutUrl && typeof checkoutUrl === 'string') {
        window.location.href = checkoutUrl;
      } else {
        console.error('Invalid checkout URL:', checkoutUrl);
        alert('There was a problem with the checkout URL. Please try again.');
      }
      return;
    }
    
    if (result && typeof result === 'object' && 'formError' in result) {
      console.error('Error creating cart:', result.formError);
      alert('There was a problem processing your order: ' + result.formError);
      return;
    }
    
    console.error('Unknown response format:', result);
    alert('There was an unexpected error. Please try again.');
  } catch (error: any) {
    console.error('Error in handleCreateCheckout:', error);
    alert('There was a problem processing your order. Please try again.');
  }
};

type handleUpdateSelectedVariantType = {
  selectedCardVariant: {
    [id: string]: {
      [key: string]: string;
    };
  };
  productId: string;
  productVariants: ProductCardFragment['variants']['nodes'];
  setCartLine: React.Dispatch<React.SetStateAction<CartLineInput>>;
};

export const handleUpdateSelectedVariant = ({
  productId,
  productVariants,
  selectedCardVariant,
  setCartLine,
}: handleUpdateSelectedVariantType) => {
  const selectedVariant = selectedCardVariant[productId];

  // First, check if this is a single-color product
  const uniqueColors = new Set(
    productVariants.flatMap(variant =>
      variant.selectedOptions
        .filter(opt => opt.name === 'Color')
        .map(opt => opt.value)
    )
  );
  const isSingleColorProduct = uniqueColors.size === 1;

  // If it's a single-color product, we only need to check size availability
  if (isSingleColorProduct) {
    const color = Array.from(uniqueColors)[0];
    const selectedSize = selectedVariant?.Size;

    // If size is selected, find that specific variant
    if (selectedSize) {
      const exactMatch = productVariants.find(variant =>
        variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value === selectedSize)
      );

      if (exactMatch?.availableForSale) {
        setCartLine({
          merchandiseId: exactMatch.id,
          quantity: 1,
        });
        return true;
      }
      return false;
    }

    // If no size selected, return true if any variant is available
    return productVariants.some(variant => variant.availableForSale);
  }

  // For multi-color products, use the existing logic
  const hasAvailableVariant = productVariants.some(variant => variant.availableForSale);
  
  if (!selectedVariant || Object.keys(selectedVariant).length === 0) {
    return hasAvailableVariant;
  }

  const selectedColor = selectedVariant.Color;
  const selectedSize = selectedVariant.Size;

  if (selectedColor && selectedSize) {
    const exactMatch = productVariants.find(variant => {
      return variant.selectedOptions.some(opt => opt.name === 'Color' && opt.value === selectedColor) &&
             variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value === selectedSize);
    });

    if (exactMatch?.availableForSale) {
      setCartLine({
        merchandiseId: exactMatch.id,
        quantity: 1,
      });
      return true;
    }
    return false;
  }

  if (selectedColor) {
    return productVariants.some(variant =>
      variant.availableForSale &&
      variant.selectedOptions.some(opt => opt.name === 'Color' && opt.value === selectedColor)
    );
  }

  if (selectedSize) {
    return productVariants.some(variant =>
      variant.availableForSale &&
      variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value === selectedSize)
    );
  }

  return hasAvailableVariant;
};

export type handleUpdateSelectedVariantsType = {
  selectedCardVariant: {
    [id: string]: {
      [key: string]: string;
    };
  };
  productId: string;
  productVariants: ProductCardFragment['variants']['nodes'];
  setIds: React.Dispatch<
    React.SetStateAction<{
      [id: string]: CartLineInput;
    }>
  >;
};

export const handleUpdateSelectedVariants = ({
  productId,
  productVariants,
  selectedCardVariant,
  setIds,
}: handleUpdateSelectedVariantsType) => {
  const selectedVariant = selectedCardVariant[productId];

  // First, check if this is a single-color product
  const uniqueColors = new Set(
    productVariants.flatMap(variant =>
      variant.selectedOptions
        .filter(opt => opt.name === 'Color')
        .map(opt => opt.value)
    )
  );
  const isSingleColorProduct = uniqueColors.size === 1;

  // If it's a single-color product, we only need to check size availability
  if (isSingleColorProduct) {
    const color = Array.from(uniqueColors)[0];
    const selectedSize = selectedVariant?.Size;

    // If size is selected, find that specific variant
    if (selectedSize) {
      const exactMatch = productVariants.find(variant =>
        variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value === selectedSize)
      );

      if (exactMatch?.availableForSale) {
        setIds((prev) => ({
          ...prev,
          [productId]: {
            merchandiseId: exactMatch.id,
            quantity: 1,
          },
        }));
        return true;
      }
      return false;
    }

    // If no size selected, return true if any variant is available
    return productVariants.some(variant => variant.availableForSale);
  }

  // For multi-color products, use the existing logic
  const hasAvailableVariant = productVariants.some(variant => variant.availableForSale);
  
  if (!selectedVariant || Object.keys(selectedVariant).length === 0) {
    return hasAvailableVariant;
  }

  const selectedColor = selectedVariant.Color;
  const selectedSize = selectedVariant.Size;

  if (selectedColor && selectedSize) {
    const exactMatch = productVariants.find(variant => {
      return variant.selectedOptions.some(opt => opt.name === 'Color' && opt.value === selectedColor) &&
             variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value === selectedSize);
    });

    if (exactMatch?.availableForSale) {
      setIds((prev) => ({
        ...prev,
        [productId]: {
          merchandiseId: exactMatch.id,
          quantity: 1,
        },
      }));
      return true;
    }
    return false;
  }

  if (selectedColor) {
    return productVariants.some(variant =>
      variant.availableForSale &&
      variant.selectedOptions.some(opt => opt.name === 'Color' && opt.value === selectedColor)
    );
  }

  if (selectedSize) {
    return productVariants.some(variant =>
      variant.availableForSale &&
      variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value === selectedSize)
    );
  }

  return hasAvailableVariant;
};

export function calculateSalePercentage(
  originalPrice: string,
  currentPrice: string,
) {
  // Convert the string prices to numbers
  const original = parseFloat(originalPrice);
  const current = parseFloat(currentPrice);

  // Calculate the sale percentage
  const salePercentage = ((original - current) / original) * 100;

  // Return the result rounded to two decimal places
  return salePercentage.toFixed(0);
}

export const collectionTranslations: {
  [key: string]: {
    [lang: string]: string;
  };
} = {
  Men: {
    en: 'Men',
    ar: 'رجال',
  },
  Women: {
    en: 'Women',
    ar: 'نساء',
  },
  Kids: {
    en: 'Kids',
    ar: 'أطفال',
  },
  Designers: {
    en: 'Designers',
    ar: 'المصممون',
  },
  Outlet: {
    en: 'Outlet',
    ar: 'مَنفَذ',
  },
  Sale: {
    en: 'Sale',
    ar: 'تنزيلات',
  },
  Valentine: {
    en: 'Valentine',
    ar: 'عيد الحب',
  },
  'Recommended Products': {
    en: 'Recommended Products',
    ar: 'المنتجات الموصى بها',
  },
  'New Arrivals': {
    en: 'Brand New',
    ar: 'علامة تجارية جديدة',
  },
  'Best Selling': {
    en: 'Top Picks',
    ar: 'أفضل الإختيارات',
  },
};

export type HandleColorSizeValidationType = {
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  ref: React.MutableRefObject<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  productId: string;
  selectedCardVariant: {
    [id: string]: {
      [key: string]: string;
    };
  };
};
export const handleColorSizeValidation = ({
  event,
  ref,
  setMessage,
  productId,
  selectedCardVariant,
}: HandleColorSizeValidationType) => {
  ref.current.closeTrigger();
  const size = selectedCardVariant[productId].Size;
  const color = selectedCardVariant[productId].Color;
  if (size === undefined || color === undefined) {
    event.preventDefault();
    if (size === undefined && color === undefined) {
      setMessage('Please select a color & a size');
    } else if (size && color === undefined) {
      setMessage('Please select a color');
    } else if (size === undefined && color) {
      setMessage('Please select a size');
    }
    ref.current.openTrigger();
  } else {
    setMessage('');
  }
};

export const getUserGeoLocation = async () => {
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const data = (await response.json()) as any;
    return data;
  } catch (error) {
    console.error('Error fetching the country code:', error);
    return 'AE';
  }
};

export const navigateTo = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  link: string,
  navigate: NavigateFunction,
) => {
  event.preventDefault();
  navigate(link);
  event.stopPropagation();
};
