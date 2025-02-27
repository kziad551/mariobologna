// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerDetailsCustomer on Customer {
    id
    firstName
    lastName
    defaultAddress {
      ...CustomerDetailsAddress
    }
    addresses(first: 6) {
      nodes {
        ...CustomerDetailsAddress
      }
    }
  }
  fragment CustomerDetailsAddress on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerDetailsCustomer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
