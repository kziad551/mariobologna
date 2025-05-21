// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        quantityAvailable
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    publishedAt
    handle
    vendor
    productType
    tags
    collections(first: 100) {
      nodes {
        handle
      }
    }
    descriptionHtml
    description
    availableForSale
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange{
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 5) {
      nodes {
        id
        url
        altText
        width
        height
      }

    }
    variants(first: 250) {
      nodes {
        id
        availableForSale
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
` as const;

export const CUSTOMER_FRAGMENT = `#graphql
fragment Customer on Customer {
  id
  firstName
  lastName
  phone
  email
  defaultAddress {
    ...Address
  }
  addresses(first: 6) {
    nodes {
      ...Address
    }
  }
  orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
    nodes {
      ...OrderCard
    }
  }
}

fragment OrderCard on Order {
  id
  processedAt
  canceledAt
  cancelReason
  financialStatus
  fulfillmentStatus
  totalPrice {
    amount
    currencyCode
  }
  totalRefunded {
    amount
    currencyCode
  }
  lineItems(first: 3) {
    nodes {
      currentQuantity
      variant {
        id
        price {
          amount
          currencyCode
        }
        image{
          id
          altText
          height
          width
          url
        }
      }
    }
  }
}

fragment Address on MailingAddress {
  id
  firstName
  lastName
  company
  address1
  address2
  city
  country
  countryCodeV2
  zip
  phone
}
` as const;

export const ORDER_FRAGMENT = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment Order on Order {
    id
    name
    statusUrl
    processedAt
    fulfillmentStatus
    totalTax {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    originalTotalPrice {
      ...OrderMoney
    }
    shippingAddress {
      address1
      address2
      city
      company
      country
      firstName
      lastName
      phone
      province
      zip
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        variant {
          id
          image {
            altText
            height
            url
            id
            width
          }
          title
        }
        title
        quantity
        originalTotalPrice {
          ...OrderMoney
        }
        discountAllocations {
          allocatedAmount {
            ...OrderMoney
          }
          discountApplication {
            ...DiscountApplication
          }
        }
      }
    }
  }
` as const;

