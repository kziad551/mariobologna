import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {tokenCookie, verifyToken, processCancel} from '~/utils/auth';

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront, env} = context;
  const {orderId, refundAmount} = (await request.json()) as {
    orderId: string;
    refundAmount: string;
  };
  const cookieHeader = request.headers.get('Cookie');

  const token: string | null = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return json({redirect: '/account/login'});
  }

  try {
    const customerID = await verifyToken(token, storefront);
    if (!customerID) {
      return json(
        {redirect: '/account/login', error: 'Invalid token'},
        {
          headers: {
            'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
          },
        },
      );
    }

    const response = await processCancel(orderId, env, refundAmount);
    if (response.success) {
      return json({...response});
    } else {
      return json({error: response.error}, {status: 400});
    }
  } catch (error: any) {
    console.log('Error processing refund:', error);
    return json({error: error.message}, {status: 500});
  }
}
