import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {tokenCookie, verifyToken, processRefund} from '~/utils/auth';

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront, env} = context;
  const {orderId, lineItems, allSelected, note} = (await request.json()) as any;
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

    // Extract necessary information from lineItems
    const refundLineItems: {
      line_item_id: string;
      location_id: string;
      quantity: number;
      amount: string;
      currency: string;
    }[] = lineItems.map((item: any) => ({
      line_item_id: item.line_item_id,
      location_id: item.location_id,
      quantity: item.quantity,
      amount: item.price,
      currency: item.currency,
    }));

    const response = await processRefund(
      orderId,
      refundLineItems,
      allSelected,
      env,
      note,
    );
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
