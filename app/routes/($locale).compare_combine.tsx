import {
  Link,
  type MetaFunction,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import {defer, LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Image, Money} from '@shopify/hydrogen';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BsSuitHeart, BsSuitHeartFill} from 'react-icons/bs';
import {FaCircle} from 'react-icons/fa';
import {ProductCardFragment} from 'storefrontapi.generated';
import {useCustomContext} from '~/contexts/App';
import {useCompareProducts} from '~/contexts/CompareProducts';
import {useWishlist} from '~/contexts/WishList';
import useWindowDimensions from '~/hooks/useWindowDimensions';

export const meta: MetaFunction = () => {
  return [{title: 'Compare & Combine'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  return defer({});
}

function CompareCombine() {
  const data = useLoaderData<typeof loader>();
  const {compareProducts} = useCompareProducts();
  const {t} = useTranslation();
  const {toggleWishlist, wishlist} = useWishlist();
  const {setCurrentPage, direction} = useCustomContext();
  const navigate = useNavigate();
  const {width} = useWindowDimensions(50);

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
  const [descriptions, setDescriptions] = useState<{[key: string]: string[]}>(
    {},
  );

  useEffect(() => {
    if (direction === 'rtl') {
      const newDescriptions: {[key: string]: string[]} = {};

      compareProducts.forEach((product) => {
        const desc = product.metafields?.find(
          (meta) => meta.key === 'arabic_description',
        )?.value;

        if (desc) {
          newDescriptions[product.id] = desc.split('\n'); // Store description as an array, keyed by product ID
        }
      });

      setDescriptions(newDescriptions);
    }
  }, [compareProducts, direction]);

  useEffect(() => {
    setCurrentPage('Compare & Combine');
  }, []);

  useEffect(() => {
    if (width !== 0) {
      if (width > 1023 && compareProducts.length < 2) {
        navigate('/wishlist', {replace: true});
      } else if (width < 1024 && compareProducts.length !== 2) {
        navigate('/wishlist', {replace: true});
      }
    }
  }, [compareProducts.length, width]);

  if (width > 1023 && compareProducts.length < 2) {
    return <></>;
  }
  if (width < 1024 && compareProducts.length !== 2) {
    return <></>;
  }

  return (
    <div className="compare-combine px-8 py-14">
      <div
        className="grid dir-aware"
        style={{
          '--grid-columns': compareProducts.length + 1,
          gridTemplateColumns: `repeat(var(--grid-columns), minmax(70px, 1fr))`,
        }}
      >
        <h1 className="text-base xs:text-lg sm:text-2xl">
          {t('Compare & Combine')}
        </h1>
        {compareProducts.map((product, index) => (
          <Link
            key={product.id}
            className={`relative z-10 hover:no-underline group rounded-xl border bg-white border-neutral-N-80 overflow-hidden w-full max-w-87.5 mb-4 ss:mb-8 mx-auto hover:shadow-md hover:shadow-black/30 active:shadow-none`}
            to={`/products/${product.handle}`}
            onClick={(event) =>
              event.defaultPrevented && event.stopPropagation()
            }
          >
            <button
              onClick={(event) => handleHeartClick(event, product)}
              className={`${direction === 'ltr' ? 'right-0' : 'left-0'} absolute z-10 w-fit p-1 xs:p-2 mx-1 my-2 sm:mx-2 sm:my-4 block transition-all group-hover:bg-neutral-N-92 hover:bg-neutral-N-92 active:bg-neutral-N-90 rounded-full`}
            >
              {wishlist.findIndex((item) => item.id === product.id) != -1 ? (
                <BsSuitHeartFill className="w-4 h-4 xs:w-6 xs:h-6" />
              ) : (
                <BsSuitHeart className="w-4 h-4 xs:w-6 xs:h-6" />
              )}
            </button>
            {product.featuredImage ? (
              <Image
                data={product.featuredImage}
                aspectRatio="1/1"
                className="w-auto max-h-40 sm:max-h-75 object-cover object-center"
                sizes="auto"
                loading="lazy"
              />
            ) : (
              <img
                src="/no_image.png"
                className="w-full max-h-40 sm:max-h-75 object-contain"
              />
            )}
            <div className="lower-card-container p-1 xs:p-2 sm:p-4 w-full flex flex-col items-start justify-start gap-1 xs:gap-3 sm:gap-5 bg-[#F5F5F5] group-hover:bg-neutral-N-92 transition-all duration-300">
              <div className="max-w-full">
                <h4 className="overflow-x-auto scrollbar-none text-sm xs:text-base text-nowrap text-neutral-N-10">
                  {direction === 'ltr'
                    ? product.title
                    : product.metafields?.find(
                        (meta) => meta.key === 'arabic_title',
                      ).value ?? product.title}{' '}
                  - {t(product.vendor)}
                </h4>
              </div>
              <Link
                to={`/products/${product.handle}`}
                className="text-center hover:bg-neutral-N-92 active:bg-neutral-N-87 w-full text-primary-P-40 bg-transparent border text-[10px] xs:text-xs sm:text-sm py-1.5 px-2 sm:py-2.5 sm:px-4 border-primary-P-40 rounded-md transition-all"
              >
                {t('View Product')}
              </Link>
            </div>
          </Link>
        ))}
        <p className="font-bold border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">
          {t('Price')}
        </p>
        {compareProducts.map((product, index) => (
          <div
            key={index}
            className="border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5"
          >
            <Money data={product.priceRange.minVariantPrice} as="span" />
          </div>
        ))}

        <p className="font-bold border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">
          {t('Sizes Available')}
        </p>
        {compareProducts.map((product, index) => {
          let uniqueSizeOptions: string[] = [];
          product.options.forEach((option) => {
            if (option.name === 'Size') {
              uniqueSizeOptions = option.values;
            }
          });
          return (
            <div
              key={index}
              className="flex flex-wrap items-start gap-2 border overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5"
            >
              {uniqueSizeOptions.map((option, index) => (
                <p
                  key={index}
                  className="text-xs sm:text-sm py-1 px-3 border border-black bg-transparent hover:bg-neutral-N-92 transition-colors"
                >
                  {option}
                </p>
              ))}
            </div>
          );
        })}

        <p className="font-bold border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">
          {t('Colors Available')}
        </p>
        {compareProducts.map((product, index) => {
          let uniqueColorOptions: string[] = [];
          product.options.forEach((option) => {
            if (option.name === 'Color') {
              uniqueColorOptions = option.values;
            }
          });
          return (
            <div
              key={index}
              className="flex flex-wrap items-start gap-2 border overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5"
            >
              {uniqueColorOptions.map((option, index) => (
                <p key={index}>
                  <FaCircle
                    className="rounded-full w-6 h-6 sm:w-8 sm:h-8 border-transparent border sm:border-2 transition-colors hover:border-secondary-S-90"
                    style={{color: `${option}`}}
                  />
                </p>
              ))}
            </div>
          );
        })}

        {/* <p className="font-bold border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">Rating</p>
        {compareProducts.map((product, index) => (
          <div key={index} className="border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">
            <span className="flex items-center">
              <span className="text-yellow-500">rating ★</span>
            </span>
          </div>
        ))} */}

        <p className="font-bold border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">
          {t('Description')}
        </p>
        {compareProducts.map((product, index) =>
          direction === 'ltr' ? (
            <div
              key={index}
              className="border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          ) : (
            <div
              key={index}
              className="border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5"
            >
              {descriptions[product.id].map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          ),
        )}

        <p className="font-bold border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5">
          {t('Product Care')}
        </p>
        {compareProducts.map((product, index) => {
          let careGuide: string[] = [];
          if (product.metafields) {
            const care: string = product.metafields.find(
              (item: any) =>
                item.key ===
                (direction === 'ltr' ? 'care_guide' : 'care_guide_ar'),
            )?.value;
            if (care) {
              const array = care.split('\n');
              careGuide = array;
            }
          }
          return (
            <div
              key={index}
              className="border text-sm sm:text-base overflow-x-auto scrollbar-none px-2 py-8 sm:py-14 sm:px-5"
            >
              {careGuide.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompareCombine;
