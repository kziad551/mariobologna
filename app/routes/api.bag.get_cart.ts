import {LoaderFunctionArgs, json} from '@shopify/remix-oxygen';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import {tokenCookie, verifyToken} from '~/utils/auth';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront, session} = context;
  const cookieHeader = request.headers.get('Cookie');

  // Check for authentication
  const token: string | null = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return json({
      success: false,
      message: 'Not authenticated',
    });
  }

  const customerID = await verifyToken(token, storefront);
  if (!customerID) {
    return json(
      {
        success: false,
        message: 'Invalid token',
      },
      {
        headers: {
          'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
        },
      },
    );
  }

  // Get the cart from session
  try {
    const cart = await session.get('cart');
    
    if (!cart) {
      return json({
        success: true,
        data: null,
      });
    }

    // Get the full cart details from Shopify
    const CART_QUERY = `#graphql
      query CartQuery($id: ID!) {
        cart(id: $id) {
          id
          lines(first: 100) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    `;

    const {cart: cartDetails} = await storefront.query(CART_QUERY, {
      variables: {
        id: cart.id,
      },
      cache: storefront.CacheNone(),
    });

    return json({
      success: true,
      data: cartDetails,
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    return json({
      success: false,
      message: error instanceof Error ? error.message : 'Error getting cart',
    });
  }
} 