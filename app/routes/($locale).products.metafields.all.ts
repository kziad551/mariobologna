import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const {env} = context;
  const {IDs} = (await request.json()) as {
    IDs: string[];
  };

  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;
  const ADMIN_URL = (id: string) =>
    `${SHOPIFY_ADMIN_API_URL}/products/${id}/metafields.json`;

  try {
    // Fetch all metafields concurrently
    const responses = await Promise.all(
      IDs.map(async (ID) => {
        const response = await fetch(ADMIN_URL(ID), {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch metafields for product ${ID}`);
          return null;
        }

        const result: any = await response.json();
        return {
          productId: ID,
          metafields: result.metafields,
        };
      }),
    );

    // Filter out null responses and return combined results
    const results = responses.filter(Boolean);
    return json({success: true, data: results});
  } catch (error) {
    console.error('Error fetching product metafields:', error);
    return json(
      {error: 'Something went wrong while fetching product metafields'},
      {status: 500},
    );
  }
}
