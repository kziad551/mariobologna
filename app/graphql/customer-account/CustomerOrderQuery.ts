// NOTE: https://shopify.dev/docs/api/customer/latest/queries/order
export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment CustomerOrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment CustomerOrderDiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...CustomerOrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment CustomerOrderLineItemFull on OrderLineItem {
    variant {
      id
    }
    title
    quantity
    originalTotalPrice {
      ...CustomerOrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...CustomerOrderMoney
      }
      discountApplication {
        ...CustomerOrderDiscountApplication
      }
    }
    variant {
      image {
        altText
        height
        url
        id
        width
      }
      title
    }
  }
  fragment CustomerOrderDetails on Order {
    id
    name
    statusUrl
    processedAt
    fulfillmentStatus
    totalTax {
      ...CustomerOrderMoney
    }
    totalPrice {
      ...CustomerOrderMoney
    }
    originalTotalPrice {
      ...CustomerOrderMoney
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
        ...CustomerOrderDiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...CustomerOrderLineItemFull
      }
    }
  }
  query CustomerOrder($orderId: ID!) {
    node(id: $orderId) {
      ... on Order {
        ...CustomerOrderDetails
      }
    }
  }
` as const;
