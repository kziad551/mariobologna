import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';

import {
  SearchForm,
  SearchResults,
  NoSearchResults,
  TrySearch,
} from '~/components/Search';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => {
  return [{title: `Search`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchTerm = String(searchParams.get('q') || '');
  const handle = String(searchParams.get('handle') || '');
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

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      handle,
    };
  }

  const {errors, ...data} = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      country,
      query: `product_type:"${searchTerm}" OR tag:"${searchTerm}" OR vendor:"${searchTerm}" OR title:"${searchTerm}"`,
      first: 100,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  let filteredResults = data.products.nodes;
  if (handle) {
    filteredResults = filteredResults.filter((product) =>
      product.collections.nodes.some(
        (collection: any) => collection.handle === handle,
      ),
    );
  }
  const totalResults = filteredResults.length;

  // const totalResults = Object.values(data).reduce((total, value) => {
  //   return total + value.nodes.length;
  // }, 0);

  const searchResults = {
    results: {
      products: {nodes: filteredResults},
    },
    totalResults,
  };
  // const searchResults = {
  //   results: data,
  //   totalResults,
  // };

  return defer({
    searchTerm,
    searchResults,
    handle,
  });
}

export default function SearchPage() {
  const {searchTerm, searchResults, handle} = useLoaderData<typeof loader>();
  const {setCurrentPage, language, direction} = useCustomContext();
  const {t} = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage('Search');
  }, []);

  return (
    <div className="search px-4 py-8">
      <SearchForm
        t={t}
        direction={direction}
        searchTerm={searchTerm}
        handle={handle}
        navigate={navigate}
      />
      {searchTerm ? (
        !searchResults.totalResults ? (
          <NoSearchResults t={t} />
        ) : (
          <SearchResults
            results={searchResults.results}
            searchTerm={searchTerm}
            t={t}
          />
        )
      ) : (
        <TrySearch t={t} />
      )}
    </div>
  );
}

const SEARCH_QUERY = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
  query search(
    $country: CountryCode
    $first: Int
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
          collections(first: 100) {
            nodes {
              handle
            }
          }
        }
      }
    }
  }
` as const;