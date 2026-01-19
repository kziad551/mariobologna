import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';

import {
  SearchForm,
  SearchResults,
  NoSearchResults,
  TrySearch,
} from '~/components/Search';
import {resolveCountry} from '~/lib/utils';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import synonymsEnData from '~/data/synonyms-en.json';
import synonymsArData from '~/data/synonyms-ar.json';

export const meta: MetaFunction = () => {
  return [{title: `Search`}];
};

/**
 * Build search query with synonyms
 * If the searchTerm exists in the synonym dictionary (as key or value), append all related terms to the query
 */
function buildSearchQueryWithSynonyms(searchTerm: string, language: string = 'EN'): string {
  // Select the appropriate synonyms dictionary based on language
  const isArabic = language.toLowerCase().startsWith('ar');
  const synonymsData = isArabic ? synonymsArData : synonymsEnData;
  const synonyms = synonymsData as Record<string, string[]>;
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  let allTerms = [searchTerm];
  
  // Check if the search term is a key in the dictionary
  if (synonyms[normalizedTerm]) {
    allTerms.push(...synonyms[normalizedTerm]);
  } else {
    // Check if the search term is a value (synonym) in any of the arrays
    for (const [key, synonymList] of Object.entries(synonyms)) {
      const normalizedSynonyms = synonymList.map(s => s.toLowerCase());
      if (normalizedSynonyms.includes(normalizedTerm)) {
        // Include the key and all its synonyms
        allTerms.push(key);
        allTerms.push(...synonymList);
        break; // Found a match, no need to continue
      }
    }
  }
  
  // Remove duplicates (case-insensitive)
  const uniqueTerms = Array.from(
    new Set(allTerms.map(t => t.toLowerCase()))
  );
  
  // Build the query for each field (product_type, tag, vendor, title)
  const fields = ['product_type', 'tag', 'vendor', 'title'];
  const queryParts: string[] = [];
  
  fields.forEach(field => {
    const fieldQueries = uniqueTerms.map(term => `${field}:"${term}"`);
    queryParts.push(...fieldQueries);
  });
  
  return queryParts.join(' OR ');
}

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchTerm = String(searchParams.get('q') || '');
  const handle = String(searchParams.get('handle') || '');
  const cookies = request.headers.get('Cookie');
  const country = resolveCountry(cookies);
  
  // Get language from cookies (where the UI stores it)
  let language = 'en';
  if (cookies) {
    const languageMatch = cookies.match(/language=([^;]+)/);
    if (languageMatch) {
      language = decodeURIComponent(languageMatch[1]);
    }
  }


  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      handle,
    };
  }

  // Build query with synonyms based on the current language
  const searchQuery = buildSearchQueryWithSynonyms(searchTerm, language);

  const {errors, ...data} = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      country,
      query: searchQuery,
      first: 100,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  let filteredResults = data.products.nodes;
  
  // Filter out Kids products (by collection handle or tags)
  filteredResults = filteredResults.filter((product: any) => {
    // Check if product is in kids collection
    const isInKidsCollection = product.collections.nodes.some(
      (collection: any) => collection.handle === 'kids' || collection.handle.includes('kids')
    );
    // Check if product has kids tag
    const hasKidsTag = product.tags?.some(
      (tag: string) => tag.toLowerCase() === 'kids' || tag.toLowerCase().includes('kids')
    );
    return !isInKidsCollection && !hasKidsTag;
  });
  
  if (handle) {
    filteredResults = filteredResults.filter((product: any) =>
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
    tags
    productType
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