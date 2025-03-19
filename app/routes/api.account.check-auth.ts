import {type LoaderFunctionArgs, json} from '@shopify/remix-oxygen';
import {tokenCookie, verifyToken} from '~/utils/auth';

export async function loader({context, request}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const token = await tokenCookie.parse(cookieHeader);

  if (!token) {
    return json({ authenticated: false });
  }

  const customer = await verifyToken(token, context.storefront);
  if (!customer) {
    return json(
      { authenticated: false },
      {
        headers: {
          'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
        },
      },
    );
  }

  return json({ authenticated: true });
} 