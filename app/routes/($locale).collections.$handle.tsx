import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  type MetaFunction,
  NavLink,
  useNavigate,
  useLocation,
  useNavigation,
} from '@remix-run/react';

const SCROLL_TO_PRODUCTS_FLAG = 'scrollToProducts';
import {useInView} from 'react-intersection-observer';
import {Pagination, getPaginationVariables, Money} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {IoIosArrowDown, IoIosArrowForward} from 'react-icons/io';
import {CgClose} from 'react-icons/cg';
import Product from '~/components/Product';
import {useEffect, useState} from 'react';
import {filterList} from '~/lib/filter';
import {GoSearch} from 'react-icons/go';
import {MdArrowRight, MdMenu} from 'react-icons/md';
import {
  CountryCode,
  Filter,
  Image,
  Maybe,
  MediaImage,
  MetaobjectField,
  ProductCollectionSortKeys,
  ProductFilter,
  ProductSortKeys,
} from '@shopify/hydrogen/storefront-api-types';
import {AnimatePresence, motion} from 'framer-motion';
import {GiHamburgerMenu} from 'react-icons/gi';
import {useCustomContext} from '~/contexts/App';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import MobileProduct from '~/components/MobileProduct';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import invariant from 'tiny-invariant';
import {
  FILTER_URL_PREFIX,
  SortFilter,
  SortParam,
} from '~/components/SortFilter';
import {parseAsCurrency} from '~/lib/utils';
import {Button} from '~/components/Button';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {
  METAOBJECT_CONTENT_QUERY,
  ONE_LOOK_COLLECTION_QUERY,
} from '~/lib/queries';
import {allCurrencies, currencyType} from '~/data/currencies';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [{title: 'Collection | Mario Bologna'}];
  }

  const {collection} = data;
  const title = collection.title || 'Collection';
  const description = collection.description 
    ? collection.description.substring(0, 150) + (collection.description.length > 150 ? '...' : '')
    : `Shop our ${title} collection at Mario Bologna. Discover premium quality clothing, shoes, and accessories with authentic designs.`;

  return [
    { title: `${title} | Mario Bologna` },
    { name: 'description', content: description },
    { name: 'keywords', content: `${title}, collection, Mario Bologna, fashion, luxury clothing, designer collection` },
    { property: 'og:title', content: `${title} | Mario Bologna` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${title} | Mario Bologna` },
    { name: 'twitter:description', content: description },
  ];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 6,
  });
  const {handle} = params;
  const cookies = request.headers.get('cookie');
  let currency = allCurrencies[0];
  let country: CountryCode = 'AE';

  if (cookies) {
    // Use a regular expression to extract the 'currency' cookie
    const match = cookies.match(/currency=([^;]+)/);
    if (match) {
      try {
        // Parse the JSON string back into an object
        currency = JSON.parse(decodeURIComponent(match[1])) as currencyType;
      } catch (error) {
        console.error('Error parsing currency cookie:', error);
      }
    }

    const matchCountry = cookies.match(/country=([^;]+)/);
    if (matchCountry) {
      try {
        // Parse the JSON string back into an object
        country = JSON.parse(
          decodeURIComponent(matchCountry[1]),
        ) as CountryCode;
      } catch (error) {
        console.error('Error parsing country cookie:', error);
      }
    }
  }

  invariant(handle, 'Missing handle param');

  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
    (searchParams.get('sort') as SortParam) || 'newest',
  );
  
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        
        // Special case for Accessories filter
        if (filterKey === 'productType' && value === '"Accessories"') {
          // Instead of filtering by "Accessories", filter by the actual product types that should be in Accessories
          // This includes: Beach Accessories, Belts, Hats, Scarfs, Sunglasses, Wallets
          
          // Try using productType directly first, as this is more likely to work consistently
          filters.push({
            productType: "Accessories"
          });
        } 
        else {
          filters.push({
            [filterKey]: JSON.parse(value),
          });
        }
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {
      ...paginationVariables,
      handle,
      filters,
      sortKey,
      reverse,
      country,
    },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const allFilters = [...collection.products.filters];

  const desiredOrder = [
    'Brand',
    'Product Type',
    'Description',
    'Price',
    'Size',
    'Color',
    'Availability',
  ];

  const sortedFilters = allFilters.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.label);
    const indexB = desiredOrder.indexOf(b.label);

    // If the label is not found in the desiredOrder, it will be pushed to the end.
    return (
      (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity)
    );
  });

  const allFilterValues = allFilters.flatMap((filter) => filter.values);
  const appliedFilters = filters
    .map((filter) => {
      // Special case for Accessories filter (product type filter)
      if (filter.productType === "Accessories") {
        return {
          filter,
          label: 'Accessories',
        };
      }

      // Special case for Accessories filter (tag-based filter)
      if (filter.tag && typeof filter.tag === 'string' && filter.tag.includes('Beach Accessories')) {
        return {
          filter,
          label: 'Accessories',
        };
      }

      // If no allFilterValues yet, just create a basic filter object
      if (!allFilterValues || allFilterValues.length === 0) {
        // Create a generic label based on the filter properties
        let label = 'Filter';
        if (filter.productType) label = `Type: ${filter.productType}`;
        else if (filter.tag) label = `Tag: ${filter.tag}`;
        
        return {
          filter,
          label
        };
      }

      const foundValue = allFilterValues.find((value) => {
        if (!value.input) return false;
        
        try {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
          // special case for price
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
        } catch (e) {
          return false;
        }
      });

      if (!foundValue) {
        // If we can't match the filter to a value, create a generic label
        let label = 'Filter';
        if (filter.productType) label = `Type: ${filter.productType}`;
        else if (filter.tag) label = `Tag: ${filter.tag}`;
        
        return {
          filter,
          label
        };
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price
        try {
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, currency);
        const max = parseAsCurrency(input.price?.max ?? 0, currency);
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
        } catch (e) {
          return {
            filter,
            label: 'Price'
          };
      }
      }
      
      return {
        filter,
        label: foundValue.label || 'Filter',
      };
    });

  const {collection: lookCollection} = await context.storefront.query(
    ONE_LOOK_COLLECTION_QUERY,
    {
      variables: {country, handle: 'one-look'},
    },
  );

  let metaobject = null;

  if (['outlet', 'sale'].includes(handle)) {
    const contentHandle = `${handle.toLocaleLowerCase()}s_banner`;
    const type = 'collections_banner';
    const data = await context.storefront.query(METAOBJECT_CONTENT_QUERY, {
      variables: {
        country,
        handle: contentHandle,
        type,
      },
    });

    metaobject = data.metaobject;
  }

  return json({
    handle,
    collection,
    lookCollection,
    appliedFilters,
    allFilters: sortedFilters,
    metaobject,
  });
}

export default function Collection() {
  const {setCurrentPage, language, direction} = useCustomContext();
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    handle,
    collection,
    lookCollection,
    appliedFilters,
    allFilters,
    metaobject,
  } = useLoaderData<typeof loader>();
  const {ref, inView} = useInView();
  const [openDropdown, setOpenDropdown] = useState<{[x: string]: boolean}>({});
  const [openFilter, setOpenFilter] = useState<boolean>(width >= 1280);
  const [selectedOptions, setSelectedOptions] = useState<{
    [x: string]: {[y: string]: boolean};
  }>({});
  const [toggleInitial, setToggleInitial] = useState<boolean>(false);
  const [totalLength, setTotalLength] = useState(
    collection.allProducts.nodes.length,
  );
  const [filteredLength, setFilteredLength] = useState(
    collection.products.nodes.length,
  );
  const [section, setSection] = useState('');

  useEffect(() => {
    if (['women', 'men', 'kids'].includes(handle)) {
      setSection(handle);
    } else {
      setSection('other collections');
    }
  }, [handle]);

  useEffect(() => {
    setCurrentPage(collection.title);
    const initialOptions: {[x: string]: {[y: string]: boolean}} = {};
    filterList.forEach((filter) => {
      initialOptions[filter.title] = {};
    });
    setSelectedOptions(initialOptions);
  }, [toggleInitial]);

  useEffect(() => {
    setTotalLength(collection.allProducts.nodes.length);
    setFilteredLength(collection.filteredProducts?.nodes?.length || 0);
  }, [appliedFilters]);

  // Update filter display based on screen size
  useEffect(() => {
    setOpenFilter(width >= 1280); // Use sidebar filter only on large desktop (xl+), mobile-style on tablet and iPad
  }, [width]);

  // Handle controlled scroll behavior using sessionStorage flag
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only scroll when we *explicitly* set the flag
    const shouldScroll = sessionStorage.getItem(SCROLL_TO_PRODUCTS_FLAG) === '1';
    if (!shouldScroll) return;

    // Wait until the navigation has finished and the DOM is painted
    if (navigation.state !== 'idle') return;

    sessionStorage.removeItem(SCROLL_TO_PRODUCTS_FLAG);

    // If you have a sticky header, optionally subtract its height
    requestAnimationFrame(() => {
      const el = document.getElementById('products');
      if (!el) return;
      const header = document.getElementById('main-header');
      const offset = header?.offsetHeight ?? 0;

      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }, [location.pathname, location.search, navigation.state]);


  // Let Remix handle scroll restoration for back/forward navigation

  return (
    <div className="collection">
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
          {t(collection.title)}
        </p>
      </div>
      {['Men', 'Women', 'Kids'].includes(collection.title) ? (
        <div
          className={`mt-4 lg:mt-0 px-4 ss:px-8 grid grid-cols-1 ss:grid-cols-2 ${handle !== 'kids' ? 'md:grid-cols-3 xl:grid-cols-4' : 'xl:grid-cols-2'} gap-2 md:gap-4`}
        >
          <div
            className={`block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30 cursor-pointer`}
            style={{
              backgroundImage: section
                ? `url('/images/${section}/shoes.jpg')`
                : '',
            }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(SCROLL_TO_PRODUCTS_FLAG, '1');
              }
              navigate(`/collections/${collection.handle}?filter.productType="Footwear"`, {
                replace: true,
                preventScrollReset: true,
              });
            }}
          >
            <p className="p-2 text-xs ss:text-base md:p-4">{t('Footwear')}</p>
          </div>
          {handle !== 'kids' ? (
            <>
              <div
                className={`block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30 cursor-pointer`}
                style={{
                  backgroundImage: section
                    ? `url('/images/${section}/clothes.jpg')`
                    : '',
                }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem(SCROLL_TO_PRODUCTS_FLAG, '1');
                  }
                  navigate(`/collections/${collection.handle}?filter.productType="Clothes"`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }}
              >
                <p className="p-2 text-xs ss:text-base md:p-4">
                  {t('Clothes')}
                </p>
              </div>
              <div
                className={`block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30 cursor-pointer`}
                style={{
                  backgroundImage: section
                    ? `url('/images/${section}/bags.jpg')`
                    : '',
                }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem(SCROLL_TO_PRODUCTS_FLAG, '1');
                  }
                  navigate(`/collections/${collection.handle}?filter.productType="Bags"`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }}
              >
                <p className="p-2 text-xs ss:text-base md:p-4">{t('Bags')}</p>
              </div>
              <div
                className={`block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30 cursor-pointer`}
                style={{
                  backgroundImage: section
                    ? `url('/images/${section}/accessories.jpg')`
                    : '',
                }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem(SCROLL_TO_PRODUCTS_FLAG, '1');
                  }
                  navigate(`/collections/${collection.handle}?filter.productType="Accessories"`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }}
              >
                <p className="p-2 text-xs ss:text-base md:p-4">
                  {t('Accessories')}
                </p>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : ['Sale', 'Outlet'].includes(collection.title) ? (
        <BannerSection
          t={t}
          direction={direction}
          language={language}
          metaobject={metaobject}
        />
      ) : (
        <div className="pt-4 pb-8 px-4 sm:pt-8 sm:pb-10 sm:px-14 mx-4 ss:mx-8 flex flex-col items-start justify-start bg-neutral-N-90">
          <h1 className="text-xl sm:text-5xl font-medium mb-2">
            {t(collection.title)}
          </h1>
          <p className="text-sm sm:text-base">
            {t('Discover how much you can save by exploring the products!')}
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
      )}
      {/* <div className="px-4 ss:px-8 flex items-start justify-start gap-16">
        <AnimatePresence>
          {openFilter && (
            <div className="w-72 md:block hidden">
              <div className="flex items-center gap-16">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button
                  onClick={() => setOpenFilter(false)}
                  title="Close Filter"
                >
                  <CgClose className="w-7 h-7" />
                </button>
                <button
                  onClick={() => setToggleInitial(!toggleInitial)}
                  className="hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="flex gap-1 py-6">
                <span>Showing</span>
                <span>0</span>
                <span>of</span>
                <span>100</span>
              </div>
              <div className="flex flex-col gap-5 border-b border-b-black pb-5">
                {filterList.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() =>
                        setOpenDropdown({
                          [item.title]: !openDropdown[item.title],
                        })
                      }
                      className="flex w-full items-center justify-between py-5 border-t border-t-black"
                    >
                      <p className="text-2xl">{item.title}</p>
                      <IoIosArrowDown
                        className={`${
                          openDropdown[item.title] ? 'rotate-0' : 'rotate-180'
                        } ml-2 transition-transform`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown[item.title] &&
                        (!item.isSize ? (
                          <motion.div
                            initial={{
                              height: 0,
                            }}
                            animate={{
                              height: 'auto',
                            }}
                            exit={{
                              height: 0,
                            }}
                            className="overflow-hidden"
                          >
                            {item.dropdownList.map((dropdown, index) => (
                              <div
                                key={index}
                                className="flex gap-3 items-center justify-start py-2"
                              >
                                <input
                                  type="checkbox"
                                  name={item.checkboxGroup}
                                  id={`${item.checkboxGroup}_${index}`}
                                  checked={
                                    selectedOptions[item.title]?.[
                                      dropdown.name
                                    ] ?? false
                                  }
                                  onChange={() => {
                                    setSelectedOptions({
                                      ...selectedOptions,
                                      [item.title]: {
                                        ...selectedOptions[item.title],
                                        [dropdown.name]:
                                          !selectedOptions[item.title][
                                            dropdown.name
                                          ],
                                      },
                                    });
                                  }}
                                />
                                <label
                                  htmlFor={`${item.checkboxGroup}_${index}`}
                                >
                                  {dropdown.name}
                                </label>
                              </div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{
                              height: 0,
                            }}
                            animate={{
                              height: 'auto',
                            }}
                            exit={{
                              height: 0,
                            }}
                            className="flex flex-wrap gap-2 overflow-hidden"
                          >
                            {item.dropdownList.map((dropdown, index) => (
                              <button
                                key={index}
                                className={`${selectedOptions[item.title][dropdown.name] ? 'border-transparent text-white bg-secondary-S-90' : 'border-neutral-N-50 text-primary-P-40'} py-2.5 px-6 text-sm rounded-md border`}
                                onClick={() => {
                                  setSelectedOptions({
                                    ...selectedOptions,
                                    [item.title]: {
                                      ...selectedOptions[item.title],
                                      [dropdown.name]:
                                        !selectedOptions[item.title][
                                          dropdown.name
                                        ],
                                    },
                                  });
                                }}
                              >
                                {dropdown.name}
                              </button>
                            ))}
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div> */}
      {collection.products.filters.length > 0 ? (
        <div id="products">
          <SortFilter
            filters={allFilters as Filter[]}
            appliedFilters={appliedFilters as any}
            isOpen={openFilter}
            setIsOpen={setOpenFilter}
            t={t}
            direction={direction}
            filteredLength={filteredLength}
            totalLength={totalLength}
            handle={handle}
          >
            <Pagination connection={collection.products}>
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
                  {nodes.length > 0 ? (
                    <ProductsGrid
                      handle={section}
                      t={t}
                      direction={direction}
                      products={nodes as ProductCardFragment[]}
                      openFilter={openFilter}
                      width={width}
                      inView={inView}
                      hasNextPage={hasNextPage}
                      hasPreviousPage={hasPreviousPage}
                      previousPageUrl={previousPageUrl}
                      nextPageUrl={nextPageUrl}
                      state={state}
                      lookProducts={lookCollection?.products.nodes}
                    />
                  ) : (
                    <p>{t('No Products available yet')}</p>
                  )}
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
          </SortFilter>
        </div>
      ) : (
        <div className="px-4 ss:px-8 pt-6">
          <h3 className="font-semibold text-2xl xs:text-4xl">
            {t('COMING SOON...')}
          </h3>
        </div>
      )}
    </div>
  );
}

function ProductsGrid({
  handle,
  t,
  direction,
  products,
  openFilter,
  width,
  inView,
  nextPageUrl,
  previousPageUrl,
  hasNextPage,
  hasPreviousPage,
  state,
  lookProducts = [],
}: {
  handle: string;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  products: ProductCardFragment[];
  openFilter: boolean;
  width: number;
  inView: boolean;
  nextPageUrl: string;
  previousPageUrl: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  state: any;
  lookProducts?: ProductCardFragment[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Reset metafieldsMap when search params change (filter change)
  useEffect(() => {
    // Skip if we're navigating to products section - let the main scroll handler deal with it
    if (location.hash === '#products') {
      return;
    }
    
    // Reset metafields when the URL search params change (filter change)
    setMetafieldsMap({});
  }, [location.search, location.hash]);

  const [modulo, setModulo] = useState(openFilter ? 6 : 8);
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

  // Update modulo value when openFilter changes
  useEffect(() => {
    setModulo(openFilter ? 6 : 8);
  }, [openFilter]);

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

  const elements: any[] = [];
  let guide = '';
  products.forEach((product, index) => {
    if (['men', 'women', 'kids'].includes(handle)) {
      guide = handle;
    } else {
      const collections = product.collections.nodes;
      // Find the first matching collection
      const collection = collections.find((collection) =>
        ['women', 'men', 'kids'].includes(collection.handle),
      );
      if (collection) {
        guide = collection.handle;
      }
    }
    elements.push(
      width >= 640 ? (
        <Product
          t={t}
          direction={direction}
          key={`desktop-${product.id}`}
          product={product}
          metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
          loading={index < 8 ? 'eager' : undefined}
        />
      ) : (
        <MobileProduct
          t={t}
          direction={direction}
          key={`mobile-${product.id}`}
          product={product}
          metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
        />
      ),
    );

    // if ((index + 1) % modulo === 0) {
    //   elements.push(
    //     <LookSection
    //       t={t}
    //       direction={direction}
    //       key={`look-${index}`}
    //       openFilter={openFilter}
    //       width={width}
    //       lookProducts={lookProducts}
    //     />,
    //   );
    // }
  });

  return (
    <div
      className={`grid gap-3 sm:gap-4 md:gap-6 lg:gap-4 ${
        openFilter 
          ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' // When filter sidebar is open (large desktop), show fewer columns
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5' // When filter is mobile-style (tablet/iPad), show 3 columns on tablet/iPad
      }`}
    >
      {elements}
    </div>
  );
}

function LookSection({
  t,
  direction,
  width,
  height,
  openFilter,
  lookProducts,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  width: number;
  height?: number;
  openFilter: boolean;
  lookProducts: ProductCardFragment[];
}) {
  const [totalPrice, setTotalPrice] = useState('0');
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

  useEffect(() => {
    let total = 0;
    lookProducts.forEach((product) => {
      total += parseFloat(product.priceRange.minVariantPrice.amount);
    });
    setTotalPrice(total.toString());
  }, []);

  useEffect(() => {
    const fetchMetafields = async () => {
      const productIDs = lookProducts.map((product) =>
        product.id.split('/').pop(),
      );

      const response = await fetch('/api/products/metafields/all', {
        method: 'POST',
        body: JSON.stringify({IDs: productIDs}), // Send an array of product IDs
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
      });

      const result: any = await response.json();
      if (result.success) {
        const newMetafieldsMap = result.data.reduce((acc: any, item: any) => {
          acc[item.productId] = item.metafields;
          return acc;
        }, {});
        setMetafieldsMap({...metafieldsMap, ...newMetafieldsMap});
      }
    };

    fetchMetafields();
  }, [lookProducts]);

  return (
    <div
      className={`${openFilter ? 'md:gap-x-6' : 'md:gap-x-3'} w-full flex gap-2 md:gap-y-6 flex-wrap`}
    >
      <NavLink
        to="/look"
        className="text-start group flex flex-col border border-neutral-N-80 rounded-xl overflow-hidden"
      >
        <div
          className={`${openFilter ? 'lg:min-w-180.5 lg:min-h-210.5' : 'md:min-w-177.5 md:min-h-210.5'} min-w-43.5 min-h-40 xs:min-w-89.5 sm:min-w-87 xs:min-h-80 block hover:no-underline relative flex-grow transition-colors bg-cover bg-top bg-no-repeat bg-[url('/images/look_photo.jpeg')] after:absolute after:inset-0 after:z-10 after:group-hover:bg-black/20 after:group-active:bg-black/30 after:transition-colors`}
        ></div>
        <div className="self-stretch flex flex-col p-4 gap-5 items-stretch justify-start">
          <div>
            <h4 className="text-neutral-N-10 text-sm sm:text-base">
              {t('Look')}
            </h4>
            <Money
              className="text-neutral-N-30 text-xs sm:text-sm"
              data={{amount: totalPrice, currencyCode: 'AED'}}
            />
          </div>
          <NavLink
            to="/look"
            className="text-center font-medium bg-primary-P-40 text-white rounded-md transition-colors p-2 xs:py-2.5 xs:px-6 hover:no-underline hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90"
          >
            {t('View Look')}
          </NavLink>
        </div>
      </NavLink>
      <div className="flex flex-col gap-2 md:gap-6 flex-1">
        <div
          className={`${openFilter ? 'md:gap-x-6' : 'md:gap-x-3'} flex-wrap self-start flex gap-2 md:gap-y-6`}
        >
          {lookProducts.map((product, index) => {
            return (
              index < 2 &&
              (width >= 640 ? (
                <Product
                  t={t}
                  direction={direction}
                  key={`desktop-look-${product.id}`}
                  product={product}
                  metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                  loading={index < 8 ? 'eager' : undefined}
                />
              ) : (
                <MobileProduct
                  t={t}
                  direction={direction}
                  key={`mobile-look-${product.id}`}
                  product={product}
                  metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                />
              ))
            );
          })}
        </div>
        {!openFilter && (
          <div className="flex self-start flex-wrap gap-x-3 gap-y-6">
            {lookProducts.map((product, index) => {
              return (
                index >= 2 &&
                (width >= 640 ? (
                  <Product
                    t={t}
                    direction={direction}
                    key={`desktop-look-more-${product.id}`}
                    product={product}
                    metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                    loading={index < 8 ? 'eager' : undefined}
                  />
                ) : (
                  <MobileProduct
                    t={t}
                    direction={direction}
                    key={`mobile-look-more-${product.id}`}
                    product={product}
                    metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                  />
                ))
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}

function BannerSection({
  t,
  direction,
  language,
  metaobject,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  language: string;
  metaobject:
    | {
        fields: Array<
          Pick<MetaobjectField, 'key' | 'value' | 'type'> & {
            reference?: Maybe<
              Pick<MediaImage, 'id'> & {
                image?: Maybe<
                  Pick<Image, 'url' | 'altText' | 'width' | 'height'>
                >;
              }
            >;
            references?: Maybe<{
              nodes: Array<
                Pick<MediaImage, 'id'> & {
                  image?: Maybe<
                    Pick<Image, 'url' | 'altText' | 'width' | 'height'>
                  >;
                }
              >;
            }>;
          }
        >;
      }
    | null
    | undefined;
}) {
  const [rightLine, setRightLine] = useState('');
  const [leftLine, setLeftLine] = useState('');
  const [rightImagesSrc, setRightImagesSrc] = useState<
    (string | undefined)[] | undefined
  >();
  const [leftImagesSrc, setLeftImagesSrc] = useState<
    (string | undefined)[] | undefined
  >();

  if (!metaobject) return <></>;

  useEffect(() => {
    const rightImages = metaobject.fields.find(
      (meta) => meta.key === 'right_images',
    );
    const leftImages = metaobject.fields.find(
      (meta) => meta.key === 'left_images',
    );
    setRightImagesSrc(
      rightImages?.references?.nodes?.map((ref) => ref.image?.url),
    );
    setLeftImagesSrc(
      leftImages?.references?.nodes?.map((ref) => ref.image?.url),
    );
  }, [metaobject]);

  useEffect(() => {
    const fields = metaobject.fields;
    let leftLine = '';
    let rightLine = '';
    if (language === 'en') {
      leftLine = fields.find((meta) => meta.key === 'left_line')?.value ?? '';
      rightLine = fields.find((meta) => meta.key === 'right_line')?.value ?? '';
    }
    if (language === 'ar') {
      leftLine =
        fields.find((meta) => meta.key === 'arabic_left_line')?.value ?? '';
      rightLine =
        fields.find((meta) => meta.key === 'arabic_right_line')?.value ?? '';
    }

    setRightLine(rightLine);
    setLeftLine(leftLine);
  }, [metaobject, language]);

  return (
    <div className="relative w-full h-[35vh] sm:h-[29vh] flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-50">
      {/* Desktop layout */}
      <div className="hidden sm:flex absolute inset-0 items-center justify-center">
        {/* Left images */}
        <div
          className={`${direction === 'ltr' ? 'left-8 md:left-16' : 'right-8 md:right-16'} absolute flex items-center justify-center gap-4`}
        >
          {leftImagesSrc &&
            leftImagesSrc.map((src) => (
              <img
                key={src}
                src={src}
                className="max-h-32 md:max-h-48 lg:max-h-64 w-auto object-contain"
                alt=""
              />
            ))}
        </div>

        {/* Center text */}
        <div className="flex flex-col items-center gap-6 md:gap-8 z-10 max-w-2xl px-8">
          <p className="font-rangga text-2xl md:text-4xl lg:text-5xl backdrop-blur bg-white/20 px-6 py-3 rounded-lg text-center">
            {leftLine}
          </p>
          <p className="font-rangga text-2xl md:text-4xl lg:text-5xl backdrop-blur bg-white/20 px-6 py-3 rounded-lg text-center">
            {rightLine}
          </p>
        </div>

        {/* Right images */}
        <div
          className={`${direction === 'ltr' ? 'right-8 md:right-16' : 'left-8 md:left-16'} absolute flex items-center justify-center gap-4`}
        >
          {rightImagesSrc &&
            rightImagesSrc.map((src) => (
              <img
                key={src}
                src={src}
                className="max-h-32 md:max-h-48 lg:max-h-64 w-auto object-contain"
                alt=""
              />
            ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden flex flex-col items-center justify-center gap-6 p-6 w-full">
        {/* Top images */}
        <div className="flex items-center justify-center gap-3">
          {leftImagesSrc &&
            leftImagesSrc.map((src) => (
              <img
                key={src}
                src={src}
                className="max-h-16 w-auto object-contain"
                alt=""
              />
            ))}
        </div>
        
        {/* Text content */}
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="font-rangga text-xl backdrop-blur bg-white/30 px-4 py-2 rounded-lg text-center w-full">
            {leftLine}
          </p>
          <p className="font-rangga text-xl backdrop-blur bg-white/30 px-4 py-2 rounded-lg text-center w-full">
            {rightLine}
          </p>
        </div>
        
        {/* Bottom images */}
        <div className="flex items-center justify-center gap-3">
          {rightImagesSrc &&
            rightImagesSrc.map((src) => (
              <img
                key={src}
                src={src}
                className="max-h-16 w-auto object-contain"
                alt=""
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
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
      allProducts: products(
        first: 250,
      ) {
        nodes {
          id
        }
      }
      filteredProducts: products(
        first: 250,
        filters: $filters,
      ) {
        nodes {
          id
        }
      }
    }
  }
` as const;