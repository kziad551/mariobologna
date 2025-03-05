import {Link, useNavigate, type FetcherWithComponents} from '@remix-run/react';
import {CartForm, Money} from '@shopify/hydrogen';
import {Image} from '@shopify/hydrogen';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {BsSuitHeart, BsSuitHeartFill} from 'react-icons/bs';
import {FaCircle} from 'react-icons/fa';
import {ProductCardFragment} from 'storefrontapi.generated';
import PopupContainer from './PopupContainer';
import {CgClose} from 'react-icons/cg';
import {useWishlist} from '~/contexts/WishList';
import {TFunction} from 'i18next';
import {
  calculateSalePercentage,
  handleColorSizeValidation,
  handleCreateCheckout,
  handleUpdateSelectedVariant,
  navigateTo,
} from '~/lib/utils';
import {
  CartLineInput,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import InformationPopup from './InformationPopup';
import {useCustomContext} from '~/contexts/App';
import ColorCircleIcon from '../Icons/ColorCircleIcon';

export type ProductProps = {
  product: ProductCardFragment;
  productTitle: {[id: string]: string};
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  sizeOptions: string[];
  colorOptions: string[];
  handle?: string;
};

const PopupProduct = forwardRef(
  (
    {
      product,
      productTitle,
      t,
      direction,
      sizeOptions,
      colorOptions,
      handle,
    }: ProductProps,
    ref: React.ForwardedRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>,
  ) => {
    const infoRef = useRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>({
      openTrigger: () => {},
      closeTrigger: () => {},
    });
    const navigate = useNavigate();
    const {toggleWishlist, wishlist} = useWishlist();
    const {currency} = useCustomContext();

    const [openPopup, setOpenPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedCardVariant, setSelectedCardVariant] = useState<{
      [id: string]: {[key: string]: string};
    }>({[product.id]: {}});
    const [params, setParams] = useState(``);
    const [isAvailable, setIsAvailable] = useState(true);
    const [cartLine, setCartLine] = useState<CartLineInput>({
      merchandiseId: '',
    });
    const [message, setMessage] = useState('');
    const [guide, setGuide] = useState('');
    const [currentImage, setCurrentImage] = useState(product.featuredImage);

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

        if (Object.keys(selectedCardVariant[product.id] ?? {}).length === 2) {
          const queryStrings = new URLSearchParams(
            selectedCardVariant[product.id],
          ).toString();
          setParams(queryStrings);
          const result = handleUpdateSelectedVariant({
            productId: product.id,
            productVariants: product.variants.nodes,
            selectedCardVariant,
            setCartLine,
          });
          setIsAvailable(result);
        }
      }
    }, [selectedCardVariant, product.id]);

    useEffect(() => {
      const close = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpenPopup(false);
        }
      };

      window.addEventListener('keyup', close);

      return () => {
        window.removeEventListener('keyup', close);
      };
    }, []);

    useEffect(() => {
      let details = {};
      if (colorOptions.length === 1) {
        details = {
          ...details,
          Color: colorOptions[0],
        };
      }
      if (sizeOptions.length === 1) {
        details = {
          ...details,
          Size: sizeOptions[0],
        };
      }

      setSelectedCardVariant({
        [product.id]: {
          ...details,
        },
      });
    }, [colorOptions, sizeOptions]);
    useImperativeHandle(ref, () => {
      return {
        openTrigger: () => setOpenPopup(true),
        closeTrigger: () => setOpenPopup(false),
      };
    });

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

    return (
      <PopupContainer
        key={product.id}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Link
          className="w-full xs:w-87.5 max-h-120 rounded-xl border bg-white border-neutral-N-80 overflow-hidden"
          to={`/products/${product.handle}?${params}`}
          onClick={(event) => event.defaultPrevented && event.stopPropagation()}
        >
          <div
            className={`${direction === 'ltr' ? 'left-2' : 'right-2'} absolute z-10 top-4 flex flex-col xs:flex-row flex-wrap gap-2 items-start xs:items-center xs:justify-center`}
          >
            {product.collections.nodes.findIndex(
              (collection) => collection.handle === 'new-arrivals',
            ) !== -1 ? (
              <span className="bg-neutral-N-96 text-primary-P-40 font-semibold rounded px-3 py-1 text-xs">
                {t('New Season')}
              </span>
            ) : (
              <></>
            )}
            {product.collections.nodes.findIndex(
              (collection) => collection.handle === 'sale',
            ) !== -1 ? (
              <span className="bg-red-500 text-white font-semibold rounded px-3 py-1 text-xs">
                {t('Sale')}
              </span>
            ) : (
              <></>
            )}
          </div>
          <div
            className={`${direction === 'ltr' ? 'right-3' : 'left-3'} absolute top-4 z-10 bg-neutral-N-92/80 rounded-full flex items-center justify-end py-2 px-3 gap-3 shadow-lg shadow-white/20`}
          >
            <button onClick={(event) => handleHeartClick(event, product)}>
              {wishlist.findIndex((item) => item.id === product.id) != -1 ? (
                <BsSuitHeartFill className="w-6 h-6" />
              ) : (
                <BsSuitHeart className="w-6 h-6" />
              )}
            </button>
            <CgClose
              className="h-5 w-5 cursor-pointer"
              onClick={(event) => {
                event.preventDefault();
                setOpenPopup(false);
                event.stopPropagation();
              }}
            />
          </div>
          <div className="relative">
            {currentImage ? (
              <Image
                data={currentImage}
                aspectRatio="1/1"
                className="w-full h-75 pb-12 xs:pb-20 object-contain mx-auto"
                sizes="auto"
                loading="lazy"
              />
            ) : (
              <img
                src="/no_image.png"
                className="w-full h-75 pb-12 xs:pb-20 object-contain mx-auto"
              />
            )}
            <div className="w-full bg-white p-2 border-t border-t-neutral-N-92 absolute bottom-0">
              <div className="flex items-center justify-start mb-2">
                {sizeOptions.length > 1 ? (
                  <p className="text-sm xs:text-base">{t('Select size')}</p>
                ) : (
                  <></>
                )}
                <button
                  onClick={(e) =>
                    navigateTo(
                      e,
                      guide
                        ? `/sizes?guide=${guide}&section=${product.productType}#size_details`
                        : '/sizes',
                      navigate,
                    )
                  }
                  className="hover:no-underline rounded hover:transition-all text-xs xs:text-sm bg-transparent p-2 text-primary-P-40 hover:bg-neutral-N-92 active:bg-neutral-N-90"
                >
                  {t('Size Guide')}
                </button>
              </div>
              {sizeOptions.length > 1 ? (
                <div className="flex gap-2 flex-wrap">
                  {sizeOptions.map((option, index) => (
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
                      className={`${Object.keys(selectedCardVariant)[0] === product.id && selectedCardVariant[product.id].Size === option ? 'bg-neutral-N-90' : 'bg-transparent'} px-1 border border-black rounded text-sm hover:bg-neutral-N-92 active:bg-neutral-N-90 transition-colors`}
                    >
                      {option}
                    </button>
                  ))}
                  <button className="px-1 rounded text-sm hover:bg-neutral-N-92 active:bg-neutral-N-90 transition-colors">
                    +
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="lower-card-container p-4 w-full flex flex-col items-start justify-start gap-5 bg-[#F5F5F5] group-hover:bg-neutral-N-92 transition-all duration-300">
            <div>
              <h4 className="text-neutral-N-10 text-base">
                {productTitle[product.id] ? (
                  `${productTitle[product.id]} - ${t(product.vendor)}`
                ) : (
                  <div className="h-6"></div>
                )}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.compareAtPriceRange.minVariantPrice.amount !==
                '0.0' ? (
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
                {product.compareAtPriceRange.minVariantPrice.amount !==
                '0.0' ? (
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
            </div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.length > 1 ? (
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(
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
                </div>
              ) : (
                <FaCircle className="w-5 h-5 text-transparent" />
              )}
            </div>
            <CartForm
              route="/cart"
              inputs={{
                lines: [cartLine],
              }}
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
                    <div className="flex justify-between items-center w-full gap-2">
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
                          } w-full bg-primary-P-40 text-white border text-sm py-2 xs:py-2.5 border-transparent rounded-md transition-all`}
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
                        } w-full text-primary-P-40 bg-transparent border text-sm py-2 xs:py-2.5 border-primary-P-40 rounded-md transition-all`}
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
          </div>
          <InformationPopup
            t={t}
            direction={direction}
            ref={infoRef}
            message={message}
            popupKey={product.id}
          />
        </Link>
      </PopupContainer>
    );
  },
);

export default PopupProduct;
