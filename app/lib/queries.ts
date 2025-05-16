import {PRODUCT_CARD_FRAGMENT} from './fragments';

export const ONE_LOOK_COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Look(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        __typename
        id
        url
        altText
        width
        height
      }
      products(first: 250) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

export const OTHER_COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query OtherCollection(
    $handle: String!
    $first: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        __typename
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
      ) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

export const SIMILAR_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query SimilarProducts(
    $productType: String!
    $productId: ID!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      filters: [
        {
          productType: $productType
        }
      ]
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

export const GET_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query GetProductsByIds($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      ...ProductCard
    }
  }
}
` as const;

export const METAOBJECT_CONTENT_QUERY = `#graphql
  query GetMetaobject(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $type: String!
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: $type}) {
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
        references(first: 2) {
          nodes {
            ... on MediaImage {
              id
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;

export const NEW_ARRIVALS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query NewArrivalsCollection(
    $handle: String!
    $first: Int
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        __typename
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

export const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductRecommendations(
    $productId: ID!
    $first: Int = 4
    $country: CountryCode
  ) @inContext(country: $country) {
    productRecommendations(productId: $productId, first: $first) {
      ...ProductCard
    }
  }
` as const;

export const PRODUCT_BY_TYPE_QUERY = `#graphql
  query ProductsByType(
    $productType: String!
    $excludeId: ID!
    $first: Int = 4
    $country: CountryCode
  ) @inContext(country: $country) {
    products(
      first: $first
      query: $productType
      sortKey: CREATED_AT
      reverse: true
    ) {
      nodes {
        ...ProductCardFragment
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
