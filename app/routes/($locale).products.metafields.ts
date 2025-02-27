import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const {env} = context;
  const {ID} = (await request.json()) as {
    ID: string;
  };

  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;
  const ADMIN_URL = `${SHOPIFY_ADMIN_API_URL}/products/${ID}/metafields.json`;

  let response = null;
  try {
    response = await fetch(ADMIN_URL, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
      },
    });
  } catch (error) {
    console.log('error while getting product metafields from Admin API', error);
    return json({error: 'Something went wrong from Admin API'}, {status: 500});
  }
  if (response) {
    const result: any = await response.json();
    if (response.ok) {
      return json({success: true, data: result.metafields});
    }
    return json({error: result}, {status: response.status});
  }
  return json({error: 'Something went wrong from Admin API'}, {status: 500});
}
