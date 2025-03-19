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

  console.log('Create cart API called with body:', body);

  const token: string | null = await tokenCookie.parse(cookieHeader);
  if (!token) {
    console.log('No authentication token found, redirecting to login');
    return json('/account/login');
  }

  const customerID = await verifyToken(token, storefront);
  if (!customerID) {
    console.log('Invalid token, redirecting to login');
    return json('/account/login', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }

  try {
    const lines = body.lines as CartLineInput[];
    console.log('Creating cart with lines:', lines);
    
    if (!lines || !lines.length || !lines[0].merchandiseId) {
      console.error('Invalid lines:', lines);
      return json(
        { formError: 'Invalid product selection' },
        { status: 400 }
      );
    }
    
    const response = await createSeparateCartCheckout(storefront, lines);
    console.log('Checkout creation response:', response);
    
    if (typeof response === 'string') {
      console.error('Error creating cart:', response);
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

    console.log('Cart created successfully with checkout URL:', response.checkoutUrl);
    
    return json(
      {
        success: true,
        data: response as Pick<Cart, 'id' | 'checkoutUrl'>,
      },
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error: any) {
    console.error('Error creating cart:', error);
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
