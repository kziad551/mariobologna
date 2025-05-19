import {useNonce} from '@shopify/hydrogen';
import {
  defer,
  type SerializeFrom,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import favicon from './assets/favicon.png';
import resetStyles from './styles/reset.css?url';
import appStyles from './styles/app.css?url';
import {Layout} from '~/components/Layout';
import stylesheet from '~/tailwind.css?url';
import ContextProvider from './contexts/App';
import {PrimeReactProvider} from 'primereact/api';
import {WishlistProvider} from './contexts/WishList';
import {AuthProvider} from './contexts/AuthContext';
import {I18nextProvider} from 'react-i18next';
import i18n from './utils/i18n';
import {ViewedProductsProvider} from './contexts/ViewedProducts';
import {BrowsingHistoryProvider} from './contexts/BrowsingHistory';
import {
  CountryCode,
  MenuItem,
  MenuItemType,
  type Shop,
  type Menu,
} from '@shopify/hydrogen/storefront-api-types';
import {Storefront, type I18nLocale} from './lib/type';
import GoogleMapWrapper from './components/GoogleMapWrapper';
import {CompareProductProvider} from './contexts/CompareProducts';
import CookieConsent from './components/Popup/PopupCookie';
import {HelmetProvider, Helmet} from 'react-helmet-async';
import type {
  CartApiQueryFragment,
  FooterQuery,
} from 'storefrontapi.generated';
import {Jsonify} from '@remix-run/server-runtime/dist/jsonify';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: stylesheet},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = (): SerializeFrom<typeof loader> => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export type submenuType = Pick<
  MenuItem,
  'id' | 'tags' | 'type' | 'title' | 'url'
> & {
  items: Array<
    Pick<MenuItem, 'id' | 'tags' | 'type' | 'title' | 'url'> & {
      items: Array<
        Pick<MenuItem, 'id' | 'tags' | 'type' | 'title' | 'url'> & {
          items: Array<
            Pick<MenuItem, 'id' | 'tags' | 'type' | 'title' | 'url'>
          >;
        }
      >;
    }
  >;
};
type HandleFiltersType = {
  storefront: Storefront;
  type: 'men' | 'women' | 'kids';
  publicStoreDomain: string;
  submenus: {
    men: submenuType[];
    women: submenuType[];
    kids: submenuType[];
  };
  country: CountryCode;
};

const handleFilters = async ({
  storefront,
  type,
  publicStoreDomain,
  submenus,
  country,
}: HandleFiltersType) => {
  const filters = await storefront.query(GET_COLLECTION_PRODUCT_FILTERS, {
    cache: storefront.CacheLong(),
    variables: {
      country,
      handle: type,
    },
  });
  let productTypes = filters.collection?.products.filters.find(
    (filter) => filter.label === 'Product Type',
  );
  for (const productType of productTypes?.values || []) {
    let value: submenuType = {
      id: '',
      title: '',
      url: '',
      type: 'HTTP',
      items: [],
      tags: [],
    };
    const label = productType.label;
    value.title = label;
    value.url = publicStoreDomain + `/?filter.productType=\"${label}\"`;
    const labelFilters = await storefront.query(
      GET_COLLECTION_PRODUCT_FILTERS,
      {
        cache: storefront.CacheLong(),
        variables: {
          country,
          handle: type,
          filters: [
            {
              productType: label,
            },
          ],
        },
      },
    );
    const tags = labelFilters.collection?.products.filters.find(
      (filter) => filter.label === 'Description',
    );
    const validTags = tags?.values.filter((tag) => tag.count !== 0);
    if (validTags && validTags.length > 0) {
      value.items.push(
        ...validTags.map((tag) => ({
          id: '',
          title: tag.label,
          url:
            publicStoreDomain +
            `/?filter.productType=\"${label}\"&filter.tag=\"${tag.label}\"`,
          type: 'HTTP' as MenuItemType,
          tags: [],
          items: [],
        })),
      );
    }
    submenus[type].push(value);
    submenus[type].sort((a, b) => a.title.localeCompare(b.title));
  }
};

type ShopData = {
  id: string;
  name: string;
  description: string;
  primaryDomain: {
    url: string;
  };
  brand?: {
    logo?: {
      image?: {
        url?: string;
      };
    };
  };
};

type HeaderData = {
  shop: ShopData | null;
  menu: Menu | null;
};

export type LayoutProps = {
  cart: CartApiQueryFragment | null;
  children?: React.ReactNode;
  footer: {
    mainFooter: Jsonify<FooterQuery>;
    aboutFooter: Jsonify<FooterQuery>;
    ordersFooter: Jsonify<FooterQuery>;
    customerFooter: Jsonify<FooterQuery>;
    privacyFooter: Jsonify<FooterQuery>;
  };
  header: Jsonify<HeaderData>;
  submenus: {
    men: submenuType[];
    women: submenuType[];
    kids: submenuType[];
  };
  GOOGLE_API_KEY: string;
  publicStoreDomain: string;
  selectedLocale: I18nLocale;
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront, cart, env} = context;
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;
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

  const mainFooter = await storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer',
      language: storefront.i18n.language,
    },
  }).catch(() => ({ menu: null }));

  const aboutFooter = await storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'about-footer-menu',
      language: storefront.i18n.language,
    },
  }).catch(() => ({ menu: null }));

  const ordersFooter = await storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'orders-footer-menu',
      language: storefront.i18n.language,
    },
  }).catch(() => ({ menu: null }));

  const customerFooter = await storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'customer-care-footer-menu',
      language: storefront.i18n.language,
    },
  }).catch(() => ({ menu: null }));

  const privacyFooter = await storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'privacy-footer-menu',
      language: storefront.i18n.language,
    },
  }).catch(() => ({ menu: null }));

  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu',
      language: storefront.i18n.language,
    },
  }).catch(() => ({ shop: null, menu: null }));

  const submenus: {
    men: submenuType[];
    women: submenuType[];
    kids: submenuType[];
  } = {
    men: [],
    women: [],
    kids: [],
  };

  await handleFilters({
    publicStoreDomain,
    storefront,
    submenus,
    type: 'men',
    country,
  });
  await handleFilters({
    publicStoreDomain,
    storefront,
    submenus,
    type: 'women',
    country,
  });
  await handleFilters({
    publicStoreDomain,
    storefront,
    submenus,
    type: 'kids',
    country,
  });

  return defer(
    {
      GOOGLE_API_KEY: env.GOOGLE_API_KEY,
      cart: await cart.get(),
      footer: {
        mainFooter,
        aboutFooter,
        ordersFooter,
        customerFooter,
        privacyFooter,
      },
      header,
      submenus,
      publicStoreDomain,
      selectedLocale: storefront.i18n,
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const value = {
    cssTransition: true,
    hideOverlaysOnDocumentScrolling: true,
    // inputStyle: "filled",
    nullSortOrder: -1,
  };

  return (
    <HelmetProvider>
      <html lang="en">
        <head>
          <Helmet>
            {/* Google Tag Manager */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-RRXF8VQM6Q"
              nonce={nonce}
            ></script>
            <script nonce={nonce}>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-RRXF8VQM6Q', {
                  send_page_view: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
                
                // Enable Enhanced Ecommerce measurements
                gtag('set', 'developer_id.dNDMyYj', true);
                gtag('config', 'G-RRXF8VQM6Q', {
                  send_page_view: true,
                  ecommerce: {
                    currency: 'AED',
                    items: []
                  }
                });
              `}
            </script>
          </Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <PrimeReactProvider value={value}>
            <AuthProvider>
              <ContextProvider>
                <CompareProductProvider>
                  <ViewedProductsProvider>
                    <WishlistProvider>
                      <I18nextProvider i18n={i18n}>
                        <GoogleMapWrapper googleKey={data.GOOGLE_API_KEY}>
                          <Layout {...data as any}>
                            <BrowsingHistoryProvider>
                              <Outlet />
                            </BrowsingHistoryProvider>
                          </Layout>
                        </GoogleMapWrapper>
                      </I18nextProvider>
                    </WishlistProvider>
                  </ViewedProductsProvider>
                </CompareProductProvider>
                <CookieConsent />
              </ContextProvider>
            </AuthProvider>
          </PrimeReactProvider>
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </body>
      </html>
    </HelmetProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData as any}>
          <div className="route-error">
            <h1>Oops</h1>
            <h2>{errorStatus}</h2>
            {errorMessage && (
              <fieldset>
                <pre>{errorMessage}</pre>
              </fieldset>
            )}
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
    items {
      ...MenuItem
    }
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const GET_COLLECTION_PRODUCT_FILTERS = `#graphql
    query GetCollectionProductFilters($handle: String!, $filters: [ProductFilter!], $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
      collection(handle: $handle) {
        id
        handle
        products(first: 1, filters: $filters) {
          filters {
            id
            label
            values {
              id
              label
              count
            }
          }
        }
      }
    }
  ` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
