import {
  Link,
  Form,
  useParams,
  useFetcher,
  type FormProps,
  NavigateFunction,
} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {applyTrackingParams} from '~/lib/search';

import type {SearchQuery} from 'storefrontapi.generated';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import {TFunction} from 'i18next';
import {Button} from './Button';
import {useCustomContext} from '~/contexts/App';
import {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {Dropdown} from 'primereact/dropdown';

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  styledTitle?: string;
  title: string;
  url: string;
};

export type NormalizedPredictiveSearchResults = Array<
  | {type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'products'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'collections'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'pages'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'articles'; items: Array<NormalizedPredictiveSearchResultItem>}
>;

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
  totalResults: number;
};

type FetchSearchResultsReturn = {
  searchResults: {
    results: SearchQuery | null;
    totalResults: number;
  };
  searchTerm: string;
};

export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  {type: 'queries', items: []},
  {type: 'products', items: []},
  {type: 'collections', items: []},
  {type: 'pages', items: []},
  {type: 'articles', items: []},
];

type SearchFormType = {
  searchTerm: string;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  handle: string;
  navigate: NavigateFunction;
};

export function SearchForm({
  searchTerm,
  t,
  direction,
  handle,
  navigate,
}: SearchFormType) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // focus the input when cmd+k is pressed
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Form method="get" className="flex flex-col gap-4 max-w-133.5">
      <div className="relative flex flex-col xs:flex-row gap-1">
        <div className={`${direction === 'rtl' ? 'rtl-container' : ''} flex-1`}>
          <FloatLabel>
            <InputText
              defaultValue={searchTerm}
              name="q"
              ref={inputRef}
              type="search"
              className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
            />
            <label className="ml-2 -mt-2" htmlFor="email">
              {t('Search')}
            </label>
          </FloatLabel>
        </div>
        <div
          className={`${direction === 'rtl' ? 'rtl-container md:right-full md:mr-4' : 'md:left-full md:ml-4'} md:absolute`}
        >
          <FloatLabel>
            <Dropdown
              id="handle"
              name="handle"
              value={handle ?? ''}
              onChange={(e) =>
                navigate(`/search?handle=${e.target.value}&q=${searchTerm}`)
              }
              options={[
                {name: t('Men'), value: 'men'},
                {name: t('Women'), value: 'women'},
                {name: t('Kids'), value: 'kids'},
              ]}
              optionLabel="name"
              optionValue="value"
              placeholder={t('Select a Section')}
              className="!bg-transparent w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
            />
            <label className="ml-2 -mt-2" htmlFor="email">
              {t('Section')}
            </label>
          </FloatLabel>
        </div>
      </div>

      {/* {handle ? <input type="hidden" name="handle" value={handle} /> : <></>} */}
      <input
        type="submit"
        value={t('Search')}
        className="cursor-pointer py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm"
      />
    </Form>
  );
}

export function SearchResults({
  results,
  searchTerm,
  t,
}: Pick<FetchSearchResultsReturn['searchResults'], 'results'> & {
  searchTerm: string;
} & Pick<SearchFormType, 't'>) {
  if (!results) {
    return null;
  }
  const keys = Object.keys(results) as Array<keyof typeof results>;
  return (
    <div>
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];

          // if (resourceResults.nodes[0]?.__typename === 'Page') {
          //   const pageResults = resourceResults as SearchQuery['pages'];
          //   return resourceResults.nodes.length ? (
          //     <SearchResultPageGrid key="pages" pages={pageResults} />
          //   ) : null;
          // }

          if (resourceResults.nodes[0]?.__typename === 'Product') {
            const productResults = resourceResults as SearchQuery['products'];
            return resourceResults.nodes.length ? (
              <SearchResultsProductsGrid
                key="products"
                products={productResults}
                searchTerm={searchTerm}
                t={t}
              />
            ) : null;
          }

          // if (resourceResults.nodes[0]?.__typename === 'Article') {
          //   const articleResults = resourceResults as SearchQuery['articles'];
          //   return resourceResults.nodes.length ? (
          //     <SearchResultArticleGrid
          //       key="articles"
          //       articles={articleResults}
          //     />
          //   ) : null;
          // }

          return null;
        })}
    </div>
  );
}

function SearchResultsProductsGrid({
  products,
  searchTerm,
  t,
}: Pick<SearchQuery, 'products'> & {
  searchTerm: string;
} & Pick<SearchFormType, 't'>) {
  const {currency} = useCustomContext();

  const ItemsMarkup = products.nodes.map((product) => {
    const trackingParams = applyTrackingParams(
      product,
      `q=${encodeURIComponent(searchTerm)}`,
    );

    return (
      <Link
        key={product.id}
        prefetch="intent"
        to={`/products/${product.handle}${trackingParams}`}
        className="group flex justify-between border border-neutral-N-80 p-4 my-4 rounded w-125 gap-5"
      >
        {product.variants.nodes[0].image && (
          <Image
            data={product.variants.nodes[0].image}
            alt={product.title}
            aspectRatio="1/1"
            loading="lazy"
            sizes="auto"
            className="max-w-30 h-20 ss:max-w-60 ss:h-40 object-contain object-center"
          />
        )}
        <div className="flex flex-col items-end">
          <p className="text-xl text-medium group-hover:underline">
            {product.title}
          </p>
          <small>
            <Money
              data={{
                amount: (
                  parseFloat(product.variants.nodes[0].price.amount) *
                  currency.exchange_rate
                ).toString(),
                currencyCode: currency.currency['en'] as CurrencyCode,
              }}
            />
          </small>
        </div>
      </Link>
    );
  });

  return (
    <div className="sm:pb-36 pt-8 sm:pt-18 sm:px-8">
      <h2 className="text-xl font-medium">{t('Products')}</h2>
      <div className="flex flex-wrap gap-4">{ItemsMarkup}</div>
    </div>
  );
}

// function SearchResultPageGrid({pages}: Pick<SearchQuery, 'pages'>) {
//   return (
//     <div className="search-result">
//       <h2>Pages</h2>
//       <div>
//         {pages?.nodes?.map((page) => (
//           <div className="search-results-item" key={page.id}>
//             <Link prefetch="intent" to={`/pages/${page.handle}`}>
//               {page.title}
//             </Link>
//           </div>
//         ))}
//       </div>
//       <br />
//     </div>
//   );
// }

// function SearchResultArticleGrid({articles}: Pick<SearchQuery, 'articles'>) {
//   return (
//     <div className="search-result">
//       <h2>Articles</h2>
//       <div>
//         {articles?.nodes?.map((article) => (
//           <div className="search-results-item" key={article.id}>
//             <Link prefetch="intent" to={`/blogs/${article.handle}`}>
//               {article.title}
//             </Link>
//           </div>
//         ))}
//       </div>
//       <br />
//     </div>
//   );
// }

export function NoSearchResults({t}: Pick<SearchFormType, 't'>) {
  return (
    <p className="pb-36 pt-18 px-8">
      {t('No results, try a different search.')}
    </p>
  );
}

export function TrySearch({t}: Pick<SearchFormType, 't'>) {
  return (
    <p className="pb-36 pt-18 px-8">
      {t('Search for whatever you want, try different searches.')}
    </p>
  );
}

type ChildrenRenderProps = {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetcher: ReturnType<typeof useFetcher<NormalizedPredictiveSearchResults>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

type SearchFromProps = {
  action?: FormProps['action'];
  className?: string;
  children: (passedProps: ChildrenRenderProps) => React.ReactNode;
  [key: string]: unknown;
};

/**
 *  Search form component that sends search requests to the `/search` route
 **/
export function PredictiveSearchForm({
  action,
  children,
  className = 'predictive-search-form',
  ...props
}: SearchFromProps) {
  const params = useParams();
  const fetcher = useFetcher<NormalizedPredictiveSearchResults>({
    key: 'search',
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const searchAction = action ?? '/api/predictive-search';
    const newSearchTerm = event.target.value || '';
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;

    fetcher.submit(
      {q: newSearchTerm, limit: '6'},
      {method: 'GET', action: localizedAction},
    );
  }

  // ensure the passed input has a type of search, because SearchResults
  // will select the element based on the input
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  return (
    <fetcher.Form
      {...props}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!inputRef?.current || inputRef.current.value === '') {
          return;
        }
        inputRef.current.blur();
      }}
    >
      {children({fetchResults, inputRef, fetcher})}
    </fetcher.Form>
  );
}
