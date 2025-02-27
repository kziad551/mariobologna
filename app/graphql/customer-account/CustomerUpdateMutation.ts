export const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/customer/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        email
        phone
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
      }
    }
  }
` as const;
