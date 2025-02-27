import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';
import {tokenCookie, updateCartBuyerIdentity, verifyToken} from '~/utils/auth';

export async function action({request, context, params}: ActionFunctionArgs) {
  const {storefront} = context;
  const body = (await request.json()) as any;
  const cookieHeader = request.headers.get('Cookie');

  const token: string | null = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return json('/account/login');
  }

  const customerID = await verifyToken(token, storefront);
  if (!customerID) {
    return json('/account/login', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }

  try {
    const cartId = body.cartId;
    const buyerIdentity = {...body.buyerIdentity, customerAccessToken: token};
    invariant(typeof cartId === 'string', 'You must provide a cart id.');

    const response = await updateCartBuyerIdentity(
      storefront,
      buyerIdentity,
      cartId,
    );
    if (typeof response === 'string') {
      return json(
        {formError: response},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    invariant(!response.errors?.length, response.errors?.[0]?.message);

    invariant(
      !response?.cartBuyerIdentityUpdate?.userErrors?.length,
      response?.cartBuyerIdentityUpdate?.userErrors?.[0]?.message,
    );

    return json(
      {
        success: true,
        data: response.cartBuyerIdentityUpdate?.cart as Pick<
          Cart,
          'id' | 'checkoutUrl'
        >,
      },
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error: any) {
    console.log('error', error);
    return json(
      {formError: error.message},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}
