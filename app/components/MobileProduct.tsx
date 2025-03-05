import {Money} from '@shopify/hydrogen';
import {Image} from '@shopify/hydrogen';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BsSuitHeart, BsSuitHeartFill} from 'react-icons/bs';
import {FaCircle} from 'react-icons/fa';
import {ProductCardFragment} from 'storefrontapi.generated';
import PopupProduct from './Popup/PopupProduct';
import {useWishlist} from '~/contexts/WishList';
import {TFunction} from 'i18next';
import {calculateSalePercentage} from '~/lib/utils';
import {useCustomContext} from '~/contexts/App';
import {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import ColorCircleIcon from './Icons/ColorCircleIcon';

export type ProductProps = {
  product: ProductCardFragment;
  metafields: any;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  handle?: string;
  showCompare?: boolean;
  handleCompareCheckbox?: (product: ProductCardFragment) => void;
  selectedProducts?: ProductCardFragment[];
};

const MobileProduct = ({
  product,
  metafields,
  t,
  direction,
  handle,
  showCompare = false,
  handleCompareCheckbox = () => {},
  selectedProducts = [],
}: ProductProps) => {
  const {currency, language} = useCustomContext();
  const {toggleWishlist, wishlist} = useWishlist();
  const productRef = useRef<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>({
    openTrigger: () => {},
    closeTrigger: () => {},
  });
  const [selectedCardVariant, setSelectedCardVariant] = useState<{
    [id: string]: {[key: string]: string};
  }>({[product.id]: {}});
  const [currentImage, setCurrentImage] = useState(product.featuredImage);

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

  let uniqueSizeOptions: string[] = [];
  let uniqueColorOptions: string[] = [];
  product.options.forEach((option) => {
    if (option.name === 'Size') {
      uniqueSizeOptions = option.values;
    } else if (option.name === 'Color') {
      uniqueColorOptions = option.values;
    }
  });
  const [productTitle, setProductTitle] = useState<{[id: string]: string}>({});

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
    }
  }, [selectedCardVariant, product.id]);

  return (
    <div
      key={product.id}
      className={`${!showCompare ? 'h-73.75' : ''} relative hover:no-underline flex flex-col items-stretch cursor-pointer rounded-xl border bg-white border-neutral-N-80 overflow-hidden w-37.5 flex-grow ss:w-43.75`}
      onClick={() => productRef.current.openTrigger()}
    >
      <div
        className={`${direction === 'ltr' ? 'left-1' : 'right-1'} absolute z-10 top-1 flex flex-col gap-2 items-start`}
      >
        {product.collections.nodes.findIndex(
          (collection) => collection.handle === 'new-arrivals',
        ) !== -1 ? (
          <span className="bg-neutral-N-96 text-primary-P-40 font-semibold rounded px-1 py-0.5 text-xs">
            {t('New Season')}
          </span>
        ) : (
          <></>
        )}
        {product.collections.nodes.findIndex(
          (collection) => collection.handle === 'sale',
        ) !== -1 ? (
          <span className="bg-red-500 text-white font-semibold rounded px-1 py-0.5 text-xs">
            {t('Sale')}
          </span>
        ) : (
          <></>
        )}
      </div>
      <button
        onClick={(event) => handleHeartClick(event, product)}
        className={`${direction === 'ltr' ? 'ml-auto mr-1 right-0' : 'ml-1 mr-auto left-0'} absolute z-10 w-fit mt-1 block transition-all bg-neutral-N-92 active:bg-neutral-N-90 rounded-full p-1`}
      >
        {wishlist.findIndex((item) => item.id === product.id) != -1 ? (
          <BsSuitHeartFill className="w-4 h-4" />
        ) : (
          <BsSuitHeart className="w-4 h-4" />
        )}
      </button>
      <div className="relative">
        {currentImage ? (
          <Image
            data={currentImage}
            aspectRatio="1/1"
            className="w-full h-39.5 object-contain mx-auto"
            sizes="auto"
            loading="lazy"
          />
        ) : (
          <img
            src="/no_image.png"
            className="w-full h-39.5 object-contain mx-auto"
          />
        )}
      </div>
      <div className="p-2 w-full flex-grow flex flex-col items-start justify-between gap-2 bg-[#F5F5F5] group-hover:bg-neutral-N-92 transition-all duration-300">
        <div className="max-w-full">
          <h4 className="overflow-x-auto scrollbar-none text-nowrap text-neutral-N-10 text-sm">
            {productTitle[product.id] ? (
              `${productTitle[product.id]} - ${t(product.vendor)}`
            ) : (
              <div className="h-5"></div>
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
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
                  className="opacity-30 text-xs"
                />
              </s>
            ) : (
              <></>
            )}
            <Money
              className="text-neutral-N-30 text-xs"
              data={{
                amount: (
                  parseFloat(product.priceRange.minVariantPrice.amount) *
                  currency.exchange_rate
                ).toString(),
                currencyCode: currency.currency['en'] as CurrencyCode,
              }}
            />
            {product.compareAtPriceRange.minVariantPrice.amount !== '0.0' ? (
              <span className="block text-xs text-red-700 text-bold">
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
        {uniqueColorOptions.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {uniqueColorOptions.map(
              (option, index) =>
                index < 5 && (
                  <button
                    key={index}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedCardVariant({
                        [product.id]: {
                          ...selectedCardVariant[product.id],
                          Color: option,
                        },
                      });
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
        <div className="flex justify-between items-center w-full gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              productRef.current.openTrigger();
            }}
            className="flex-1 bg-primary-P-40 text-white border text-[10px] py-0.75 px-0.25 border-transparent rounded-md transition-all hover:shadow-md hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90"
          >
            {t('View Product')}
          </button>
        </div>
        {showCompare ? (
          <label
            key={product.id}
            onClick={(e) => e.stopPropagation()}
            className="flex align-items-center gap-1"
          >
            <input
              type="checkbox"
              checked={selectedProducts.some(
                (selectedProduct) => selectedProduct.id === product.id,
              )}
              onChange={() => handleCompareCheckbox(product)}
              className="w-4 h-4"
            />
            <span className="text-xs">{t('Compare & Combine')}</span>
          </label>
        ) : (
          <></>
        )}
      </div>
      <PopupProduct
        ref={productRef}
        product={product}
        productTitle={productTitle}
        t={t}
        handle={handle}
        direction={direction}
        sizeOptions={uniqueSizeOptions}
        colorOptions={uniqueColorOptions}
      />
    </div>
  );
};

export default MobileProduct;
