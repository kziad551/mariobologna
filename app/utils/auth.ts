import {Storefront} from '@shopify/hydrogen';
import {I18nLocale} from '~/lib/type';
import {createCookie} from '@shopify/remix-oxygen';
import {CUSTOMER_FRAGMENT, ORDER_FRAGMENT} from '~/lib/fragments';
import {
  AddressFragment,
  CustomerFragment,
  OrderFragment,
} from 'storefrontapi.generated';
import {
  CartLineInput,
  CustomerUpdateInput,
  MailingAddressInput,
} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';

export const tokenCookie = createCookie('shopifyAccessToken', {
  httpOnly: true,
  secure: true,
  path: '/',
});

export async function verifyToken(
  token: string,
  storefront: Storefront<I18nLocale>,
) {
  const VERIFY_QUERY = `#graphql
    query customerVerify($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
      }
    }
  ` as const;

  try {
    const {customer} = await storefront.query(VERIFY_QUERY, {
      variables: {
        customerAccessToken: token,
      },
    });

    return customer?.id;
  } catch (error) {
    return null;
  }
}

export async function fetchCustomerDetails(
  token: string,
  storefront: Storefront<I18nLocale>,
) {
  const CUSTOMER_QUERY = `#graphql
    ${CUSTOMER_FRAGMENT}
    query CustomerDetails($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        ...Customer
      }
    }
  ` as const;

  try {
    const {customer} = await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: token,
      },
    });

    return customer;
  } catch (error) {
    return null;
  }
}

export async function updateCustomerDetails(
  token: string,
  storefront: Storefront<I18nLocale>,
  props: CustomerUpdateInput,
) {
  const UPDATE_MUTATION = `#graphql
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
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

  try {
    const response = await storefront.mutate(UPDATE_MUTATION, {
      variables: {
        customerAccessToken: token,
        customer: props,
      },
    });

    if (response?.customerUpdate?.customerUserErrors?.length) {
      return response.customerUpdate.customerUserErrors[0].message;
    }

    return response.customerUpdate.customer;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong';
  }
}

export async function addNewAddress(
  token: string,
  storefront: Storefront<I18nLocale>,
  address: Partial<AddressFragment>,
) {
  const CREATE_ADDRESS_MUTATION = `#graphql
    mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
      customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
        customerAddress {
          id
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    const response = await storefront.mutate(CREATE_ADDRESS_MUTATION, {
      variables: {
        address,
        customerAccessToken: token,
      },
    });

    if (response?.customerAddressCreate?.customerUserErrors?.length) {
      return response.customerAddressCreate.customerUserErrors[0].message;
    }

    return response.customerAddressCreate;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong';
  }
}

export async function updateCartBuyerIdentity(
  storefront: Storefront<I18nLocale>,
  buyerIdentity: Partial<AddressFragment>,
  cartId: string,
) {
  const UPDATE_CART_BUYER_MUTATION = `#graphql
    mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!) {
      cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
        cart {
          id
          buyerIdentity {
            email
            phone
            countryCode
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    const response = await storefront.mutate(UPDATE_CART_BUYER_MUTATION, {
      variables: {
        buyerIdentity,
        cartId,
      },
    });

    if (response?.cartBuyerIdentityUpdate?.userErrors?.length) {
      return response.cartBuyerIdentityUpdate.userErrors[0].message;
    }

    return response.cartBuyerIdentityUpdate.cart;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong';
  }
}

export async function createSeparateCartCheckout(
  storefront: Storefront<I18nLocale>,
  lines: CartLineInput[],
) {
  const CREATE_CART_MUTATION = `#graphql
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    console.log('Creating cart with mutation, lines:', lines);
    const response = await storefront.mutate(CREATE_CART_MUTATION, {
      variables: {
        input: {
          lines,
        },
      },
    });
    console.log('Cart mutation response:', response);

    if (response?.cartCreate?.userErrors?.length) {
      return response.cartCreate.userErrors[0].message;
    }

    // Return the cart data directly for easier access
    return response.cartCreate.cart;
  } catch (error) {
    console.error('Error in createSeparateCartCheckout:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong';
  }
}

export async function updateAddress(
  token: string,
  storefront: Storefront<I18nLocale>,
  address: MailingAddressInput,
  addressId: string,
  isDefault: boolean = false,
) {
  const UPDATE_ADDRESS_MUTATION = `#graphql
    mutation customerAddressUpdate($address: MailingAddressInput!, $id: ID!, $customerAccessToken: String!) {
      customerAddressUpdate(address: $address, id: $id, customerAccessToken: $customerAccessToken) {
        customerAddress {
          id
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  ` as const;

  const SET_DEFAULT_ADDRESS_MUTATION = `#graphql
    mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
      customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
        customer {
          id
          defaultAddress {
            id
          }
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    const response = await storefront.mutate(UPDATE_ADDRESS_MUTATION, {
      variables: {
        address,
        id: addressId,
        customerAccessToken: token,
      },
    });

    if (response?.customerAddressUpdate?.customerUserErrors?.length) {
      return response.customerAddressUpdate.customerUserErrors[0].message;
    }

    if (isDefault) {
      const defaultResponse = await storefront.mutate(SET_DEFAULT_ADDRESS_MUTATION, {
        variables: {
          addressId,
          customerAccessToken: token,
        },
      });

      if (defaultResponse?.customerDefaultAddressUpdate?.customerUserErrors?.length) {
        return defaultResponse.customerDefaultAddressUpdate.customerUserErrors[0].message;
      }
    }

    return response.customerAddressUpdate;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong';
  }
}

export async function fetchCustomerOrder(
  storefront: Storefront<I18nLocale>,
  id: string,
) {
  const ORDER_QUERY = `#graphql
    ${ORDER_FRAGMENT}
    query CustomerOrder($orderId: ID!) {
      node(id: $orderId) {
        ... on Order {
          ...Order
        }
      }
    }
  ` as const;

  try {
    const response = await storefront.query(ORDER_QUERY, {
      variables: {
        orderId: id,
      },
    });

    return response.node;
  } catch (error) {
    return null;
  }
}

interface RefundCreateResponse {
  data?: {
    refundCreate?: {
      refund: {
        id: string;
        note: string;
        createdAt: string;
        transactions: Array<{
          id: string;
          amount: {
            amount: string;
            currencyCode: string;
          };
        }>;
      };
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}

interface OrderCancelResponse {
  data?: {
    orderCancel?: {
      order: {
        id: string;
        cancelReason: string;
        cancelledAt: string;
      };
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}

interface CustomerResetResponse {
  data?: {
    customerReset?: {
      customer: {
        id: string;
        email: string;
      };
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}

interface CustomerSearchResponse {
  data?: {
    customers?: {
      edges: Array<{
        node: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
        };
      }>;
    };
  };
}

export async function processRefund(
  orderId: string,
  lineItems: {
    line_item_id: string;
    location_id: string;
    quantity: number;
  }[],
  allSelected: boolean,
  env: Env,
  note?: string,
) {
  const ADMIN_REFUND_MUTATION = `#graphql
    mutation refundCreate($input: RefundInput!) {
      refundCreate(input: $input) {
        refund {
          id
          note
          createdAt
          transactions {
            id
            amount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    const response = await fetch(
      `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.ADMIN_API_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: ADMIN_REFUND_MUTATION,
          variables: {
            input: {
              orderId,
              notify: true,
              note: note || 'Refund processed',
              shipping: {
                fullRefund: allSelected,
              },
              refundLineItems: lineItems.map((item) => ({
                lineItemId: item.line_item_id,
                locationId: item.location_id,
                quantity: item.quantity,
                restockType: 'return',
              })),
            },
          },
        }),
      },
    );

    const data = (await response.json()) as RefundCreateResponse;

    if (data?.data?.refundCreate?.userErrors?.length) {
      return {
        error: data.data.refundCreate.userErrors[0].message,
      };
    }

    return {
      success: true,
      data: data.data?.refundCreate?.refund,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}

export async function processCancel(
  orderId: string,
  env: Env,
  refundAmount: string,
) {
  const ADMIN_CANCEL_MUTATION = `#graphql
    mutation orderCancel($input: OrderCancelInput!) {
      orderCancel(input: $input) {
        order {
          id
          cancelReason
          cancelledAt
        }
        userErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    const response = await fetch(
      `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.ADMIN_API_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: ADMIN_CANCEL_MUTATION,
          variables: {
            input: {
              id: orderId,
              reason: 'CUSTOMER',
              email: true,
              refund: {
                amount: refundAmount,
                shipping: true,
              },
            },
          },
        }),
      },
    );

    const data = (await response.json()) as OrderCancelResponse;

    if (data?.data?.orderCancel?.userErrors?.length) {
      return {
        error: data.data.orderCancel.userErrors[0].message,
      };
    }

    return {
      success: true,
      data: data.data?.orderCancel?.order,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}

export async function checkCustomerByEmail(email: string, env: Env) {
  const ADMIN_CUSTOMER_QUERY = `#graphql
    query getCustomerByEmail($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
            email
            firstName
            lastName
          }
        }
      }
    }
  ` as const;

  try {
    const response = await fetch(
      `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.ADMIN_API_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: ADMIN_CUSTOMER_QUERY,
          variables: {
            query: `email:${email}`,
          },
        }),
      },
    );

    const data = (await response.json()) as CustomerSearchResponse;
    return data?.data?.customers?.edges?.[0]?.node || null;
  } catch (error) {
    return null;
  }
}

export async function resetCustomerPassword(
  id: string,
  password: string,
  password_confirmation: string,
  env: Env,
) {
  const ADMIN_RESET_PASSWORD_MUTATION = `#graphql
    mutation customerReset($id: ID!, $input: CustomerResetInput!) {
      customerReset(id: $id, input: $input) {
        customer {
          id
          email
        }
        userErrors {
          field
          message
        }
      }
    }
  ` as const;

  try {
    const response = await fetch(
      `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.ADMIN_API_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: ADMIN_RESET_PASSWORD_MUTATION,
          variables: {
            id,
            input: {
              password,
              password_confirmation,
            },
          },
        }),
      },
    );

    const data = (await response.json()) as CustomerResetResponse;

    if (data?.data?.customerReset?.userErrors?.length) {
      return {
        error: data.data.customerReset.userErrors[0].message,
      };
    }

    return {
      success: true,
      data: data.data?.customerReset?.customer,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}
