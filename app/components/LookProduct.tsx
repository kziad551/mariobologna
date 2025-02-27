import {useNavigate} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {Image} from '@shopify/hydrogen';
import {
  CartLineInput,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import {TFunction} from 'i18next';
import React, {useCallback, useEffect, useState} from 'react';
import {BsSuitHeart, BsSuitHeartFill} from 'react-icons/bs';
import {FaCircle} from 'react-icons/fa';
import {ProductCardFragment} from 'storefrontapi.generated';
import {useWishlist} from '~/contexts/WishList';
import {currencyType} from '~/data/currencies';
import {handleUpdateSelectedVariants} from '~/lib/utils';

export type ProductProps = {
  product: ProductCardFragment;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  currency: currencyType;
  setIds: React.Dispatch<React.SetStateAction<{[id: string]: CartLineInput}>>;
  setIsAvailable: React.Dispatch<React.SetStateAction<{[id: string]: boolean}>>;
  isAvailable: {[id: string]: boolean};
};

const LookProduct = ({
  t,
  direction,
  currency,
  product,
  setIds,
  setIsAvailable,
  isAvailable,
}: ProductProps) => {
  const {toggleWishlist, wishlist} = useWishlist();
  const [selectedCardVariant, setSelectedCardVariant] = useState<{
    [id: string]: {[key: string]: string};
  }>({
    [product.id]: {
      Size: product.variants.nodes[0].selectedOptions[0].value,
      Color: product.variants.nodes[0].selectedOptions[1].value,
    },
  });

  useEffect(() => {
    const productId = Object.keys(selectedCardVariant)[0];
    if (productId) {
      const result = handleUpdateSelectedVariants({
        productId: product.id,
        productVariants: product.variants.nodes,
        selectedCardVariant,
        setIds,
      });
      setIsAvailable((prev) => ({
        ...prev,
        [product.id]: result,
      }));
    }
  }, [selectedCardVariant]);

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

  return (
    <>
      <div
        key={product.id}
        title={
          !isAvailable[product.id]
            ? t('THIS PRODUCT SELECTION IS OUT OF STOCK')
            : ''
        }
        className={`${isAvailable[product.id] ? 'border-neutral-N-80' : 'border-red-500 shadow-lg shadow-red-500/50'} flex px-5 py-6 gap-4 flex-col xs:flex-row items-stretch border rounded transition-all`}
      >
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            className="ss:max-w-31.75 max-h-50 ss:max-h-36 object-contain"
            sizes="auto"
            loading="lazy"
          />
        ) : (
          <img
            src="/no_image.png"
            className="ss:max-w-31.75 ss:max-h-36 object-contain"
          />
        )}
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
            <div className="flex sm:items-center sm:justify-center gap-1">
              <span className="sm:text-xl">{product.title}</span>
              <button onClick={(event) => handleHeartClick(event, product)}>
                {wishlist.findIndex((item) => item.id === product.id) != -1 ? (
                  <BsSuitHeartFill className="w-6 h-6" />
                ) : (
                  <BsSuitHeart className="w-6 h-6" />
                )}
              </button>
            </div>
            <Money
              as="span"
              className="text-sm sm:text-base"
              data={{
                amount: (
                  parseFloat(product.priceRange.minVariantPrice.amount) *
                  currency.exchange_rate
                ).toString(),
                currencyCode: currency.currency['en'] as CurrencyCode,
              }}
            />
          </div>
          {uniqueColorOptions.length > 1 ? (
            <div className="flex flex-wrap gap-2">
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
                    >
                      <FaCircle
                        className={`${Object.keys(selectedCardVariant)[0] === product.id && selectedCardVariant[product.id].Color === option ? 'border-secondary-S-90 border-[3.5px] sm:border-[5px]' : ''} rounded-full w-6 h-6 sm:w-8 sm:h-8`}
                        style={{color: `${option}`}}
                      />
                    </button>
                  ),
              )}
            </div>
          ) : (
            <FaCircle className="w-6 h-6 sm:w-8 sm:h-8 text-transparent" />
          )}
          <div className="flex gap-2 flex-wrap">
            {uniqueSizeOptions.map((option, index) => (
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
                className={`${Object.keys(selectedCardVariant)[0] === product.id && selectedCardVariant[product.id].Size === option ? 'bg-neutral-N-90' : 'bg-transparent'} px-2 py-1 border border-black rounded text-sm hover:bg-neutral-N-92 active:bg-neutral-N-90 transition-colors`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LookProduct;
