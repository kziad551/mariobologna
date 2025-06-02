import {Link, useNavigate, type FetcherWithComponents} from '@remix-run/react';
import {CartForm, Money} from '@shopify/hydrogen';
import {Image} from '@shopify/hydrogen';
import {
  CartLineInput,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import {TFunction} from 'i18next';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BsSuitHeart, BsSuitHeartFill} from 'react-icons/bs';
import {FaCircle} from 'react-icons/fa';
import {ProductCardFragment} from 'storefrontapi.generated';
import {useWishlist} from '~/contexts/WishList';
import {
  calculateSalePercentage,
  handleColorSizeValidation,
  handleCreateCheckout,
  handleUpdateSelectedVariant,
  navigateTo,
} from '~/lib/utils';
import InformationPopup from './Popup/InformationPopup';
import {useCustomContext} from '~/contexts/App';
import ColorCircleIcon from './Icons/ColorCircleIcon';

export type ProductProps = {
  product: ProductCardFragment;
  metafields: any;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  loading?: 'eager' | 'lazy';
  handle?: string;
  showCompare?: boolean;
  handleCompareCheckbox?: (product: ProductCardFragment) => void;
  selectedProducts?: ProductCardFragment[];
};

const Product = ({
  t,
  direction,
  product,
  metafields,
  loading = 'lazy',
  handle,
  showCompare = false,
  handleCompareCheckbox = () => {},
  selectedProducts = [],
}: ProductProps) => {
  const infoRef = useRef<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>({
    openTrigger: () => {},
    closeTrigger: () => {},
  });
  const navigate = useNavigate();
  const {currency, language} = useCustomContext();
  const {toggleWishlist, wishlist} = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCardVariant, setSelectedCardVariant] = useState<{
    [id: string]: {[key: string]: string};
  }>({[product.id]: {}});
  const [params, setParams] = useState(``);
  const [isAvailable, setIsAvailable] = useState(() => {
    return product.variants.nodes.some(variant => variant.availableForSale);
  });
  const [cartLine, setCartLine] = useState<CartLineInput>({
    merchandiseId: '',
  });
  const [message, setMessage] = useState('');
  const [guide, setGuide] = useState('');
  const [productTitle, setProductTitle] = useState<{[id: string]: string}>({});
  const [currentImage, setCurrentImage] = useState(product.featuredImage);

  useEffect(() => {
    if (metafields) {
      const title: string =
        language === 'en'
          ? product.title
          : metafields.find((item: any) => item.key === 'arabic_title')?.value;
      if (title) {
        setProductTitle({[product.id]: title});
      } else {
        setProductTitle({[product.id]: product.title});
      }
    }
  }, [metafields, language]);

  useEffect(() => {
    if (Object.keys(selectedCardVariant[product.id] ?? {}).length >= 1) {
      const selectedColor = selectedCardVariant[product.id].Color;
      if (selectedColor) {
        // Find variant with matching color
        const matchingVariant = product.variants.nodes.find(
          (variant) => 
            variant.selectedOptions.find(
              (option) => option.name === 'Color' && option.value === selectedColor
            )
        );
        
        if (matchingVariant?.image) {
          setCurrentImage(matchingVariant.image);
        }
      }

      // Update availability based on selected options
      const result = handleUpdateSelectedVariant({
        productId: product.id,
        productVariants: product.variants.nodes,
        selectedCardVariant,
        setCartLine,
      });
      setIsAvailable(result);

      if (Object.keys(selectedCardVariant[product.id] ?? {}).length === 2) {
        const queryStrings = new URLSearchParams(
          selectedCardVariant[product.id],
        ).toString();
        setParams(queryStrings);
      }
    }
  }, [selectedCardVariant, product.id]);

  useEffect(() => {
    if (handle) {
      setGuide(handle);
    } else {
      const collections = product.collections.nodes;
      // Find the first matching collection
      const collection = collections.find((collection) =>
        ['women', 'men', 'kids'].includes(collection.handle),
      );
      if (collection) {
        setGuide(collection.handle);
      }
    }
  }, [handle, product]);

  const handleHeartClick = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      product: ProductCardFragment,
    ) => {
      event.preventDefault();
      toggleWishlist(product);
      event.stopPropagation();
    },
    [],
  );

  const extractUniqueColors = (product: ProductCardFragment) => {
    // First try to get colors from options
    const colorOption = product.options.find(option => option.name === 'Color');
    if (colorOption && colorOption.values.length > 0) {
      return colorOption.values;
    }
    
    // If no colors in options, try to extract from variants
    const colors = new Set<string>();
    product.variants.nodes.forEach(variant => {
      const colorOption = variant.selectedOptions.find(option => option.name === 'Color');
      if (colorOption) {
        colors.add(colorOption.value);
      }
    });
    
    return Array.from(colors);
  };

  let uniqueSizeOptions: string[] = [];
  let uniqueColorOptions: string[] = extractUniqueColors(product);

  product.options.forEach((option) => {
    if (option.name === 'Size') {
      uniqueSizeOptions = option.values;
    }
  });

  useEffect(() => {
    let details = {};
    // If there's only one color option, select it but don't treat it as a complete selection
    if (uniqueColorOptions.length === 1) {
      details = {
        ...details,
        Color: uniqueColorOptions[0],
      };
    }
    // If there's only one size option, select it
    if (uniqueSizeOptions.length === 1) {
      details = {
        ...details,
        Size: uniqueSizeOptions[0],
      };
    }

    // Initialize selected variant
    setSelectedCardVariant({
      [product.id]: {
        ...details,
      },
    });

    // Check initial availability
    const result = handleUpdateSelectedVariant({
      productId: product.id,
      productVariants: product.variants.nodes,
      selectedCardVariant: {[product.id]: details},
      setCartLine,
    });
    setIsAvailable(result);
  }, [uniqueColorOptions, uniqueSizeOptions, product.id]);

  return (
    <Link
      to={`/products/${product.handle}`}
      key={product.id}
      className={`${!showCompare ? 'h-auto min-h-110' : ''} relative z-10 hover:no-underline group rounded-xl border bg-white border-neutral-N-80 overflow-hidden max-w-87.5 hover:shadow-md hover:shadow-black/30 active:shadow-none`}
      onClick={(event) => event.defaultPrevented && event.stopPropagation()}
    >
      <div className="relative">
        <button
          onClick={(event) => handleHeartClick(event, product)}
          className={`${direction === 'ltr' ? 'right-2' : 'left-2'} absolute z-10 top-2 block transition-all bg-neutral-N-92/80 hover:bg-neutral-N-92 active:bg-neutral-N-90 rounded-full p-1.5`}
        >
          {wishlist.findIndex((item) => item.id === product.id) != -1 ? (
            <BsSuitHeartFill className="w-5 h-5" />
          ) : (
            <BsSuitHeart className="w-5 h-5" />
          )}
        </button>
        
        {currentImage ? (
          <Image
            data={currentImage}
            aspectRatio="1/1"
            className="w-full h-75 object-contain mx-auto"
            sizes="auto"
            loading={loading}
          />
        ) : (
          <img src="/no_image.png" className="w-full h-75 object-contain mx-auto" />
        )}
      </div>
      
      <div className="lower-card-container p-3 sm:p-4 w-full flex flex-col flex-grow items-start justify-between gap-3 bg-[#F5F5F5] group-hover:bg-neutral-N-92 transition-all duration-300">
        <div className="flex-grow w-full">
          <div className="max-w-full">
            <h4 className="overflow-x-auto scrollbar-none text-nowrap text-neutral-N-10 text-base mb-1">
              {productTitle[product.id] ? (
                `${productTitle[product.id]} - ${t(product.vendor)}`
              ) : (
                <div className="h-6"></div>
              )}
            </h4>
            <div className="flex gap-2">
              {product.compareAtPriceRange.minVariantPrice.amount !== '0.0' ? (
                <s>
                  <Money
                    data={{
                      amount: (
                        parseFloat(
                          product.compareAtPriceRange.minVariantPrice.amount,
                        ) * currency.exchange_rate
                      ).toString(),
                      currencyCode: currency.currency['en'] as CurrencyCode,
                    }}
                    className="opacity-30 text-sm"
                  />
                </s>
              ) : (
                <></>
              )}
              <Money
                className="text-neutral-N-30 text-sm"
                data={{
                  amount: (
                    parseFloat(product.priceRange.minVariantPrice.amount) *
                    currency.exchange_rate
                  ).toString(),
                  currencyCode: currency.currency['en'] as CurrencyCode,
                }}
              />
              {product.compareAtPriceRange.minVariantPrice.amount !== '0.0' ? (
                <span className="block text-sm text-red-700 text-bold">
                  {calculateSalePercentage(
                    product.compareAtPriceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.amount,
                  )}
                  % {t('OFF')}
                </span>
              ) : (
                <></>
              )}
            </div>
            
            {uniqueSizeOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {uniqueSizeOptions.length > 5 ? (
                  <>
                    {uniqueSizeOptions.slice(0, 4).map((option, index) => (
                      <button
                        key={index}
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedCardVariant({
                            [product.id]: {
                              ...selectedCardVariant[product.id],
                              Size: option,
                            },
                          });
                          event.stopPropagation();
                        }}
                        className={`${
                          Object.keys(selectedCardVariant)[0] === product.id && 
                          selectedCardVariant[product.id].Size === option 
                            ? 'bg-neutral-N-90 font-medium' 
                            : 'bg-transparent'
                        } px-1.5 py-0.5 border border-neutral-N-50 rounded text-xs hover:bg-neutral-N-92 active:bg-neutral-N-90 transition-colors min-w-[24px] text-center`}
                      >
                        {option}
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 self-center">+{uniqueSizeOptions.length - 4}</span>
                  </>
                ) : (
                  uniqueSizeOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedCardVariant({
                          [product.id]: {
                            ...selectedCardVariant[product.id],
                            Size: option,
                          },
                        });
                        event.stopPropagation();
                      }}
                      className={`${
                        Object.keys(selectedCardVariant)[0] === product.id && 
                        selectedCardVariant[product.id].Size === option 
                          ? 'bg-neutral-N-90 font-medium' 
                          : 'bg-transparent'
                      } px-1.5 py-0.5 border border-neutral-N-50 rounded text-xs hover:bg-neutral-N-92 active:bg-neutral-N-90 transition-colors min-w-[24px] text-center`}
                    >
                      {option}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          
          {uniqueColorOptions.length > 1 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {uniqueColorOptions.map(
                (option, index) =>
                  index < 5 && (
                    <button
                      key={index}
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedCardVariant({
                          [product.id]: {
                            ...selectedCardVariant[product.id],
                            Color: option,
                          },
                        });
                        event.stopPropagation();
                      }}
                      title={option}
                      aria-label={`Color: ${option}`}
                    >
                      <ColorCircleIcon
                        option={option}
                        productId={product.id}
                        selectedVariant={selectedCardVariant}
                        size="small"
                      />
                    </button>
                  ),
              )}
              {uniqueColorOptions.length > 5 && (
                <span className="text-xs text-gray-500 self-center">
                  +{uniqueColorOptions.length - 5}
                </span>
              )}
            </div>
          ) : uniqueColorOptions.length === 1 ? (
            <div className="flex items-center gap-2 mt-3">
              <ColorCircleIcon
                option={uniqueColorOptions[0]}
                productId={product.id}
                selectedVariant={{[product.id]: {Color: uniqueColorOptions[0]}}}
                size="small"
              />
              <span className="text-xs text-gray-600">{uniqueColorOptions[0]}</span>
            </div>
          ) : (
            <div className="h-8 mt-3"></div>
          )}
        </div>
        
        <div className="w-full mt-auto">
          <CartForm
            route="/cart"
            inputs={{ lines: [cartLine] }}
            action={CartForm.ACTIONS.LinesAdd}
          >
            {(fetcher: FetcherWithComponents<any>) => {
              useEffect(() => {
                if (
                  fetcher.state === 'submitting' ||
                  fetcher.state === 'loading'
                ) {
                  setIsLoading(true);
                } else {
                  setIsLoading(false);
                }
              }, [fetcher.state]);

              return (
                <>
                  <div className="flex justify-between items-center w-full gap-2 mt-1">
                    {isAvailable ? (
                      <button
                        type={
                          Object.keys(selectedCardVariant[product.id] ?? {})
                            .length !== 2
                            ? 'button'
                            : 'submit'
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          Object.keys(selectedCardVariant[product.id] ?? {})
                            .length !== 2
                            ? handleColorSizeValidation({
                                event,
                                ref: infoRef,
                                setMessage,
                                productId: product.id,
                                selectedCardVariant,
                              })
                            : handleCreateCheckout({
                                lines: [cartLine],
                                navigate,
                              });
                          event.stopPropagation();
                        }}
                        disabled={isLoading}
                        className={`${
                          Object.keys(selectedCardVariant[product.id] ?? {})
                            .length !== 2
                            ? ''
                            : 'hover:shadow-md hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90'
                        } w-full bg-primary-P-40 text-white border text-sm py-2.5 px-4 border-transparent rounded-md transition-all`}
                      >
                        {t('Buy Now')}
                      </button>
                    ) : (
                      <></>
                    )}
                    <button
                      type={
                        Object.keys(selectedCardVariant[product.id] ?? {})
                          .length !== 2
                          ? 'button'
                          : 'submit'
                      }
                      onClick={(event) => {
                        handleColorSizeValidation({
                          event,
                          ref: infoRef,
                          setMessage,
                          productId: product.id,
                          selectedCardVariant,
                        });
                        event.stopPropagation();
                      }}
                      disabled={!isAvailable || isLoading}
                      className={`${
                        Object.keys(selectedCardVariant[product.id] ?? {})
                          .length !== 2
                          ? ''
                          : 'hover:bg-neutral-N-92 active:bg-neutral-N-87'
                      } w-full text-primary-P-40 bg-transparent border text-sm py-2.5 px-4 border-primary-P-40 rounded-md transition-all`}
                    >
                      {isAvailable
                        ? isLoading
                          ? t('Processing...')
                          : t('Add to Bag')
                        : t('Sold Out')}
                    </button>
                  </div>
                </>
              );
            }}
          </CartForm>

          {showCompare ? (
            <label
              key={product.id}
              onClick={(e) => e.stopPropagation()}
              className="flex align-items-center gap-2 mt-2"
            >
              <input
                type="checkbox"
                checked={selectedProducts.some(
                  (selectedProduct) => selectedProduct.id === product.id,
                )}
                onChange={() => handleCompareCheckbox(product)}
                className="w-5 h-5"
              />
              <span>{t('Compare & Combine')}</span>
            </label>
          ) : (
            <></>
          )}
        </div>
      </div>
      
      <InformationPopup
        t={t}
        direction={direction}
        ref={infoRef}
        message={message}
        popupKey={product.id}
      />
    </Link>
  );
};

export default Product;
