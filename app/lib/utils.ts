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
    const response = await fetch('/api/bag/checkout/create_cart', {
      method: 'POST',
      body: JSON.stringify({lines}),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });
    const result = (await response.json()) as any;
    if (typeof result === 'string') {
      navigate(result, {replace: true});
    }

    if (result.success) {
      const checkoutUrl = result.data.checkoutUrl;
      window.location.href = checkoutUrl;
    }
  } catch (error: any) {
    console.log(error.message);
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
