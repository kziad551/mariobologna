import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResults,
} from '~/components/Search';
import {NO_PREDICTIVE_SEARCH_RESULTS} from '~/components/Search';
import {applyTrackingParams} from '~/lib/search';

import type {
  PredictiveArticleFragment,
  PredictiveCollectionFragment,
  PredictivePageFragment,
  PredictiveProductFragment,
  PredictiveQueryFragment,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

type PredictiveSearchTypes =
  | 'ARTICLE'
  | 'COLLECTION'
  | 'PAGE'
  | 'PRODUCT'
  | 'QUERY';

const DEFAULT_SEARCH_TYPES: PredictiveSearchTypes[] = [
  'ARTICLE',
  'COLLECTION',
  'PAGE',
  'PRODUCT',
  'QUERY',
];

/**
 * Fetches the search results from the predictive search API
 * requested by the SearchForm component
 */
export async function loader({request, params, context}: LoaderFunctionArgs) {
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

  const search = await fetchPredictiveSearchResults({
    params,
    request,
    context,
    country,
  });

  return json(search, {
    headers: {'Cache-Control': `max-age=${search.searchTerm ? 60 : 3600}`},
  });
}

async function fetchPredictiveSearchResults({
  params,
  request,
  context,
  country,
}: Pick<LoaderFunctionArgs, 'params' | 'context' | 'request'> & {
  country: CountryCode;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const searchTerm = searchParams.get('q') || '';
  const limit = Number(searchParams.get('limit') || 10);
  const rawTypes = String(searchParams.get('type') || 'ANY');

  const searchTypes =
    rawTypes === 'ANY'
      ? DEFAULT_SEARCH_TYPES
      : rawTypes
          .split(',')
          .map((t) => t.toUpperCase() as PredictiveSearchTypes)
          .filter((t) => DEFAULT_SEARCH_TYPES.includes(t));

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      searchTypes,
    };
  }

  const data = await context.storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      country,
      limit,
      limitScope: 'EACH',
      searchTerm,
      types: searchTypes,
    },
  });

  if (!data) {
    throw new Error('No data returned from Shopify API');
  }

  const searchResults = normalizePredictiveSearchResults(
    data.predictiveSearch,
    params.locale,
  );

  return {searchResults, searchTerm, searchTypes};
}

/**
 * Normalize results and apply tracking qurery parameters to each result url
 */
export function normalizePredictiveSearchResults(
  predictiveSearch: PredictiveSearchQuery['predictiveSearch'],
  locale: LoaderFunctionArgs['params']['locale'],
): NormalizedPredictiveSearch {
  let totalResults = 0;
  if (!predictiveSearch) {
    return {
      results: NO_PREDICTIVE_SEARCH_RESULTS,
      totalResults,
    };
  }

  const localePrefix = locale ? `/${locale}` : '';
  const results: NormalizedPredictiveSearchResults = [];

  if (predictiveSearch.queries.length) {
    results.push({
      type: 'queries',
      items: predictiveSearch.queries.map((query: PredictiveQueryFragment) => {
        const trackingParams = applyTrackingParams(
          query,
          `q=${encodeURIComponent(query.text)}`,
        );

        totalResults++;
        return {
          __typename: query.__typename,
          handle: '',
          id: query.text,
          image: undefined,
          title: query.text,
          styledTitle: query.styledText,
          url: `${localePrefix}/search${trackingParams}`,
        };
      }),
    });
  }

  if (predictiveSearch.products.length) {
    results.push({
      type: 'products',
      items: predictiveSearch.products.map(
        (product: PredictiveProductFragment) => {
          totalResults++;
          const trackingParams = applyTrackingParams(product);
          return {
            __typename: product.__typename,
            handle: product.handle,
            id: product.id,
            image: product.variants?.nodes?.[0]?.image,
            title: product.title,
            url: `${localePrefix}/products/${product.handle}${trackingParams}`,
            price: product.variants.nodes[0].price,
          };
        },
      ),
    });
  }

  if (predictiveSearch.collections.length) {
    results.push({
      type: 'collections',
      items: predictiveSearch.collections.map(
        (collection: PredictiveCollectionFragment) => {
          totalResults++;
          const trackingParams = applyTrackingParams(collection);
          return {
            __typename: collection.__typename,
            handle: collection.handle,
            id: collection.id,
            image: collection.image,
            title: collection.title,
            url: `${localePrefix}/collections/${collection.handle}${trackingParams}`,
          };
        },
      ),
    });
  }

  if (predictiveSearch.pages.length) {
    results.push({
      type: 'pages',
      items: predictiveSearch.pages.map((page: PredictivePageFragment) => {
        totalResults++;
        const trackingParams = applyTrackingParams(page);
        return {
          __typename: page.__typename,
          handle: page.handle,
          id: page.id,
          image: undefined,
          title: page.title,
          url: `${localePrefix}/pages/${page.handle}${trackingParams}`,
        };
      }),
    });
  }

  if (predictiveSearch.articles.length) {
    results.push({
      type: 'articles',
      items: predictiveSearch.articles.map(
        (article: PredictiveArticleFragment) => {
          totalResults++;
          const trackingParams = applyTrackingParams(article);
          return {
            __typename: article.__typename,
            handle: article.handle,
            id: article.id,
            image: article.image,
            title: article.title,
            url: `${localePrefix}/blog/${article.handle}${trackingParams}`,
          };
        },
      ),
    });
  }

  return {results, totalResults};
}

const PREDICTIVE_SEARCH_QUERY = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
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
      }
    }
  }
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
  query predictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $searchTerm: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $searchTerm,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
` as const;
