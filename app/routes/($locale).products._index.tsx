import {json, type LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
  NavLink,
  useNavigate,
} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {IoIosArrowForward} from 'react-icons/io';
import Product from '~/components/Product';
import {useEffect, useState} from 'react';
import {useCustomContext} from '~/contexts/App';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import MobileProduct from '~/components/MobileProduct';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {Button} from '~/components/Button';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [{title: 'Products | Mario Bologna'}];
  }

  const {designer} = data;
  const designerName = designer ? designer : 'All Products';
  const title = `${designerName} | Mario Bologna`;
  const description = designer 
    ? `Discover ${designerName} collection at Mario Bologna. Shop premium quality products with authentic designs and craftsmanship.`
    : 'Explore our premium collection of fashion products at Mario Bologna. Find the perfect style with our curated selection of luxury brands.';

  return [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: `${designerName}, Mario Bologna, fashion collection, luxury brands, designer products` },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

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

  // Get designer parameter from URL
  const designer = searchParams.get('designer') ?? '';

  try {
    const {products} = await context.storefront.query(PRODUCT_QUERY, {
      variables: {
        ...paginationVariables,
        query: designer || '', // Ensure we have a valid query string
        sortKey: 'CREATED',
        reverse: true,
        country,
      },
    });
    
    // Ensure products is not null/undefined
    if (!products) {
      return json({
        products: {
          nodes: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
            endCursor: null
          }
        }, 
        designer
      });
    }
    
    return json({products, designer});
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty products array in case of error
    return json({
      products: {
        nodes: [],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: null,
          endCursor: null
        }
      }, 
      designer
    });
  }
}

export default function Collection() {
  const {setCurrentPage, direction} = useCustomContext();
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const {products, designer} = useLoaderData<typeof loader>();
  const {ref, inView} = useInView();

  useEffect(() => {
    setCurrentPage('Designers');
  }, []);

  function capitalizeWords(input: string): string {
    return input
      .split(' ') // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
      .join(' '); // Join the words back into a single string
  }

  return (
    <div className="collection">
      <div className="hidden lg:flex w-fit items-center justify-center mt-3 mb-4 px-4 ss:px-8">
        <NavLink to="/" className="text-sm hover:underline">
          {t('Home')}
        </NavLink>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} m-3`}
        />
        <p className="text-sm">
          {designer !== '' ? t(capitalizeWords(designer)) : t('Products')}
        </p>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} m-3`}
        />
        <NavLink to="/designers" className="text-sm hover:underline">
          {t('All')}
        </NavLink>
      </div>
      <div className="px-4 ss:px-8">
        {!products || !products.nodes || products.nodes.length === 0 ? (
          <div>
            <p>{t("This Designer doesn't have any products yet")}</p>
            <NavLink to="/designers" className="hover:underline">
              {t('Designers Page')}
            </NavLink>
          </div>
        ) : (
          <></>
        )}
        {products && products.nodes ? (
          <Pagination connection={products}>
            {({
              nodes,
              isLoading,
              PreviousLink,
              NextLink,
              previousPageUrl,
              nextPageUrl,
              hasPreviousPage,
              hasNextPage,
              state,
            }) => (
              <>
                <div
                  className={`${hasPreviousPage ? 'mb-6' : ''} flex items-center justify-center`}
                >
                  <Button
                    ref={ref}
                    as={PreviousLink}
                    variant="secondary"
                    width="full"
                  >
                    {isLoading ? t('Loading...') : t('Load previous')}
                  </Button>
                </div>
                <ProductsGrid
                  t={t}
                  direction={direction}
                  products={nodes as ProductCardFragment[]}
                  width={width}
                  inView={inView}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  previousPageUrl={previousPageUrl}
                  nextPageUrl={nextPageUrl}
                  state={state}
                />
                <div className="flex items-center justify-center mt-6">
                  <Button
                    ref={ref}
                    as={NextLink}
                    variant="secondary"
                    width="full"
                  >
                    {isLoading ? t('Loading...') : t('Load more products')}
                  </Button>
                </div>
              </>
            )}
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}

function ProductsGrid({
  t,
  direction,
  products,
  width,
  inView,
  nextPageUrl,
  previousPageUrl,
  hasNextPage,
  hasPreviousPage,
  state,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  products: ProductCardFragment[];
  width: number;
  inView: boolean;
  nextPageUrl: string;
  previousPageUrl: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  state: any;
}) {
  const navigate = useNavigate();
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    } else if (inView && hasPreviousPage) {
      navigate(previousPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [
    inView,
    navigate,
    state,
    nextPageUrl,
    previousPageUrl,
    hasNextPage,
    hasPreviousPage,
  ]);

  useEffect(() => {
    const fetchMetafields = async () => {
      // Get IDs of the current products
      const productIDs = products
        .map((product) => product.id.split('/').pop())
        .filter(Boolean);

      // Filter out product IDs that already exist in metafieldsMap
      const newProductIDs = productIDs.filter((id) => !metafieldsMap[id]);

      if (newProductIDs.length === 0) return; // No new products to fetch

      // Fetch metafields only for the new products
      const response = await fetch('/api/products/metafields/all', {
        method: 'POST',
        body: JSON.stringify({IDs: newProductIDs}), // Only new product IDs
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
      });

      const result: any = await response.json();
      if (result.success) {
        // Create a map of new metafields
        const newMetafieldsMap = result.data.reduce((acc: any, item: any) => {
          acc[item.productId] = item.metafields;
          return acc;
        }, {});

        // Merge the new metafields into the existing metafieldsMap
        setMetafieldsMap((prev) => ({...prev, ...newMetafieldsMap}));
      }
    };

    fetchMetafields();
  }, [products]); // Re-fetch when `products` changes

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-2 md:gap-6 overflow-hidden">
      {products.map((product, index) =>
        width >= 640 ? (
          <Product
            t={t}
            direction={direction}
            key={product.id}
            product={product}
            metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
            loading={index < 8 ? 'eager' : undefined}
          />
        ) : (
          <MobileProduct
            t={t}
            direction={direction}
            key={product.id}
            product={product}
            metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
          />
        ),
      )}
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Products($country: CountryCode, $language: LanguageCode, $sortKey: ProductSortKeys!, $reverse: Boolean, $query: String, $first: Int, $last: Int, $startCursor: String, $endCursor: String) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;