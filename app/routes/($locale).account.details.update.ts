import {ActionFunctionArgs, json, redirect} from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import {tokenCookie, updateCustomerDetails, verifyToken} from '~/utils/auth';

export async function action({request, context, params}: ActionFunctionArgs) {
  const {storefront} = context;
  const props = (await request.json()) as {[key: string]: string};
  const cookieHeader = request.headers.get('Cookie');

  const token: string | null = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return json('/account/login');
  }

  try {
    const customerID = await verifyToken(token, storefront);
    if (!customerID) {
      return json('/account/login', {
        headers: {
          'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
        },
      });
    }

    const response = await updateCustomerDetails(token, storefront, {
      ...props,
    });
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
      !response?.customerUpdate?.customerUserErrors?.length,
      response?.customerUpdate?.customerUserErrors?.[0]?.message,
    );

    if (props['password']) {
      return json(
        {success: true, redirect: '/account/login'},
        {
          headers: {
            'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
          },
        },
      );
    }
    return json(
      {success: true},
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
