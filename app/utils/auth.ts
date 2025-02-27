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
  const VERIFY_TOKEN_QUERY = `#graphql
    query VerifyToken($token: String!) {
      customer(customerAccessToken: $token) {
        id
      }
    }
  ` as const;

  try {
    const response = await storefront.query(VERIFY_TOKEN_QUERY, {
      variables: {token},
    });
    const customer = response.customer;

    if (!customer) {
      throw new Error('Invalid token');
    }

    return customer.id as string;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export async function fetchCustomerDetails(
  token: string,
  storefront: Storefront<I18nLocale>,
) {
  const CUSTOMER_DETAILS_QUERY = `#graphql
  query AuthCustomerDetails($token: String!) {
    customer(customerAccessToken: $token) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;

  try {
    const response = await storefront.query(CUSTOMER_DETAILS_QUERY, {
      variables: {token},
      headers: {
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
      },
      cache: {
        mode: 'no-store',
      },
    });
    const customer = response.customer as CustomerFragment | null;

    if (!customer) {
      throw new Error('Failed to fetch customer details');
    }

    return customer;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export async function updateCustomerDetails(
  token: string,
  storefront: Storefront<I18nLocale>,
  props: CustomerUpdateInput,
) {
  const CUSTOMER_UPDATE_MUTATION = `#graphql
    mutation AuthCustomerUpdate(
      $token: String!,
      $customer: CustomerUpdateInput!
    ){
      customerUpdate(
        customerAccessToken: $token,
        customer: $customer
      ){
        customer {
          id
        }
        customerUserErrors{
          message,
          code,
          field,
        }
      }
    }
  ` as const;

  try {
    return await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customer: {
          ...props,
        },
        token,
      },
    });
  } catch (error) {
    let errorMessage = 'Something went wrong while updating customer email';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return errorMessage;
  }
}

export async function addNewAddress(
  token: string,
  storefront: Storefront<I18nLocale>,
  address: Partial<AddressFragment>,
) {
  const CREATE_ADDRESS_MUTATION = `#graphql
  mutation AuthCustomerAddressCreate(
    $token: String!,
    $address: MailingAddressInput!
  ) {
    customerAddressCreate(
      customerAccessToken:$token,
      address: $address
    ) {
      customerAddress {
        id
      }
      customerUserErrors{
        message,
        code,
        field,
      }
    }
  }
  ` as const;

  try {
    return await storefront.mutate(CREATE_ADDRESS_MUTATION, {
      variables: {
        address,
        token,
      },
    });
  } catch (error) {
    let errorMessage = 'Something went wrong while adding new address';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return errorMessage;
  }
}

export async function updateCartBuyerIdentity(
  storefront: Storefront<I18nLocale>,
  buyerIdentity: Partial<AddressFragment>,
  cartId: string,
) {
  const UPDATE_CART_BUYER_IDENTITY = `#graphql
  mutation UpdateCart($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
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
    return await storefront.mutate(UPDATE_CART_BUYER_IDENTITY, {
      variables: {
        buyerIdentity,
        cartId,
      },
    });
  } catch (error) {
    let errorMessage =
      'Something went wrong while updating cart buyer identity';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return errorMessage;
  }
}

export async function createSeparateCartCheckout(
  storefront: Storefront<I18nLocale>,
  lines: CartLineInput[],
) {
  const CREATE_CHECKOUT_MUTATION = `#graphql
  mutation CreateCart($input: CartInput!) {
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
    return await storefront.mutate(CREATE_CHECKOUT_MUTATION, {
      variables: {
        input: {
          lines,
        },
      },
    });
  } catch (error) {
    let errorMessage =
      'Something went wrong while creating a new cart for buy now option';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return errorMessage;
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
  mutation UpdateCustomerAddress($token: String!, $addressId: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $token, id: $addressId, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        country
        zip
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
  ` as const;

  const SET_DEFAULT_ADDRESS = `#graphql
  mutation SetDefaultAddress($token: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $addressId) {
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
  `;

  try {
    if (isDefault) {
      const body = {
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
      };
      const response = await updateCustomerDetails(token, storefront, {
        ...body,
      });
      if (typeof response === 'string') {
        return response;
      }

      invariant(!response.errors?.length, response.errors?.[0]?.message);

      invariant(
        !response?.customerUpdate?.customerUserErrors?.length,
        response?.customerUpdate?.customerUserErrors?.[0]?.message,
      );
      const setDefaultResponse = await storefront.mutate(SET_DEFAULT_ADDRESS, {
        variables: {
          token,
          addressId,
        },
      });
      invariant(
        !setDefaultResponse.errors?.length,
        setDefaultResponse.errors?.[0]?.message,
      );
      invariant(
        !setDefaultResponse?.customerDefaultAddressUpdate?.customerUserErrors
          ?.length,
        setDefaultResponse?.customerDefaultAddressUpdate
          ?.customerUserErrors?.[0]?.message,
      );
    }
    return await storefront.mutate(UPDATE_ADDRESS_MUTATION, {
      variables: {
        address,
        token,
        addressId,
      },
    });
  } catch (error) {
    let errorMessage = 'Something went wrong while updating an address';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return errorMessage;
  }
}

export async function fetchCustomerOrder(
  storefront: Storefront<I18nLocale>,
  id: string,
) {
  const CUSTOMER_ORDER_QUERY = `#graphql
  query AuthOrder($orderId: ID!) {
    node(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
  ${ORDER_FRAGMENT}
  ` as const;

  try {
    const response = await storefront.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId: id,
      },
    });
    const order = response.node as OrderFragment | null;

    if (!order) {
      throw new Error('Failed to fetch order details');
    }

    return order;
  } catch (error) {
    console.log('error:', error);
    return null;
  }
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
  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;

  const calculateRefundPayload = {
    refund: {
      refund_line_items: lineItems.map((item) => ({
        line_item_id: item.line_item_id,
        quantity: item.quantity,
        restock_type: 'return',
        location_id: item.location_id,
      })),
      shipping: {
        full_refund: allSelected,
      },
    },
  };

  const CALCULATE_URL = `${SHOPIFY_ADMIN_API_URL}/orders/${orderId}/refunds/calculate.json`;
  const REFUND_URL = `${SHOPIFY_ADMIN_API_URL}/orders/${orderId}/refunds.json`;

  try {
    const response = await fetch(CALCULATE_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(calculateRefundPayload),
    });

    const result: any = await response.json();
    if (response.ok) {
      const transaction = result.refund.transactions[0];

      const refundPayload = {
        refund: {
          note: note ?? "Didn't provide a reason",
          notify: true,
          refund_line_items: lineItems.map((item) => ({
            line_item_id: item.line_item_id,
            quantity: item.quantity,
            restock_type: 'return',
            location_id: item.location_id,
          })),
          transactions: [
            {
              parent_id: transaction.parent_id,
              amount: transaction.amount,
              kind: 'refund',
              gateway: transaction.gateway,
            },
          ],
        },
      };
      const refundResponse = await fetch(REFUND_URL, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(refundPayload),
      });

      const refundResult: any = await refundResponse.json();
      if (refundResponse.ok) return {success: true};
      return {success: false, error: refundResult};
    }
    return {success: false, error: result};
  } catch (error) {
    let errorMessage = 'Something went wrong while processing the refund';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return {success: false, error: errorMessage};
  }
}

export async function processCancel(
  orderId: string,
  env: Env,
  refundAmount: string,
) {
  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;

  const cancelPayload = {
    amount: refundAmount,
    reason: 'customer',
    email: true,
  };
  const URL = `${SHOPIFY_ADMIN_API_URL}/orders/${orderId}/cancel.json`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(cancelPayload),
    });

    const result: any = await response.json();
    if (response.ok) {
      return {success: true, data: result};
    }
    return {success: false, error: result};
  } catch (error) {
    let errorMessage = 'Something went wrong while processing the cancel';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return {success: false, error: errorMessage};
  }
}

export async function checkCustomerByEmail(email: string, env: Env) {
  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;
  const URL = `${SHOPIFY_ADMIN_API_URL}/graphql.json`;

  const CHECK_CUSTOMER_QUERY = `
    query {
      customers(first: 1, query: "email:${email}") {
        nodes {
          id
          email
        }
      }
    }
  `;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({query: CHECK_CUSTOMER_QUERY}),
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const result = (await response.json()) as any;

    invariant(!result.errors?.length, result.errors?.[0]?.message);

    const customer = result.data.customers.nodes;
    return {success: true, data: customer};
  } catch (error) {
    let errorMessage = 'Something went wrong while getting customers';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return {success: false, data: [] as any, error: errorMessage};
  }
}

export async function resetCustomerPassword(
  id: string,
  password: string,
  password_confirmation: string,
  env: Env,
) {
  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;
  const URL = `${SHOPIFY_ADMIN_API_URL}/customers/${id}.json`;
  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          password,
          password_confirmation,
        },
      }),
    });

    const result = (await response.json()) as any;

    invariant(typeof result.errors !== 'string', result.errors);
    invariant(
      !result.errors?.password_confirmation?.length,
      result.errors?.password_confirmation?.[0],
    );

    return {success: true, error: null};
  } catch (error) {
    let errorMessage = 'Something went wrong while resetting password';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
    }
    return {success: false, error: errorMessage};
  }
}
