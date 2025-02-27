import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {Cart, CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';
import {
  createSeparateCartCheckout,
  tokenCookie,
  verifyToken,
} from '~/utils/auth';

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
    const lines = body.lines as CartLineInput[];
    const response = await createSeparateCartCheckout(storefront, lines);
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
      !response?.cartCreate?.userErrors?.length,
      response?.cartCreate?.userErrors?.[0]?.message,
    );

    return json(
      {
        success: true,
        data: response.cartCreate?.cart as Pick<Cart, 'id' | 'checkoutUrl'>,
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
