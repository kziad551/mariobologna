import {json, ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const {cartId, discountCode} = (await request.json()) as {
    cartId: string;
    discountCode: string;
  };

  const response = await context.storefront.mutate(APPLY_DISCOUNT_MUTATION, {
    variables: {
      cartId,
      discountCodes: [discountCode],
    },
  });

  const {cartDiscountCodesUpdate} = response;

  if (cartDiscountCodesUpdate.userErrors.length > 0) {
    return json(
      {error: cartDiscountCodesUpdate.userErrors[0].message},
      {status: 400},
    );
  }

  const discountCodes = cartDiscountCodesUpdate.cart.discountCodes;

  if (!discountCodes[0].applicable) {
    return json({error: 'Discount code is not applicable.'}, {status: 400});
  }

  return json(
    {success: true, cart: cartDiscountCodesUpdate.cart},
    {status: 200},
  );
}

const APPLY_DISCOUNT_MUTATION = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          id
          discountCodes {
            code
            applicable
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
