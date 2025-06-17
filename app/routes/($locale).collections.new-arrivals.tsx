import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction, NavLink} from '@remix-run/react';
import {useEffect} from 'react';
import {IoIosArrowForward} from 'react-icons/io';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {ProductsSection} from '~/components/ProductsSection';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {NEW_ARRIVALS_QUERY, OTHER_COLLECTION_QUERY} from '~/lib/queries';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => {
  return [{title: 'New Arrivals'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
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

  // Try to fetch using NEW_ARRIVALS_QUERY first
  try {
    const {collection: newArrivalsProducts} = await storefront.query(
      NEW_ARRIVALS_QUERY,
      {
        variables: {
          country, 
          handle: 'new-arrivals', 
          first: 10,
          sortKey: 'PUBLISHED_AT',
          reverse: true
        },
      },
    );

    if (newArrivalsProducts) {
      return defer({
        newArrivalsProducts,
      });
    }
  } catch (error) {
    console.error('Error fetching new-arrivals with NEW_ARRIVALS_QUERY:', error);
  }

  // Fallback to OTHER_COLLECTION_QUERY if the first query fails
  try {
    const {collection: newArrivalsProducts} = await storefront.query(
      OTHER_COLLECTION_QUERY,
      {
        variables: {
          country, 
          handle: 'new-arrivals', 
          first: 10,
        },
      },
    );

    if (newArrivalsProducts) {
      return defer({
        newArrivalsProducts,
      });
    }
  } catch (error) {
    console.error('Error fetching new-arrivals with OTHER_COLLECTION_QUERY:', error);
  }

  // If both queries fail, return an empty collection instead of throwing a 404
  return defer({
    newArrivalsProducts: {
      id: 'new-arrivals',
      handle: 'new-arrivals',
      title: 'New Arrivals',
      description: '',
      products: {
        nodes: [],
      },
    },
  });
}

export default function NewArrivalsPage() {
  const {setCurrentPage, direction, language} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const {newArrivalsProducts} = useLoaderData<typeof loader>();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('New Arrivals');
  }, [setCurrentPage]);

  return (
    <div className="new-arrivals">
      <div className="flex w-full items-center mt-3 mb-4 px-4 ss:px-8 text-neutral-N-30 overflow-x-auto">
        <NavLink to="/" className="text-sm hover:underline whitespace-nowrap">
          {t('Home')}
        </NavLink>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} mx-2 flex-shrink-0`}
        />
        <span className="text-sm text-neutral-N-30 whitespace-nowrap">
          {t('Collections')}
        </span>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} mx-2 flex-shrink-0`}
        />
        <p className="text-sm font-medium text-primary-P-40 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
          {t('New Arrivals')}
        </p>
      </div>

      <div className="pt-4 pb-8 px-4 sm:pt-8 sm:pb-10 sm:px-14 mx-4 ss:mx-8 flex flex-col items-start justify-start bg-neutral-N-90">
        <h1 className="text-xl sm:text-5xl font-medium mb-2">
          {t('New Arrivals')}
        </h1>
        <p className="text-sm sm:text-base">
          {t('Discover our latest products!')}
        </p>
        <div className="flex flex-wrap items-stretch justify-start gap-x-3 gap-y-4 sm:gap-10 mt-4 sm:mt-8">
          <NavLink
            to="/collections/men"
            className="text-sm font-medium px-6 py-2.5 bg-transparent border border-primary-P-40 text-primary-P-40"
          >
            {t('Shop Men')}
          </NavLink>
          <NavLink
            to="/collections/women"
            className="text-sm font-medium px-6 py-2.5 bg-transparent border border-primary-P-40 text-primary-P-40"
          >
            {t('Shop Women')}
          </NavLink>
          <NavLink
            to="/collections/kids"
            className="text-sm font-medium px-6 py-2.5 bg-transparent border border-primary-P-40 text-primary-P-40"
          >
            {t('Shop Kids')}
          </NavLink>
        </div>
      </div>

      <div className="px-4 ss:px-8 py-8">
        {newArrivalsProducts && newArrivalsProducts.products.nodes.length > 0 ? (
          <ProductsSection
            title=""
            width={width}
            height={height}
            products={newArrivalsProducts?.products.nodes}
            t={t}
            direction={direction}
            showViewAll={false}
          />
        ) : (
          <div className="text-center py-10">
            <p>{t('No products available yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
} 