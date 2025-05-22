import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {Cart, CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';
import {
  createSeparateCartCheckout,
  tokenCookie,
  verifyToken,
} from '~/utils/auth';

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const body = (await request.json()) as any;
  const cookieHeader = request.headers.get('Cookie');
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo');

  const token: string | null = await tokenCookie.parse(cookieHeader);

  // build the optional buyerIdentity
  let buyerIdentity: any = body.buyerIdentity ?? undefined;

  // If token exists and is valid, add it to buyerIdentity
  // If not, we'll create an anonymous checkout
  if (token) {
    try {
    const customerID = await verifyToken(token, storefront);
      if (customerID) {
        // add the access token for a customer-linked checkout
    buyerIdentity = {...buyerIdentity, customerAccessToken: token};
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // Continue with anonymous checkout - don't return error
    }
  }

  const lines = body.lines as CartLineInput[];

  try {
    const response = await createSeparateCartCheckout(
      storefront,
      lines,
      buyerIdentity,
      returnTo || undefined
    );

    if (typeof response === 'string') {
      return json(response);
    }

    // The response is directly a cart object with id and checkoutUrl
    return json({
      success: true,
      data: {
        checkoutUrl: response.checkoutUrl,
      },
    });
  } catch (error: any) {
    return json(
      {
        success: false,
        formError: error.message,
      },
      { status: 400 },
    );
  }
}
