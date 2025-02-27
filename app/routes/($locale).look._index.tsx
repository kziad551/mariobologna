import {useEffect, useState} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
  NavLink,
  useNavigate,
  NavigateFunction,
} from '@remix-run/react';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import type {
  CartLineInput,
  CountryCode,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import {IoIosArrowForward} from 'react-icons/io';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {ProductsSection} from '~/components/ProductsSection';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import LookProduct from '~/components/LookProduct';
import {handleCreateCheckout} from '~/lib/utils';
import {ONE_LOOK_COLLECTION_QUERY, OTHER_COLLECTION_QUERY} from '~/lib/queries';
import {currencyType} from '~/data/currencies';

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  return [{title: `${data?.collection?.title ?? 'Look'}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cookies = request.headers.get('Cookie');
  let country: CountryCode = 'AE';
  if (cookies) {
    const match = cookies.match(/country=([^;]+)/);
    if (match) {
      try {
        // Parse the JSON string back into an object
        country = JSON.parse(decodeURIComponent(match[1])) as CountryCode;
      } catch (error) {
        console.error('Error parsing country cookie:', error);
      }
    }
  }

  const {collection} = await storefront.query(ONE_LOOK_COLLECTION_QUERY, {
    variables: {country, handle: 'one-look'},
  });

  if (!collection) return redirect('/');

  const {collection: youMayAlsoLikeProducts} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      variables: {country, handle: 'recommended-products', first: 4},
    },
  );

  return defer({collection, youMayAlsoLikeProducts});
}

export default function OneLook() {
  const {collection, youMayAlsoLikeProducts} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const {height, width} = useWindowDimensions(50);
  const {direction, language, setCurrentPage, currency} = useCustomContext();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage(collection.title);
  }, []);

  return (
    <div className="one-look">
      <div className="hidden lg:flex w-fit items-center justify-center mt-3 mb-4 px-4 ss:px-8">
        <NavLink to="/" className="text-sm hover:underline">
          {t('Home')}
        </NavLink>
        <IoIosArrowForward className="m-3" />
        <button
          onClick={() => navigate(-1)}
          className="text-sm hover:underline"
        >
          {t('All')}
        </button>
        <IoIosArrowForward className="m-3" />
        <p className="text-sm">{t(collection.title)}</p>
      </div>
      <div className="flex flex-wrap gap-3 px-4 mb-8 sm:gap-14 sm:px-8 sm:mb-16 items-start justify-start">
        <h1 className="text-3xl mt-3 sm:hidden font-semibold">
          {t(collection.description)}
        </h1>
        <ProductImage image={collection.image} />
        <ProductsGrid
          t={t}
          direction={direction}
          currency={currency}
          products={collection.products.nodes}
          navigate={navigate}
          width={width}
          title={t(collection.description)}
        />
      </div>
      {youMayAlsoLikeProducts &&
      youMayAlsoLikeProducts.products.nodes.length > 0 ? (
        <ProductsSection
          t={t}
          direction={direction}
          title={t('You May Also Like')}
          viewAllLink={youMayAlsoLikeProducts?.handle}
          width={width}
          height={height}
          products={youMayAlsoLikeProducts?.products.nodes}
          containerClassName="px-8"
        />
      ) : (
        <></>
      )}
    </div>
  );
}

function ProductsGrid({
  t,
  direction,
  currency,
  navigate,
  products,
  width,
  title,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  currency: currencyType;
  navigate: NavigateFunction;
  products: ProductCardFragment[];
  width: number;
  title: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [ids, setIds] = useState<{[id: string]: CartLineInput}>({});
  const [isAvailable, setIsAvailable] = useState<{[id: string]: boolean}>({});
  const [totalPrice, setTotalPrice] = useState('0');

  useEffect(() => {
    let total = 0;
    products.forEach((product) => {
      total += parseFloat(product.priceRange.minVariantPrice.amount);
    });
    setTotalPrice(total.toString());
  }, []);

  const checkIfUndefined = (isAvailable: {[id: string]: boolean}) => {
    return (
      Object.values(isAvailable).find((value) => value === false) === undefined
    );
  };

  return (
    <div className="sm:sticky sm:top-51.5 w-full sm:w-auto flex flex-col items-stretch justify-start">
      <div className="flex flex-col gap-3 mb-4">
        <h1 className="text-3xl hidden sm:block font-semibold">{title}</h1>
        <Money
          as="p"
          className="text-2xl"
          data={{
            amount: (
              parseFloat(totalPrice) * currency.exchange_rate
            ).toString(),
            currencyCode: currency.currency['en'] as CurrencyCode,
          }}
        />
      </div>
      <div className="flex flex-col gap-3 mb-6">
        {products.map((product, index) => (
          <LookProduct
            key={index}
            product={product}
            t={t}
            direction={direction}
            currency={currency}
            setIds={setIds}
            setIsAvailable={setIsAvailable}
            isAvailable={isAvailable}
          />
        ))}
      </div>
      <CartForm
        route="/cart"
        inputs={{
          lines: [...Object.values(ids)],
        }}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher: FetcherWithComponents<any>) => {
          useEffect(() => {
            if (fetcher.state === 'submitting' || fetcher.state === 'loading') {
              setIsLoading(true);
            } else {
              setIsLoading(false);
            }
          }, [fetcher.state]);

          return (
            <>
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full gap-2">
                {checkIfUndefined(isAvailable) ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      handleCreateCheckout({
                        lines: [...Object.values(ids)],
                        navigate,
                      });
                      event.stopPropagation();
                    }}
                    className="w-full bg-primary-P-40 text-white border text-sm py-2.5 px-4 border-transparent rounded-md transition-colors hover:shadow-md hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90"
                  >
                    {t('Buy Now')}
                  </button>
                ) : (
                  <></>
                )}
                <button
                  type="submit"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  disabled={
                    Object.values(isAvailable).filter(
                      (value) => value === false,
                    ).length > 0 || isLoading
                  }
                  className={`${checkIfUndefined(isAvailable) ? 'hover:bg-neutral-N-92 active:bg-neutral-N-87' : ''} w-full text-primary-P-40 bg-transparent border text-sm py-2.5 px-4 border-primary-P-40 rounded-md transition-colors`}
                >
                  {checkIfUndefined(isAvailable)
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
  );
}

function ProductImage({image}: {image: ProductCardFragment['featuredImage']}) {
  if (!image) {
    return <></>;
  }
  return (
    <div className="relative flex items-center justify-center sm:h-216 w-full sm:w-212.5">
      <Image
        key={image.id}
        data={image}
        alt={image.altText || 'Variant Product Image'}
        aspectRatio="1/1"
        className="w-auto max-h-216 bg-white object-contain"
        sizes="auto"
      />
    </div>
  );
}
